import XCTest
@testable import ScamShieldLE

final class SubscriptionTierTests: XCTestCase {

    // MARK: - hasPassiveDetection

    func testFreeHasNoPassiveDetection() {
        XCTAssertFalse(SubscriptionTier.free.hasPassiveDetection,
            ".free tier should NOT have passive detection")
    }

    func testProHasPassiveDetection() {
        XCTAssertTrue(SubscriptionTier.pro.hasPassiveDetection,
            ".pro tier SHOULD have passive detection")
    }

    func testFamilyHasPassiveDetection() {
        XCTAssertTrue(SubscriptionTier.family.hasPassiveDetection,
            ".family tier SHOULD have passive detection")
    }

    // MARK: - hasFamilyMode

    func testFreeHasNoFamilyMode() {
        XCTAssertFalse(SubscriptionTier.free.hasFamilyMode,
            ".free tier should NOT have family mode")
    }

    func testProHasNoFamilyMode() {
        XCTAssertFalse(SubscriptionTier.pro.hasFamilyMode,
            ".pro tier should NOT have family mode")
    }

    func testFamilyHasFamilyMode() {
        XCTAssertTrue(SubscriptionTier.family.hasFamilyMode,
            ".family tier SHOULD have family mode")
    }

    // MARK: - displayName

    func testFreeDisplayNameIsNonEmpty() {
        XCTAssertFalse(SubscriptionTier.free.displayName.isEmpty,
            ".free displayName should be non-empty")
    }

    func testProDisplayNameIsNonEmpty() {
        XCTAssertFalse(SubscriptionTier.pro.displayName.isEmpty,
            ".pro displayName should be non-empty")
    }

    func testFamilyDisplayNameIsNonEmpty() {
        XCTAssertFalse(SubscriptionTier.family.displayName.isEmpty,
            ".family displayName should be non-empty")
    }

    func testAllDisplayNamesAreDistinct() {
        let names = [SubscriptionTier.free.displayName,
                     SubscriptionTier.pro.displayName,
                     SubscriptionTier.family.displayName]
        XCTAssertEqual(Set(names).count, names.count,
            "Each subscription tier should have a unique displayName")
    }

    // MARK: - Feature Availability

    func testFreeHasBasicAlertCapability() {
        XCTAssertTrue(SubscriptionTier.free.hasAlerts,
            ".free tier should have basic alert capability")
    }

    func testProHasAlertCapability() {
        XCTAssertTrue(SubscriptionTier.pro.hasAlerts,
            ".pro tier should have alert capability")
    }

    func testFamilyHasAlertCapability() {
        XCTAssertTrue(SubscriptionTier.family.hasAlerts,
            ".family tier should have alert capability")
    }

    func testThreeTiersExist() {
        XCTAssertEqual(SubscriptionTier.allCases.count, 3,
            "There should be exactly 3 subscription tiers")
    }

    func testTierOrderFreeProFamily() {
        let allTiers = SubscriptionTier.allCases
        XCTAssertEqual(allTiers[0], .free,   "First tier should be .free")
        XCTAssertEqual(allTiers[1], .pro,    "Second tier should be .pro")
        XCTAssertEqual(allTiers[2], .family, "Third tier should be .family")
    }

    func testFreeIsLowestTier() {
        XCTAssertLessThan(SubscriptionTier.free.rawValue,
                          SubscriptionTier.pro.rawValue,
                          ".free should have lower raw value than .pro")
    }

    func testFamilyIsHighestTier() {
        XCTAssertGreaterThan(SubscriptionTier.family.rawValue,
                             SubscriptionTier.pro.rawValue,
                             ".family should have higher raw value than .pro")
    }

    func testPassiveDetectionGatingIsCorrect() {
        let expected: [(SubscriptionTier, Bool)] = [(.free, false), (.pro, true), (.family, true)]
        for (tier, expectedValue) in expected {
            XCTAssertEqual(tier.hasPassiveDetection, expectedValue,
                "\(tier.displayName).hasPassiveDetection should be \(expectedValue)")
        }
    }

    func testFamilyModeGatingIsCorrect() {
        let expected: [(SubscriptionTier, Bool)] = [(.free, false), (.pro, false), (.family, true)]
        for (tier, expectedValue) in expected {
            XCTAssertEqual(tier.hasFamilyMode, expectedValue,
                "\(tier.displayName).hasFamilyMode should be \(expectedValue)")
        }
    }
}