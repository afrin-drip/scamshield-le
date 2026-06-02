import Foundation

enum RiskLevel: String, Codable {
    case safe = "SAFE"
    case low = "LOW"
    case medium = "MEDIUM"
    case high = "HIGH"
    case critical = "CRITICAL"

    var displayName: String { rawValue.capitalized }

    var color: String {
        switch self {
        case .safe:     return "green"
        case .low:      return "yellow"
        case .medium:   return "orange"
        case .high:     return "red"
        case .critical: return "purple"
        }
    }

    static func from(score: Int) -> RiskLevel {
        switch score {
        case 0..<20:    return .safe
        case 20..<40:   return .low
        case 40..<60:   return .medium
        case 60..<80:   return .high
        default:        return .critical
        }
    }
}

struct RiskAssessment: Equatable {
    let totalScore: Int
    let signals: Set<ScamSignal>
    let level: RiskLevel
    let transcript: String

    static let empty = RiskAssessment(totalScore: 0, signals: [], level: .safe, transcript: "")

    init(totalScore: Int, signals: Set<ScamSignal>, level: RiskLevel, transcript: String = "") {
        self.totalScore = min(totalScore, 100)
        self.signals = signals
        self.level = level
        self.transcript = transcript
    }

    static func == (lhs: RiskAssessment, rhs: RiskAssessment) -> Bool {
        lhs.totalScore == rhs.totalScore && lhs.signals == rhs.signals && lhs.level == rhs.level
    }
}
