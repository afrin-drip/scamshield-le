import Foundation

enum SubscriptionTier: String, Codable, CaseIterable {
    case free, pro, family

    var hasPassiveDetection: Bool { self != .free }
    var hasFamilyMode: Bool { self == .family }
    var hasAnalytics: Bool { self != .free }
    var hasSimulation: Bool { self != .free }
    var displayName: String { rawValue.capitalized }

    var price: String {
        switch self {
        case .free: return "Free"
        case .pro: return "$2.99/mo"
        case .family: return "$4.99/mo"
        }
    }

    var features: [String] {
        switch self {
        case .free: return ["Manual monitoring", "Scam alerts", "Agency directory", "FTC/FBI reporting"]
        case .pro: return ["Everything in Free", "Passive detection", "Analytics dashboard", "Simulation mode"]
        case .family: return ["Everything in Pro", "Protect 5 family numbers", "Guardian notifications", "Family dashboard"]
        }
    }
}

enum ProductIdentifiers {
    static let proMonthly = "scamshield_pro_monthly"
    static let familyMonthly = "scamshield_family_monthly"
    static let all: Set<String> = [proMonthly, familyMonthly]
}
