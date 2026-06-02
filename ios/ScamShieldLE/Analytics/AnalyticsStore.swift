import Foundation
import SwiftData
import Observation

// MARK: - Data Models used by Analytics

/// Lightweight incident record stored in SwiftData.
@Model
final class ScamIncident {
    var id: UUID
    var date: Date
    var callerNumber: String
    var riskLevel: String       // ClaudeAnalysisResult.RiskLevel.rawValue
    var detectedSignals: [String]
    var transcript: String
    var familyMemberId: String?

    init(
        callerNumber: String,
        riskLevel: String,
        detectedSignals: [String],
        transcript: String,
        familyMemberId: String? = nil
    ) {
        self.id = UUID()
        self.date = Date()
        self.callerNumber = callerNumber
        self.riskLevel = riskLevel
        self.detectedSignals = detectedSignals
        self.transcript = transcript
        self.familyMemberId = familyMemberId
    }
}

// MARK: - Analytics Store

@Observable
final class AnalyticsStore {

    // Published stats
    private(set) var totalIncidents: Int = 0
    private(set) var last7DaysCounts: [DayCount] = []
    private(set) var riskBreakdown: [RiskCount] = []
    private(set) var topSignals: [SignalCount] = []
    private(set) var recentIncidents: [ScamIncident] = []

    private var modelContext: ModelContext?

    struct DayCount: Identifiable {
        let id = UUID()
        let date: Date
        let count: Int
        var dayLabel: String {
            let f = DateFormatter()
            f.dateFormat = "EEE"
            return f.string(from: date)
        }
    }

    struct RiskCount: Identifiable {
        let id = UUID()
        let level: String
        let count: Int
        let color: String   // asset color name
    }

    struct SignalCount: Identifiable {
        let id = UUID()
        let signal: String
        let count: Int
        var displayName: String {
            switch signal {
            case "law_enforcement_claim": return "LE Claim"
            case "arrest_language": return "Arrest Threat"
            case "money_request": return "Money Request"
            case "unusual_payment_method": return "Payment Method"
            case "urgency_pressure": return "Urgency"
            default: return signal
            }
        }
    }

    // MARK: - Setup

    func configure(with context: ModelContext) {
        self.modelContext = context
        refresh()
    }

    // MARK: - Refresh

    func refresh() {
        guard let context = modelContext else { return }

        let allDescriptor = FetchDescriptor<ScamIncident>(
            sortBy: [SortDescriptor(\.date, order: .reverse)]
        )
        let all = (try? context.fetch(allDescriptor)) ?? []
        totalIncidents = all.count
        recentIncidents = Array(all.prefix(20))

        computeLast7Days(from: all)
        computeRiskBreakdown(from: all)
        computeTopSignals(from: all)
    }

    // MARK: - Insert

    func recordIncident(_ incident: ScamIncident) {
        guard let context = modelContext else { return }
        context.insert(incident)
        try? context.save()
        refresh()
    }

    // MARK: - Private Computations

    private func computeLast7Days(from incidents: [ScamIncident]) {
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: Date())
        last7DaysCounts = (0..<7).reversed().map { daysAgo -> DayCount in
            let day = calendar.date(byAdding: .day, value: -daysAgo, to: today)!
            let nextDay = calendar.date(byAdding: .day, value: 1, to: day)!
            let count = incidents.filter { $0.date >= day && $0.date < nextDay }.count
            return DayCount(date: day, count: count)
        }
    }

    private func computeRiskBreakdown(from incidents: [ScamIncident]) {
        let levels = ["low", "medium", "high", "critical"]
        let colors = ["safeGreen", "scamYellow", "scamOrange", "scamRed"]
        riskBreakdown = zip(levels, colors).map { level, color in
            let count = incidents.filter { $0.riskLevel == level }.count
            return RiskCount(level: level.capitalized, count: count, color: color)
        }.filter { $0.count > 0 }
    }

    private func computeTopSignals(from incidents: [ScamIncident]) {
        var counts: [String: Int] = [:]
        for incident in incidents {
            for signal in incident.detectedSignals {
                counts[signal, default: 0] += 1
            }
        }
        topSignals = counts.map { SignalCount(signal: $0.key, count: $0.value) }
            .sorted { $0.count > $1.count }
    }
}
