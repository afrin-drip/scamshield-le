import XCTest
@testable import ScamShieldLE

final class AgencyDirectoryTests: XCTestCase {

    var directory: AgencyDirectory!

    override func setUp() {
        super.setUp()
        directory = AgencyDirectory()
    }

    override func tearDown() {
        directory = nil
        super.tearDown()
    }

    func testAgencyCount() {
        XCTAssertEqual(directory.allAgencies.count, 10,
            "AgencyDirectory should contain exactly 10 agencies")
    }

    func testNoNilAgencies() {
        XCTAssertFalse(directory.allAgencies.isEmpty, "Agency list should not be empty")
    }

    func testFTCPhoneNumber() {
        guard let ftc = directory.allAgencies.first(where: {
            $0.name.contains("FTC") || $0.name.lowercased().contains("federal trade")
        }) else { XCTFail("FTC agency not found in directory"); return }
        XCTAssertEqual(ftc.phoneNumber, "1-877-382-4357",
            "FTC phone number should be 1-877-382-4357, got \(ftc.phoneNumber)")
    }

    func testFBICategory() {
        guard let fbi = directory.allAgencies.first(where: {
            $0.name.contains("FBI") || $0.name.lowercased().contains("federal bureau")
        }) else { XCTFail("FBI agency not found in directory"); return }
        XCTAssertEqual(fbi.category, .federalLawEnforcement,
            "FBI should be categorized as .federalLawEnforcement")
    }

    func testFTCCategoryIsConsumerProtection() {
        guard let ftc = directory.allAgencies.first(where: {
            $0.name.contains("FTC") || $0.name.lowercased().contains("federal trade")
        }) else { XCTFail("FTC agency not found in directory"); return }
        XCTAssertEqual(ftc.category, .consumerProtection,
            "FTC should be categorized as .consumerProtection")
    }

    func testAllAgenciesHaveNonEmptyName() {
        for agency in directory.allAgencies {
            XCTAssertFalse(agency.name.isEmpty, "Every agency should have a non-empty name")
        }
    }

    func testAllAgenciesHaveNonEmptyPhoneNumber() {
        for agency in directory.allAgencies {
            XCTAssertFalse(agency.phoneNumber.isEmpty,
                "Every agency should have a non-empty phone number: \(agency.name)")
        }
    }

    func testAllAgenciesHaveNonEmptyDescription() {
        for agency in directory.allAgencies {
            XCTAssertFalse(agency.description.isEmpty,
                "Every agency should have a non-empty description: \(agency.name)")
        }
    }

    func testGetByCategory_FederalLawEnforcement() {
        let federal = directory.agencies(inCategory: .federalLawEnforcement)
        XCTAssertFalse(federal.isEmpty, "Should return at least one .federalLawEnforcement agency")
        for agency in federal {
            XCTAssertEqual(agency.category, .federalLawEnforcement,
                "\(agency.name) has wrong category \(agency.category)")
        }
    }

    func testGetByCategory_ConsumerProtection() {
        let consumer = directory.agencies(inCategory: .consumerProtection)
        XCTAssertFalse(consumer.isEmpty, "Should return at least one .consumerProtection agency")
        for agency in consumer {
            XCTAssertEqual(agency.category, .consumerProtection,
                "\(agency.name) has wrong category \(agency.category)")
        }
    }

    func testGetByCategoryReturnCorrectSubset() {
        let federal = directory.agencies(inCategory: .federalLawEnforcement)
        let all = directory.allAgencies
        let allFederalInDirectory = all.filter { $0.category == .federalLawEnforcement }
        XCTAssertEqual(federal.count, allFederalInDirectory.count,
            "agencies(inCategory:) should return exactly the agencies matching that category")
    }

    func testSearchByName() {
        let results = directory.search(query: "FBI")
        XCTAssertFalse(results.isEmpty, "Search for 'FBI' should return at least one result")
        let hasFBI = results.contains {
            $0.name.uppercased().contains("FBI") || $0.name.lowercased().contains("federal bureau")
        }
        XCTAssertTrue(hasFBI, "Search for 'FBI' should return an FBI-related agency")
    }

    func testSearchByNameCaseInsensitive() {
        let upper = directory.search(query: "FBI")
        let lower = directory.search(query: "fbi")
        XCTAssertEqual(upper.count, lower.count, "Search should be case-insensitive")
    }

    func testSearchWithNoMatchReturnsEmpty() {
        let results = directory.search(query: "XYZNONEXISTENTAGENCY123")
        XCTAssertTrue(results.isEmpty,
            "Search for a non-existent agency should return empty results")
    }

    func testSearchByNameFTC() {
        let results = directory.search(query: "FTC")
        XCTAssertFalse(results.isEmpty, "Search for 'FTC' should return at least one result")
    }

    func testAllAgencyIdsAreUnique() {
        let ids = directory.allAgencies.map { $0.id }
        XCTAssertEqual(ids.count, Set(ids).count, "All agency IDs should be unique")
    }
}