package com.scamshield.le.data.repository

import com.scamshield.le.data.local.dao.IncidentDao
import com.scamshield.le.data.model.Incident
import com.scamshield.le.sync.FirestoreSyncManager
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class IncidentRepository @Inject constructor(
    private val incidentDao: IncidentDao,
    private val firestoreSyncManager: FirestoreSyncManager
) {
    fun getAllIncidents(): Flow<List<Incident>> = incidentDao.getAllIncidents()

    fun getIncidentById(id: Long): Flow<Incident?> = incidentDao.getIncidentById(id)

    suspend fun saveIncident(incident: Incident): Long {
        val id = incidentDao.insertIncident(incident)
        firestoreSyncManager.syncIncident(incident.copy(id = id))
        return id
    }

    suspend fun updateIncident(incident: Incident) {
        incidentDao.updateIncident(incident)
        firestoreSyncManager.syncIncident(incident)
    }

    suspend fun deleteIncident(incident: Incident) {
        incidentDao.deleteIncident(incident)
        firestoreSyncManager.deleteIncident(incident.id)
    }

    suspend fun deleteIncidentById(id: Long) {
        incidentDao.deleteIncidentById(id)
        firestoreSyncManager.deleteIncident(id)
    }
}