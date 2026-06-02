import SwiftUI

extension Color {
    /// Matches Android theme: scam_red (#D32F2F)
    static let scamRed = Color(red: 0.827, green: 0.184, blue: 0.184)

    /// Matches Android theme: scam_orange (#F57C00)
    static let scamOrange = Color(red: 0.961, green: 0.486, blue: 0.0)

    /// Matches Android theme: scam_yellow (#F9A825)
    static let scamYellow = Color(red: 0.976, green: 0.659, blue: 0.145)

    /// Matches Android theme: safe_green (#388E3C)
    static let safeGreen = Color(red: 0.220, green: 0.557, blue: 0.235)
}

// MARK: - Risk Level → Color

extension ClaudeAnalysisResult.RiskLevel {
    var color: Color {
        switch self {
        case .low: return .safeGreen
        case .medium: return .scamYellow
        case .high: return .scamOrange
        case .critical: return .scamRed
        }
    }

    var label: String {
        switch self {
        case .low: return "Low Risk"
        case .medium: return "Medium Risk"
        case .high: return "High Risk"
        case .critical: return "CRITICAL"
        }
    }
}
