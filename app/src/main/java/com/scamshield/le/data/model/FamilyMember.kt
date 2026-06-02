package com.scamshield.le.data.model
data class FamilyMember(val id: Long = 0, val name: String, val phoneNumber: String, val relationship: String, val isProtected: Boolean = true, val notifyOnScam: Boolean = true, val addedAt: Long = System.currentTimeMillis())
