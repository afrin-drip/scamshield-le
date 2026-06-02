import SwiftUI
import SwiftData

struct HistoryView: View {
    @Query(sort: \Incident.date, order: .reverse) private var incidents: [Incident]
    @Environment(\.modelContext) private var modelContext

    var body: some View {
        Group {
            if incidents.isEmpty {
                ContentUnavailableView("No Incidents Yet", systemImage: "clock.arrow.circlepath",
                    description: Text("Past monitoring sessions will appear here."))
            } else {
                List {
                    ForEach(incidents) { incident in
                        NavigationLink { IncidentDetailView(incident: incident) } label: { IncidentRow(incident: incident) }
                    }
                    .onDelete { indexSet in
                        indexSet.forEach { modelContext.delete(incidents[$0]) }
                        try? modelContext.save()
                    }
                }
            }
        }
        .navigationTitle("History")
        .navigationBarTitleDisplayMode(.large)
        .toolbar { if !incidents.isEmpty { EditButton() } }
    }
}

struct IncidentRow: View {
    let incident: Incident
    var levelColor: Color {
        switch incident.level {
        case .safe: return .green; case .low: return .yellow
        case .medium: return .orange; case .high: return .red; case .critical: return .purple
        }
    }
    var body: some View {
        HStack(spacing: 12) {
            ZStack {
                Circle().fill(levelColor.opacity(0.15)).frame(width: 44, height: 44)
                Text("\(incident.riskScore)").font(.system(.subheadline, design: .rounded).bold()).foregroundStyle(levelColor)
            }
            VStack(alignment: .leading, spacing: 3) {
                Text(incident.level.displayName + " Risk").font(.headline).foregroundStyle(levelColor)
                Text(incident.formattedDate).font(.caption).foregroundStyle(.secondary)
                let m = incident.durationSeconds/60; let s = incident.durationSeconds%60
                Text("\(incident.detectedSignals.count) signal(s) · \(m>0 ? "\(m)m \(s)s" : "\(s)s")")
                    .font(.caption2).foregroundStyle(.secondary)
            }
        }
    }
}

struct IncidentDetailView: View {
    let incident: Incident
    var body: some View {
        List {
            Section("Risk Assessment") {
                LabeledContent("Score", value: "\(incident.riskScore)/100")
                LabeledContent("Level", value: incident.level.displayName)
                LabeledContent("Date", value: incident.formattedDate)
                LabeledContent("Duration") {
                    let m = incident.durationSeconds/60; let s = incident.durationSeconds%60
                    Text(m > 0 ? "\(m)m \(s)s" : "\(s)s")
                }
            }
            if !incident.signals.isEmpty {
                Section("Detected Signals (\(incident.signals.count))") {
                    ForEach(incident.signals, id: \.id) { signal in Label(signal.label, systemImage: signal.icon) }
                }
            }
            if let agency = incident.reportedToAgency {
                Section("Reported To") {
                    Text(AgencyDirectory.shared.agency(withId: agency)?.name ?? agency)
                }
            }
            if !incident.transcript.isEmpty {
                Section("Transcript") {
                    Text(incident.transcript).font(.caption).foregroundStyle(.secondary)
                }
            }
        }
        .navigationTitle("Incident Detail").navigationBarTitleDisplayMode(.inline)
    }
}
