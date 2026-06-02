import XCTest
@testable import ScamShieldLE

final class ScamScriptsTests: XCTestCase {

    var scriptsProvider: ScamScriptsProvider!
    var riskEngine: RiskEngine!

    override func setUp() {
        super.setUp()
        scriptsProvider = ScamScriptsProvider()
        riskEngine = RiskEngine()
    }

    override func tearDown() {
        scriptsProvider = nil
        riskEngine = nil
        super.tearDown()
    }

    // MARK: - Script Existence

    func testExactlyFiveScriptsExist() {
        XCTAssertEqual(scriptsProvider.allScripts.count, 5,
            "ScamScriptsProvider should contain exactly 5 scripts")
    }

    func testIRSScriptExists() {
        let has = scriptsProvider.allScripts.contains {
            $0.title.uppercased().contains("IRS") || $0.title.lowercased().contains("tax")
        }
        XCTAssertTrue(has, "An IRS/tax-related script should exist")
    }

    func testFBIScriptExists() {
        let has = scriptsProvider.allScripts.contains {
            $0.title.uppercased().contains("FBI") ||
            $0.title.lowercased().contains("federal bureau") ||
            $0.title.lowercased().contains("warrant")
        }
        XCTAssertTrue(has, "An FBI/warrant-related script should exist")
    }

    func testSocialSecurityScriptExists() {
        let has = scriptsProvider.allScripts.contains {
            $0.title.lowercased().contains("social security") ||
            $0.title.lowercased().contains("ssa") ||
            $0.title.lowercased().contains("benefit")
        }
        XCTAssertTrue(has, "A Social Security Administration script should exist")
    }

    func testTechSupportScriptExists() {
        let has = scriptsProvider.allScripts.contains {
            $0.title.lowercased().contains("tech") ||
            $0.title.lowercased().contains("microsoft") ||
            $0.title.lowercased().contains("support") ||
            $0.title.lowercased().contains("virus")
        }
        XCTAssertTrue(has, "A tech support scam script should exist")
    }

    func testGrandparentScriptExists() {
        let has = scriptsProvider.allScripts.contains {
            $0.title.lowercased().contains("grandparent") ||
            $0.title.lowercased().contains("family") ||
            $0.title.lowercased().contains("bail") ||
            $0.title.lowercased().contains("emergency")
        }
        XCTAssertTrue(has, "A grandparent/family emergency scam script should exist")
    }

    // MARK: - Script Content

    func testAllScriptsHaveNonEmptyLinesArray() {
        for script in scriptsProvider.allScripts {
            XCTAssertFalse(script.lines.isEmpty,
                "Script '\(script.title)' should have a non-empty lines array")
        }
    }

    func testAllScriptsHaveNonEmptyTitle() {
        for script in scriptsProvider.allScripts {
            XCTAssertFalse(script.title.isEmpty,
                "Every script should have a non-empty title")
        }
    }

    func testAllScriptsHaveAtLeastTwoLines() {
        for script in scriptsProvider.allScripts {
            XCTAssertGreaterThanOrEqual(script.lines.count, 2,
                "Script '\(script.title)' should have at least 2 lines")
        }
    }

    func testAllScriptLinesAreNonEmpty() {
        for script in scriptsProvider.allScripts {
            for (index, line) in script.lines.enumerated() {
                XCTAssertFalse(line.text.isEmpty,
                    "Line \(index) in script '\(script.title)' should not be empty")
            }
        }
    }

    func testAllScriptIdsAreUnique() {
        let ids = scriptsProvider.allScripts.map { $0.id }
        XCTAssertEqual(ids.count, Set(ids).count, "All script IDs should be unique")
    }

    func testScriptLinesHaveSpeakerIdentified() {
        for script in scriptsProvider.allScripts {
            for line in script.lines {
                XCTAssertNotNil(line.speaker,
                    "Each script line should have an identified speaker")
            }
        }
    }

    // MARK: - Risk Engine Integration

    func testFBIScriptProducesCriticalRisk() {
        guard let fbiScript = scriptsProvider.allScripts.first(where: {
            $0.title.uppercased().contains("FBI") ||
            $0.title.lowercased().contains("federal bureau") ||
            $0.title.lowercased().contains("warrant")
        }) else { XCTFail("FBI script not found in ScamScriptsProvider"); return }
        let transcript = fbiScript.lines.map { $0.text }.joined(separator: " ")
        let result = riskEngine.analyze(transcript: transcript)
        XCTAssertEqual(result.riskLevel, .critical,
            "FBI warrant script should produce .critical risk level, got score \(result.score)")
        XCTAssertGreaterThanOrEqual(result.score, 90,
            "FBI warrant script should score >=90")
    }

    func testAllScriptsProduceAtLeastSuspicious() {
        for script in scriptsProvider.allScripts {
            let transcript = script.lines.map { $0.text }.joined(separator: " ")
            let result = riskEngine.analyze(transcript: transcript)
            XCTAssertGreaterThanOrEqual(result.score, 40,
                "Script '\(script.title)' should produce score >=40, got \(result.score)")
            XCTAssertNotEqual(result.riskLevel, .low,
                "Script '\(script.title)' should not produce .low risk level")
        }
    }

    func testIRSScriptIsHighRisk() {
        guard let irsScript = scriptsProvider.allScripts.first(where: {
            $0.title.uppercased().contains("IRS") || $0.title.lowercased().contains("tax")
        }) else { XCTFail("IRS script not found"); return }
        let transcript = irsScript.lines.map { $0.text }.joined(separator: " ")
        let result = riskEngine.analyze(transcript: transcript)
        XCTAssertGreaterThanOrEqual(result.score, 40, "IRS scam script should score >=40")
    }
}