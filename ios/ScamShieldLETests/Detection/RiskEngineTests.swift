import XCTest
@testable import ScamShieldLE

final class RiskEngineTests: XCTestCase {

    var engine: RiskEngine!

    override func setUp() {
        super.setUp()
        engine = RiskEngine()
    }

    override func tearDown() {
        engine = nil
        super.tearDown()
    }

    // MARK: - Individual Signal Detection

    func testLawEnforcementClaimDetected() {
        let result = engine.analyze(transcript: "I'm officer Johnson from the local police department")
        XCTAssertGreaterThanOrEqual(result.score, 25,
            "Law enforcement claim should contribute at least +25 to risk score")
        XCTAssertTrue(result.detectedSignals.contains(where: { $0.type == .lawEnforcementClaim }),
            "Should detect .lawEnforcementClaim signal")
    }

    func testMoneyRequestDetected() {
        let result = engine.analyze(transcript: "you need to pay now or face arrest")
        XCTAssertGreaterThanOrEqual(result.score, 40,
            "Money request should contribute at least +40 to risk score")
        XCTAssertTrue(result.detectedSignals.contains(where: { $0.type == .moneyRequest }),
            "Should detect .moneyRequest signal")
    }

    func testSuspiciousPaymentDetected() {
        let result = engine.analyze(transcript: "please buy gift cards and give me the numbers")
        XCTAssertGreaterThanOrEqual(result.score, 60,
            "Suspicious payment method should contribute at least +60 to risk score")
        XCTAssertTrue(result.detectedSignals.contains(where: { $0.type == .suspiciousPaymentMethod }),
            "Should detect .suspiciousPaymentMethod signal")
    }

    func testUrgencyDetected() {
        let result = engine.analyze(transcript: "don't hang up or you'll be arrested immediately")
        XCTAssertGreaterThanOrEqual(result.score, 20,
            "Urgency signal should contribute at least +20 to risk score")
        XCTAssertTrue(result.detectedSignals.contains(where: { $0.type == .urgencyTactics }),
            "Should detect .urgencyTactics signal")
    }

    func testLawEnforcementClaimScoreIsExact() {
        let result = engine.analyze(transcript: "this is officer Johnson calling")
        let lawSignals = result.detectedSignals.filter { $0.type == .lawEnforcementClaim }
        XCTAssertFalse(lawSignals.isEmpty, "Law enforcement claim should be detected")
        let contribution = lawSignals.reduce(0) { $0 + $1.score }
        XCTAssertEqual(contribution, 25,
            "Law enforcement claim score should be exactly 25, got \(contribution)")
    }

    func testMoneyRequestScoreIsExact() {
        let result = engine.analyze(transcript: "you need to pay now")
        let signals = result.detectedSignals.filter { $0.type == .moneyRequest }
        XCTAssertFalse(signals.isEmpty, "Money request should be detected")
        let contribution = signals.reduce(0) { $0 + $1.score }
        XCTAssertEqual(contribution, 40,
            "Money request score should be exactly 40, got \(contribution)")
    }

    func testSuspiciousPaymentScoreIsExact() {
        let result = engine.analyze(transcript: "buy gift cards")
        let signals = result.detectedSignals.filter { $0.type == .suspiciousPaymentMethod }
        XCTAssertFalse(signals.isEmpty, "Suspicious payment should be detected")
        let contribution = signals.reduce(0) { $0 + $1.score }
        XCTAssertEqual(contribution, 60,
            "Suspicious payment score should be exactly 60, got \(contribution)")
    }

    func testUrgencyScoreIsExact() {
        let result = engine.analyze(transcript: "don't hang up")
        let signals = result.detectedSignals.filter { $0.type == .urgencyTactics }
        XCTAssertFalse(signals.isEmpty, "Urgency tactics should be detected")
        let contribution = signals.reduce(0) { $0 + $1.score }
        XCTAssertEqual(contribution, 20,
            "Urgency score should be exactly 20, got \(contribution)")
    }

    func testMultipleSignalsCombine() {
        let result = engine.analyze(transcript: "I'm officer Johnson and you need to pay now")
        XCTAssertGreaterThanOrEqual(result.score, 65,
            "Combined signals should sum their individual scores (>=65)")
        XCTAssertTrue(result.detectedSignals.count >= 2,
            "Should detect at least 2 signals from combined transcript")
    }

    func testAllFourSignalsCombine() {
        let transcript = "I'm officer Johnson, you need to pay now with gift cards, don't hang up"
        let result = engine.analyze(transcript: transcript)
        XCTAssertEqual(result.detectedSignals.count, 4,
            "All four signal types should be detected")
        let types = Set(result.detectedSignals.map { $0.type })
        XCTAssertTrue(types.contains(.lawEnforcementClaim))
        XCTAssertTrue(types.contains(.moneyRequest))
        XCTAssertTrue(types.contains(.suspiciousPaymentMethod))
        XCTAssertTrue(types.contains(.urgencyTactics))
    }

    func testScoreCapAt100() {
        let transcript = "I'm officer Johnson from the FBI. You need to pay now with gift cards. Don't hang up or you'll be arrested. Send wire transfers immediately. Buy more gift cards. You owe back taxes. Pay now or face prison."
        let result = engine.analyze(transcript: transcript)
        XCTAssertLessThanOrEqual(result.score, 100,
            "Risk score must never exceed 100, got \(result.score)")
        XCTAssertGreaterThanOrEqual(result.score, 0,
            "Risk score must never be negative")
    }

    func testScoreNeverNegative() {
        let result = engine.analyze(transcript: "have a nice day, goodbye")
        XCTAssertGreaterThanOrEqual(result.score, 0,
            "Score should never be negative for benign transcripts")
    }

    func testCriticalThresholdAt90() {
        let transcript = "I'm special agent Johnson from the FBI. You need to pay now. Buy gift cards immediately. Don't hang up. Wire the money. You'll be arrested if you don't pay. This is an official warrant."
        let result = engine.analyze(transcript: transcript)
        XCTAssertGreaterThanOrEqual(result.score, 90,
            "Highly suspicious transcript should score >=90")
        XCTAssertEqual(result.riskLevel, .critical,
            "Score >=90 should map to .critical risk level")
    }

    func testLikelyScamAt70() {
        let result = engine.analyze(transcript: "I'm officer Johnson and you need to pay now don't hang up")
        if result.score >= 70 && result.score < 90 {
            XCTAssertEqual(result.riskLevel, .likelyScam,
                "Score 70-89 should map to .likelyScam")
        } else if result.score >= 90 {
            XCTAssertEqual(result.riskLevel, .critical,
                "Score >=90 should map to .critical")
        } else {
            XCTAssertGreaterThanOrEqual(result.score, 40,
                "Combined signals should at least reach .suspicious threshold")
        }
    }

    func testSuspiciousAt40() {
        let result = engine.analyze(transcript: "you need to pay now")
        XCTAssertGreaterThanOrEqual(result.score, 40,
            "Money request alone should score >=40")
        let expected: RiskAssessment.RiskLevel = result.score >= 90 ? .critical :
                                                  result.score >= 70 ? .likelyScam : .suspicious
        XCTAssertEqual(result.riskLevel, expected,
            "Risk level should match score band")
    }

    func testLowBelow40() {
        let result = engine.analyze(transcript: "the weather is nice today, have a great day")
        XCTAssertLessThan(result.score, 40,
            "Benign transcript should score <40")
        XCTAssertEqual(result.riskLevel, .low,
            "Score <40 should map to .low risk level")
    }

    func testEmptyTranscriptIsLow() {
        let result = engine.analyze(transcript: "")
        XCTAssertEqual(result.score, 0,
            "Empty transcript should produce score of 0")
        XCTAssertEqual(result.riskLevel, .low,
            "Empty transcript should produce .low risk level")
        XCTAssertTrue(result.detectedSignals.isEmpty,
            "Empty transcript should produce no detected signals")
    }

    func testWhitespaceOnlyTranscriptIsLow() {
        let result = engine.analyze(transcript: "   \n\t   ")
        XCTAssertEqual(result.riskLevel, .low,
            "Whitespace-only transcript should produce .low risk level")
    }

    func testCaseInsensitiveDetection() {
        let lower = engine.analyze(transcript: "buy gift cards now")
        let upper = engine.analyze(transcript: "BUY GIFT CARDS NOW")
        let mixed = engine.analyze(transcript: "Buy Gift Cards Now")
        XCTAssertEqual(lower.score, upper.score,
            "Detection should be case-insensitive (lower vs upper)")
        XCTAssertEqual(lower.score, mixed.score,
            "Detection should be case-insensitive (lower vs mixed)")
    }

    func testSingleWordTranscriptIsLow() {
        let result = engine.analyze(transcript: "hello")
        XCTAssertEqual(result.riskLevel, .low,
            "Single innocuous word should be .low risk")
    }

    func testFBIScriptIsCritical() {
        let fbiScript = "This is Special Agent Michael Thompson from the Federal Bureau of Investigation. We have issued a federal warrant for your arrest due to involvement in money laundering and tax evasion. You need to pay a bail bond immediately to avoid being taken into custody. Do not hang up this call under any circumstances. You must purchase Google Play gift cards worth $2000 and read the card numbers to me right now. Wire transfers and gift cards are the only accepted forms of payment for federal bail bonds. Do not hang up."
        let result = engine.analyze(transcript: fbiScript)
        XCTAssertGreaterThanOrEqual(result.score, 90,
            "FBI warrant script should score >=90, got \(result.score)")
        XCTAssertEqual(result.riskLevel, .critical,
            "FBI warrant script should be classified as .critical")
        XCTAssertGreaterThanOrEqual(result.detectedSignals.count, 3,
            "FBI script should trigger at least 3 distinct signal types")
    }

    func testFBIScriptDetectsAllSignalTypes() {
        let fbiScript = "I am FBI Special Agent Johnson. You owe back taxes and must pay now. Buy gift cards and don't hang up or federal agents will arrest you."
        let result = engine.analyze(transcript: fbiScript)
        let detectedTypes = Set(result.detectedSignals.map { $0.type })
        XCTAssertTrue(detectedTypes.contains(.lawEnforcementClaim), "FBI script should trigger .lawEnforcementClaim")
        XCTAssertTrue(detectedTypes.contains(.moneyRequest), "FBI script should trigger .moneyRequest")
        XCTAssertTrue(detectedTypes.contains(.suspiciousPaymentMethod), "FBI script should trigger .suspiciousPaymentMethod")
        XCTAssertTrue(detectedTypes.contains(.urgencyTactics), "FBI script should trigger .urgencyTactics")
    }

    func testAnalyzeReturnsSameScoreForSameInput() {
        let transcript = "buy gift cards now and don't hang up"
        let result1 = engine.analyze(transcript: transcript)
        let result2 = engine.analyze(transcript: transcript)
        XCTAssertEqual(result1.score, result2.score,
            "Same input should always produce the same score (deterministic)")
        XCTAssertEqual(result1.riskLevel, result2.riskLevel,
            "Same input should always produce the same risk level")
    }

    func testDetectedSignalsMatchScore() {
        let result = engine.analyze(transcript: "I'm officer Johnson, buy gift cards now")
        let signalSum = result.detectedSignals.reduce(0) { $0 + $1.score }
        let expectedScore = min(signalSum, 100)
        XCTAssertEqual(result.score, expectedScore,
            "result.score should equal min(sum of signal scores, 100)")
    }
}