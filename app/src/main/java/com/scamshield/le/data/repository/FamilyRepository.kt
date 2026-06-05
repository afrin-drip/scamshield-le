package com.scamshield.le.data.repository
import com.scamshield.le.data.db.FamilyMemberDao; import com.scamshield.le.data.db.FamilyMemberEntity
import com.scamshield.le.data.model.FamilyMember; import kotlinx.coroutines.flow.Flow; import kotlinx.coroutines.flow.map
import javax.inject.Inject; import javax.inject.Singleton
@Singleton class FamilyRepository @Inject constructor(private val dao: FamilyMemberDao) {
    val allMembers: Flow<List<FamilyMember>> = dao.getAllMembers().map { it.map { e -> FamilyMember(e.id, e.name, e.phoneNumber, e.relationship, e.isProtected, e.notifyOnScam, e.addedAt) } }
    suspend fun addMember(name: String, phone: String, rel: String) = dao.insertMember(FamilyMemberEntity(name = name, phoneNumber = phone, relationship = rel))
    suspend fun removeMember(id: Long) = dao.deleteById(id)
    suspend fun setProtected(id: Long, v: Boolean) = dao.setProtected(id, v)
    suspend fun setNotify(id: Long, v: Boolean) = dao.setNotify(id, v)

    suspend fun setSmsEnabled(id: Long, enabled: Boolean) {
        val member = dao.getById(id) ?: return
        dao.update(member.copy(smsEnabled = enabled))
    }

    suspend fun setGuardianPhone(id: Long, phone: String) {
        val member = dao.getById(id) ?: return
        dao.update(member.copy(guardianPhone = phone))
    }
}