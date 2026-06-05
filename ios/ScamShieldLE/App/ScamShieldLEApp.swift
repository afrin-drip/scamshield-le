import SwiftUI
import StoreKit

@main
struct ScamShieldLEApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    @StateObject private var storeKitManager = StoreKitManager.shared
    @StateObject private var callMonitor = CallMonitor.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(storeKitManager)
                .environmentObject(callMonitor)
                .onOpenURL { url in
                    handleDeepLink(url)
                }
        }
    }

    private func handleDeepLink(_ url: URL) {
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: true) else { return }
        switch components.host {
        case "report":
            NotificationCenter.default.post(name: .openReportView, object: url)
        case "alert":
            NotificationCenter.default.post(name: .openAlertDetail, object: url)
        case "settings":
            NotificationCenter.default.post(name: .openSettings, object: url)
        default:
            print("Unhandled deep link: \(url)")
        }
    }
}

extension Notification.Name {
    static let openReportView = Notification.Name("openReportView")
    static let openAlertDetail = Notification.Name("openAlertDetail")
    static let openSettings = Notification.Name("openSettings")
}