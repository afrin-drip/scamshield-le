import SwiftUI

struct SettingsView: View {
    @StateObject private var settings = SettingsStore.shared

    var body: some View {
        Form {
            Section {
                Toggle("Passive Detection", isOn: $settings.passiveDetectionEnabled)
                Toggle("Family Mode", isOn: $settings.familyModeEnabled)
                Toggle("Haptic Alerts", isOn: $settings.hapticAlertsEnabled)
                Toggle("Voice Alerts", isOn: $settings.voiceAlertsEnabled)
                Toggle("Local Notifications", isOn: $settings.localNotificationsEnabled)
            } header: {
                Text("Detection Settings")
            } footer: {
                Text("Passive Detection monitors ambient audio in the background. Family Mode lowers the alert threshold for extra sensitivity.")
            }

            Section("Alert Threshold") {
                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Text("Alert at score:")
                        Spacer()
                        Text("\(Int(settings.alertThreshold))").bold()
                    }
                    Slider(value: $settings.alertThreshold, in: 20...80, step: 5)
                }
            }

            Section("Agency Directory") {
                NavigationLink("View All Agencies") { AgencyDirectoryView() }
            }

            Section("About") {
                LabeledContent("Version", value: "1.0.0")
                LabeledContent("Build", value: "1")
                LabeledContent("Platform", value: "iOS SwiftUI")
            }
        }
        .navigationTitle("Settings")
        .navigationBarTitleDisplayMode(.large)
    }
}
