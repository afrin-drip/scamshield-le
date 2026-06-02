import Foundation
import UserNotifications

final class FamilyNotificationManager {

    static let shared = FamilyNotificationManager()
    private init() {}

    // MARK: - Permission

    func requestAuthorization() async -> Bool {
        let center = UNUserNotificationCenter.current()
        do {
            return try await center.requestAuthorization(options: [.alert, .sound, .badge])
        } catch {
            return false
        }
    }

    // MARK: - Scam Alert

    /// Send a local notification warning that a family member's call may be a scam.
    func sendScamAlert(
        for member: FamilyMember,
        callerNumber: String,
        riskLevel: ClaudeAnalysisResult.RiskLevel,
        signals: [ClaudeAnalysisResult.ScamSignal]
    ) {
        guard member.notificationsEnabled else { return }

        let content = UNMutableNotificationContent()
        content.title = "⚠️ Scam Alert — \(member.name)"
        content.body = buildBody(caller: callerNumber, riskLevel: riskLevel, signals: signals)
        content.sound = riskLevel == .critical ? .defaultCritical : .default
        content.categoryIdentifier = "SCAM_ALERT"

        // Attach metadata for deep-linking
        content.userInfo = [
            "memberId": member.id.uuidString,
            "callerNumber": callerNumber,
            "riskLevel": riskLevel.rawValue
        ]

        let request = UNNotificationRequest(
            identifier: "scam-\(member.id)-\(Date().timeIntervalSince1970)",
            content: content,
            trigger: nil // immediate delivery
        )

        UNUserNotificationCenter.current().add(request) { error in
            if let error {
                print("[FamilyNotificationManager] Failed to schedule: \(error)")
            }
        }
    }

    // MARK: - Category Registration

    /// Call once at app startup to register notification categories and actions.
    func registerCategories() {
        let callBack = UNNotificationAction(
            identifier: "CALL_BACK",
            title: "Call Back",
            options: [.foreground]
        )
        let dismiss = UNNotificationAction(
            identifier: "DISMISS",
            title: "Dismiss",
            options: [.destructive]
        )
        let category = UNNotificationCategory(
            identifier: "SCAM_ALERT",
            actions: [callBack, dismiss],
            intentIdentifiers: [],
            options: [.customDismissAction]
        )
        UNUserNotificationCenter.current().setNotificationCategories([category])
    }

    // MARK: - Helpers

    private func buildBody(
        caller: String,
        riskLevel: ClaudeAnalysisResult.RiskLevel,
        signals: [ClaudeAnalysisResult.ScamSignal]
    ) -> String {
        var parts: [String] = []

        let levelLabel: String
        switch riskLevel {
        case .low: levelLabel = "Low risk"
        case .medium: levelLabel = "Medium risk"
        case .high: levelLabel = "High risk"
        case .critical: levelLabel = "CRITICAL risk"
        }

        parts.append("Incoming call from \(caller) — \(levelLabel).")

        if !signals.isEmpty {
            let signalLabels = signals.prefix(3).map { signalLabel($0) }.joined(separator: ", ")
            parts.append("Detected: \(signalLabels).")
        }

        parts.append("Advise them not to share money or personal information.")
        return parts.joined(separator: " ")
    }

    private func signalLabel(_ signal: ClaudeAnalysisResult.ScamSignal) -> String {
        switch signal {
        case .lawEnforcementClaim: return "law enforcement claim"
        case .arrestLanguage: return "arrest threat"
        case .moneyRequest: return "money request"
        case .unusualPaymentMethod: return "unusual payment"
        case .urgencyPressure: return "urgency pressure"
        }
    }
}
