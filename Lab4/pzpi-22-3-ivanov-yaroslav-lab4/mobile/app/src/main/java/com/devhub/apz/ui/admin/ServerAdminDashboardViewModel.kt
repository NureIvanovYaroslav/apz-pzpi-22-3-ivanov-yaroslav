package com.devhub.apz.ui.admin

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.devhub.apz.R
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import kotlin.math.min

class ServerAdminDashboardViewModel(application: Application) : AndroidViewModel(application) {
    val serverStatus = MutableLiveData<JSONObject?>()
    val serverConfig = MutableLiveData<JSONObject?>()
    val logs = MutableLiveData<List<JSONObject>>()
    val error = MutableLiveData<String?>()
    val loading = MutableLiveData<Boolean>()

    val currentLogsPage = MutableLiveData<Int>().apply { value = 1 }
    val totalLogsPages = MutableLiveData<Int>()
    private val logsPerPage = 10

    private var allLogs: List<JSONObject> = emptyList()

    fun fetchServerStatus(token: String) {
        loading.value = true
        error.value = null
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val url = URL("http://10.0.2.2:5000/api/admin/server-status")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "GET"
                conn.setRequestProperty("Authorization", "Bearer $token")
                val code = conn.responseCode
                if (code == HttpURLConnection.HTTP_OK) {
                    val response = conn.inputStream.bufferedReader().readText()
                    conn.disconnect()
                    val json = JSONObject(response)
                    withContext(Dispatchers.Main) {
                        serverStatus.value = json
                        loading.value = false
                    }
                } else {
                    conn.disconnect()
                    withContext(Dispatchers.Main) {
                        error.value = getApplication<Application>().getString(
                            R.string.error_fetching_status,
                            code
                        )
                        loading.value = false
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    error.value = getApplication<Application>().getString(
                        R.string.error_fetching_status,
                        e.message ?: ""
                    )
                    loading.value = false
                }
            }
        }
    }

    fun fetchServerConfig(token: String) {
        loading.value = true
        error.value = null
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val url = URL("http://10.0.2.2:5000/api/admin/server-config")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "GET"
                conn.setRequestProperty("Authorization", "Bearer $token")
                val code = conn.responseCode
                if (code == HttpURLConnection.HTTP_OK) {
                    val response = conn.inputStream.bufferedReader().readText()
                    conn.disconnect()
                    val json = JSONObject(response)
                    withContext(Dispatchers.Main) {
                        serverConfig.value = json
                        loading.value = false
                    }
                } else {
                    conn.disconnect()
                    withContext(Dispatchers.Main) {
                        error.value = getApplication<Application>().getString(
                            R.string.error_fetching_config,
                            code
                        )
                        loading.value = false
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    error.value = getApplication<Application>().getString(
                        R.string.error_fetching_config,
                        e.message ?: ""
                    )
                    loading.value = false
                }
            }
        }
    }

    fun updateServerConfig(token: String, newConfig: JSONObject) {
        loading.value = true
        error.value = null
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val url = URL("http://10.0.2.2:5000/api/admin/server-config")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "POST"
                conn.doOutput = true
                conn.setRequestProperty("Content-Type", "application/json")
                conn.setRequestProperty("Authorization", "Bearer $token")
                val jsonBody = newConfig.toString()
                conn.outputStream.use { it.write(jsonBody.toByteArray()) }
                val code = conn.responseCode
                conn.disconnect()
                withContext(Dispatchers.Main) {
                    if (code == HttpURLConnection.HTTP_OK) {
                        fetchServerConfig(token)
                    } else {
                        error.value = getApplication<Application>().getString(
                            R.string.error_updating_config,
                            code
                        )
                        loading.value = false
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    error.value = getApplication<Application>().getString(
                        R.string.error_updating_config,
                        e.message ?: ""
                    )
                    loading.value = false
                }
            }
        }
    }

    fun fetchLogs(token: String, page: Int = 1) {
        loading.value = true
        error.value = null
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val url = URL("http://10.0.2.2:5000/api/admin/logs")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "GET"
                conn.setRequestProperty("Authorization", "Bearer $token")
                val responseCode = conn.responseCode
                val responseText = conn.inputStream.bufferedReader().readText()
                conn.disconnect()
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    val arr = JSONArray(responseText)
                    val list = mutableListOf<JSONObject>()
                    for (i in 0 until arr.length()) {
                        list.add(arr.getJSONObject(i))
                    }
                    allLogs = list
                    val totalLogs = list.size
                    val totalPagesCalculated = if (totalLogs % logsPerPage == 0)
                        totalLogs / logsPerPage else (totalLogs / logsPerPage) + 1
                    withContext(Dispatchers.Main) {
                        totalLogsPages.value = totalPagesCalculated
                        paginateLogs(page)
                        loading.value = false
                    }
                } else {
                    withContext(Dispatchers.Main) {
                        error.value = getApplication<Application>().getString(
                            R.string.error_fetching_logs,
                            responseCode
                        )
                        loading.value = false
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    error.value = getApplication<Application>().getString(
                        R.string.error_fetching_logs,
                        e.message ?: ""
                    )
                    loading.value = false
                }
            }
        }
    }

    fun paginateLogs(page: Int) {
        val totalLogs = allLogs.size
        val fromIndex = (page - 1) * logsPerPage
        val toIndex = min(fromIndex + logsPerPage, totalLogs)
        val pageLogs =
            if (fromIndex in 0 until totalLogs) allLogs.subList(fromIndex, toIndex) else emptyList()
        logs.value = pageLogs
        currentLogsPage.value = page
    }

    fun deleteAllLogs(token: String, onComplete: (Boolean, String?) -> Unit) {
        loading.value = true
        error.value = null
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val url = URL("http://10.0.2.2:5000/api/admin/logs")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "DELETE"
                conn.setRequestProperty("Authorization", "Bearer $token")
                val code = conn.responseCode
                conn.disconnect()
                withContext(Dispatchers.Main) {
                    loading.value = false
                    if (code == HttpURLConnection.HTTP_OK) {
                        onComplete(true, null)
                    } else {
                        onComplete(
                            false,
                            getApplication<Application>().getString(
                                R.string.error_deleting_logs,
                                code
                            )
                        )
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    loading.value = false
                    onComplete(
                        false,
                        getApplication<Application>().getString(
                            R.string.error_deleting_logs,
                            e.message ?: ""
                        )
                    )
                }
            }
        }
    }

    fun deleteLogsByDate(token: String, date: String, onComplete: (Boolean, String?) -> Unit) {
        loading.value = true
        error.value = null
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val url = URL("http://10.0.2.2:5000/api/admin/logs/by-date?date=$date")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "DELETE"
                conn.setRequestProperty("Authorization", "Bearer $token")
                val code = conn.responseCode
                val response = conn.inputStream.bufferedReader().readText()
                conn.disconnect()
                withContext(Dispatchers.Main) {
                    loading.value = false
                    if (code == HttpURLConnection.HTTP_OK) {
                        onComplete(
                            true,
                            getApplication<Application>().getString(
                                R.string.logs_deleted_by_date,
                                date
                            )
                        )
                    } else {
                        onComplete(
                            false,
                            getApplication<Application>().getString(
                                R.string.error_deleting_logs_by_date,
                                code
                            )
                        )
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    loading.value = false
                    onComplete(
                        false,
                        getApplication<Application>().getString(
                            R.string.error_deleting_logs_by_date,
                            e.message ?: ""
                        )
                    )
                }
            }
        }
    }
}