import SwiftUI
import AVFoundation
import Speech

struct OnboardingView: View {
    @AppStorage("hasCompletedOnboarding") private var hasCompletedOnboarding = false
    @State private var currentPage = 0
    @State private var micGranted = false
    @State private var speechGranted = false
    @State private var requestingPermissions = false

    var body: some View {
        TabView(selection: $currentPage) {
            WelcomePage(onNext: { currentPage = 1 })
                .tag(0)

            PermissionsPage(
                micGranted: micGranted,
                speechGranted: speechGranted,
                requesting: requestingPermissions,
                onRequest: { Task { await requestPermissions() } },
                onNext: { currentPage = 2 }
            )
            .tag(1)

            KeyRulePage(onNext: { currentPage = 3 })
                .tag(2)

            DonePage(onFinish: { hasCompletedOnboarding = true })
                .tag(3)
        }
        .tabViewStyle(.page(indexDisplayMode: .always))
        .indexViewStyle(.page(backgroundDisplayMode: .always))
        .ignoresSafeArea(edges: .top)
        .animation(.easeInOut, value: currentPage)
    }

    // MARK: - Permissions

    private func requestPermissions() async {
        requestingPermissions = true
        defer { requestingPermissions = false }

        // Microphone
        micGranted = await withCheckedContinuation { continuation in
            AVAudioApplication.requestRecordPermission { granted in
                continuation.resume(returning: granted)
            }
        }

        // Speech Recognition
        speechGranted = await withCheckedContinuation { continuation in
            SFSpeechRecognizer.requestAuthorization { status in
                continuation.resume(returning: status == .authorized)
            }
        }

        // Notifications
        _ = await FamilyNotificationManager.shared.requestAuthorization()
    }
}

// MARK: - Page 1: Welcome

private struct WelcomePage: View {
    let onNext: () -> Void

    var body: some View {
        VStack(spacing: 32) {
            Spacer()
            Image(systemName: "shield.lefthalf.filled")
                .font(.system(size: 80))
                .foregroundStyle(.blue)
                .symbolEffect(.pulse)

            VStack(spacing: 12) {
                Text("ScamShield LE")
                    .font(.largeTitle.bold())
                Text("Protect yourself and your family from law enforcement impersonation scams in real time.")
                    .font(.body)
                    .multilineTextAlignment(.center)
                    .foregroundStyle(.secondary)
                    .padding(.horizontal, 32)
            }

            Spacer()

            Button(action: onNext) {
                Text("Get Started")
                    .font(.headline)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .foregroundStyle(.white)
                    .clipShape(RoundedRectangle(cornerRadius: 14))
            }
            .padding(.horizontal, 32)
            .padding(.bottom, 60)
        }
    }
}

// MARK: - Page 2: Permissions

private struct PermissionsPage: View {
    let micGranted: Bool
    let speechGranted: Bool
    let requesting: Bool
    let onRequest: () -> Void
    let onNext: () -> Void

    private var allGranted: Bool { micGranted && speechGranted }

    var body: some View {
        VStack(spacing: 32) {
            Spacer()
            Image(systemName: "mic.badge.plus")
                .font(.system(size: 72))
                .foregroundStyle(.orange)

            VStack(spacing: 12) {
                Text("Permissions Needed")
                    .font(.largeTitle.bold())
                Text("ScamShield needs microphone and speech recognition access to analyze calls in real time.")
                    .font(.body)
                    .multilineTextAlignment(.center)
                    .foregroundStyle(.secondary)
                    .padding(.horizontal, 32)
            }

            VStack(spacing: 16) {
                PermissionRow(title: "Microphone", granted: micGranted)
                PermissionRow(title: "Speech Recognition", granted: speechGranted)
            }
            .padding(.horizontal, 48)

            Spacer()

            VStack(spacing: 12) {
                if !allGranted {
                    Button(action: onRequest) {
                        Group {
                            if requesting {
                                ProgressView().tint(.white)
                            } else {
                                Text("Grant Permissions")
                                    .font(.headline)
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.orange)
                        .foregroundStyle(.white)
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                    }
                    .disabled(requesting)
                }

                Button(action: onNext) {
                    Text(allGranted ? "Continue" : "Skip for Now")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(allGranted ? Color.blue : Color.secondary.opacity(0.2))
                        .foregroundStyle(allGranted ? .white : .primary)
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                }
            }
            .padding(.horizontal, 32)
            .padding(.bottom, 60)
        }
    }
}

private struct PermissionRow: View {
    let title: String
    let granted: Bool

    var body: some View {
        HStack {
            Image(systemName: granted ? "checkmark.circle.fill" : "circle")
                .foregroundStyle(granted ? .green : .secondary)
            Text(title)
            Spacer()
            Text(granted ? "Granted" : "Required")
                .font(.caption)
                .foregroundStyle(granted ? .green : .secondary)
        }
    }
}

// MARK: - Page 3: Key Rule

private struct KeyRulePage: View {
    let onNext: () -> Void

    var body: some View {
        VStack(spacing: 32) {
            Spacer()
            Image(systemName: "exclamationmark.triangle.fill")
                .font(.system(size: 72))
                .foregroundStyle(.red)

            VStack(spacing: 16) {
                Text("The Golden Rule")
                    .font(.largeTitle.bold())

                VStack(spacing: 12) {
                    RuleCard(icon: "building.columns.fill", text: "Real government agencies NEVER demand payment by gift card, crypto, or wire transfer.")
                    RuleCard(icon: "phone.fill", text: "Real officers will let you hang up and call back on official numbers.")
                    RuleCard(icon: "person.2.fill", text: "Always tell a trusted family member about suspicious calls.")
                }
                .padding(.horizontal, 24)
            }

            Spacer()

            Button(action: onNext) {
                Text("I Understand")
                    .font(.headline)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.red)
                    .foregroundStyle(.white)
                    .clipShape(RoundedRectangle(cornerRadius: 14))
            }
            .padding(.horizontal, 32)
            .padding(.bottom, 60)
        }
    }
}

private struct RuleCard: View {
    let icon: String
    let text: String

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundStyle(.red)
                .frame(width: 32)
            Text(text)
                .font(.body)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.red.opacity(0.08))
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}

// MARK: - Page 4: Done

private struct DonePage: View {
    let onFinish: () -> Void

    var body: some View {
        VStack(spacing: 32) {
            Spacer()
            Image(systemName: "checkmark.seal.fill")
                .font(.system(size: 80))
                .foregroundStyle(.green)
                .symbolEffect(.bounce)

            VStack(spacing: 12) {
                Text("You're Protected")
                    .font(.largeTitle.bold())
                Text("ScamShield is ready. When a call comes in, we'll analyze it in real time and warn you immediately.")
                    .font(.body)
                    .multilineTextAlignment(.center)
                    .foregroundStyle(.secondary)
                    .padding(.horizontal, 32)
            }

            Spacer()

            Button(action: onFinish) {
                Text("Start Using ScamShield")
                    .font(.headline)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.green)
                    .foregroundStyle(.white)
                    .clipShape(RoundedRectangle(cornerRadius: 14))
            }
            .padding(.horizontal, 32)
            .padding(.bottom, 60)
        }
    }
}

#Preview {
    OnboardingView()
}
