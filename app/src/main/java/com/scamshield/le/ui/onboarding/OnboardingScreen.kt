package com.scamshield.le.ui.onboarding

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.MicNone
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel

data class OnboardingPage(
    val icon: ImageVector,
    val title: String,
    val description: String,
    val iconTint: Color = Color(0xFF1976D2)
)

private val onboardingPages = listOf(
    OnboardingPage(
        icon = Icons.Filled.Shield,
        title = "Welcome to ScamShield LE",
        description = "Your intelligent guardian against phone scams. ScamShield LE uses AI to detect and alert you about suspicious calls in real time, keeping you and your loved ones safe.",
        iconTint = Color(0xFF00897B)
    ),
    OnboardingPage(
        icon = Icons.Filled.MicNone,
        title = "Microphone and Call Access",
        description = "ScamShield LE needs microphone and phone permissions to analyze live calls for scam patterns. Your audio is processed locally and never stored or shared.",
        iconTint = Color(0xFF1565C0)
    ),
    OnboardingPage(
        icon = Icons.Filled.Notifications,
        title = "Stay Instantly Notified",
        description = "Enable notifications so ScamShield LE can alert you the moment a scam is detected, even when the app is running in the background.",
        iconTint = Color(0xFFF57C00)
    ),
    OnboardingPage(
        icon = Icons.Filled.Star,
        title = "Key Features",
        description = "Real-time AI scam detection\nInstant alerts during live calls\nScam call history and reports\nWorks silently in the background\nNo data leaves your device",
        iconTint = Color(0xFF7B1FA2)
    )
)

@Composable
fun OnboardingScreen(
    onOnboardingComplete: () -> Unit,
    viewModel: OnboardingViewModel = hiltViewModel()
) {
    val currentStep by viewModel.currentStep.collectAsState()
    val totalSteps = onboardingPages.size

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(Color(0xFF0D1B2A), Color(0xFF1B2838))
                )
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(48.dp))

            Row(
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                repeat(totalSteps) { index ->
                    Box(
                        modifier = Modifier
                            .padding(horizontal = 4.dp)
                            .size(if (index == currentStep) 12.dp else 8.dp)
                            .clip(CircleShape)
                            .background(
                                if (index == currentStep) Color(0xFF00BCD4)
                                else Color(0xFF455A64)
                            )
                    )
                }
            }

            Spacer(modifier = Modifier.height(48.dp))

            AnimatedContent(
                targetState = currentStep,
                transitionSpec = {
                    fadeIn(animationSpec = tween(400)) togetherWith
                        fadeOut(animationSpec = tween(400))
                },
                modifier = Modifier.weight(1f),
                label = "onboarding_page"
            ) { step ->
                val page = onboardingPages[step]
                Column(
                    modifier = Modifier.fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Box(
                        modifier = Modifier
                            .size(120.dp)
                            .clip(CircleShape)
                            .background(page.iconTint.copy(alpha = 0.15f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = page.icon,
                            contentDescription = null,
                            tint = page.iconTint,
                            modifier = Modifier.size(64.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(32.dp))

                    Text(
                        text = page.title,
                        fontSize = 26.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        textAlign = TextAlign.Center,
                        lineHeight = 32.sp
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    Text(
                        text = page.description,
                        fontSize = 16.sp,
                        color = Color(0xFFB0BEC5),
                        textAlign = TextAlign.Center,
                        lineHeight = 24.sp,
                        modifier = Modifier.padding(horizontal = 8.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(32.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (currentStep > 0) {
                    TextButton(onClick = { viewModel.goToPreviousStep() }) {
                        Text(text = "Back", color = Color(0xFF78909C), fontSize = 16.sp)
                    }
                } else {
                    TextButton(
                        onClick = {
                            viewModel.completeOnboarding()
                            onOnboardingComplete()
                        }
                    ) {
                        Text(text = "Skip", color = Color(0xFF78909C), fontSize = 16.sp)
                    }
                }

                Button(
                    onClick = {
                        if (currentStep < totalSteps - 1) {
                            viewModel.goToNextStep()
                        } else {
                            viewModel.completeOnboarding()
                            onOnboardingComplete()
                        }
                    },
                    shape = RoundedCornerShape(50),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00BCD4)),
                    modifier = Modifier.height(52.dp).widthIn(min = 160.dp)
                ) {
                    Text(
                        text = if (currentStep < totalSteps - 1) "Next" else "Get Started",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color.White
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }
}
