import SwiftUI

struct AlertView: View {
    let assessment: RiskAssessment
    let onDismiss: () -> Void
    let onReport: (String) -> Void

    @State private var showAgencyList = false
    private let alertManager = AlertManager()

    var body: some View {
        ZStack {
            (assessment.level == .critical ? Color.purple : Color.red).ignoresSafeArea()
            VStack(spacing: 32) {
                Spacer()
                VStack(spacing: 16) {
                    Image(systemName: "exclamationmark.triangle.fill")
                        .font(.system(size: 80)).foregroundStyle(.white).symbolEffect(.pulse)
                    Text("SCAM ALERT").font(.system(size: 36, weight: .black)).foregroundStyle(.white)
                    Text("Risk Score: \(assessment.totalScore)/100")
                        .font(.title3.bold()).foregroundStyle(.white.opacity(0.9))
                        .padding(.horizontal, 20).padding(.vertical, 8)
                        .background(.white.opacity(0.2)).clipShape(Capsule())
                }
                if !assessment.signals.isEmpty {
                    VStack(alignment: .leading, spacing: 8) {
                        ForEach(Array(assessment.signals).prefix(5), id: \.id) { signal in
                            HStack(spacing: 10) {
                                Image(systemName: signal.icon).frame(width: 20)
                                Text(signal.label).font(.subheadline)
                            }.foregroundStyle(.white)
                        }
                    }
                    .padding().background(.white.opacity(0.15))
                    .clipShape(RoundedRectangle(cornerRadius: 14)).padding(.horizontal)
                }
                Spacer()
                VStack(spacing: 14) {
                    Button {
                        alertManager.triggerHaptic(for: .warning)
                        alertManager.speak("Warning. High risk scam call detected. Hang up immediately.")
                    } label: {
                        Label("HANG UP NOW", systemImage: "phone.down.fill")
                            .font(.headline).frame(maxWidth: .infinity).padding()
                            .background(.white).foregroundStyle(.red)
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                    }.padding(.horizontal)

                    Button { showAgencyList = true } label: {
                        Label("Report to Agency", systemImage: "building.columns.fill")
                            .font(.headline).frame(maxWidth: .infinity).padding()
                            .background(.white.opacity(0.2)).foregroundStyle(.white)
                            .clipShape(RoundedRectangle(cornerRadius: 14))
                            .overlay(RoundedRectangle(cornerRadius: 14).stroke(.white.opacity(0.4), lineWidth: 1))
                    }.padding(.horizontal)

                    Button { onDismiss() } label: {
                        Text("Dismiss").font(.subheadline).foregroundStyle(.white.opacity(0.7))
                    }.padding(.bottom, 32)
                }
            }
        }
        .onAppear {
            alertManager.triggerHaptic(for: .error)
            alertManager.speak("Warning. Scam call detected. Risk level \(assessment.level.displayName). Consider hanging up.")
            alertManager.scheduleLocalNotification(
                title: "\u26a0\ufe0f Scam Call Detected",
                body: "Risk score \(assessment.totalScore)/100 — \(assessment.signals.count) signals detected."
            )
        }
        .sheet(isPresented: $showAgencyList) {
            AgencyReportSheet { agencyId in showAgencyList = false; onReport(agencyId) }
        }
    }
}

struct AgencyReportSheet: View {
    let onSelectAgency: (String) -> Void
    @Environment(\.dismiss) private var dismiss
    var body: some View {
        NavigationStack {
            List(AgencyDirectory.shared.agencies) { agency in
                Button {
                    onSelectAgency(agency.id)
                } label: {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(agency.name).font(.headline).foregroundStyle(.primary)
                        Text(agency.phone).font(.subheadline).foregroundStyle(.secondary)
                    }
                }
            }
            .navigationTitle("Report to Agency")
            .toolbar { ToolbarItem(placement: .cancellationAction) { Button("Cancel") { dismiss() } } }
        }
    }
}
