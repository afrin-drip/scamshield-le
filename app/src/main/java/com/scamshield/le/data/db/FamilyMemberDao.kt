package com.scamshield.le.data.db
import androidx.room.*; import kotlinx.coroutines.flow.Flow
@Dao interface FamilyMemberDao {
    @Query("SELECT * FROM family_members ORDER BY name ASC") fun getAllMembers(): Flow<List<FamilyMemberEntity>>
    @Insert(onConflict = OnConflictStrategy.REPLACE) suspend fun insertMember(m: FamilyMemberEntity): Long
    @Query("DELETE FROM family_members WHERE id = :id") suspend fun deleteById(id: Long)
    @Query("UPDATE family_members SET isProtected = :protected WHERE id = :id") suspend fun setProtected(id: Long, protected: Boolean)
    @Query("UPDATE family_members SET notifyOnScam = :notify WHERE id = :id") suspend fun setNotify(id: Long, notify: Boolean)
}
