import SwiftUI
import SwiftData

struct MonitoringView: View {
    @ObservedObject var coordinator: CallAnalysisCoordinator
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss
    @State private var showAlert = false

    var body: some View {
        ZStack {
            backgroundGradient.ignoresSafeArea()
            ScrollView {
                VStack(spacing: 24) {
                    riskGaugeSection
                    if !coordinator.riskAssessment.signals.isEmpty { signalChipsSection }
                    transcriptCard
                    stopButton
                }.padding()
            }
        }
        .navigationTitle("Live Monitoring").navigationBarTitleDisplayMode(.inline)
        .navigationBarBackButtonHidden(coordinator.isMonitoring)
        .onAppear { coordinator.startMonitoring() }
        .onChange(of: coordinator.riskAssessment.level) { _, newLevel in
            if (newLevel == .high || newLevel == .critical) && !showAlert { showAlert = true }
        }
        .fullScreenCover(isPresented: $showAlert) {
            AlertView(
                assessment: coordinator.riskAssessment,
                onDismiss: { showAlert = false; coordinator.stopMonitoring(); coordinator.saveIncident(to: modelContext); dismiss() },
                onReport: { id in showAlert = false; coordinator.saveIncident(to: modelContext, reportedAgency: id); dismiss() }
            )
        }
    }

    private var backgroundGradient: some View {
        let colors: [Color]
        switch coordinator.riskAssessment.level {
        case .safe:     colors = [Color(.systemBackground), Color(.systemGroupedBackground)]
        case .low:      colors = [Color.yellow.opacity(0.1), Color(.systemGroupedBackground)]
        case .medium:   colors = [Color.orange.opacity(0.15), Color(.systemGroupedBackground)]
        case .high:     colors = [Color.red.opacity(0.2), Color(.systemGroupedBackground)]
        case .critical: colors = [Color.purple.opacity(0.25), Color.red.opacity(0.15)]
        }
        return LinearGradient(colors: colors, startPoint: .topLeading, endPoint: .bottomTrailing)
    }

    private var gaugeColor: Color {
        switch coordinator.riskAssessment.level {
        case .safe: return .green; case .low: return .yellow
        case .medium: return .orange; case .high: return .red; case .critical: return .purple
        }
    }

    private var riskGaugeSection: some View {
        VStack(spacing: 16) {
            ZStack {
                Circle().stroke(Color(.systemFill), lineWidth: 20).frame(width: 200, height: 200)
                Circle()
                    .trim(from: 0, to: CGFloat(coordinator.riskAssessment.totalScore) / 100.0)
                    .stroke(gaugeColor, style: StrokeStyle(lineWidth: 20, lineCap: .round))
                    .frame(width: 200, height: 200).rotationEffect(.degrees(-90))
                    .animation(.easeInOut(duration: 0.5), value: coordinator.riskAssessment.totalScore)
                VStack(spacing: 4) {
                    Text("\(coordinator.riskAssessment.totalScore)")
                        .font(.system(size: 48, weight: .bold, design: .rounded)).contentTransition(.numericText())
                    Text(coordinator.riskAssessment.level.displayName)
                        .font(.caption.bold()).foregroundStyle(gaugeColor)
                        .padding(.horizontal, 10).padding(.vertical, 3)
                        .background(gaugeColor.opacity(0.15)).clipShape(Capsule())
                }
            }
            Label("Session: \(formattedDuration)", systemImage: "clock").font(.caption).foregroundStyle(.secondary)
        }.padding(.top)
    }

    private var signalChipsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Detected Signals").font(.headline)
            FlowLayout(spacing: 8) {
                ForEach(Array(coordinator.riskAssessment.signals), id: \.id) { signal in
                    HStack(spacing: 4) {
                        Image(systemName: signal.icon).font(.caption2)
                        Text(signal.label).font(.caption)
                    }
                    .padding(.horizontal, 10).padding(.vertical, 6)
                    .background(Color.red.opacity(0.15)).foregroundStyle(.red).clipShape(Capsule())
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading).padding()
        .background(Color(.secondarySystemBackground)).clipShape(RoundedRectangle(cornerRadius: 14))
    }

    private var transcriptCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("Live Transcript", systemImage: "waveform").font(.headline)
            Text(coordinator.transcript.isEmpty ? "Listening for speech…" : coordinator.transcript)
                .font(.body).foregroundStyle(coordinator.transcript.isEmpty ? .secondary : .primary)
                .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding().background(Color(.secondarySystemBackground)).clipShape(RoundedRectangle(cornerRadius: 14))
    }

    private var stopButton: some View {
        Button(role: .destructive) {
            coordinator.stopMonitoring()
            if coordinator.riskAssessment.totalScore > 0 { coordinator.saveIncident(to: modelContext) }
            dismiss()
        } label: {
            Label("Stop Monitoring", systemImage: "stop.circle.fill")
                .font(.headline).frame(maxWidth: .infinity).padding()
                .background(Color.red.opacity(0.9)).foregroundStyle(.white)
                .clipShape(RoundedRectangle(cornerRadius: 14))
        }
    }

    private var formattedDuration: String {
        let m = coordinator.sessionDuration / 60; let s = coordinator.sessionDuration % 60
        return String(format: "%d:%02d", m, s)
    }
}

struct FlowLayout: Layout {
    var spacing: CGFloat = 8
    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout Void) -> CGSize {
        let width = proposal.width ?? .infinity
        var x: CGFloat = 0; var y: CGFloat = 0; var rowH: CGFloat = 0
        for sv in subviews {
            let s = sv.sizeThatFits(.unspecified)
            if x + s.width > width, x > 0 { y += rowH + spacing; x = 0; rowH = 0 }
            x += s.width + spacing; rowH = max(rowH, s.height)
        }
        return CGSize(width: width, height: y + rowH)
    }
    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout Void) {
        var x = bounds.minX; var y = bounds.minY; var rowH: CGFloat = 0
        for sv in subviews {
            let s = sv.sizeThatFits(.unspecified)
            if x + s.width > bounds.maxX, x > bounds.minX { y += rowH + spacing; x = bounds.minX; rowH = 0 }
            sv.place(at: CGPoint(x: x, y: y), proposal: ProposedViewSize(s))
            x += s.width + spacing; rowH = max(rowH, s.height)
        }
    }
}
