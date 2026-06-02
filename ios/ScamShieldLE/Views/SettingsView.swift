//
//  SettingsView.swift
//  ScamShieldLE
//
//  Main settings screen. Includes a "Call Identification" section
//  that shows CallKit extension status and links to CallKitSetupView.
//

import SwiftUI

struct SettingsView: View {

    @StateObject private var callKitManager = CallKitManager.shared

    var body: some View {
        NavigationStack {
            List {

                // MARK: - Call Identification
                Section {
                    HStack {
                        Label("Status", systemImage: "phone.badge.checkmark")
                        Spacer()
                        callIdentificationStatusLabel
                    }

                    NavigationLink {
                        CallKitSetupView()
                    } label: {
                        Label("Configure", systemImage: "gear")
                    }
                } header: {
                    Text("Call Identification")
                } footer: {
                    Text("ScamShield flags suspected scam calls using iOS CallKit. Tap Configure to enable or learn more.")
                }

                // MARK: - General
                Section("General") {
                    NavigationLink {
                        Text("Notifications settings go here")
                            .navigationTitle("Notifications")
                    } label: {
                        Label("Notifications", systemImage: "bell")
                    }

                    NavigationLink {
                        Text("Privacy settings go here")
                            .navigationTitle("Privacy")
                    } label: {
                        Label("Privacy", systemImage: "hand.raised")
                    }
                }

                // MARK: - About
                Section("About") {
                    HStack {
                        Text("Version")
                        Spacer()
                        Text(appVersion)
                            .foregroundStyle(.secondary)
                    }
                }
            }
            .navigationTitle("Settings")
            .task {
                await callKitManager.checkAuthorizationStatus()
            }
        }
    }

    // MARK: - Helpers

    @ViewBuilder
    private var callIdentificationStatusLabel: some View {
        switch callKitManager.authorizationStatus {
        case .enabled:
            Text("Enabled").foregroundStyle(.green)
        case .disabled:
            Text("Disabled").foregroundStyle(.red)
        case .restricted:
            Text("Restricted").foregroundStyle(.orange)
        case .unknown:
            Text("Not Set Up").foregroundStyle(.secondary)
        @unknown default:
            Text("Unknown").foregroundStyle(.secondary)
        }
    }

    private var appVersion: String {
        let version = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "—"
        let build = Bundle.main.infoDictionary?["CFBundleVersion"] as? String ?? "—"
        return "\(version) (\(build))"
    }
}

// MARK: - Preview

#Preview {
    SettingsView()
}
