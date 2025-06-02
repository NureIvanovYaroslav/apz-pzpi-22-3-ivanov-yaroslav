package com.devhub.apz.api

import org.json.JSONObject
import android.util.Base64

fun getUserRolesFromToken(token: String): List<String> {
    return try {
        val parts = token.split(".")
        if (parts.size < 2) return emptyList()
        val payload = Base64.decode(
            parts[1],
            Base64.URL_SAFE or Base64.NO_PADDING or Base64.NO_WRAP
        )
        val payloadStr = String(payload, Charsets.UTF_8)
        val json = JSONObject(payloadStr)
        val rolesArr = json.optJSONArray("roles")
        if (rolesArr != null) {
            List(rolesArr.length()) { rolesArr.getString(it) }
        } else {
            emptyList()
        }
    } catch (e: Exception) {
        emptyList()
    }
}