package com.scamshield.le.viewmodel

import android.app.Activity
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.android.billingclient.api.ProductDetails
import com.scamshield.le.billing.BillingRepository
import com.scamshield.le.billing.SubscriptionTier
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SubscriptionViewModel @Inject constructor(
    private val billingRepository: BillingRepository
) : ViewModel() {

    val currentTier: StateFlow<SubscriptionTier> = billingRepository.currentTier
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), SubscriptionTier.FREE)

    val productDetails: StateFlow<List<ProductDetails>> =
        billingRepository.billingManager.productDetails
            .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

    fun launchBillingFlow(activity: Activity, productId: String) {
        billingRepository.billingManager.launchBillingFlow(activity, productId)
    }

    fun restorePurchases() {
        viewModelScope.launch {
            billingRepository.restorePurchases()
        }
    }
}
