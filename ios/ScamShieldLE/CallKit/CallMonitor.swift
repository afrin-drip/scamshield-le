//
//  CallMonitor.swift
//  ScamShieldLE
//
//  Observes the device call lifecycle via CXCallObserver.
//  Publishes isOnCall and currentCallUUID, and posts a notification
//  when a call connects so MonitoringView can auto-start analysis.
//

import Foundation
import CallKit
import Combine

// MARK: - Notification Names

extension Notification.Name {
    /// Posted when an incoming/outgoing call is answered and audio connects.
    static let scamShieldCallConnected = Notification.Name("ScamShieldCallConnected")
    /// Posted when a call ends.
    static let scamShieldCallEnded = Notification.Name("ScamShieldCallEnded")
}

// MARK: - CallMonitor

@Observable
final class CallMonitor: NSObject {

    // MARK: Published state

    /// `true` while at least one call is in the connected state.
    private(set) var isOnCall: Bool = false

    /// UUID of the most-recently connected call, or `nil` when idle.
    private(set) var currentCallUUID: UUID?

    // MARK: Private

    private let observer = CXCallObserver()

    // MARK: Init

    override init() {
        super.init()
        observer.setDelegate(self, queue: .main)
    }

    // MARK: Helpers

    private var connectedCalls: [CXCall] {
        observer.calls.filter { $0.hasConnected && !$0.hasEnded }
    }

    private func refreshState() {
        let calls = connectedCalls
        let wasOnCall = isOnCall
        isOnCall = !calls.isEmpty
        currentCallUUID = calls.first?.uuid

        if isOnCall && !wasOnCall {
            NotificationCenter.default.post(
                name: .scamShieldCallConnected,
                object: self,
                userInfo: currentCallUUID.map { ["uuid": $0] }
            )
        } else if !isOnCall && wasOnCall {
            NotificationCenter.default.post(
                name: .scamShieldCallEnded,
                object: self
            )
        }
    }
}

// MARK: - CXCallObserverDelegate

extension CallMonitor: CXCallObserverDelegate {

    func callObserver(_ callObserver: CXCallObserver, callChanged call: CXCall) {
        refreshState()
    }
}
