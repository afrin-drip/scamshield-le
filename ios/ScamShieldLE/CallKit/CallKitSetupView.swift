//
//  CallKitSetupView.swift
//  ScamShieldLE
//
//  Explains iOS CallKit capabilities and limitations,
//  shows extension status, and deep-links to Settings.
//

import SwiftUI
import CallKit

struct CallKitSetupView: View {

    @StateObject private var manager = CallKitManager.shared
    @State private var isReloading = false

    var body: some View {
        List {
            // MARK: What CallKit can do
            Section {
                CapabilityRow(
                    symbol: "phone.badge.checkmark",
                    color: .green,
                    title: "Caller ID Flagging",
                    detail: "ScamShield can label incoming calls from known scam numbers before you answer — no app open required."
                )
                CapabilityRow(
                    symbol: "nosign",
                    color: .red,
                    title: "Number Blocking",
                    detail: "Block specific numbers so calls are silently rejected at the system level."
                )
            } header: {
                Text("What ScamShield Can Do")
            }

            // MARK: What CallKit cannot do (iOS vs Android)
            Section {
                CapabilityRow(
                    symbol: "waveform.slash",
                    color: .orange,
                    title: "No Audio Interception",
                    detail: "Unlike Android, iOS does not permit third-party apps to access live call audio. ScamShield cannot analyze conversation in real time on iOS — only caller ID labeling is supported."
                )
                CapabilityRow(
                    symbol: "lock.shield",
                    color: .blue,
                    title: "Privacy by Design",
                    detail: "Apple's sandbox ensures no app can record or process your call audio without explicit consent via a CallKit VoIP integration."
                )
            } header: {
                Text("iOS Limitations vs Android")
            } footer: {
                Text("On Android, ScamShield uses the Accessibility Service to analyze live audio. Apple does not provide an equivalent API for standard cellular calls.")
            }

            // MARK: Extension status
            Section {
                HStack {
                    Label("Extension Status", systemImage: "switch.2")
                    Spacer()
                    statusBadge
                }

                if !manager.isExtensionEnabled {
                    Text("Enable \"Call Blocking & Identification\" for ScamShield in iOS Settings → Phone → Call Blocking & Identification.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }
            } header: {
                Text("Current Status")
            }

            // MARK: Actions
            Section {
                Button {
                    openPhoneSettings()
                } label: {
                    Label("Open Settings", systemImage: "gear")
                }

                Button {
                    Task {
                        isReloading = true
                        await manager.reloadExtension()
                        isReloading = false
                    }
                } label: {
                    HStack {
                        Label("Refresh Extension Data", systemImage: "arrow.clockwise")
                        if isReloading {
                            Spacer()
                            ProgressView()
                        }
                    }
                }
                .disabled(isReloading)
            } header: {
                Text("Actions")
            } footer: {
                Text("Refresh after ScamShield updates your blocked number list to sync changes with iOS.")
            }
        }
        .navigationTitle("Call Identification")
        .navigationBarTitleDisplayMode(.inline)
        .task {
            await manager.checkAuthorizationStatus()
        }
    }

    // MARK: - Helpers

    @ViewBuilder
    private var statusBadge: some View {
        switch manager.authorizationStatus {
        case .enabled:
            Label("Enabled", systemImage: "checkmark.circle.fill")
                .foregroundStyle(.green).font(.subheadline)
        case .disabled:
            Label("Disabled", systemImage: "xmark.circle.fill")
                .foregroundStyle(.red).font(.subheadline)
        case .restricted:
            Label("Restricted", systemImage: "exclamationmark.circle.fill")
                .foregroundStyle(.orange).font(.subheadline)
        case .unknown:
            Label("Unknown", systemImage: "questionmark.circle")
                .foregroundStyle(.secondary).font(.subheadline)
        @unknown default:
            Label("Unknown", systemImage: "questionmark.circle")
                .foregroundStyle(.secondary).font(.subheadline)
        }
    }

    private func openPhoneSettings() {
        if let url = URL(string: "App-prefs:Phone") ?? URL(string: UIApplication.openSettingsURLString) {
            UIApplication.shared.open(url)
        }
    }
}

// MARK: - CapabilityRow

private struct CapabilityRow: View {
    let symbol: String
    let color: Color
    let title: String
    let detail: String

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: symbol)
                .font(.title2)
                .foregroundStyle(color)
                .frame(width: 32)
            VStack(alignment: .leading, spacing: 2) {
                Text(title).font(.headline)
                Text(detail).font(.subheadline).foregroundStyle(.secondary)
            }
        }
        .padding(.vertical, 4)
    }
}

// MARK: - Preview

#Preview {
    NavigationStack {
        CallKitSetupView()
    }
}
