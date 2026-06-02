package com.scamshield.le.ui.subscription

import android.app.Activity
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.scamshield.le.billing.ProductIds
import com.scamshield.le.billing.SubscriptionTier
import com.scamshield.le.viewmodel.SubscriptionViewModel

@Composable
fun SubscriptionScreen(
    viewModel: SubscriptionViewModel = hiltViewModel()
) {
    val currentTier by viewModel.currentTier.collectAsState()
    val context = LocalContext.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Choose Your Plan",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(vertical = 16.dp)
        )

        TierCard(
            title = "Free",
            price = "$0 / month",
            features = listOf(
                Feature("Basic scam detection", true),
                Feature("Passive detection", false),
                Feature("Analytics", false),
                Feature("Simulations", false),
                Feature("Family mode", false)
            ),
            isCurrentPlan = currentTier == SubscriptionTier.FREE,
            onSubscribe = null
        )

        Spacer(modifier = Modifier.height(12.dp))

        TierCard(
            title = "Pro",
            price = "$4.99 / month",
            features = listOf(
                Feature("Basic scam detection", true),
                Feature("Passive detection", true),
                Feature("Analytics", true),
                Feature("Simulations", true),
                Feature("Family mode", false)
            ),
            isCurrentPlan = currentTier == SubscriptionTier.PRO,
            onSubscribe = {
                viewModel.launchBillingFlow(context as Activity, ProductIds.PRO_MONTHLY)
            }
        )

        Spacer(modifier = Modifier.height(12.dp))

        TierCard(
            title = "Family",
            price = "$9.99 / month",
            features = listOf(
                Feature("Basic scam detection", true),
                Feature("Passive detection", true),
                Feature("Analytics", true),
                Feature("Simulations", true),
                Feature("Family mode", true)
            ),
            isCurrentPlan = currentTier == SubscriptionTier.FAMILY,
            onSubscribe = {
                viewModel.launchBillingFlow(context as Activity, ProductIds.FAMILY_MONTHLY)
            }
        )

        Spacer(modifier = Modifier.height(24.dp))

        TextButton(onClick = { viewModel.restorePurchases() }) {
            Text("Restore Purchases")
        }
    }
}

private data class Feature(val label: String, val included: Boolean)

@Composable
private fun TierCard(
    title: String,
    price: String,
    features: List<Feature>,
    isCurrentPlan: Boolean,
    onSubscribe: (() -> Unit)?
) {
    val borderColor = if (isCurrentPlan) MaterialTheme.colorScheme.primary else Color.Gray.copy(alpha = 0.4f)
    val borderWidth = if (isCurrentPlan) 2.dp else 1.dp

    Card(
        modifier = Modifier.fillMaxWidth(),
        border = BorderStroke(borderWidth, borderColor)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(text = title, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                if (isCurrentPlan) {
                    Surface(
                        color = MaterialTheme.colorScheme.primary,
                        shape = MaterialTheme.shapes.small
                    ) {
                        Text(
                            text = "Current Plan",
                            color = MaterialTheme.colorScheme.onPrimary,
                            fontSize = 12.sp,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                }
            }

            Text(
                text = price,
                color = MaterialTheme.colorScheme.primary,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier.padding(vertical = 8.dp)
            )

            HorizontalDivider()

            Spacer(modifier = Modifier.height(8.dp))

            features.forEach { feature ->
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(vertical = 4.dp)
                ) {
                    Icon(
                        imageVector = if (feature.included) Icons.Default.Check else Icons.Default.Close,
                        contentDescription = null,
                        tint = if (feature.included) MaterialTheme.colorScheme.primary else Color.Gray,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = feature.label,
                        color = if (feature.included) MaterialTheme.colorScheme.onSurface else Color.Gray,
                        fontSize = 14.sp
                    )
                }
            }

            if (onSubscribe != null && !isCurrentPlan) {
                Spacer(modifier = Modifier.height(12.dp))
                Button(
                    onClick = onSubscribe,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Subscribe to $title")
                }
            }
        }
    }
}
