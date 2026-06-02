import Foundation
import SwiftData

@Model
final class Incident {
    var id: UUID
    var date: Date
    var transcript: String
    var riskScore: Int
    var riskLevel: String
    var detectedSignals: [String]
    var durationSeconds: Int
    var reportedToAgency: String?

    init(
        id: UUID = UUID(),
        date: Date = Date(),
        transcript: String,
        riskScore: Int,
        riskLevel: String,
        detectedSignals: [String],
        durationSeconds: Int,
        reportedToAgency: String? = nil
    ) {
        self.id = id
        self.date = date
        self.transcript = transcript
        self.riskScore = riskScore
        self.riskLevel = riskLevel
        self.detectedSignals = detectedSignals
        self.durationSeconds = durationSeconds
        self.reportedToAgency = reportedToAgency
    }

    var level: RiskLevel {
        RiskLevel(rawValue: riskLevel) ?? .safe
    }

    var signals: [ScamSignal] {
        detectedSignals.compactMap { ScamSignal(rawValue: $0) }
    }

    var formattedDate: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }
}
