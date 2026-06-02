package com.scamshield.le.simulation

enum class ScriptType(val displayName: String) {
    FBI_WARRANT("FBI Warrant"),
    IRS_ARREST("IRS Arrest"),
    SHERIFF_DEPUTY("Sheriff Deputy"),
    US_MARSHAL("US Marshal"),
    COURT_SUMMONS("Court Summons")
}

/**
 * ScamScripts: Pattern demonstrations for training the ScamShield LE detection engine.
 * These are stylized signal-pattern sequences used in simulation/demo mode only.
 * Each utterance is crafted to surface detectable scam signals: authority claims,
 * urgency escalation, secrecy demands, and coercive payment requests.
 */
object ScamScripts {

    fun getScript(type: ScriptType): List<String> = when (type) {
        ScriptType.FBI_WARRANT -> fbiFakeWarrantScript
        ScriptType.IRS_ARREST -> irsArrestScript
        ScriptType.SHERIFF_DEPUTY -> sheriffDeputyScript
        ScriptType.US_MARSHAL -> usMarshalScript
        ScriptType.COURT_SUMMONS -> courtSummonsScript
    }

    private val fbiFakeWarrantScript = listOf(
        "[DEMO PATTERN] This is a notice from a party claiming to be the Federal Bureau of Investigation.",
        "[DEMO PATTERN] A federal warrant bearing your name and SSN has been issued by a district court.",
        "[DEMO PATTERN] You are implicated in a money-laundering investigation across multiple states.",
        "[DEMO PATTERN] Your bank accounts and assets are flagged for immediate federal seizure.",
        "[DEMO PATTERN] To avoid arrest, you must not contact your bank, attorney, or any family member.",
        "[DEMO PATTERN] This matter is strictly confidential -- do not tell anyone you received this call.",
        "[DEMO PATTERN] You must immediately transfer funds via wire transfer to a secure government escrow account.",
        "[DEMO PATTERN] Alternatively, purchase Google Play gift cards and provide the redemption codes immediately.",
        "[DEMO PATTERN] Failure to comply within two hours will result in agents arriving at your residence.",
        "[DEMO PATTERN] Confirm your SSN and date of birth now to proceed with the clearance process."
    )

    private val irsArrestScript = listOf(
        "[DEMO PATTERN] This is an automated notice from a party claiming to be the Internal Revenue Service.",
        "[DEMO PATTERN] Our records indicate an outstanding tax liability requiring immediate resolution.",
        "[DEMO PATTERN] A federal arrest warrant has been prepared in your name due to tax fraud.",
        "[DEMO PATTERN] Local law enforcement has been notified and officers are standing by.",
        "[DEMO PATTERN] This is your final opportunity to settle this matter before criminal charges are filed.",
        "[DEMO PATTERN] Do not hang up -- disconnecting this call will be interpreted as non-compliance.",
        "[DEMO PATTERN] You must not speak to anyone about this, including your attorney, until this is resolved.",
        "[DEMO PATTERN] Immediate payment is required via iTunes gift cards or wire transfer to a clearing account.",
        "[DEMO PATTERN] Provide the gift card redemption codes over the phone to our compliance officer.",
        "[DEMO PATTERN] Once payment is received, your warrant will be recalled and no arrest will occur."
    )

    private val sheriffDeputyScript = listOf(
        "[DEMO PATTERN] This message is from a party claiming to be the County Sheriff's Department.",
        "[DEMO PATTERN] You failed to appear for jury duty and a bench warrant has been issued for your arrest.",
        "[DEMO PATTERN] Deputies are currently in route to your address to take you into custody.",
        "[DEMO PATTERN] You can avoid arrest by paying a fine immediately over the phone.",
        "[DEMO PATTERN] This offer to pay remotely expires in thirty minutes -- act immediately.",
        "[DEMO PATTERN] Do not contact a lawyer at this time as it may complicate the resolution process.",
        "[DEMO PATTERN] Payment must be made via prepaid debit card or wire transfer -- no other method accepted.",
        "[DEMO PATTERN] Read the card numbers to our clerk now to process your fine and recall the warrant.",
        "[DEMO PATTERN] This call is being recorded and your cooperation will be noted in your file."
    )

    private val usMarshalScript = listOf(
        "[DEMO PATTERN] You are being contacted by a party claiming authority as a United States Marshal.",
        "[DEMO PATTERN] A sealed federal indictment has been issued under your Social Security Number.",
        "[DEMO PATTERN] You are named as a co-conspirator in a federal narcotics and fraud investigation.",
        "[DEMO PATTERN] Assets registered in your name are subject to immediate federal forfeiture.",
        "[DEMO PATTERN] Speaking to anyone -- including family -- before this is resolved constitutes obstruction.",
        "[DEMO PATTERN] You must remain on the line and follow instructions precisely to avoid arrest.",
        "[DEMO PATTERN] To secure release from the warrant, you must wire funds to a federal holding account.",
        "[DEMO PATTERN] The wire transfer must be completed within one hour or the warrant becomes active.",
        "[DEMO PATTERN] Do not visit a bank branch -- conduct all transactions via phone or online banking only.",
        "[DEMO PATTERN] Confirm your SSN and current address so we can file your compliance paperwork."
    )

    private val courtSummonsScript = listOf(
        "[DEMO PATTERN] This is a notice from a party claiming to represent the Superior Court of your district.",
        "[DEMO PATTERN] You have failed to respond to an official court summons issued thirty days ago.",
        "[DEMO PATTERN] A contempt-of-court warrant is now active and enforceable by local law enforcement.",
        "[DEMO PATTERN] You have one final opportunity to resolve this matter without physical arrest.",
        "[DEMO PATTERN] Court fees and penalties must be paid immediately to suspend the active warrant.",
        "[DEMO PATTERN] Do not discuss this matter with anyone until the court has processed your payment.",
        "[DEMO PATTERN] Standard payment methods are not available for warrant resolution -- gift cards are required.",
        "[DEMO PATTERN] Purchase Amazon or Walmart gift cards and call back with the PIN numbers immediately.",
        "[DEMO PATTERN] Failure to call back within ninety minutes will result in officers being dispatched.",
        "[DEMO PATTERN] This is your last notice -- there will be no further calls before the arrest is executed."
    )
}
