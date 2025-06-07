package com.devhub.apz.ui.profile

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.devhub.apz.R
import com.devhub.apz.api.getUserIdFromToken
import com.devhub.apz.models.UserProfile
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

class EditProfileViewModel(application: Application) : AndroidViewModel(application) {

    val user = MutableLiveData<UserProfile?>()
    val error = MutableLiveData<String?>()

    fun loadUserProfile(token: String) {
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val userId = getUserIdFromToken(token)
                    ?: throw Exception(getApplication<Application>().getString(R.string.no_token))
                val url = URL("http://192.168.0.210:5000/api/users/$userId")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "GET"
                conn.setRequestProperty("Authorization", "Bearer $token")
                conn.connectTimeout = 5000
                conn.readTimeout = 5000
                val responseCode = conn.responseCode
                val responseText = conn.inputStream.bufferedReader().readText()
                conn.disconnect()
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    val json = JSONObject(responseText)
                    val loadedUser = UserProfile(
                        name = json.optString("name"),
                        birthDate = json.optString("birthDate"),
                        weight = json.optDouble("weight"),
                        height = json.optDouble("height"),
                        country = json.optString("country"),
                        sex = json.optString("sex")
                    )
                    withContext(Dispatchers.Main) {
                        user.value = loadedUser
                        error.value = null
                    }
                } else {
                    withContext(Dispatchers.Main) {
                        error.value = getApplication<Application>().getString(
                            R.string.load_profile_error,
                            responseCode
                        )
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    error.value = getApplication<Application>().getString(
                        R.string.load_profile_error,
                        e.message ?: ""
                    )
                }
            }
        }
    }

    fun updateUserProfile(
        token: String,
        updatedProfile: Map<String, Any?>,
        onComplete: (Boolean, String?) -> Unit
    ) {
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val userId = getUserIdFromToken(token)
                    ?: throw Exception(getApplication<Application>().getString(R.string.no_token))
                val url = URL("http://192.168.0.210:5000/api/users/$userId")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "PUT"
                conn.doOutput = true
                conn.setRequestProperty("Content-Type", "application/json")
                conn.setRequestProperty("Authorization", "Bearer $token")
                val jsonBody = JSONObject(updatedProfile).toString()
                conn.outputStream.use { it.write(jsonBody.toByteArray()) }
                val responseCode = conn.responseCode
                conn.disconnect()
                if (responseCode == HttpURLConnection.HTTP_OK || responseCode == HttpURLConnection.HTTP_NO_CONTENT) {
                    withContext(Dispatchers.Main) {
                        onComplete(true, null)
                    }
                } else {
                    withContext(Dispatchers.Main) {
                        onComplete(
                            false,
                            getApplication<Application>().getString(
                                R.string.edit_error,
                                responseCode
                            )
                        )
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    onComplete(
                        false,
                        getApplication<Application>().getString(
                            R.string.edit_error,
                            e.message ?: ""
                        )
                    )
                }
            }
        }
    }
}