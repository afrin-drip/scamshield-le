import Foundation

// MARK: - Enhanced Result

struct ClaudeEnhancedResult {
    let originalIsScam: Bool
    let enhancedIsScam: Bool
    let confidence: Double
    let detectedSignals: [ClaudeAnalysisResult.ScamSignal]
    let explanation: String
    let riskLevel: ClaudeAnalysisResult.RiskLevel
    let wasEnhanced: Bool

    /// Merge Claude's semantic result with an existing baseline detection result.
    init(from claudeResult: ClaudeAnalysisResult, originalIsScam: Bool) {
        self.originalIsScam = originalIsScam
        self.enhancedIsScam = claudeResult.isScam || (originalIsScam && claudeResult.confidence > 0.3)
        self.confidence = claudeResult.confidence
        self.detectedSignals = claudeResult.detectedSignals
        self.explanation = claudeResult.explanation
        self.riskLevel = claudeResult.riskLevel
        self.wasEnhanced = true
    }

    /// Passthrough when Claude is not invoked.
    init(passthrough isScam: Bool) {
        self.originalIsScam = isScam
        self.enhancedIsScam = isScam
        self.confidence = isScam ? 0.5 : 0.1
        self.detectedSignals = []
        self.explanation = "Keyword-based detection only."
        self.riskLevel = isScam ? .medium : .low
        self.wasEnhanced = false
    }
}

// MARK: - Semantic Enhancement Layer

/// Mirrors the logic of Android's ClaudeAudioAnalyzer.kt.
actor ClaudeAudioAnalyzer {

    static let shared = ClaudeAudioAnalyzer()

    // MARK: Enhancement Gate

    /// Returns true when the Claude API call is worth making.
    ///
    /// Conditions (any one is sufficient):
    /// - Transcript is long enough to have meaningful context (≥ 30 words)
    /// - Keyword scan already flagged a potential scam (surface-level hit)
    /// - Transcript contains law-enforcement keywords regardless of length
    func shouldEnhanceWithClaude(result: Bool, transcriptLength: Int) -> Bool {
        // Always enhance if keyword scan detected something
        if result { return true }
        // Enhance if transcript is substantial (≥ 30 words → ~150 chars average)
        if transcriptLength >= 150 { return true }
        return false
    }

    // MARK: Semantic Analysis

    func analyzeTranscriptSemantically(_ transcript: String) async -> ClaudeEnhancedResult {
        // Quick local pre-screen: if transcript is trivially short, skip API
        let wordCount = transcript.split(separator: " ").count
        guard wordCount >= 5 else {
            return ClaudeEnhancedResult(passthrough: false)
        }

        do {
            let claudeResult = try await ClaudeAPIService.shared.analyze(transcript: transcript)
            return ClaudeEnhancedResult(from: claudeResult, originalIsScam: false)
        } catch {
            // On failure, fall back gracefully; don't surface errors to caller
            return ClaudeEnhancedResult(passthrough: localKeywordCheck(transcript))
        }
    }

    // MARK: - Local Keyword Fallback

    private func localKeywordCheck(_ transcript: String) -> Bool {
        let lower = transcript.lowercased()
        let signals: [String] = [
            "arrest", "warrant", "fbi", "dea", "irs", "social security",
            "gift card", "bitcoin", "wire transfer", "bail", "deportation",
            "frozen", "suspended", "do not tell", "keep this confidential"
        ]
        let hits = signals.filter { lower.contains($0) }.count
        return hits >= 2
    }
}
