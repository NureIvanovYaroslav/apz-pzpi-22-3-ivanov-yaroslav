package com.devhub.apz.ui.admin

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.devhub.apz.R
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

class DbAdminDashboardViewModel(application: Application) : AndroidViewModel(application) {
    val backupResult = MutableLiveData<Pair<Boolean, String?>>()
    val restoreResult = MutableLiveData<Pair<Boolean, String?>>()
    val dbStatus = MutableLiveData<JSONObject?>()
    val loading = MutableLiveData<Boolean>()
    val error = MutableLiveData<String?>()

    fun createBackup(token: String) {
        loading.value = true
        error.value = null
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val url = URL("http://192.168.0.210:5000/api/admin/backup")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "POST"
                conn.doOutput = true
                conn.setRequestProperty("Content-Type", "application/json")
                conn.setRequestProperty("Authorization", "Bearer $token")
                val responseCode = conn.responseCode
                val responseText = conn.inputStream.bufferedReader().readText()
                conn.disconnect()
                withContext(Dispatchers.Main) {
                    if (responseCode == HttpURLConnection.HTTP_OK) {
                        backupResult.value = Pair(
                            true,
                            getApplication<Application>().getString(R.string.backup_created_success)
                        )
                    } else {
                        backupResult.value =
                            Pair(
                                false,
                                getApplication<Application>().getString(
                                    R.string.error_backup_db,
                                    responseCode
                                )
                            )
                    }
                    loading.value = false
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    backupResult.value = Pair(
                        false,
                        getApplication<Application>().getString(
                            R.string.error_backup_db,
                            e.message ?: ""
                        )
                    )
                    loading.value = false
                }
            }
        }
    }

    fun restoreBackup(token: String, backupName: String) {
        loading.value = true
        error.value = null
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val url = URL("http://192.168.0.210:5000/api/admin/restore")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "POST"
                conn.doOutput = true
                conn.setRequestProperty("Content-Type", "application/json")
                conn.setRequestProperty("Authorization", "Bearer $token")
                val jsonBody = JSONObject().put("backupName", backupName).toString()
                conn.outputStream.use { it.write(jsonBody.toByteArray()) }
                val responseCode = conn.responseCode
                val responseText = conn.inputStream.bufferedReader().readText()
                conn.disconnect()
                withContext(Dispatchers.Main) {
                    if (responseCode == HttpURLConnection.HTTP_OK) {
                        restoreResult.value = Pair(
                            true,
                            getApplication<Application>().getString(R.string.db_restored_success)
                        )
                    } else {
                        restoreResult.value = Pair(
                            false,
                            getApplication<Application>().getString(
                                R.string.error_restore_db,
                                responseCode
                            )
                        )
                    }
                    loading.value = false
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    restoreResult.value = Pair(
                        false,
                        getApplication<Application>().getString(
                            R.string.error_restore_db,
                            e.message ?: ""
                        )
                    )
                    loading.value = false
                }
            }
        }
    }

    fun checkDatabaseStatus(token: String) {
        loading.value = true
        error.value = null
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val url = URL("http://192.168.0.210:5000/api/admin/database-status")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "GET"
                conn.setRequestProperty("Authorization", "Bearer $token")
                val responseCode = conn.responseCode
                val responseText = conn.inputStream.bufferedReader().readText()
                conn.disconnect()
                withContext(Dispatchers.Main) {
                    if (responseCode == HttpURLConnection.HTTP_OK) {
                        val json = JSONObject(responseText)
                        dbStatus.value = json
                    } else {
                        error.value = getApplication<Application>().getString(
                            R.string.error_status_db,
                            responseCode
                        )
                    }
                    loading.value = false
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    error.value = getApplication<Application>().getString(
                        R.string.error_status_db,
                        e.message ?: ""
                    )
                    loading.value = false
                }
            }
        }
    }
}