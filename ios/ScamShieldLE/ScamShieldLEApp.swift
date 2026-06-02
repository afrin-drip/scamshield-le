import SwiftUI
import SwiftData

@main
struct ScamShieldLEApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .modelContainer(IncidentStore.shared.container)
        }
    }
}
