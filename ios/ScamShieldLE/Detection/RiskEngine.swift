import Foundation

final class RiskEngine {

    private let urgencyKeywords: [String] = [
        "immediately", "right now", "urgent", "emergency", "today only",
        "within the hour", "no time to waste", "act now", "final notice",
        "last chance", "deadline", "expire", "suspended", "terminated",
        "before it's too late", "don't delay", "time sensitive"
    ]

    private let impersonationKeywords: [String] = [
        "irs", "internal revenue service", "social security", "ssa",
        "federal bureau", "fbi", "department of justice", "doj",
        "treasury department", "medicare", "medicaid", "social security administration",
        "us marshals", "marshal service", "sheriff", "sheriff's office",
        "police department", "court", "judge", "prosecutor", "attorney general",
        "government agency", "federal agent", "law enforcement"
    ]

    private let paymentKeywords: [String] = [
        "pay", "payment", "wire transfer", "bank transfer", "send money",
        "owe money", "outstanding balance", "debt", "back taxes", "back pay",
        "fee", "fine", "penalty", "settlement", "bail", "bond",
        "cash", "prepaid card", "itunes", "google play", "amazon gift card"
    ]

    private let threatKeywords: [String] = [
        "arrest", "arrested", "warrant", "warrant for your arrest",
        "handcuff", "jail", "prison", "prosecute", "criminal charges",
        "felony", "lawsuit", "sue", "legal action", "court order",
        "seized", "frozen", "confiscated", "deport", "deportation",
        "suspended license", "revoked"
    ]

    private let secrecyKeywords: [String] = [
        "don't tell anyone", "keep this confidential", "don't mention",
        "do not discuss", "secret", "between us", "do not contact",
        "don't call back", "don't hang up", "stay on the line",
        "do not speak to anyone", "don't tell your family",
        "don't tell your bank", "don't speak to a lawyer",
        "this call is being recorded for your protection"
    ]

    private let personalInfoKeywords: [String] = [
        "social security number", "ssn", "date of birth", "mother's maiden name",
        "bank account", "account number", "routing number", "credit card",
        "debit card", "pin number", "password", "driver's license",
        "passport number", "medicare number", "insurance number",
        "verify your identity", "confirm your information"
    ]

    private let unusualPaymentKeywords: [String] = [
        "gift card", "itunes card", "google play card", "steam card",
        "amazon card", "prepaid debit", "money order", "wire", "zelle",
        "cash app", "venmo", "bitcoin", "cryptocurrency", "crypto",
        "western union", "moneygram", "reload pack", "green dot"
    ]

    private let legalKeywords: [String] = [
        "civil lawsuit", "criminal complaint", "court summons",
        "subpoena", "contempt of court", "default judgment",
        "garnish your wages", "lien on your property",
        "press charges", "file charges", "bring charges",
        "violation of federal law", "federal crime", "criminal investigation"
    ]

    private let arrestKeywords: [String] = [
        "arrest warrant", "active warrant", "bench warrant",
        "warrant has been issued", "officers are on their way",
        "local authorities", "deputies will arrive",
        "avoid arrest", "prevent your arrest",
        "you will be taken into custody", "taken to jail",
        "placed under arrest", "apprehended"
    ]

    private let giftCardKeywords: [String] = [
        "itunes", "apple gift card", "google play", "steam wallet",
        "amazon gift card", "ebay gift card", "walmart gift card",
        "target gift card", "best buy gift card", "cvs gift card",
        "walgreens gift card", "rite aid gift card", "scratching",
        "scratch the back", "read me the numbers", "read the code"
    ]

    func analyze(_ transcript: String) -> RiskAssessment {
        let lower = transcript.lowercased()
        var signals = Set<ScamSignal>()
        var totalScore = 0

        func check(_ keywords: [String], signal: ScamSignal) {
            if keywords.contains(where: { lower.contains($0) }) {
                signals.insert(signal)
                totalScore += signal.score
            }
        }

        check(urgencyKeywords,        signal: .urgencyPressure)
        check(impersonationKeywords,  signal: .impersonation)
        check(paymentKeywords,        signal: .paymentDemand)
        check(threatKeywords,         signal: .threatLanguage)
        check(secrecyKeywords,        signal: .secrecyInstruction)
        check(personalInfoKeywords,   signal: .personalInfoRequest)
        check(unusualPaymentKeywords, signal: .unusualPaymentMethod)
        check(legalKeywords,          signal: .legalThreat)
        check(arrestKeywords,         signal: .arrestThreat)
        check(giftCardKeywords,       signal: .giftCardPayment)

        let capped = min(totalScore, 100)
        return RiskAssessment(totalScore: capped, signals: signals, level: RiskLevel.from(score: capped), transcript: transcript)
    }
}
