import Foundation
import SwiftData
import Observation

@Observable
final class FamilyStore {

    private(set) var members: [FamilyMember] = []
    private var modelContext: ModelContext?

    init() {}

    // MARK: - Setup

    func configure(with context: ModelContext) {
        self.modelContext = context
        fetchAll()
    }

    // MARK: - CRUD

    func addMember(name: String, phoneNumber: String, relationship: String) {
        guard let context = modelContext else { return }
        let member = FamilyMember(name: name, phoneNumber: phoneNumber, relationship: relationship)
        context.insert(member)
        save()
        fetchAll()
    }

    func deleteMember(_ member: FamilyMember) {
        guard let context = modelContext else { return }
        context.delete(member)
        save()
        fetchAll()
    }

    func toggleProtection(for member: FamilyMember) {
        member.isProtected.toggle()
        save()
    }

    func toggleNotifications(for member: FamilyMember) {
        member.notificationsEnabled.toggle()
        save()
    }

    func recordIncident(for phoneNumber: String) {
        guard let member = members.first(where: { $0.matches(phoneNumber: phoneNumber) }) else { return }
        member.recordIncident()
        save()
    }

    // MARK: - Lookup

    func member(for phoneNumber: String) -> FamilyMember? {
        members.first { $0.matches(phoneNumber: phoneNumber) }
    }

    var protectedMembers: [FamilyMember] {
        members.filter { $0.isProtected }
    }

    // MARK: - Private

    private func fetchAll() {
        guard let context = modelContext else { return }
        let descriptor = FetchDescriptor<FamilyMember>(
            sortBy: [SortDescriptor(\.addedDate, order: .reverse)]
        )
        members = (try? context.fetch(descriptor)) ?? []
    }

    private func save() {
        try? modelContext?.save()
    }
}
