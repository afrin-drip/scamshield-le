import SwiftUI
import SwiftData

struct SimulationView: View {
    let script: ScamScript
    @ObservedObject var coordinator: CallAnalysisCoordinator
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss
    @StateObject private var viewModel: SimulationViewModel
    @State private var showAlert = false

    init(script: ScamScript, coordinator: CallAnalysisCoordinator) {
        self.script = script; self.coordinator = coordinator
        _viewModel = StateObject(wrappedValue: SimulationViewModel(script: script, coordinator: coordinator))
    }

    var gaugeColor: Color {
        switch coordinator.riskAssessment.level {
        case .safe: return .green; case .low: return .yellow
        case .medium: return .orange; case .high: return .red; case .critical: return .purple
        }
    }

    var body: some View {
        ZStack {
            Color(.systemGroupedBackground).ignoresSafeArea()
            VStack(spacing: 24) {
                VStack(spacing: 8) {
                    Text(script.title).font(.headline)
                    Text("Simulation Mode").font(.caption).foregroundStyle(.secondary)
                        .padding(.horizontal, 10).padding(.vertical, 3)
                        .background(Color.orange.opacity(0.15)).clipShape(Capsule())
                }
                ZStack {
                    Circle().stroke(Color(.systemFill), lineWidth: 16).frame(width: 160, height: 160)
                    Circle()
                        .trim(from: 0, to: CGFloat(coordinator.riskAssessment.totalScore) / 100.0)
                        .stroke(gaugeColor, style: StrokeStyle(lineWidth: 16, lineCap: .round))
                        .frame(width: 160, height: 160).rotationEffect(.degrees(-90))
                        .animation(.easeInOut(duration: 0.3), value: coordinator.riskAssessment.totalScore)
                    VStack(spacing: 2) {
                        Text("\(coordinator.riskAssessment.totalScore)")
                            .font(.system(size: 36, weight: .bold, design: .rounded)).contentTransition(.numericText())
                        Text(coordinator.riskAssessment.level.displayName).font(.caption.bold()).foregroundStyle(gaugeColor)
                    }
                }
                ScrollView {
                    Text(viewModel.currentLine.isEmpty ? "Tap Start to begin…" : viewModel.currentLine)
                        .font(.body).foregroundStyle(viewModel.currentLine.isEmpty ? .secondary : .primary)
                        .frame(maxWidth: .infinity, alignment: .leading).padding()
                }.frame(height: 160).background(Color(.secondarySystemBackground))
                    .clipShape(RoundedRectangle(cornerRadius: 14)).padding(.horizontal)
                if !coordinator.riskAssessment.signals.isEmpty {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            ForEach(Array(coordinator.riskAssessment.signals), id: \.id) { signal in
                                Label(signal.label, systemImage: signal.icon).font(.caption)
                                    .padding(.horizontal, 10).padding(.vertical, 6)
                                    .background(Color.red.opacity(0.12)).foregroundStyle(.red).clipShape(Capsule())
                            }
                        }.padding(.horizontal)
                    }
                }
                Spacer()
                HStack(spacing: 16) {
                    if !viewModel.isPlaying && !viewModel.isFinished {
                        Button { viewModel.start() } label: {
                            Label("Start", systemImage: "play.fill").font(.headline)
                                .frame(maxWidth: .infinity).padding().background(Color.blue).foregroundStyle(.white)
                                .clipShape(RoundedRectangle(cornerRadius: 14))
                        }
                    } else if viewModel.isPlaying {
                        Button { viewModel.pause() } label: {
                            Label("Pause", systemImage: "pause.fill").font(.headline)
                                .frame(maxWidth: .infinity).padding().background(Color.orange).foregroundStyle(.white)
                                .clipShape(RoundedRectangle(cornerRadius: 14))
                        }
                        Button { viewModel.stop(); coordinator.saveIncident(to: modelContext); dismiss() } label: {
                            Label("Stop", systemImage: "stop.fill").font(.headline)
                                .frame(maxWidth: .infinity).padding().background(Color.red).foregroundStyle(.white)
                                .clipShape(RoundedRectangle(cornerRadius: 14))
                        }
                    } else {
                        Button { coordinator.saveIncident(to: modelContext); dismiss() } label: {
                            Label("Done", systemImage: "checkmark.circle.fill").font(.headline)
                                .frame(maxWidth: .infinity).padding().background(Color.green).foregroundStyle(.white)
                                .clipShape(RoundedRectangle(cornerRadius: 14))
                        }
                    }
                }.padding(.horizontal).padding(.bottom, 16)
            }
        }
        .navigationTitle("Simulation").navigationBarTitleDisplayMode(.inline)
        .onChange(of: coordinator.riskAssessment.level) { _, level in
            if (level == .high || level == .critical) && !showAlert { showAlert = true }
        }
        .fullScreenCover(isPresented: $showAlert) {
            AlertView(
                assessment: coordinator.riskAssessment,
                onDismiss: { showAlert = false; viewModel.stop(); coordinator.saveIncident(to: modelContext); dismiss() },
                onReport: { id in showAlert = false; viewModel.stop(); coordinator.saveIncident(to: modelContext, reportedAgency: id); dismiss() }
            )
        }
    }
}
