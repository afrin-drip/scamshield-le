package com.scamshield.le.billing

import android.app.Activity
import android.content.Context
import com.android.billingclient.api.*
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class BillingManager @Inject constructor(
    @ApplicationContext private val context: Context
) : PurchasesUpdatedListener {

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    private val _currentTier = MutableStateFlow(SubscriptionTier.FREE)
    val currentTier: StateFlow<SubscriptionTier> = _currentTier.asStateFlow()

    private val _productDetails = MutableStateFlow<List<ProductDetails>>(emptyList())
    val productDetails: StateFlow<List<ProductDetails>> = _productDetails.asStateFlow()

    private var billingClient: BillingClient = BillingClient.newBuilder(context)
        .setListener(this)
        .enablePendingPurchases()
        .build()

    init {
        startConnection()
    }

    fun startConnection() {
        billingClient.startConnection(object : BillingClientStateListener {
            override fun onBillingSetupFinished(result: BillingResult) {
                if (result.responseCode == BillingClient.BillingResponseCode.OK) {
                    scope.launch {
                        queryProductDetails()
                        queryPurchasesAsync()
                    }
                }
            }

            override fun onBillingServiceDisconnected() {
                // Retry after delay
                scope.launch {
                    delay(3000)
                    startConnection()
                }
            }
        })
    }

    suspend fun queryProductDetails() {
        val productList = listOf(
            QueryProductDetailsParams.Product.newBuilder()
                .setProductId(ProductIds.PRO_MONTHLY)
                .setProductType(BillingClient.ProductType.SUBS)
                .build(),
            QueryProductDetailsParams.Product.newBuilder()
                .setProductId(ProductIds.FAMILY_MONTHLY)
                .setProductType(BillingClient.ProductType.SUBS)
                .build()
        )

        val params = QueryProductDetailsParams.newBuilder()
            .setProductList(productList)
            .build()

        val result = billingClient.queryProductDetails(params)
        if (result.billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
            _productDetails.value = result.productDetailsList ?: emptyList()
        }
    }

    fun launchBillingFlow(activity: Activity, productId: String) {
        val productDetails = _productDetails.value.find { it.productId == productId } ?: return

        val offerToken = productDetails.subscriptionOfferDetails?.firstOrNull()?.offerToken ?: return

        val productDetailsParamsList = listOf(
            BillingFlowParams.ProductDetailsParams.newBuilder()
                .setProductDetails(productDetails)
                .setOfferToken(offerToken)
                .build()
        )

        val flowParams = BillingFlowParams.newBuilder()
            .setProductDetailsParamsList(productDetailsParamsList)
            .build()

        billingClient.launchBillingFlow(activity, flowParams)
    }

    override fun onPurchasesUpdated(result: BillingResult, purchases: List<Purchase>?) {
        if (result.responseCode == BillingClient.BillingResponseCode.OK && purchases != null) {
            scope.launch {
                for (purchase in purchases) {
                    handlePurchase(purchase)
                }
            }
        }
    }

    private suspend fun handlePurchase(purchase: Purchase) {
        if (purchase.purchaseState != Purchase.PurchaseState.PURCHASED) return

        // Update tier based on product
        val tier = when {
            purchase.products.contains(ProductIds.FAMILY_MONTHLY) -> SubscriptionTier.FAMILY
            purchase.products.contains(ProductIds.PRO_MONTHLY) -> SubscriptionTier.PRO
            else -> return
        }
        _currentTier.value = tier

        // Acknowledge if not already acknowledged
        if (!purchase.isAcknowledged) {
            val params = AcknowledgePurchaseParams.newBuilder()
                .setPurchaseToken(purchase.purchaseToken)
                .build()
            billingClient.acknowledgePurchase(params)
        }
    }

    suspend fun queryPurchasesAsync() {
        val params = QueryPurchasesParams.newBuilder()
            .setProductType(BillingClient.ProductType.SUBS)
            .build()

        val result = billingClient.queryPurchases(params)
        if (result.billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
            val activePurchases = result.purchasesList.filter {
                it.purchaseState == Purchase.PurchaseState.PURCHASED
            }

            if (activePurchases.isEmpty()) {
                _currentTier.value = SubscriptionTier.FREE
                return
            }

            for (purchase in activePurchases) {
                handlePurchase(purchase)
            }
        }
    }

    fun tierForProductId(productId: String): SubscriptionTier = when (productId) {
        ProductIds.PRO_MONTHLY -> SubscriptionTier.PRO
        ProductIds.FAMILY_MONTHLY -> SubscriptionTier.FAMILY
        else -> SubscriptionTier.FREE
    }
}
