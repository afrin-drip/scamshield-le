package com.scamshield.le.intelligence

import android.content.Context
import android.util.Log
import androidx.hilt.work.HiltWorker
import androidx.work.*
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject
import java.util.concurrent.TimeUnit

@HiltWorker
class NumberIntelligenceWorker @AssistedInject constructor(
    @Assisted context: Context,
    @Assisted workerParams: WorkerParameters,
    private val scamIntelligenceManager: ScamIntelligenceManager
) : CoroutineWorker(context, workerParams) {

    override suspend fun doWork(): Result {
        Log.d(TAG, "Starting periodic scam number sync (attempt ${runAttemptCount + 1})")
        return try {
            scamIntelligenceManager.syncFromCloud()
            Log.d(TAG, "Sync completed successfully")
            Result.success()
        } catch (e: Exception) {
            Log.e(TAG, "Sync failed: ${e.message}")
            if (runAttemptCount < MAX_RETRY_COUNT) Result.retry() else Result.failure()
        }
    }

    companion object {
        private const val TAG = "NumberIntelligenceWorker"
        private const val WORK_NAME = "ScamNumberPeriodicSync"
        private const val MAX_RETRY_COUNT = 3

        /**
         * Enqueues a unique periodic WorkManager job that syncs scam numbers every 6 hours.
         * Call from Application.onCreate() or a Hilt-injected initializer.
         */
        fun schedule(context: Context) {
            val constraints = Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .build()

            val request = PeriodicWorkRequestBuilder<NumberIntelligenceWorker>(
                repeatInterval = 6,
                repeatIntervalTimeUnit = TimeUnit.HOURS
            )
                .setConstraints(constraints)
                .setBackoffCriteria(
                    BackoffPolicy.EXPONENTIAL,
                    WorkRequest.MIN_BACKOFF_MILLIS,
                    TimeUnit.MILLISECONDS
                )
                .build()

            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                WORK_NAME,
                ExistingPeriodicWorkPolicy.KEEP,
                request
            )

            Log.d(TAG, "Periodic sync scheduled (every 6 h)")
        }
    }
}
