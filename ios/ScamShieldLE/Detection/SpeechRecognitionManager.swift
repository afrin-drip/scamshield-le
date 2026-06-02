import Foundation
import Speech
import AVFoundation
import Combine

struct SpeechResult {
    let text: String
    let isFinal: Bool
}

@MainActor
final class SpeechRecognitionManager: NSObject, ObservableObject, SFSpeechRecognizerDelegate {

    let speechResultPublisher = PassthroughSubject<SpeechResult, Never>()
    @Published private(set) var isListening = false
    @Published private(set) var authorizationStatus: SFSpeechRecognizerAuthorizationStatus = .notDetermined

    private let speechRecognizer = SFSpeechRecognizer(locale: Locale(identifier: "en-US"))
    private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recognitionTask: SFSpeechRecognitionTask?
    private let audioEngine = AVAudioEngine()
    private var restartWorkItem: DispatchWorkItem?
    private var isRestarting = false

    override init() {
        super.init()
        speechRecognizer?.delegate = self
        requestAuthorization()
    }

    func requestAuthorization() {
        SFSpeechRecognizer.requestAuthorization { [weak self] status in
            DispatchQueue.main.async { self?.authorizationStatus = status }
        }
    }

    func startListening() {
        guard !isListening else { return }
        guard authorizationStatus == .authorized else { requestAuthorization(); return }
        do { try beginSession(); isListening = true }
        catch { print("[SpeechRecognitionManager] Start error: \(error)") }
    }

    func stopListening() {
        isListening = false
        isRestarting = false
        restartWorkItem?.cancel()
        tearDown()
    }

    private func beginSession() throws {
        tearDown()
        let audioSession = AVAudioSession.sharedInstance()
        try audioSession.setCategory(.record, mode: .measurement, options: .duckOthers)
        try audioSession.setActive(true, options: .notifyOthersOnDeactivation)
        recognitionRequest = SFSpeechAudioBufferRecognitionRequest()
        guard let recognitionRequest else { throw NSError(domain: "SpeechManager", code: 1) }
        recognitionRequest.shouldReportPartialResults = true
        guard let recognizer = speechRecognizer, recognizer.isAvailable else {
            throw NSError(domain: "SpeechManager", code: 2)
        }
        recognitionTask = recognizer.recognitionTask(with: recognitionRequest) { [weak self] result, error in
            guard let self else { return }
            if let result {
                let text = result.bestTranscription.formattedString
                Task { @MainActor in
                    self.speechResultPublisher.send(SpeechResult(text: text, isFinal: result.isFinal))
                    if result.isFinal && self.isListening { self.scheduleRestart() }
                }
            }
            if error != nil && self.isListening { Task { @MainActor in self.scheduleRestart() } }
        }
        let inputNode = audioEngine.inputNode
        let format = inputNode.outputFormat(forBus: 0)
        inputNode.installTap(onBus: 0, bufferSize: 1024, format: format) { [weak self] buffer, _ in
            self?.recognitionRequest?.append(buffer)
        }
        audioEngine.prepare()
        try audioEngine.start()
    }

    private func tearDown() {
        recognitionTask?.cancel(); recognitionTask = nil
        recognitionRequest?.endAudio(); recognitionRequest = nil
        if audioEngine.isRunning { audioEngine.stop(); audioEngine.inputNode.removeTap(onBus: 0) }
    }

    private func scheduleRestart() {
        guard isListening, !isRestarting else { return }
        isRestarting = true
        let item = DispatchWorkItem { [weak self] in
            guard let self, self.isListening else { return }
            do { try self.beginSession(); self.isRestarting = false }
            catch { print("[SpeechRecognitionManager] Restart error: \(error)"); self.isRestarting = false }
        }
        restartWorkItem = item
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5, execute: item)
    }

    nonisolated func speechRecognizer(_ speechRecognizer: SFSpeechRecognizer, availabilityDidChange available: Bool) {
        if !available { Task { @MainActor in if self.isListening { self.scheduleRestart() } } }
    }
}
