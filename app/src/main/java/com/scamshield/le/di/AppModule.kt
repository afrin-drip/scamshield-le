package com.scamshield.le.di
import android.content.Context; import androidx.room.Room
import com.scamshield.le.data.db.AppDatabase; import com.scamshield.le.data.db.FamilyMemberDao; import com.scamshield.le.data.db.IncidentDao
import dagger.Module; import dagger.Provides; import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext; import dagger.hilt.components.SingletonComponent
import okhttp3.OkHttpClient; import java.util.concurrent.TimeUnit; import javax.inject.Singleton
@Module @InstallIn(SingletonComponent::class) object AppModule {
    @Provides @Singleton fun provideContext(@ApplicationContext ctx: Context): Context = ctx
    @Provides @Singleton fun provideOkHttp(): OkHttpClient = OkHttpClient.Builder().connectTimeout(30, TimeUnit.SECONDS).readTimeout(30, TimeUnit.SECONDS).build()
    @Provides @Singleton fun provideDatabase(@ApplicationContext ctx: Context): AppDatabase = Room.databaseBuilder(ctx, AppDatabase::class.java, "scamshield.db").fallbackToDestructiveMigration().build()
    @Provides fun provideIncidentDao(db: AppDatabase): IncidentDao = db.incidentDao()
    @Provides fun provideFamilyMemberDao(db: AppDatabase): FamilyMemberDao = db.familyMemberDao()
}


// ── Billing ──────────────────────────────────────────────────────────────────
import android.content.Context
import com.scamshield.le.billing.BillingManager
import com.scamshield.le.billing.BillingRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object BillingModule {

    @Provides
    @Singleton
    fun provideBillingManager(
        @ApplicationContext context: Context
    ): BillingManager = BillingManager(context)

    @Provides
    @Singleton
    fun provideBillingRepository(
        @ApplicationContext context: Context,
        billingManager: BillingManager
    ): BillingRepository = BillingRepository(context, billingManager)
}
