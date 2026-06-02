import Foundation
import UIKit
import AVFoundation
import UserNotifications

final class AlertManager {

    private let synthesizer = AVSpeechSynthesizer()

    func triggerHaptic(for type: UINotificationFeedbackGenerator.FeedbackType) {
        let generator = UINotificationFeedbackGenerator()
        generator.prepare()
        generator.notificationOccurred(type)
    }

    func triggerImpact(style: UIImpactFeedbackGenerator.FeedbackStyle = .heavy) {
        let generator = UIImpactFeedbackGenerator(style: style)
        generator.prepare()
        generator.impactOccurred()
    }

    func speak(_ text: String, rate: Float = 0.5, pitch: Float = 1.0) {
        guard SettingsStore.shared.voiceAlertsEnabled else { return }
        if synthesizer.isSpeaking { synthesizer.stopSpeaking(at: .immediate) }
        let utterance = AVSpeechUtterance(string: text)
        utterance.rate = rate
        utterance.pitchMultiplier = pitch
        utterance.voice = AVSpeechSynthesisVoice(language: "en-US")
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback, options: .mixWithOthers)
            try AVAudioSession.sharedInstance().setActive(true)
        } catch { print("[AlertManager] Audio session error: \(error)") }
        synthesizer.speak(utterance)
    }

    func scheduleLocalNotification(title: String, body: String, delay: TimeInterval = 0) {
        guard SettingsStore.shared.localNotificationsEnabled else { return }
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, _ in
            guard granted else { return }
            let content = UNMutableNotificationContent()
            content.title = title
            content.body = body
            content.sound = .defaultCritical
            content.interruptionLevel = .critical
            let trigger = delay > 0 ? UNTimeIntervalNotificationTrigger(timeInterval: delay, repeats: false) : nil
            let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: trigger)
            UNUserNotificationCenter.current().add(request) { error in
                if let error { print("[AlertManager] Notification error: \(error)") }
            }
        }
    }
}
