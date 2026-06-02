import Foundation
import Combine

@MainActor
final class SimulationViewModel: ObservableObject {
    @Published private(set) var currentLine: String = ""
    @Published private(set) var wordIndex: Int = 0
    @Published private(set) var isPlaying: Bool = false
    @Published private(set) var isFinished: Bool = false

    private let script: ScamScript
    private weak var coordinator: CallAnalysisCoordinator?
    private var timer: Timer?
    private var allWords: [String] = []
    private var accumulatedText: String = ""

    init(script: ScamScript, coordinator: CallAnalysisCoordinator) {
        self.script = script
        self.coordinator = coordinator
        self.allWords = script.fullText.components(separatedBy: .whitespaces).filter { !$0.isEmpty }
    }

    func start() {
        guard !isPlaying else { return }
        isPlaying = true; isFinished = false; accumulatedText = ""; wordIndex = 0
        coordinator?.startMonitoring()
        scheduleNextWord()
    }

    func pause() { isPlaying = false; timer?.invalidate(); timer = nil }

    func resume() { guard !isFinished else { return }; isPlaying = true; scheduleNextWord() }

    func stop() {
        isPlaying = false; isFinished = true
        timer?.invalidate(); timer = nil
        coordinator?.stopMonitoring()
    }

    private func scheduleNextWord() {
        timer = Timer.scheduledTimer(withTimeInterval: 0.3, repeats: false) { [weak self] _ in
            Task { @MainActor in self?.advanceWord() }
        }
    }

    private func advanceWord() {
        guard isPlaying, wordIndex < allWords.count else {
            if wordIndex >= allWords.count { isFinished = true; isPlaying = false; coordinator?.stopMonitoring() }
            return
        }
        accumulatedText += (accumulatedText.isEmpty ? "" : " ") + allWords[wordIndex]
        currentLine = accumulatedText
        coordinator?.injectTranscript(accumulatedText)
        wordIndex += 1
        if isPlaying { scheduleNextWord() }
    }

    deinit { timer?.invalidate() }
}
