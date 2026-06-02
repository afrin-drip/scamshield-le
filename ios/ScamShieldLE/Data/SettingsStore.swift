import Foundation
import SwiftUI

@MainActor
final class SettingsStore: ObservableObject {
    static let shared = SettingsStore()

    @AppStorage("passiveDetectionEnabled") var passiveDetectionEnabled: Bool = false
    @AppStorage("familyModeEnabled") var familyModeEnabled: Bool = false
    @AppStorage("hapticAlertsEnabled") var hapticAlertsEnabled: Bool = true
    @AppStorage("voiceAlertsEnabled") var voiceAlertsEnabled: Bool = true
    @AppStorage("localNotificationsEnabled") var localNotificationsEnabled: Bool = true
    @AppStorage("alertThreshold") var alertThreshold: Double = 60.0

    private init() {}
}
