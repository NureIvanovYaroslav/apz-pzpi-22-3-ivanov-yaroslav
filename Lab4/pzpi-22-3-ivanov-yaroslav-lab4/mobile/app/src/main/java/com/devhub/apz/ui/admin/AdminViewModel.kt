package com.devhub.apz.ui.admin

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.devhub.apz.api.getUserRolesFromToken

class AdminViewModel : ViewModel() {
    private val _hasAdminAccess = MutableLiveData<Boolean>()
    val hasAdminAccess: LiveData<Boolean> get() = _hasAdminAccess

    fun checkAdminAccess(token: String?) {
        val roles = token?.let { getUserRolesFromToken(it) } ?: emptyList()
        _hasAdminAccess.value = roles.any { it in listOf("ADMIN", "DB_ADMIN", "SERVER_ADMIN") }
    }
}