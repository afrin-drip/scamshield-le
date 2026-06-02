package com.scamshield.shared.simulation

data class ScamScript(
    val id: String,
    val title: String,
    val callerRole: String,
    val lines: List<String>
)