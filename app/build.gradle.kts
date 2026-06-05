plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.hilt)
    alias(libs.plugins.ksp)
    id("com.google.firebase.crashlytics")
    id("com.google.gms.google-services")
}
android {
    namespace = "com.scamshield.le"
    compileSdk = 35
    defaultConfig {
        applicationId = "com.scamshield.le"
        minSdk = 26; targetSdk = 35; versionCode = 1; versionName = "1.0"
        buildConfigField("String", "CLAUDE_API_KEY", "\"${project.findProperty(\"CLAUDE_API_KEY\") ?: \"\"}\"")
        buildConfigField("String", "TWILIO_ACCOUNT_SID", "\"${project.findProperty(\"TWILIO_ACCOUNT_SID\") ?: \"\"}\"")
        buildConfigField("String", "TWILIO_AUTH_TOKEN", "\"${project.findProperty(\"TWILIO_AUTH_TOKEN\") ?: \"\"}\"")
        buildConfigField("String", "TWILIO_FROM_NUMBER", "\"${project.findProperty(\"TWILIO_FROM_NUMBER\") ?: \"\"}\"")
    }
    signingConfigs {
        create("release") {
            // TODO: Configure release signing
            // storeFile = file(System.getenv("KEYSTORE_PATH") ?: "release.keystore")
            // storePassword = System.getenv("KEYSTORE_PASSWORD") ?: ""
            // keyAlias = System.getenv("KEY_ALIAS") ?: ""
            // keyPassword = System.getenv("KEY_PASSWORD") ?: ""
        }
    }
    buildTypes {
        release {
            isMinifyEnabled = true
            // signingConfig = signingConfigs.getByName("release")
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
    compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }
    kotlinOptions { jvmTarget = "17" }
    buildFeatures { compose = true; buildConfig = true }
    composeOptions { kotlinCompilerExtensionVersion = "1.5.14" }
}
dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui); implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview); implementation(libs.androidx.material3)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.hilt.android); implementation(libs.hilt.navigation.compose)
    ksp(libs.hilt.compiler)
    implementation(libs.room.runtime); implementation(libs.room.ktx); ksp(libs.room.compiler)
    implementation(libs.okhttp); implementation(libs.gson)
    implementation(libs.kotlinx.coroutines.android)
    // DataStore for onboarding completion state
    implementation("androidx.datastore:datastore-preferences:1.1.1")
    // Compose Foundation for HorizontalPager (built-in since compose-foundation 1.4+)
    implementation("androidx.compose.foundation:foundation")
    implementation("androidx.compose.material.icons:material-icons-extended")
    implementation("androidx.glance:glance-appwidget:1.0.0")
    implementation(libs.billing.ktx)
    // Unit test dependencies
    testImplementation("junit:junit:4.13.2")
    testImplementation("io.mockk:mockk:1.13.10")
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.8.1")
    testImplementation("com.google.truth:truth:1.4.2")


    // Firebase
    implementation(platform("com.google.firebase:firebase-bom:33.1.0"))
    implementation("com.google.firebase:firebase-crashlytics-ktx")
    implementation("com.google.firebase:firebase-perf-ktx")
    implementation("com.google.firebase:firebase-analytics-ktx")
}
