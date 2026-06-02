import SwiftUI

struct HomeView: View {
    @StateObject private var coordinator = CallAnalysisCoordinator()
    @State private var showSimulationPicker = false

    var body: some View {
        ZStack {
            Color(.systemGroupedBackground).ignoresSafeArea()
            VStack(spacing: 32) {
                VStack(spacing: 8) {
                    Image(systemName: "shield.lefthalf.filled").font(.system(size: 64)).foregroundStyle(.blue)
                    Text("ScamShield LE").font(.largeTitle.bold())
                    Text("Law Enforcement Edition").font(.subheadline).foregroundStyle(.secondary)
                }.padding(.top, 32)

                VStack(spacing: 12) {
                    HStack {
                        Image(systemName: "checkmark.shield.fill").foregroundStyle(.green)
                        Text("System Ready").font(.headline)
                        Spacer()
                    }
                    HStack {
                        Image(systemName: "info.circle").foregroundStyle(.secondary).font(.caption)
                        Text("Tap \'Start Monitoring\' to begin analyzing live calls for scam indicators.")
                            .font(.caption).foregroundStyle(.secondary)
                        Spacer()
                    }
                }
                .padding()
                .background(Color(.secondarySystemBackground))
                .clipShape(RoundedRectangle(cornerRadius: 14))
                .padding(.horizontal)

                Spacer()

                VStack(spacing: 16) {
                    NavigationLink {
                        MonitoringView(coordinator: coordinator)
                    } label: {
                        Label("Start Monitoring", systemImage: "mic.fill")
                            .font(.headline).frame(maxWidth: .infinity).padding()
                            .background(Color.blue).foregroundStyle(.white)
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                    }
                    Button { showSimulationPicker = true } label: {
                        Label("Run Simulation", systemImage: "play.circle")
                            .font(.headline).frame(maxWidth: .infinity).padding()
                            .background(Color(.secondarySystemBackground)).foregroundStyle(.primary)
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                            .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color(.separator), lineWidth: 1))
                    }
                }.padding(.horizontal).padding(.bottom, 16)
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                HStack(spacing: 16) {
                    NavigationLink { HistoryView() } label: { Image(systemName: "clock.arrow.circlepath") }
                    NavigationLink { SettingsView() } label: { Image(systemName: "gearshape") }
                }
            }
        }
        .sheet(isPresented: $showSimulationPicker) {
            NavigationStack {
                List(ScamScripts.all) { script in
                    NavigationLink(script.title) { SimulationView(script: script, coordinator: coordinator) }
                }
                .navigationTitle("Choose Scenario")
                .toolbar { ToolbarItem(placement: .cancellationAction) { Button("Cancel") { showSimulationPicker = false } } }
            }
        }
    }
}
