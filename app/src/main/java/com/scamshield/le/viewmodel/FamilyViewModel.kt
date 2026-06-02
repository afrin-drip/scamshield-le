package com.scamshield.le.viewmodel
import androidx.lifecycle.ViewModel; import androidx.lifecycle.viewModelScope
import com.scamshield.le.data.model.FamilyMember; import com.scamshield.le.data.repository.FamilyRepository
import dagger.hilt.android.lifecycle.HiltViewModel; import kotlinx.coroutines.launch; import javax.inject.Inject
@HiltViewModel class FamilyViewModel @Inject constructor(private val repository: FamilyRepository) : ViewModel() {
    val members = repository.allMembers
    fun addMember(name: String, phone: String, rel: String) = viewModelScope.launch { repository.addMember(name, phone, rel) }
    fun removeMember(id: Long) = viewModelScope.launch { repository.removeMember(id) }
    fun toggleProtect(member: FamilyMember) = viewModelScope.launch { repository.setProtected(member.id, !member.isProtected) }
    fun toggleNotify(member: FamilyMember) = viewModelScope.launch { repository.setNotify(member.id, !member.notifyOnScam) }
}
