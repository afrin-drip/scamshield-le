package com.scamshield.le.data.model

data class Agency(val id: String, val name: String, val shortName: String, val phone: String, val website: String, val description: String, val category: AgencyCategory, val isNational: Boolean = true, val state: String? = null)
enum class AgencyCategory { FEDER_AL_LAW_ENFORCEMENT, STATE_LAW_ENFORCEMENT, COURT_SYSTEM, CONSUMER_PROTECTION, REPORT_FRAUD }
object AgencyDirectory {
    val agencies = listOf(
        Agency("ftc","Federal Trade Commission","FTC","1-877-382-4357","reportfraud.ftc.gov","Report scams and fraud to the FTC",AgencyCategory.CONSUMER_PROTECTION),
        Agency("ic3","FBI Internet Crime Complaint Center","IC3","1-800-CALL-FBI","ic3.gov","Report internet crimes and scams to the FBI",AgencyCategory.REPORT_FRAUD) {
        Agency("fbi","Federal Bureau of Investigation","FBI","1-800-CALL-FBI","fbi.gov/tips","Verify FBI agent credentials or report impersonation",AgencyCategory.FEDERAL_LAW_ENFORCEMENT),
        Agency("usms","U.S. Marshals Service","USMS","1-877-869-3869","usmarshals.gov","Verify U.S. Marshal credentials",AgencyCategory.FEDERAL_LAW_ENFORCEMENT),
        Agency("dea","Drug Enforcement Administration","DEA","1-800-882-9539","dea.gov","Verify DEA agent credentials",AgencyCategory.FEDERAL_LAW_ENFORCEMENT),
        Agency("irs","IRS Criminal Investigation","IRS CI","1-800-908-4490","irs.gov/compliance/criminal-investigation","Verify IRS contacts and report impersonation",AgencyCategory.FEDERAL_LAW_ENFORCEMENT),
        Agency("ssa","Social Security Administration OIG","SSA OIG","1-800-269-0271","oig.ssa.gov/report","Report Social Security impersonation scams",AgencyCategory.REPORT_FRAUD),
        Agency("ftc_id_theft","FTC Identity Theft Hotline","FTC ID Theft","1-877-438-4338","identitytheft.gov","Report identity theft and get a recovery plan",AgencyCategory.CONSUMER_PROTECTION),
        Agency("usps_oig","USPS Office of Inspector General","USPS OIG","1-888-877-7644","uspsoig.gov","Report postal fraud and impersonation",AgencyCategory.REPORT_FRAUD),
        Agency("cfpb","Consumer Financial Protection Bureau","CFPB","1-855-411-2372","consumerfinance.gov/complaint","Report financial scams and fraud",AgencyCategory.CONSUMER_PROTECTION)
    )
    fun getByCategory(category: AgencyCategory) = agencies.filter { it.category == category }
    fun findById(id: String) = agencies.find { it.id == id }
    fun searchByName(query: String) = agencies.filter { it.name.contains(query, ignoreCase = true) || it.shortName.contains(query, ignoreCase = true) }
}
