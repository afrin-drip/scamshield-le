import SwiftUI
import Charts
import SwiftData

struct AnalyticsView: View {
    @Environment(\.modelContext) private var modelContext
    @State private var store = AnalyticsStore()

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    summaryCards
                    barChartSection
                    riskRingSection
                    signalRankingSection
                }
                .padding()
            }
            .navigationTitle("Analytics")
            .onAppear {
                store.configure(with: modelContext)
            }
            .refreshable {
                store.refresh()
            }
        }
    }

    // MARK: - Summary Cards

    private var summaryCards: some View {
        HStack(spacing: 16) {
            StatCard(title: "Total Alerts", value: "\(store.totalIncidents)", icon: "exclamationmark.triangle.fill", color: .scamRed)
            StatCard(title: "This Week", value: "\(store.last7DaysCounts.reduce(0) { $0 + $1.count })", icon: "calendar", color: .scamOrange)
        }
    }

    // MARK: - Bar Chart (7 days)

    private var barChartSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Incidents — Last 7 Days")
                .font(.headline)

            if store.last7DaysCounts.allSatisfy({ $0.count == 0 }) {
                Text("No incidents in the past week.")
                    .foregroundStyle(.secondary)
                    .frame(maxWidth: .infinity, minHeight: 140, alignment: .center)
            } else {
                Chart(store.last7DaysCounts) { day in
                    BarMark(
                        x: .value("Day", day.dayLabel),
                        y: .value("Count", day.count)
                    )
                    .foregroundStyle(Color.scamOrange.gradient)
                    .cornerRadius(4)
                }
                .frame(height: 160)
                .chartYAxis { AxisMarks(position: .leading) }
            }
        }
        .padding()
        .background(.background.secondary)
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    // MARK: - Risk Ring Chart

    private var riskRingSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Risk Level Breakdown")
                .font(.headline)

            if store.riskBreakdown.isEmpty {
                Text("No data yet.")
                    .foregroundStyle(.secondary)
                    .frame(maxWidth: .infinity, minHeight: 120, alignment: .center)
            } else {
                HStack {
                    Chart(store.riskBreakdown) { item in
                        SectorMark(
                            angle: .value("Count", item.count),
                            innerRadius: .ratio(0.55),
                            angularInset: 2
                        )
                        .foregroundStyle(by: .value("Level", item.level))
                        .cornerRadius(4)
                    }
                    .frame(width: 140, height: 140)

                    VStack(alignment: .leading, spacing: 8) {
                        ForEach(store.riskBreakdown) { item in
                            HStack(spacing: 8) {
                                Circle()
                                    .fill(Color(item.color))
                                    .frame(width: 10, height: 10)
                                Text("\(item.level): \(item.count)")
                                    .font(.caption)
                            }
                        }
                    }
                    Spacer()
                }
            }
        }
        .padding()
        .background(.background.secondary)
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    // MARK: - Signal Ranking

    private var signalRankingSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Top Scam Signals")
                .font(.headline)

            if store.topSignals.isEmpty {
                Text("No signal data yet.")
                    .foregroundStyle(.secondary)
            } else {
                ForEach(Array(store.topSignals.prefix(5).enumerated()), id: \.element.id) { idx, signal in
                    HStack {
                        Text("\(idx + 1)")
                            .font(.caption.bold())
                            .foregroundStyle(.secondary)
                            .frame(width: 20)
                        Text(signal.displayName)
                        Spacer()
                        Text("\(signal.count)")
                            .font(.subheadline.bold())
                            .foregroundStyle(.scamRed)
                    }
                    .padding(.vertical, 4)
                    if idx < min(4, store.topSignals.count - 1) { Divider() }
                }
            }
        }
        .padding()
        .background(.background.secondary)
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}

// MARK: - Stat Card

private struct StatCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: icon)
                    .foregroundStyle(color)
                Spacer()
            }
            Text(value)
                .font(.title.bold())
            Text(title)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
        .padding()
        .frame(maxWidth: .infinity)
        .background(.background.secondary)
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}

#Preview {
    AnalyticsView()
        .modelContainer(for: ScamIncident.self, inMemory: true)
}
