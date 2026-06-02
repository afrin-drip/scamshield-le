package com.scamshield.le.viewmodel
import android.content.Context; import android.content.Intent; import android.net.Uri
import androidx.lifecycle.ViewModel; import com.scamshield.le.data.model.Agency; import com.scamshield.le.data.model.AgencyCategory
import com.scamshield.le.data.model.AgencyDirectory; import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext; import kotlinx.coroutines.flow.MutableStateFlow; import kotlinx.coroutines.flow.StateFlow; import javax.inject.Inject
@HiltViewModel class AgencyViewModel @Inject constructor(@ApplicationContext private val context: Context) : ViewModel() {
    private val _selectedCategory = MutableStateFlow<AgencyCategory?>(null)
    val selectedCategory: StateFlow<AgencyCategory?> get() = _selectedCategory
    private val _agencies = MutableStateFlow(AgencyDirectory.agencies)
    val agencies: StateFlow<List<Agency>> get() = _agencies
    fun selectCategory(category: AgencyCategory?) { _selectedCategory.value = category; _agencies.value = if (category == null) AgencyDirectory.agencies else AgencyDirectory.getByCategory(category) }
    fun callAgency(phone: String) { context.startActivity(Intent(Intent.ACTION_DIAL, Uri.parse("tel:$phone")).apply { flags = Intent.FLAG_ACTIVITY_NEW_TASK }) }
    fun openWebsite(website: String) { val url = if (website.startsWith("http")) website else "https://$website"; context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply { flags = Intent.FLAG_ACTIVITY_NEW_TASK }) }
}
