package com.scamshield.shared.agencies

enum class AgencyCategory {
    FEDERAL_LAW_ENFORCEMENT,
    FINANCIAL_CONSUMER,
    IDENTITY_THEFT,
    POSTAL,
    DRUG_ENFORCEMENT
}

data class Agency(
    val name: String,
    val fullName: String,
    val category: AgencyCategory,
    val phone: String,
    val website: String,
    val description: String
)

object AgencyDirectory {
    val agencies: List<Agency> = listOf(
        Agency(
            name = "FTC",
            fullName = "Federal Trade Commission",
            category = AgencyCategory.FINANCIAL_CONSUMER,
            phone = "1-877-382-4357",
            website = "https://reportfraud.ftc.gov",
            description = "Report scams, fraud, and bad business practices."
        ),
        Agency(
            name = "FBI IC3",
            fullName = "FBI Internet Crime Complaint Center",
            category = AgencyCategory.FEDERAL_LAW_ENFORCEMENT,
            phone = "N/A (online only)",
            website = "https://ic3.gov",
            description = "File complaints about internet-facilitated criminal activity."
        ),
        Agency(
            name = "USMS",
            fullName = "U.S. Marshals Service",
            category = AgencyCategory.FEDERAL_LAW_ENFORCEMENT,
            phone = "1-800-336-0102",
            website = "https://usmarshals.gov",
            description = "Report imposters claiming to be U.S. Marshals."
        ),
        Agency(
            name = "DEA",
            fullName = "Drug Enforcement Administration",
            category = AgencyCategory.DRUG_ENFORCEMENT,
            phone = "1-800-882-9539",
            website = "https://dea.gov",
            description = "Report DEA impersonation scams."
        ),
        Agency(
            name = "IRS CI",
            fullName = "IRS Criminal Investigation",
            category = AgencyCategory.FINANCIAL_CONSUMER,
            phone = "1-800-829-1040",
            website = "https://irs.gov/complaints",
            description = "Report IRS impersonation and tax scams."
        ),
        Agency(
            name = "SSA OIG",
            fullName = "Social Security Administration Office of Inspector General",
            category = AgencyCategory.FEDERAL_LAW_ENFORCEMENT,
            phone = "1-800-269-0271",
            website = "https://oig.ssa.gov",
            description = "Report Social Security-related fraud and scams."
        ),
        Agency(
            name = "FTC ID Theft",
            fullName = "FTC Identity Theft Reporting",
            category = AgencyCategory.IDENTITY_THEFT,
            phone = "1-877-438-4338",
            website = "https://identitytheft.gov",
            description = "Report identity theft and get a personal recovery plan."
        ),
        Agency(
            name = "USPS OIG",
            fullName = "U.S. Postal Inspection Service",
            category = AgencyCategory.POSTAL,
            phone = "1-877-876-2455",
            website = "https://postalinspectors.uspis.gov",
            description = "Report mail fraud and postal-related scams."
        ),
        Agency(
            name = "CFPB",
            fullName = "Consumer Financial Protection Bureau",
            category = AgencyCategory.FINANCIAL_CONSUMER,
            phone = "1-855-411-2372",
            website = "https://consumerfinance.gov/complaint",
            description = "Report financial fraud and consumer complaints."
        ),
        Agency(
            name = "FBI",
            fullName = "Federal Bureau of Investigation",
            category = AgencyCategory.FEDERAL_LAW_ENFORCEMENT,
            phone = "1-800-CALL-FBI",
            website = "https://tips.fbi.gov",
            description = "Report federal crimes including government impersonation scams."
        )
    )
}