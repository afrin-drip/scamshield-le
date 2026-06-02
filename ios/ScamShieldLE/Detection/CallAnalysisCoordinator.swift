import Foundation
import Combine
import SwiftData

@MainActor
final class CallAnalysisCoordinator: ObservableObject {

    @Published private(set) var riskAssessment: RiskAssessment = .empty
    @Published private(set) var transcript: String = ""
    @Published private(set) var isMonitoring = false
    @Published private(set) var sessionDuration: Int = 0

    private let speechManager = SpeechRecognitionManager()
    private let riskEngine = RiskEngine()
    private var cancellables = Set<AnyCancellable>()
    private var durationTimer: Timer?
    private var fullTranscript = ""

    init() {
        speechManager.speechResultPublisher
            .receive(on: DispatchQueue.main)
            .sink { [weak self] result in self?.process(result) }
            .store(in: &cancellables)
    }

    func startMonitoring() {
        guard !isMonitoring else { return }
        isMonitoring = true
        transcript = ""
        fullTranscript = ""
        riskAssessment = .empty
        sessionDuration = 0
        speechManager.startListening()
        startTimer()
    }

    @discardableResult
    func stopMonitoring() -> RiskAssessment {
        isMonitoring = false
        speechManager.stopListening()
        stopTimer()
        return riskAssessment
    }

    func injectTranscript(_ text: String) {
        fullTranscript = text
        transcript = text
        riskAssessment = riskEngine.analyze(fullTranscript)
    }

    private func process(_ result: SpeechResult) {
        if result.isFinal { fullTranscript += " " + result.text }
        transcript = (fullTranscript + " " + result.text).trimmingCharacters(in: .whitespaces)
        riskAssessment = riskEngine.analyze(transcript)
    }

    private func startTimer() {
        durationTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            Task { @MainActor in self?.sessionDuration += 1 }
        }
    }

    private func stopTimer() { durationTimer?.invalidate(); durationTimer = nil }

    func saveIncident(to context: ModelContext, reportedAgency: String? = nil) {
        let incident = Incident(
            transcript: transcript,
            riskScore: riskAssessment.totalScore,
            riskLevel: riskAssessment.level.rawValue,
            detectedSignals: riskAssessment.signals.map { $0.rawValue },
            durationSeconds: sessionDuration,
            reportedToAgency: reportedAgency
        )
        context.insert(incident)
        try? context.save()
    }
}
