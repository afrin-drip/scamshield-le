import Foundation

enum ScamSignal: String, CaseIterable, Identifiable {
    case urgencyPressure = "urgency_pressure"
    case impersonation = "impersonation"
    case paymentDemand = "payment_demand"
    case threatLanguage = "threat_language"
    case secrecyInstruction = "secrecy_instruction"
    case personalInfoRequest = "personal_info_request"
    case unusualPaymentMethod = "unusual_payment_method"
    case legalThreat = "legal_threat"
    case arrestThreat = "arrest_threat"
    case giftCardPayment = "gift_card_payment"

    var id: String { rawValue }

    var score: Int {
        switch self {
        case .urgencyPressure:       return 15
        case .impersonation:         return 25
        case .paymentDemand:         return 20
        case .threatLanguage:        return 20
        case .secrecyInstruction:    return 20
        case .personalInfoRequest:   return 15
        case .unusualPaymentMethod:  return 25
        case .legalThreat:           return 20
        case .arrestThreat:          return 25
        case .giftCardPayment:       return 30
        }
    }

    var label: String {
        switch self {
        case .urgencyPressure:       return "Urgency / Pressure"
        case .impersonation:         return "Impersonation"
        case .paymentDemand:         return "Payment Demand"
        case .threatLanguage:        return "Threat Language"
        case .secrecyInstruction:    return "Secrecy Instruction"
        case .personalInfoRequest:   return "Personal Info Request"
        case .unusualPaymentMethod:  return "Unusual Payment Method"
        case .legalThreat:           return "Legal Threat"
        case .arrestThreat:          return "Arrest Threat"
        case .giftCardPayment:       return "Gift Card Payment"
        }
    }

    var icon: String {
        switch self {
        case .urgencyPressure:       return "exclamationmark.triangle"
        case .impersonation:         return "person.fill.questionmark"
        case .paymentDemand:         return "dollarsign.circle"
        case .threatLanguage:        return "bolt.fill"
        case .secrecyInstruction:    return "eye.slash"
        case .personalInfoRequest:   return "person.text.rectangle"
        case .unusualPaymentMethod:  return "creditcard.trianglebadge.exclamationmark"
        case .legalThreat:           return "building.columns"
        case .arrestThreat:          return "handcuffs"
        case .giftCardPayment:       return "giftcard"
        }
    }
}
