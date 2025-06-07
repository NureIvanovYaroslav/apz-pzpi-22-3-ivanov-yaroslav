package com.devhub.apz.ui.home

import android.app.Application
import android.content.Context
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.devhub.apz.R
import com.devhub.apz.api.getUserIdFromToken
import com.devhub.apz.models.Training
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

class HomeViewModel(application: Application) : AndroidViewModel(application) {
    private val _trainings = MutableLiveData<List<Training>>()
    val trainings: LiveData<List<Training>> = _trainings

    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error

    private val _loading = MutableLiveData<Boolean>()
    val loading: LiveData<Boolean> = _loading

    fun loadTrainings() {
        _loading.value = true
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val prefs = getApplication<Application>().getSharedPreferences(
                    "app_prefs",
                    Context.MODE_PRIVATE
                )
                val token = prefs.getString("token", null)
                if (token.isNullOrEmpty()) {
                    withContext(Dispatchers.Main) {
                        _error.value = getApplication<Application>().getString(R.string.not_auth)
                        _loading.value = false
                    }
                    return@launch
                }
                val userId = getUserIdFromToken(token)
                if (userId.isNullOrEmpty()) {
                    withContext(Dispatchers.Main) {
                        _error.value = getApplication<Application>().getString(R.string.error_token)
                        _loading.value = false
                    }
                    return@launch
                }
                val userRes = makeRequest("http://192.168.0.210:5000/api/users/$userId", token)
                if (userRes.first != 200) {
                    withContext(Dispatchers.Main) {
                        _error.value =
                            getApplication<Application>().getString(R.string.error_loading_user)
                        _loading.value = false
                    }
                    return@launch
                }
                val userJson = JSONObject(userRes.second)
                val deviceId = userJson.optString("device", null)
                if (deviceId.isNullOrEmpty()) {
                    withContext(Dispatchers.Main) {
                        _error.value =
                            getApplication<Application>().getString(R.string.error_no_device)
                        _loading.value = false
                    }
                    return@launch
                }
                val trainingsRes =
                    makeRequest("http://192.168.0.210:5000/api/trainings/device/$deviceId", token)

                if (trainingsRes.first != 200) {
                    try {
                        val errorJson = JSONObject(trainingsRes.second)
                        if (errorJson.optString("message") == "Trainings not found") {
                            withContext(Dispatchers.Main) {
                                _trainings.value = emptyList()
                                _error.value = null
                                _loading.value = false
                            }
                            return@launch
                        }
                    } catch (e: Exception) {
                    }
                    withContext(Dispatchers.Main) {
                        _error.value =
                            getApplication<Application>().getString(R.string.error_loading_trainings)
                        _loading.value = false
                    }
                    return@launch
                }
                val trainingsArr = JSONArray(trainingsRes.second)
                val list = mutableListOf<Training>()
                for (i in 0 until trainingsArr.length()) {
                    val obj = trainingsArr.getJSONObject(i)
                    list.add(
                        Training(
                            id = obj.optString("id", obj.optString("_id", "")),
                            type = obj.optString("type", ""),
                            startTime = obj.optString("startTime", ""),
                            endTime = obj.optString("endTime", "")
                        )
                    )
                }
                withContext(Dispatchers.Main) {
                    _trainings.value = list
                    _error.value = null
                    _loading.value = false
                }
            } catch (ex: Exception) {
                withContext(Dispatchers.Main) {
                    _error.value = getApplication<Application>().getString(
                        R.string.error_prefix,
                        ex.message ?: ""
                    )
                    _loading.value = false
                }
            }
        }
    }

    private fun makeRequest(urlStr: String, token: String): Pair<Int, String> {
        val url = URL(urlStr)
        val conn = url.openConnection() as HttpURLConnection
        conn.requestMethod = "GET"
        conn.setRequestProperty("Authorization", "Bearer $token")
        conn.connectTimeout = 5000
        conn.readTimeout = 5000
        val code = conn.responseCode
        val body = conn.inputStream.bufferedReader().readText()
        conn.disconnect()
        return code to body
    }
}