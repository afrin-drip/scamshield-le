import Foundation

// MARK: - Result Types

struct ClaudeAnalysisResult {
    let isScam: Bool
    let confidence: Double
    let detectedSignals: [ScamSignal]
    let explanation: String
    let riskLevel: RiskLevel

    enum RiskLevel: String, Codable {
        case low, medium, high, critical
    }

    enum ScamSignal: String, Codable, CaseIterable {
        case lawEnforcementClaim = "law_enforcement_claim"
        case arrestLanguage = "arrest_language"
        case moneyRequest = "money_request"
        case unusualPaymentMethod = "unusual_payment_method"
        case urgencyPressure = "urgency_pressure"
    }
}

// MARK: - API Request/Response Models

private struct ClaudeRequest: Encodable {
    let model: String
    let maxTokens: Int
    let system: String
    let messages: [Message]

    struct Message: Encodable {
        let role: String
        let content: String
    }

    enum CodingKeys: String, CodingKey {
        case model
        case maxTokens = "max_tokens"
        case system
        case messages
    }
}

private struct ClaudeResponse: Decodable {
    let content: [ContentBlock]

    struct ContentBlock: Decodable {
        let type: String
        let text: String?
    }
}

private struct AnalysisJSON: Decodable {
    let isScam: Bool
    let confidence: Double
    let detectedSignals: [String]
    let explanation: String
    let riskLevel: String

    enum CodingKeys: String, CodingKey {
        case isScam = "is_scam"
        case confidence
        case detectedSignals = "detected_signals"
        case explanation
        case riskLevel = "risk_level"
    }
}

// MARK: - Errors

enum ClaudeAPIError: LocalizedError {
    case missingAPIKey
    case invalidResponse
    case httpError(Int)
    case decodingError(Error)
    case networkError(Error)

    var errorDescription: String? {
        switch self {
        case .missingAPIKey: return "CLAUDE_API_KEY not found in Config.plist"
        case .invalidResponse: return "Invalid response from Claude API"
        case .httpError(let code): return "HTTP error: \(code)"
        case .decodingError(let e): return "Decoding error: \(e.localizedDescription)"
        case .networkError(let e): return "Network error: \(e.localizedDescription)"
        }
    }
}

// MARK: - Service

actor ClaudeAPIService {

    static let shared = ClaudeAPIService()

    private let endpoint = URL(string: "https://api.anthropic.com/v1/messages")!
    private let model = "claude-3-5-haiku-20241022"
    private let anthropicVersion = "2023-06-01"

    private let systemPrompt = """
    You are a scam detection assistant specialized in identifying law enforcement impersonation scams \
    (also called "grandparent scams" or "government impersonation scams"). Analyze the transcript for:

    1. Law enforcement claims: Caller claims to be police, FBI, DEA, IRS, SSA, immigration, or any government agency.
    2. Arrest language: Threats of arrest, warrants, deportation, account freezing, or legal action.
    3. Money requests: Any request for money, gift cards, wire transfers, cryptocurrency, or bail.
    4. Unusual payment methods: Gift cards (Google Play, Apple, Walmart), cryptocurrency, wire transfers, cash mailing.
    5. Urgency/pressure tactics: Must act now, cannot tell family, secrecy required, extreme time pressure.

    Respond ONLY with valid JSON in this exact format:
    {
      "is_scam": true/false,
      "confidence": 0.0-1.0,
      "detected_signals": ["law_enforcement_claim","arrest_language","money_request","unusual_payment_method","urgency_pressure"],
      "explanation": "Brief explanation of what was detected",
      "risk_level": "low|medium|high|critical"
    }

    detected_signals must only include signals actually present. confidence reflects your certainty.
    """

    private var apiKey: String? = {
        guard let url = Bundle.main.url(forResource: "Config", withExtension: "plist"),
              let dict = NSDictionary(contentsOf: url),
              let key = dict["CLAUDE_API_KEY"] as? String,
              !key.isEmpty,
              key != "YOUR_CLAUDE_API_KEY_HERE" else { return nil }
        return key
    }()

    func analyze(transcript: String) async throws -> ClaudeAnalysisResult {
        guard let apiKey else { throw ClaudeAPIError.missingAPIKey }

        let requestBody = ClaudeRequest(
            model: model,
            maxTokens: 512,
            system: systemPrompt,
            messages: [.init(role: "user", content: "Analyze this call transcript:\n\n\(transcript)")]
        )

        var request = URLRequest(url: endpoint)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(apiKey, forHTTPHeaderField: "x-api-key")
        request.setValue(anthropicVersion, forHTTPHeaderField: "anthropic-version")
        request.timeoutInterval = 30

        do {
            request.httpBody = try JSONEncoder().encode(requestBody)
        } catch {
            throw ClaudeAPIError.networkError(error)
        }

        let data: Data
        let response: URLResponse
        do {
            (data, response) = try await URLSession.shared.data(for: request)
        } catch {
            throw ClaudeAPIError.networkError(error)
        }

        if let http = response as? HTTPURLResponse, !(200...299).contains(http.statusCode) {
            throw ClaudeAPIError.httpError(http.statusCode)
        }

        let claudeResponse: ClaudeResponse
        do {
            claudeResponse = try JSONDecoder().decode(ClaudeResponse.self, from: data)
        } catch {
            throw ClaudeAPIError.decodingError(error)
        }

        guard let text = claudeResponse.content.first(where: { $0.type == "text" })?.text,
              let jsonData = extractJSON(from: text).data(using: .utf8) else {
            throw ClaudeAPIError.invalidResponse
        }

        let analysis: AnalysisJSON
        do {
            analysis = try JSONDecoder().decode(AnalysisJSON.self, from: jsonData)
        } catch {
            throw ClaudeAPIError.decodingError(error)
        }

        return ClaudeAnalysisResult(
            isScam: analysis.isScam,
            confidence: analysis.confidence,
            detectedSignals: analysis.detectedSignals.compactMap { ClaudeAnalysisResult.ScamSignal(rawValue: $0) },
            explanation: analysis.explanation,
            riskLevel: ClaudeAnalysisResult.RiskLevel(rawValue: analysis.riskLevel) ?? .low
        )
    }

    // MARK: - Helpers

    private func extractJSON(from text: String) -> String {
        // Strip markdown code fences if present
        if let start = text.range(of: "{"),
           let end = text.range(of: "}", options: .backwards) {
            return String(text[start.lowerBound...end.upperBound])
        }
        return text
    }
}
