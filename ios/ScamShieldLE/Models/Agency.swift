import Foundation

struct Agency: Identifiable {
    let id: String
    let name: String
    let phone: String
    let description: String
    let category: AgencyCategory
    let website: String

    enum AgencyCategory: String {
        case federal = "Federal"
        case financial = "Financial"
        case consumer = "Consumer"
        case state = "State"
    }
}

final class AgencyDirectory {
    static let shared = AgencyDirectory()

    let agencies: [Agency] = [
        Agency(id: "ftc", name: "Federal Trade Commission", phone: "1-877-382-4357",
               description: "Report fraud, scams, and bad business practices",
               category: .federal, website: "https://reportfraud.ftc.gov"),
        Agency(id: "fbi_ic3", name: "FBI Internet Crime Complaint Center", phone: "1-800-CALL-FBI",
               description: "Report internet-facilitated criminal activity",
               category: .federal, website: "https://www.ic3.gov"),
        Agency(id: "irs", name: "IRS Phishing Reporting", phone: "1-800-829-1040",
               description: "Report IRS impersonation scams and tax fraud",
               category: .federal, website: "https://www.irs.gov/privacy-disclosure/report-phishing"),
        Agency(id: "ssa", name: "Social Security Administration OIG", phone: "1-800-269-0271",
               description: "Report Social Security number scams and SSA impersonation",
               category: .federal, website: "https://oig.ssa.gov/report"),
        Agency(id: "usms", name: "US Marshals Service", phone: "1-877-880-5291",
               description: "Report U.S. Marshal impersonation scams",
               category: .federal, website: "https://www.usmarshals.gov/what-we-do/fugitive-operations/scam-alert"),
        Agency(id: "doj", name: "Department of Justice", phone: "1-800-869-4499",
               description: "Report DOJ impersonation and law enforcement scams",
               category: .federal, website: "https://www.justice.gov/report-a-crime"),
        Agency(id: "cfpb", name: "Consumer Financial Protection Bureau", phone: "1-855-411-2372",
               description: "Report financial fraud and consumer scams",
               category: .financial, website: "https://www.consumerfinance.gov/complaint"),
        Agency(id: "usps_oig", name: "US Postal Inspection Service", phone: "1-877-876-2455",
               description: "Report mail fraud and postal-related scams",
               category: .federal, website: "https://postalinspectors.uspis.gov"),
        Agency(id: "aarp", name: "AARP Fraud Watch Network", phone: "1-877-908-3360",
               description: "Helpline for fraud targeting older adults",
               category: .consumer, website: "https://www.aarp.org/money/scams-fraud"),
        Agency(id: "state_ag", name: "State Attorney General", phone: "1-844-872-4681",
               description: "Report consumer fraud to your state attorney general",
               category: .state, website: "https://www.naag.org/find-my-ag")
    ]

    private init() {}

    func agency(withId id: String) -> Agency? {
        agencies.first { $0.id == id }
    }
}

extension Agency.AgencyCategory: CaseIterable {
    static var allCases: [Agency.AgencyCategory] = [.federal, .financial, .consumer, .state]
}
