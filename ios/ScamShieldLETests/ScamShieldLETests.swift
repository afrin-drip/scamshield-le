import XCTest
@testable import ScamShieldLE

/// ScamShieldLETests — top-level test file and integration smoke suite.
///
/// Full unit coverage lives in the sub-group test files:
///   - Detection/RiskEngineTests.swift
///   - Detection/ScamSignalTests.swift
///   - Agencies/AgencyDirectoryTests.swift
///   - Simulation/ScamScriptsTests.swift
///   - Billing/SubscriptionTierTests.swift
///
final class ScamShieldLETests: XCTestCase {

    // MARK: - Smoke: Core Types Are Instantiable

    func testRiskEngineCanBeInstantiated() {
        let engine = RiskEngine()
        XCTAssertNotNil(engine, "RiskEngine should be instantiable")
    }

    func testRiskEngineAnalyzeReturnsResult() {
        let engine = RiskEngine()
        let result = engine.analyze(transcript: "hello world")
        XCTAssertNotNil(result, "analyze() should return a non-nil RiskAssessment")
    }

    func testAgencyDirectoryCanBeInstantiated() {
        let directory = AgencyDirectory()
        XCTAssertNotNil(directory, "AgencyDirectory should be instantiable")
    }

    func testAgencyDirectoryIsNonEmpty() {
        let directory = AgencyDirectory()
        XCTAssertFalse(directory.allAgencies.isEmpty,
            "AgencyDirectory should contain at least one agency")
    }

    func testScamScriptsProviderCanBeInstantiated() {
        let provider = ScamScriptsProvider()
        XCTAssertNotNil(provider, "ScamScriptsProvider should be instantiable")
    }

    func testScamScriptsProviderIsNonEmpty() {
        let provider = ScamScriptsProvider()
        XCTAssertFalse(provider.allScripts.isEmpty,
            "ScamScriptsProvider should contain at least one script")
    }

    func testSubscriptionTierFreeExists() {
        let tier = SubscriptionTier.free
        XCTAssertEqual(tier, .free)
    }

    // MARK: - Integration: Full Pipeline

    func testEndToEndScamDetectionPipeline() {
        let engine = RiskEngine()
        let transcript = "This is FBI Special Agent Davis. You must pay a federal bond immediately. Buy gift cards and don't hang up. This is urgent."
        let assessment = engine.analyze(transcript: transcript)
        XCTAssertGreaterThanOrEqual(assessment.score, 40,
            "A clear scam transcript should score >=40")
        XCTAssertNotEqual(assessment.riskLevel, .low,
            "A clear scam transcript should not be classified as .low")
        XCTAssertFalse(assessment.detectedSignals.isEmpty,
            "A clear scam transcript should trigger at least one signal")
    }

    func testEndToEndBenignConversationIsLow() {
        let engine = RiskEngine()
        let transcript = "Hi, just calling to check how you are doing. Have a great day!"
        let assessment = engine.analyze(transcript: transcript)
        XCTAssertLessThan(assessment.score, 40,
            "A benign transcript should score <40")
        XCTAssertEqual(assessment.riskLevel, .low,
            "A benign transcript should be classified as .low")
    }

    func testAllSubsystemsCoherent() {
        // Verify scripts, risk engine, and agency directory work end-to-end together
        let provider = ScamScriptsProvider()
        let engine   = RiskEngine()
        let directory = AgencyDirectory()
        XCTAssertFalse(provider.allScripts.isEmpty)
        XCTAssertFalse(directory.allAgencies.isEmpty)
        if let script = provider.allScripts.first {
            let transcript = script.lines.map { $0.text }.joined(separator: " ")
            let result = engine.analyze(transcript: transcript)
            XCTAssertGreaterThanOrEqual(result.score, 0,
                "Risk engine should handle any script without crashing")
        }
    }
}