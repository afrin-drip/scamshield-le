import Foundation
import UserNotifications
import SwiftUI

// MARK: - Navigation destinations

enum NotificationDestination: Hashable {
    case alert(alertId: String?)
    case incidentDetail(incidentId: String)
    case history
    case monitoring
}

// MARK: - NotificationHandler

final class NotificationHandler: NSObject, ObservableObject, UNUserNotificationCenterDelegate {

    @Published var navigationPath = NavigationPath()

    override init() {
        super.init()
        UNUserNotificationCenter.current().delegate = self
    }

    // MARK: UNUserNotificationCenterDelegate

    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
        completionHandler([.banner, .sound, .badge])
    }

    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        didReceive response: UNNotificationResponse,
        withCompletionHandler completionHandler: @escaping () -> Void
    ) {
        defer { completionHandler() }
        let userInfo = response.notification.request.content.userInfo
        guard let type = userInfo["type"] as? String else { return }
        route(type: type, userInfo: userInfo)
    }

    // MARK: Routing

    func route(type: String, userInfo: [AnyHashable: Any]) {
        let destination: NotificationDestination?
        switch type {
        case "scam_alert":
            destination = .alert(alertId: userInfo["alertId"] as? String)
        case "family_scam":
            guard let id = userInfo["incidentId"] as? String, !id.isEmpty else { return }
            destination = .incidentDetail(incidentId: id)
        case "weekly_summary":
            destination = .history
        default:
            destination = nil
        }
        guard let destination else { return }
        DispatchQueue.main.async { self.navigationPath.append(destination) }
    }

    // MARK: Permission

    func requestAuthorisation() async {
        do {
            let granted = try await UNUserNotificationCenter.current()
                .requestAuthorization(options: [.alert, .badge, .sound])
            print("NotificationHandler: permission granted = \(granted)")
        } catch {
            print("NotificationHandler: authorisation error — \(error.localizedDescription)")
        }
    }
}