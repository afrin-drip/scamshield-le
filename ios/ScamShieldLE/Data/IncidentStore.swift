import Foundation
import SwiftData

final class IncidentStore {
    static let shared = IncidentStore()

    let container: ModelContainer

    private init() {
        let schema = Schema([Incident.self])
        let config = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)
        do {
            container = try ModelContainer(for: schema, configurations: [config])
        } catch {
            fatalError("[IncidentStore] Failed to create ModelContainer: \(error)")
        }
    }
}
