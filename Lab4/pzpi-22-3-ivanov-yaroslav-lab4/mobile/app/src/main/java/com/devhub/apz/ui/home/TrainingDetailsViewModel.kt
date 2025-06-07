package com.devhub.apz.ui.home

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

class TrainingDetailsViewModel(application: Application) : AndroidViewModel(application) {
    val training = MutableLiveData<JSONObject?>()
    val trainingDatas = MutableLiveData<List<JSONObject>>()
    val error = MutableLiveData<String?>()
    val loading = MutableLiveData<Boolean>()

    val recommendation = MutableLiveData<String?>()
    val recLoading = MutableLiveData<Boolean>()
    val recError = MutableLiveData<String?>()

    fun loadTrainingDetails(trainingId: String, token: String) {
        loading.value = true
        error.value = null
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val urlTraining = URL("http://192.168.0.210:5000/api/trainings/$trainingId")
                val connTraining = urlTraining.openConnection() as HttpURLConnection
                connTraining.requestMethod = "GET"
                connTraining.setRequestProperty("Authorization", "Bearer $token")
                val codeTraining = connTraining.responseCode
                val bodyTraining = connTraining.inputStream.bufferedReader().readText()
                connTraining.disconnect()
                if (codeTraining != HttpURLConnection.HTTP_OK)
                    throw Exception(getApplication<Application>().getString(R.string.error_loading_training))
                val trainingJson = JSONObject(bodyTraining)

                val urlData =
                    URL("http://192.168.0.210:5000/api/training-datas/training/$trainingId")
                val connData = urlData.openConnection() as HttpURLConnection
                connData.requestMethod = "GET"
                connData.setRequestProperty("Authorization", "Bearer $token")
                val codeData = connData.responseCode
                val bodyData = connData.inputStream.bufferedReader().readText()
                connData.disconnect()

                val datasList = mutableListOf<JSONObject>()
                if (codeData == HttpURLConnection.HTTP_OK) {
                    val jsonArray = JSONArray(bodyData)
                    for (i in 0 until jsonArray.length()) {
                        datasList.add(jsonArray.getJSONObject(i))
                    }
                }

                withContext(Dispatchers.Main) {
                    training.value = trainingJson
                    trainingDatas.value = datasList
                    loading.value = false
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    error.value = getApplication<Application>().getString(
                        R.string.error_loading_details,
                        e.message ?: ""
                    )
                    loading.value = false
                }
            }
        }
    }

    fun fetchRecommendation(trainingId: String, token: String, type: String) {
        recLoading.value = true
        recError.value = null
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val endpoint = when (type) {
                    "steps" -> "http://192.168.0.210:5000/api/analytics/recommendations/steps/$trainingId"
                    "calories" -> "http://192.168.0.210:5000/api/analytics/recommendations/calories/$trainingId"
                    "heart-rate" -> "http://192.168.0.210:5000/api/analytics/recommendations/heart-rate/$trainingId"
                    else -> throw Exception(getApplication<Application>().getString(R.string.unknown))
                }
                val url = URL(endpoint)
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "GET"
                conn.setRequestProperty("Authorization", "Bearer $token")
                val responseCode = conn.responseCode
                if (responseCode != HttpURLConnection.HTTP_OK) {
                    throw Exception(
                        getApplication<Application>().getString(
                            R.string.error_code,
                            responseCode
                        )
                    )
                }
                val response = conn.inputStream.bufferedReader().readText()
                conn.disconnect()

                val jsonObj = JSONObject(response)
                val recMessage = jsonObj.optString(
                    "message",
                    getApplication<Application>().getString(R.string.no_data)
                )
                val recFormula = jsonObj.optString("formula", "")
                val recIndicators = jsonObj.optJSONObject("indicators")
                val recParameters = jsonObj.optJSONObject("parameters")

                val recommendationText = buildString {
                    append(recMessage).append("\n")
                    if (recIndicators != null && recIndicators.length() > 0) {
                        append(getApplication<Application>().getString(R.string.indicators)).append(
                            "\n"
                        )
                        when (type) {
                            "steps" -> {
                                val steps = recIndicators.optInt("currentSteps", -1)
                                val avgSteps = recIndicators.optDouble("averageSteps", Double.NaN)
                                if (steps != -1) append(
                                    getApplication<Application>().getString(
                                        R.string.steps_in_session,
                                        steps
                                    )
                                ).append("\n")
                                if (!avgSteps.isNaN()) append(
                                    getApplication<Application>().getString(
                                        R.string.average_steps,
                                        avgSteps
                                    )
                                ).append("\n")
                            }

                            "calories" -> {
                                val calories = recIndicators.optDouble("calories", Double.NaN)
                                val avgCalories =
                                    recIndicators.optDouble("averageCalories", Double.NaN)
                                if (!calories.isNaN()) append(
                                    getApplication<Application>().getString(
                                        R.string.calories_value,
                                        calories
                                    )
                                ).append("\n")
                                if (!avgCalories.isNaN()) append(
                                    getApplication<Application>().getString(
                                        R.string.average_calories,
                                        avgCalories
                                    )
                                ).append("\n")
                            }

                            "heart-rate" -> {
                                val age = recIndicators.optInt("age", -1)
                                val maxHR = recIndicators.optDouble("maxHeartRate", Double.NaN)
                                val maxHRTraining = recIndicators.optDouble(
                                    "maxHeartRateDuringTraining",
                                    Double.NaN
                                )
                                val minHRTraining = recIndicators.optDouble(
                                    "minHeartRateDuringTraining",
                                    Double.NaN
                                )
                                val range = recIndicators.optJSONObject("acceptableRange")
                                if (age != -1) append(
                                    getApplication<Application>().getString(
                                        R.string.age_value,
                                        age
                                    )
                                ).append("\n")
                                if (!maxHR.isNaN()) append(
                                    getApplication<Application>().getString(
                                        R.string.max_heart_rate,
                                        maxHR
                                    )
                                ).append("\n")
                                if (!maxHRTraining.isNaN()) append(
                                    getApplication<Application>().getString(
                                        R.string.max_heart_rate_training,
                                        maxHRTraining
                                    )
                                ).append("\n")
                                if (!minHRTraining.isNaN()) append(
                                    getApplication<Application>().getString(
                                        R.string.min_heart_rate_training,
                                        minHRTraining
                                    )
                                ).append("\n")
                                if (range != null) {
                                    val lower = range.optDouble("lower", Double.NaN)
                                    val upper = range.optDouble("upper", Double.NaN)
                                    if (!lower.isNaN() && !upper.isNaN()) {
                                        append(
                                            getApplication<Application>().getString(
                                                R.string.recommended_heart_rate_range,
                                                lower,
                                                upper
                                            )
                                        ).append("\n")
                                    }
                                }
                            }
                        }
                    }
                    if (type == "calories" && recParameters != null && recParameters.length() > 0) {
                        append(getApplication<Application>().getString(R.string.calculation_details)).append(
                            "\n"
                        )
                        val calories = recParameters.optDouble("calories", Double.NaN)
                        if (!calories.isNaN()) append(
                            getApplication<Application>().getString(
                                R.string.calories_value,
                                calories
                            )
                        ).append("\n")
                        val steps = recParameters.optInt("totalSteps", -1)
                        if (steps != -1) append(
                            getApplication<Application>().getString(
                                R.string.steps_value,
                                steps
                            )
                        ).append("\n")
                        val heightCm = recParameters.optDouble("height", Double.NaN)
                        if (!heightCm.isNaN()) {
                            val totalInches = heightCm / 2.54
                            val feet = (totalInches / 12).toInt()
                            val inches = (totalInches % 12).toInt()
                            append(
                                getApplication<Application>().getString(
                                    R.string.height_value,
                                    feet,
                                    inches
                                )
                            ).append("\n")
                        }
                        val time = recParameters.optDouble("time", Double.NaN)
                        if (!time.isNaN()) append(
                            getApplication<Application>().getString(
                                R.string.time_seconds,
                                time
                            )
                        ).append("\n")
                        val MET = recParameters.optDouble("MET", Double.NaN)
                        if (!MET.isNaN()) append(
                            getApplication<Application>().getString(
                                R.string.met_value,
                                MET
                            )
                        ).append("\n")
                        val weightKg = recParameters.optDouble("weight", Double.NaN)
                        if (!weightKg.isNaN()) {
                            val weightLb = weightKg * 2.20462
                            append(
                                getApplication<Application>().getString(
                                    R.string.weight_lb,
                                    weightLb
                                )
                            ).append("\n")
                        }
                    }
                    if (type == "calories" && recParameters != null) {
                        val formula = recParameters.optString("formula", "")
                        if (formula.isNotEmpty()) {
                            append(getApplication<Application>().getString(R.string.used_formula)).append(
                                "\n"
                            )
                            append(formula).append("\n")
                        }
                    } else if (recFormula.isNotEmpty()) {
                        append(getApplication<Application>().getString(R.string.used_formula)).append(
                            "\n"
                        )
                        append(recFormula).append("\n")
                    }
                }

                withContext(Dispatchers.Main) {
                    recommendation.value = recommendationText.trim()
                    recLoading.value = false
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    recError.value = getApplication<Application>().getString(
                        R.string.error_prefix,
                        e.message ?: ""
                    )
                    recLoading.value = false
                }
            }
        }
    }
}