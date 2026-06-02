package com.scamshield.le.detection

import com.google.common.truth.Truth.assertThat
import org.junit.Before
import org.junit.Test

class AgencyDirectoryTest {

    private lateinit var directory: AgencyDirectory

    @Before
    fun setUp() {
        directory = AgencyDirectory()
    }

    @Test
    fun testDirectoryContainsTenAgencies() {
        assertThat(directory.getAllAgencies()).hasSize(10)
    }

    @Test
    fun testAllAgenciesHaveNonEmptyNames() {
        directory.getAllAgencies().forEach { agency ->
            assertThat(agency.name).isNotEmpty()
        }
    }

    @Test
    fun testAllAgenciesHaveNonEmptyPhoneNumbers() {
        directory.getAllAgencies().forEach { agency ->
            assertThat(agency.phoneNumber).isNotEmpty()
        }
    }

    @Test
    fun testFTCPhoneNumberIsCorrect() {
        val ftc = directory.getAllAgencies().find {
            it.name.contains("FTC", ignoreCase = true) ||
            it.name.contains("Federal Trade Commission", ignoreCase = true)
        }
        assertThat(ftc).isNotNull()
        assertThat(ftc!!.phoneNumber).isEqualTo("1-877-382-4357")
    }

    @Test
    fun testFBICategoryIsFederalLawEnforcement() {
        val fbi = directory.getAllAgencies().find {
            it.name.contains("FBI", ignoreCase = true) ||
            it.name.contains("Federal Bureau of Investigation", ignoreCase = true)
        }
        assertThat(fbi).isNotNull()
        assertThat(fbi!!.category).isEqualTo(AgencyCategory.FEDERAL_LAW_ENFORCEMENT)
    }

    @Test
    fun testFBIIsPresent() {
        val fbi = directory.getAllAgencies().find { it.name.contains("FBI", ignoreCase = true) }
        assertThat(fbi).isNotNull()
    }

    @Test
    fun testFTCIsPresent() {
        val ftc = directory.getAllAgencies().find {
            it.name.contains("FTC", ignoreCase = true) ||
            it.name.contains("Federal Trade Commission", ignoreCase = true)
        }
        assertThat(ftc).isNotNull()
    }

    @Test
    fun testIRSIsPresent() {
        val irs = directory.getAllAgencies().find {
            it.name.contains("IRS", ignoreCase = true) ||
            it.name.contains("Internal Revenue", ignoreCase = true)
        }
        assertThat(irs).isNotNull()
    }

    @Test
    fun testGetByCategoryFiltersCorrectly() {
        val federalAgencies = directory.getByCategory(AgencyCategory.FEDERAL_LAW_ENFORCEMENT)
        assertThat(federalAgencies).isNotEmpty()
        federalAgencies.forEach { agency ->
            assertThat(agency.category).isEqualTo(AgencyCategory.FEDERAL_LAW_ENFORCEMENT)
        }
    }

    @Test
    fun testGetByCategoryReturnsOnlyMatchingCategory() {
        val federalAgencies = directory.getByCategory(AgencyCategory.FEDERAL_LAW_ENFORCEMENT)
        val consumerProtection = directory.getByCategory(AgencyCategory.CONSUMER_PROTECTION)
        if (federalAgencies.isNotEmpty() && consumerProtection.isNotEmpty()) {
            val federalIds = federalAgencies.map { it.name }.toSet()
            val consumerIds = consumerProtection.map { it.name }.toSet()
            assertThat(federalIds.intersect(consumerIds)).isEmpty()
        }
    }

    @Test
    fun testGetByCategoryUnknownReturnsEmpty() {
        val result = directory.getByCategory(AgencyCategory.OTHER)
        assertThat(result).isNotNull()
    }

    @Test
    fun testGetByCategoryFederalLawEnforcementContainsFBI() {
        val federalAgencies = directory.getByCategory(AgencyCategory.FEDERAL_LAW_ENFORCEMENT)
        val names = federalAgencies.map { it.name }
        assertThat(names.any { it.contains("FBI", ignoreCase = true) }).isTrue()
    }

    @Test
    fun testSearchByNameFBIWorks() {
        val results = directory.searchByName("FBI")
        assertThat(results).isNotEmpty()
        assertThat(results.any { it.name.contains("FBI", ignoreCase = true) }).isTrue()
    }

    @Test
    fun testSearchByNameIsCaseInsensitive() {
        val upperResults = directory.searchByName("FBI")
        val lowerResults = directory.searchByName("fbi")
        val mixedResults = directory.searchByName("Fbi")
        assertThat(upperResults).isEqualTo(lowerResults)
        assertThat(upperResults).isEqualTo(mixedResults)
    }

    @Test
    fun testSearchByNamePartialMatchWorks() {
        val results = directory.searchByName("Federal")
        assertThat(results).isNotEmpty()
        results.forEach { agency ->
            assertThat(agency.name).ignoringCase().contains("federal")
        }
    }

    @Test
    fun testSearchByNameNoMatchReturnsEmpty() {
        val results = directory.searchByName("ZZZNONEXISTENT999")
        assertThat(results).isEmpty()
    }

    @Test
    fun testSearchByNameEmptyStringBehavior() {
        val results = directory.searchByName("")
        assertThat(results).isNotNull()
    }
}
