plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.hilt)
    alias(libs.plugins.ksp)
}
android {
    namespace = "com.scamshield.le"
    compileSdk = 35
    defaultConfig {
        applicationId = "com.scamshield.le"
        minSdk = 26; targetSdk = 35; versionCode = 1; versionName = "1.0"
        buildConfigField("String", "CLAUDE_API_KEY", "\"${project.findProperty(\"CLAUDE_API_KEY\") ?: \"\"}\"")
    }
    buildTypes { release { isMinifyEnabled = true } }
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
}
