import Foundation
import SwiftData

@Model
final class FamilyMember {
    var id: UUID
    var name: String
    var phoneNumber: String
    var relationship: String
    var isProtected: Bool
    var notificationsEnabled: Bool
    var addedDate: Date
    var lastIncidentDate: Date?
    var totalIncidents: Int

    init(
        name: String,
        phoneNumber: String,
        relationship: String = "",
        isProtected: Bool = true,
        notificationsEnabled: Bool = true
    ) {
        self.id = UUID()
        self.name = name
        self.phoneNumber = phoneNumber
        self.relationship = relationship
        self.isProtected = isProtected
        self.notificationsEnabled = notificationsEnabled
        self.addedDate = Date()
        self.lastIncidentDate = nil
        self.totalIncidents = 0
    }

    /// Formatted display for relationship label.
    var displayRelationship: String {
        relationship.isEmpty ? "Family Member" : relationship
    }

    /// Returns true if this phone number matches the given number (normalised).
    func matches(phoneNumber other: String) -> Bool {
        let normalised = phoneNumber.filter(\.isNumber)
        let otherNormalised = other.filter(\.isNumber)
        return normalised == otherNormalised ||
               normalised.hasSuffix(otherNormalised) ||
               otherNormalised.hasSuffix(normalised)
    }

    func recordIncident() {
        totalIncidents += 1
        lastIncidentDate = Date()
    }
}
