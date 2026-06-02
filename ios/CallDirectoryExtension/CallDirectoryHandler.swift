//
//  CallDirectoryHandler.swift
//  CallDirectoryExtension
//
//  ScamShield LE — iOS CallKit Call Directory Extension
//

import Foundation
import CallKit

class CallDirectoryHandler: CXCallDirectoryProvider {

    // MARK: - App Group
    private let appGroupID = "group.com.verreauxgroup.scamshield-le"

    // MARK: - Known scam area codes (US)
    private let suspiciousAreaCodes: [Int] = [
        202, 206, 212, 213, 310,
        404, 415, 602, 702, 800, 888
    ]

    // MARK: - CXCallDirectoryProvider

    override func beginRequest(with context: CXCallDirectoryExtensionContext) {
        context.delegate = self

        if context.isIncremental {
            addOrRemoveIncrementalBlockingPhoneNumbers(to: context)
            addOrRemoveIncrementalIdentificationPhoneNumbers(to: context)
        } else {
            addAllBlockingPhoneNumbers(to: context)
            addAllIdentificationPhoneNumbers(to: context)
        }

        context.completeRequest()
    }

    // MARK: - Blocking

    private func addAllBlockingPhoneNumbers(to context: CXCallDirectoryExtensionContext) {
        let blocked = blockedNumbers()
        for number in blocked.sorted() {
            context.addBlockingEntry(withNextSequentialPhoneNumber: number)
        }
    }

    private func addOrRemoveIncrementalBlockingPhoneNumbers(to context: CXCallDirectoryExtensionContext) {
        addAllBlockingPhoneNumbers(to: context)
    }

    // MARK: - Identification

    private func addAllIdentificationPhoneNumbers(to context: CXCallDirectoryExtensionContext) {
        var entries: [(CXCallDirectoryPhoneNumber, String)] = []

        for areaCode in suspiciousAreaCodes.sorted() {
            let base = CXCallDirectoryPhoneNumber(areaCode) * 10_000_000
            entries.append((base, "Suspicious: Area Code \(areaCode)"))
        }

        let sorted = entries.sorted { $0.0 < $1.0 }
        for (number, label) in sorted {
            context.addIdentificationEntry(withNextSequentialPhoneNumber: number, label: label)
        }
    }

    private func addOrRemoveIncrementalIdentificationPhoneNumbers(to context: CXCallDirectoryExtensionContext) {
        addAllIdentificationPhoneNumbers(to: context)
    }

    // MARK: - Shared UserDefaults

    private func blockedNumbers() -> [CXCallDirectoryPhoneNumber] {
        guard let defaults = UserDefaults(suiteName: appGroupID) else { return [] }
        let raw = defaults.array(forKey: "blockedNumbers") as? [Int64] ?? []
        return raw.map { CXCallDirectoryPhoneNumber($0) }
    }
}

// MARK: - CXCallDirectoryExtensionContextDelegate

extension CallDirectoryHandler: CXCallDirectoryExtensionContextDelegate {

    func requestFailed(for extensionContext: CXCallDirectoryExtensionContext, withError error: Error) {
        NSLog("[ScamShield] CallDirectoryHandler request failed: \(error.localizedDescription)")
    }
}
