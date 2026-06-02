import Foundation

struct ScamScript: Identifiable {
    let id: String
    let title: String
    let agencyTag: String
    let lines: [String]
    var fullText: String { lines.joined(separator: " ") }
}

enum ScamScripts {
    static let all: [ScamScript] = [fbiScript, irsScript, sheriffScript, marshalScript, courtScript]

    static let fbiScript = ScamScript(id: "fbi", title: "FBI Agent Simulation", agencyTag: "fbi_ic3", lines: [
        "Hello, this is Special Agent calling from the Federal Bureau of Investigation.",
        "We have an active warrant for your arrest due to suspicious financial activity linked to your Social Security number.",
        "Your bank account has been flagged in a federal money laundering investigation.",
        "You need to cooperate with us immediately or local authorities will be dispatched to your location.",
        "To avoid arrest, you must pay a compliance fee today using gift cards.",
        "Do not hang up and do not speak to anyone about this call.",
        "Read me the numbers from the back of the cards right now.",
        "This is your final notice before we issue a bench warrant.",
        "We are recording this call for federal documentation purposes.",
        "You have thirty minutes to comply or officers will arrive at your address."
    ])

    static let irsScript = ScamScript(id: "irs", title: "IRS Tax Simulation", agencyTag: "irs", lines: [
        "This is an urgent message from the Internal Revenue Service.",
        "Our records indicate you owe back taxes from the previous two fiscal years.",
        "A federal tax lien has been placed on your property and assets.",
        "If you do not pay immediately, the IRS will seize your bank account and garnish your wages.",
        "Criminal charges for tax evasion will be filed within the next twenty-four hours.",
        "To settle this outstanding balance and avoid prosecution, you must pay right now.",
        "We only accept payment via wire transfer or gift cards at this time.",
        "Do not contact a tax attorney as this will complicate your case.",
        "This is your last chance to avoid a criminal record.",
        "The IRS does not make mistakes — your file shows you owe this money today."
    ])

    static let sheriffScript = ScamScript(id: "sheriff", title: "Sheriff Warrant Simulation", agencyTag: "state_ag", lines: [
        "This is Deputy Sheriff Williams from the county sheriff's office.",
        "We have an active arrest warrant with your name on it for failure to appear in court.",
        "You missed jury duty and a bench warrant has been issued for your immediate arrest.",
        "Deputies are currently en route to your home to take you into custody.",
        "However, you can avoid arrest by paying the failure to appear fine immediately.",
        "We accept payment via prepaid debit card or wire transfer at this time.",
        "Do not call our main line as this is a direct law enforcement matter.",
        "If you hang up this call will be considered obstruction of justice.",
        "You need to stay on the line with me and process this payment right now.",
        "Once payment is received, the warrant will be recalled and deputies will stand down."
    ])

    static let marshalScript = ScamScript(id: "marshal", title: "US Marshal Simulation", agencyTag: "usms", lines: [
        "Good afternoon, I am Deputy Marshal calling from the US Marshals Service.",
        "You have been named in a federal criminal complaint related to suspicious financial activity.",
        "Your Social Security number was found on documents seized during a federal investigation.",
        "A grand jury indictment has been filed and a warrant has been issued for your arrest.",
        "The US Marshals office is prepared to execute this warrant unless you cooperate now.",
        "To initiate a settlement agreement, you must pay a bond immediately.",
        "Payment must be made via gift cards or cryptocurrency — no other method is accepted.",
        "Keep this conversation confidential — do not tell your family or contact an attorney.",
        "This is your one opportunity to resolve this matter before you are taken into custody.",
        "You have forty-five minutes before marshals arrive at your last known address."
    ])

    static let courtScript = ScamScript(id: "court", title: "Court Summons Simulation", agencyTag: "doj", lines: [
        "Hello, this message is from the Department of Justice court services division.",
        "You have an outstanding court summons that you failed to respond to.",
        "A default judgment has been entered against you in a civil lawsuit.",
        "The court has authorized the seizure of your assets to satisfy this judgment.",
        "Failure to act today will result in criminal contempt of court charges.",
        "To resolve this matter, you must pay the court settlement fee immediately.",
        "We require payment via wire transfer to the court's designated account.",
        "Do not speak to any lawyers as they are not authorized to intervene at this stage.",
        "This is a time sensitive legal matter — you must act right now.",
        "Once payment is confirmed, all legal proceedings will be halted and the matter closed."
    ])
}
