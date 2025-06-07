package com.devhub.apz.ui.admin

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.devhub.apz.R
import com.devhub.apz.models.AdminUser
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

class AdminDashboardViewModel(application: Application) : AndroidViewModel(application) {
    val users = MutableLiveData<List<AdminUser>>()
    val error = MutableLiveData<String?>()
    val loading = MutableLiveData<Boolean>()

    val roleOptions: List<String> =
        application.resources.getStringArray(R.array.role_options).toList()

    fun loadUsers(token: String) {
        loading.value = true
        error.value = null
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val url = URL("http://192.168.0.210:5000/api/users")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "GET"
                conn.setRequestProperty("Authorization", "Bearer $token")
                val responseCode = conn.responseCode
                val response = conn.inputStream.bufferedReader().readText()
                conn.disconnect()
                if (responseCode != HttpURLConnection.HTTP_OK) {
                    throw Exception(
                        getApplication<Application>().getString(
                            R.string.error_loading_user,
                            responseCode
                        )
                    )
                }
                val arr = JSONArray(response)
                val list = mutableListOf<AdminUser>()
                for (i in 0 until arr.length()) {
                    val obj = arr.getJSONObject(i)
                    list.add(
                        AdminUser(
                            id = obj.optString("id"),
                            email = obj.optString("email"),
                            username = obj.optString("name"),
                            roles = obj.optJSONArray("roles")?.let { jsonArr ->
                                List(jsonArr.length()) { index -> jsonArr.getString(index) }
                            } ?: emptyList()
                        )
                    )
                }
                withContext(Dispatchers.Main) {
                    users.value = list
                    loading.value = false
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    error.value = e.message
                    loading.value = false
                }
            }
        }
    }

    fun assignRole(
        userId: String,
        role: String,
        token: String,
        onComplete: (Boolean, String?) -> Unit
    ) {
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val url = URL("http://192.168.0.210:5000/api/users/$userId/role")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "POST"
                conn.doOutput = true
                conn.setRequestProperty("Content-Type", "application/json")
                conn.setRequestProperty("Authorization", "Bearer $token")
                val jsonBody = JSONObject().put("role", role).toString()
                conn.outputStream.use { it.write(jsonBody.toByteArray()) }
                val responseCode = conn.responseCode
                val responseText = conn.inputStream.bufferedReader().readText()
                conn.disconnect()
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    withContext(Dispatchers.Main) {
                        onComplete(true, null)
                    }
                } else {
                    val message = try {
                        JSONObject(responseText).optString(
                            "message",
                            getApplication<Application>().getString(R.string.error_assign_role)
                        )
                    } catch (e: Exception) {
                        getApplication<Application>().getString(R.string.error_assign_role)
                    }
                    withContext(Dispatchers.Main) {
                        onComplete(false, message)
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    onComplete(false, e.message)
                }
            }
        }
    }

    fun removeRole(
        userId: String,
        role: String,
        token: String,
        onComplete: (Boolean, String?) -> Unit
    ) {
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val url = URL("http://192.168.0.210:5000/api/users/$userId/role")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "DELETE"
                conn.doOutput = true
                conn.setRequestProperty("Content-Type", "application/json")
                conn.setRequestProperty("Authorization", "Bearer $token")
                val jsonBody = JSONObject().put("role", role).toString()
                conn.outputStream.use { it.write(jsonBody.toByteArray()) }
                val responseCode = conn.responseCode
                val responseText = conn.inputStream.bufferedReader().readText()
                conn.disconnect()
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    withContext(Dispatchers.Main) {
                        onComplete(true, null)
                    }
                } else {
                    val message = try {
                        JSONObject(responseText).optString(
                            "message",
                            getApplication<Application>().getString(R.string.error_remove_role)
                        )
                    } catch (e: Exception) {
                        getApplication<Application>().getString(R.string.error_remove_role)
                    }
                    withContext(Dispatchers.Main) {
                        onComplete(false, message)
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    onComplete(false, e.message)
                }
            }
        }
    }
}