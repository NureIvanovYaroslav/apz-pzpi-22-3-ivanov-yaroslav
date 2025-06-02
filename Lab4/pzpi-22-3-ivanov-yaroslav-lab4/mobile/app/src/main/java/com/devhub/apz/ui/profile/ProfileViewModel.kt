package com.devhub.apz.ui.profile

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.devhub.apz.R
import kotlinx.coroutines.*
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

class ProfileViewModel(application: Application) : AndroidViewModel(application) {

    private val _user = MutableLiveData<JSONObject?>()
    val user: LiveData<JSONObject?> get() = _user

    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> get() = _error

    private val viewModelJob = Job()
    private val uiScope = CoroutineScope(Dispatchers.Main + viewModelJob)

    fun loadUser(userId: String, token: String) {
        uiScope.launch {
            withContext(Dispatchers.IO) {
                try {
                    val url = URL("http://10.0.2.2:5000/api/users/$userId")
                    val conn = url.openConnection() as HttpURLConnection
                    conn.requestMethod = "GET"
                    conn.setRequestProperty("Authorization", "Bearer $token")
                    conn.connectTimeout = 5000
                    conn.readTimeout = 5000
                    val code = conn.responseCode
                    val response = conn.inputStream.bufferedReader().readText()
                    conn.disconnect()
                    if (code == HttpURLConnection.HTTP_OK) {
                        val json = JSONObject(response)
                        withContext(Dispatchers.Main) {
                            _user.value = json
                            _error.value = null
                        }
                    } else {
                        withContext(Dispatchers.Main) {
                            _error.value = getApplication<Application>().getString(
                                R.string.load_profile_error,
                                code
                            )
                        }
                    }
                } catch (e: Exception) {
                    withContext(Dispatchers.Main) {
                        _error.value = getApplication<Application>().getString(
                            R.string.load_profile_error,
                            e.message ?: ""
                        )
                    }
                }
            }
        }
    }

    override fun onCleared() {
        super.onCleared()
        viewModelJob.cancel()
    }
}