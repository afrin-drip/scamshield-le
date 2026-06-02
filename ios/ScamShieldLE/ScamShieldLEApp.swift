import SwiftUI
import UserNotifications
import FirebaseCore
import FirebaseMessaging

@main
struct ScamShieldLEApp: App {

    @UIApplicationDelegateAdaptor(AppDelegate.self) private var appDelegate
    @StateObject private var notificationHandler = NotificationHandler()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(notificationHandler)
                .onOpenURL { url in handleIncomingURL(url) }
        }
    }

    private func handleIncomingURL(_ url: URL) {
        guard url.scheme == "scamshield", let host = url.host else { return }
        switch host {
        case "alert":
            let alertId = URLComponents(url: url, resolvingAgainstBaseURL: false)?
                .queryItems?.first(where: { $0.name == "alertId" })?.value
            notificationHandler.navigationPath.append(NotificationDestination.alert(alertId: alertId))
        case "incident":
            let id = url.pathComponents.dropFirst().first ?? ""
            if !id.isEmpty {
                notificationHandler.navigationPath.append(NotificationDestination.incidentDetail(incidentId: id))
            }
        case "history":
            notificationHandler.navigationPath.append(NotificationDestination.history)
        case "monitoring":
            notificationHandler.navigationPath.append(NotificationDestination.monitoring)
        default: break
        }
    }
}

// MARK: - AppDelegate

final class AppDelegate: NSObject, UIApplicationDelegate, MessagingDelegate {

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
        FirebaseApp.configure()
        Messaging.messaging().delegate = self
        application.registerForRemoteNotifications()
        return true
    }

    func application(_ application: UIApplication,
                     didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        Messaging.messaging().apnsToken = deviceToken
    }

    func application(_ application: UIApplication,
                     didFailToRegisterForRemoteNotificationsWithError error: Error) {
        print("AppDelegate: APNs registration failed — \(error.localizedDescription)")
    }

    func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
        guard let token = fcmToken else { return }
        NotificationCenter.default.post(
            name: Notification.Name("FCMTokenDidRefresh"),
            object: nil,
            userInfo: ["token": token]
        )
    }
}