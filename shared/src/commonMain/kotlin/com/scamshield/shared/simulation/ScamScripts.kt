package com.scamshield.shared.simulation

object ScamScripts {
    val all: List<ScamScript> = listOf(
        ScamScript(
            id = "fbi_warrant",
            title = "FBI Arrest Warrant",
            callerRole = "FBI Agent",
            lines = listOf(
                "Hello, this is Special Agent Johnson from the Federal Bureau of Investigation.",
                "We have issued an arrest warrant for your name. You are under federal investigation.",
                "Your Social Security number has been linked to a money laundering operation.",
                "You must NOT hang up this phone or you will be arrested immediately.",
                "To avoid arrest, you must cooperate fully. Do you understand?",
                "You need to pay a $2,000 processing fee to clear your record. We accept gift cards.",
                "Go to the nearest store and purchase Google Play cards. Do not tell anyone.",
                "Read me the card numbers when you return. This is your only chance to avoid jail."
            )
        ),
        ScamScript(
            id = "irs_arrest",
            title = "IRS Arrest Threat",
            callerRole = "IRS Agent",
            lines = listOf(
                "This is the Internal Revenue Service calling with an urgent tax matter.",
                "We have filed a lawsuit against you for unpaid back taxes totaling $8,500.",
                "Law enforcement officers are on their way to your home right now.",
                "You have 30 minutes to resolve this before you are taken into custody.",
                "This is your final notice. Failure to comply will result in arrest.",
                "To stop the officers, you must pay immediately via wire transfer.",
                "Do not contact your attorney. This matter is strictly confidential.",
                "Once payment is received, all charges will be dropped immediately."
            )
        ),
        ScamScript(
            id = "sheriff_deputy",
            title = "Sheriff's Deputy Jury Duty",
            callerRole = "Sheriff's Deputy",
            lines = listOf(
                "This is Deputy Williams from the County Sheriff's Department.",
                "Our records show you failed to appear for jury duty last month.",
                "A bench warrant has been issued for your immediate arrest.",
                "However, you have one opportunity to avoid being taken into custody today.",
                "You must pay a failure-to-appear fine of $1,500 immediately.",
                "We accept payment via prepaid debit card or money order.",
                "You have 45 minutes to make this payment or officers will be dispatched.",
                "This call is being recorded. Do not attempt to contact the court directly."
            )
        ),
        ScamScript(
            id = "us_marshal",
            title = "U.S. Marshal Drug Investigation",
            callerRole = "U.S. Marshal",
            lines = listOf(
                "Good morning. This is Marshal Davis from the United States Marshals Service.",
                "Your name appears in connection with a federal drug trafficking investigation.",
                "A package containing illegal substances was intercepted with your address.",
                "You are currently classified as a person of interest in this federal case.",
                "To be cleared from this investigation, you must cooperate immediately.",
                "We need to verify your identity. Please provide your Social Security number.",
                "Additionally, a bond of $3,000 must be posted to protect your assets.",
                "Bitcoin is the approved payment method for federal bond processing."
            )
        ),
        ScamScript(
            id = "court_summons",
            title = "Court Summons Scam",
            callerRole = "Court Administrator",
            lines = listOf(
                "Hello, this message is from the District Court Administrator's office.",
                "You have been named as a defendant in civil case number 2024-CF-8821.",
                "A court summons was mailed to your address but returned undeliverable.",
                "You are required by law to respond to this summons within 24 hours.",
                "Failure to respond will result in a default judgment against you.",
                "To process your response, a court filing fee of $500 is required.",
                "Payment must be made via Zelle or CashApp to avoid further legal action.",
                "Call us back immediately at the number provided to resolve this matter."
            )
        )
    )
}