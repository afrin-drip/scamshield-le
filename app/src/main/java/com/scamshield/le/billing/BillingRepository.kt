package com.scamshield.le.billing

import android.content.Context
import android.content.SharedPreferences
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject
import javax.inject.Singleton

private const val PREFS_NAME = "billing_prefs"
private const val KEY_TIER = "subscription_tier"

@Singleton
class BillingRepository @Inject constructor(
    @ApplicationContext private val context: Context,
    val billingManager: BillingManager
) {
    private val prefs: SharedPreferences =
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    private val _currentTier = MutableStateFlow(loadPersistedTier())
    val currentTier: StateFlow<SubscriptionTier> = _currentTier.asStateFlow()

    init {
        // Mirror BillingManager tier updates into repository + SharedPreferences
        scope.launch {
            billingManager.currentTier.collect { tier ->
                _currentTier.value = tier
                persistTier(tier)
            }
        }
    }

    private fun loadPersistedTier(): SubscriptionTier {
        val name = prefs.getString(KEY_TIER, SubscriptionTier.FREE.name) ?: SubscriptionTier.FREE.name
        return runCatching { SubscriptionTier.valueOf(name) }.getOrDefault(SubscriptionTier.FREE)
    }

    private fun persistTier(tier: SubscriptionTier) {
        prefs.edit().putString(KEY_TIER, tier.name).apply()
    }

    suspend fun restorePurchases() {
        billingManager.queryPurchasesAsync()
    }
}
