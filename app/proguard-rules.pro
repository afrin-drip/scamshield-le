# ScamShield LE — ProGuard Rules

# ===== APP CLASSES =====
-keep class com.scamshield.le.** { *; }
-keepnames class com.scamshield.le.** { *; }

# ===== HILT / DAGGER =====
-keep class dagger.hilt.** { *; }
-keep @dagger.hilt.android.lifecycle.HiltViewModel class * { *; }
-keepclassmembers class * { @javax.inject.Inject *; }
-keepclassmembers class * { @dagger.hilt.android.AndroidEntryPoint *; }

# ===== ROOM =====
-keep class * extends androidx.room.RoomDatabase
-keep @androidx.room.Entity class * { *; }
-keep @androidx.room.Dao interface * { *; }
-dontwarn androidx.room.paging.**

# ===== FIREBASE =====
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-keepattributes *Annotation*
-keepattributes EnclosingMethod

# ===== CRASHLYTICS =====
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception
-keep class com.google.firebase.crashlytics.** { *; }

# ===== GSON (Claude API response parsing) =====
-keepattributes Signature
-keep class com.google.gson.** { *; }
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer
-keep class com.scamshield.le.api.** { *; }
-keepclassmembers class com.scamshield.le.api.** { *; }

# ===== OKHTTP =====
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }

# ===== KOTLIN / COROUTINES =====
-keepclassmembernames class kotlinx.** { volatile <fields>; }
-keep class kotlin.** { *; }
-keep class kotlinx.coroutines.** { *; }
-dontwarn kotlinx.coroutines.**

# ===== COMPOSE =====
-keep class androidx.compose.** { *; }
-dontwarn androidx.compose.**

# ===== ENUMS =====
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# ===== SERIALIZATION =====
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# ===== PARCELABLE =====
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

# ===== SPEECH RECOGNIZER =====
-keep class android.speech.** { *; }

# ===== BILLING =====
-keep class com.android.billingclient.** { *; }
-keep interface com.android.billingclient.** { *; }

# ===== GLANCE WIDGET =====
-keep class androidx.glance.** { *; }
-dontwarn androidx.glance.**
