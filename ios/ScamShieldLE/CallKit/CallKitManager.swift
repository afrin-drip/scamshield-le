//
//  CallKitManager.swift
//  ScamShieldLE
//
//  Singleton managing CXCallDirectoryManager: authorization status,
//  extension reload, and shared blocked-number storage.
//

import Foundation
import CallKit

@MainActor
final class CallKitManager: ObservableObject {

    // MARK: - Shared instance
    static let shared = CallKitManager()

    // MARK: - Published state
    @Published private(set) var authorizationStatus: CXCallDirectoryManager.AuthorizationStatus = .unknown

    // MARK: - Extension bundle ID
    private let extensionBundleID = "com.verreauxgroup.scamshield-le.CallDirectoryExtension"

    // MARK: - Init
    private init() {
        Task { await refreshAuthorizationStatus() }
    }

    // MARK: - Public API

    /// Checks and returns the current CallKit authorization status.
    @discardableResult
    func checkAuthorizationStatus() async -> CXCallDirectoryManager.AuthorizationStatus {
        await refreshAuthorizationStatus()
        return authorizationStatus
    }

    /// Tells the system to reload the Call Directory Extension.
    func reloadExtension() async {
        await withCheckedContinuation { continuation in
            CXCallDirectoryManager.sharedInstance.reloadExtension(
                withIdentifier: extensionBundleID
            ) { [weak self] error in
                if let error {
                    NSLog("[ScamShield] CallKit extension reload failed: \(error.localizedDescription)")
                }
                Task { @MainActor [weak self] in
                    await self?.refreshAuthorizationStatus()
                    continuation.resume()
                }
            }
        }
    }

    /// `true` when the extension is authorized and enabled in Settings.
    var isExtensionEnabled: Bool {
        authorizationStatus == .enabled
    }

    // MARK: - Private

    private func refreshAuthorizationStatus() async {
        authorizationStatus = await withCheckedContinuation { continuation in
            CXCallDirectoryManager.sharedInstance.getEnabledStatusForExtension(
                withIdentifier: extensionBundleID
            ) { status, error in
                if let error {
                    NSLog("[ScamShield] CallKit status check failed: \(error.localizedDescription)")
                }
                continuation.resume(returning: status)
            }
        }
    }
}

// MARK: - Blocked Number Helpers

extension CallKitManager {

    private static let appGroupID = "group.com.verreauxgroup.scamshield-le"
    private static let blockedNumbersKey = "blockedNumbers"

    func blockNumber(_ number: Int64) async {
        var numbers = storedBlockedNumbers()
        guard !numbers.contains(number) else { return }
        numbers.append(number)
        saveBlockedNumbers(numbers)
        await reloadExtension()
    }

    func unblockNumber(_ number: Int64) async {
        var numbers = storedBlockedNumbers()
        numbers.removeAll { $0 == number }
        saveBlockedNumbers(numbers)
        await reloadExtension()
    }

    func storedBlockedNumbers() -> [Int64] {
        UserDefaults(suiteName: Self.appGroupID)?
            .array(forKey: Self.blockedNumbersKey) as? [Int64] ?? []
    }

    private func saveBlockedNumbers(_ numbers: [Int64]) {
        UserDefaults(suiteName: Self.appGroupID)?
            .set(numbers, forKey: Self.blockedNumbersKey)
    }
}
