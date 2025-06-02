package com.devhub.apz.api

import org.json.JSONObject

fun getUserIdFromToken(token: String): String? {
    return try {
        val parts = token.split(".")
        if (parts.size < 2) return null
        val payload = android.util.Base64.decode(
            parts[1],
            android.util.Base64.URL_SAFE or android.util.Base64.NO_PADDING or android.util.Base64.NO_WRAP
        )
        val payloadStr = String(payload, Charsets.UTF_8)
        val json = JSONObject(payloadStr)
        json.optString("id", json.optString("_id", null))
    } catch (e: Exception) {
        null
    }
}