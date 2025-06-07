package com.devhub.apz.ui.auth

import android.app.Application
import android.content.Context
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.devhub.apz.R
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

class RegistrationViewModel(application: Application) : AndroidViewModel(application) {
    private val _registrationResult = MutableLiveData<Pair<Boolean, String?>>()
    val registrationResult: LiveData<Pair<Boolean, String?>> = _registrationResult

    fun register(email: String, password: String) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val url = URL("http://192.168.0.210:5000/api/auth/registration")
                val connection = url.openConnection() as HttpURLConnection
                connection.requestMethod = "POST"
                connection.doOutput = true
                connection.setRequestProperty("Content-Type", "application/json")
                val jsonBody = "{\"email\":\"$email\", \"password\":\"$password\"}"
                connection.outputStream.use { it.write(jsonBody.toByteArray()) }
                val responseCode = connection.responseCode
                val response = connection.inputStream.bufferedReader().readText()
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    val json = JSONObject(response)
                    val token = json.optString("accessToken")
                    getApplication<Application>().getSharedPreferences(
                        "app_prefs",
                        Context.MODE_PRIVATE
                    )
                        .edit().putString("token", token).apply()
                    withContext(Dispatchers.Main) {
                        _registrationResult.value = Pair(true, null)
                    }
                } else {
                    val json = try {
                        JSONObject(response)
                    } catch (_: Exception) {
                        null
                    }
                    val appContext = getApplication<Application>().applicationContext
                    val msg = json?.optString("message")
                        ?: appContext.getString(R.string.registration_failed) + " " + appContext.getString(
                            R.string.error_code,
                            responseCode
                        )
                    withContext(Dispatchers.Main) {
                        _registrationResult.value = Pair(false, msg)
                    }
                }
            } catch (ex: Exception) {
                val appContext = getApplication<Application>().applicationContext
                withContext(Dispatchers.Main) {
                    _registrationResult.value =
                        Pair(false, appContext.getString(R.string.error_prefix, ex.message ?: ""))
                }
            }
        }
    }
}