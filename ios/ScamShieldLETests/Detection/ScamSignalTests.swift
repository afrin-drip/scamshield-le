import XCTest
@testable import ScamShieldLE

final class ScamSignalTests: XCTestCase {

    // MARK: - Signal Score Values

    func testLawEnforcementClaimScoreIs25() {
        let signal = ScamSignal(type: .lawEnforcementClaim)
        XCTAssertEqual(signal.score, 25, ".lawEnforcementClaim score should be 25")
    }

    func testUrgencyTacticsScoreIs20() {
        let signal = ScamSignal(type: .urgencyTactics)
        XCTAssertEqual(signal.score, 20, ".urgencyTactics score should be 20")
    }

    func testMoneyRequestScoreIs40() {
        let signal = ScamSignal(type: .moneyRequest)
        XCTAssertEqual(signal.score, 40, ".moneyRequest score should be 40")
    }

    func testSuspiciousPaymentMethodScoreIs60() {
        let signal = ScamSignal(type: .suspiciousPaymentMethod)
        XCTAssertEqual(signal.score, 60, ".suspiciousPaymentMethod score should be 60")
    }

    func testPersonalInfoRequestScoreIs20() {
        let signal = ScamSignal(type: .personalInfoRequest)
        XCTAssertEqual(signal.score, 20, ".personalInfoRequest score should be 20")
    }

    // MARK: - Signal Labels

    func testLawEnforcementClaimLabelIsNonEmpty() {
        let signal = ScamSignal(type: .lawEnforcementClaim)
        XCTAssertFalse(signal.label.isEmpty, ".lawEnforcementClaim should have a non-empty label")
    }

    func testUrgencyTacticsLabelIsNonEmpty() {
        let signal = ScamSignal(type: .urgencyTactics)
        XCTAssertFalse(signal.label.isEmpty, ".urgencyTactics should have a non-empty label")
    }

    func testMoneyRequestLabelIsNonEmpty() {
        let signal = ScamSignal(type: .moneyRequest)
        XCTAssertFalse(signal.label.isEmpty, ".moneyRequest should have a non-empty label")
    }

    func testSuspiciousPaymentMethodLabelIsNonEmpty() {
        let signal = ScamSignal(type: .suspiciousPaymentMethod)
        XCTAssertFalse(signal.label.isEmpty, ".suspiciousPaymentMethod should have a non-empty label")
    }

    func testPersonalInfoRequestLabelIsNonEmpty() {
        let signal = ScamSignal(type: .personalInfoRequest)
        XCTAssertFalse(signal.label.isEmpty, ".personalInfoRequest should have a non-empty label")
    }

    func testAllSignalLabelsAreDistinct() {
        let types: [ScamSignal.SignalType] = [
            .lawEnforcementClaim, .urgencyTactics, .moneyRequest,
            .suspiciousPaymentMethod, .personalInfoRequest
        ]
        let labels = types.map { ScamSignal(type: $0).label }
        let uniqueLabels = Set(labels)
        XCTAssertEqual(uniqueLabels.count, types.count,
            "Each signal type should have a unique label")
    }

    // MARK: - RiskAssessment.RiskLevel Cases

    func testRiskLevelLowExists() {
        let level = RiskAssessment.RiskLevel.low
        XCTAssertEqual(level, .low)
    }

    func testRiskLevelSuspiciousExists() {
        let level = RiskAssessment.RiskLevel.suspicious
        XCTAssertEqual(level, .suspicious)
    }

    func testRiskLevelLikelyScamExists() {
        let level = RiskAssessment.RiskLevel.likelyScam
        XCTAssertEqual(level, .likelyScam)
    }

    func testRiskLevelCriticalExists() {
        let level = RiskAssessment.RiskLevel.critical
        XCTAssertEqual(level, .critical)
    }

    func testRiskLevelOrdering() {
        XCTAssertLessThan(RiskAssessment.RiskLevel.low.rawValue,
                          RiskAssessment.RiskLevel.suspicious.rawValue,
                          ".low should rank below .suspicious")
        XCTAssertLessThan(RiskAssessment.RiskLevel.suspicious.rawValue,
                          RiskAssessment.RiskLevel.likelyScam.rawValue,
                          ".suspicious should rank below .likelyScam")
        XCTAssertLessThan(RiskAssessment.RiskLevel.likelyScam.rawValue,
                          RiskAssessment.RiskLevel.critical.rawValue,
                          ".likelyScam should rank below .critical")
    }

    func testRiskLevelDisplayNamesNonEmpty() {
        let levels: [RiskAssessment.RiskLevel] = [.low, .suspicious, .likelyScam, .critical]
        for level in levels {
            XCTAssertFalse(level.displayName.isEmpty,
                "\(level) should have a non-empty displayName")
        }
    }

    func testRiskAssessmentInitialization() {
        let signals = [ScamSignal(type: .moneyRequest), ScamSignal(type: .urgencyTactics)]
        let score = signals.reduce(0) { $0 + $1.score } // 40 + 20 = 60
        let assessment = RiskAssessment(score: score, detectedSignals: signals)
        XCTAssertEqual(assessment.score, 60)
        XCTAssertEqual(assessment.detectedSignals.count, 2)
        XCTAssertEqual(assessment.riskLevel, .suspicious,
            "Score 60 should map to .suspicious (40..<70)")
    }

    func testAllSignalScoresArePositive() {
        let types: [ScamSignal.SignalType] = [
            .lawEnforcementClaim, .urgencyTactics, .moneyRequest,
            .suspiciousPaymentMethod, .personalInfoRequest
        ]
        for type in types {
            let signal = ScamSignal(type: type)
            XCTAssertGreaterThan(signal.score, 0,
                "Signal \(type) should have a positive score")
        }
    }
}