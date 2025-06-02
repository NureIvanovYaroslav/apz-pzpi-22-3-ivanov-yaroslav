package com.devhub.apz.models

data class AdminUser(
    val id: String,
    val email: String,
    val username: String,
    val roles: List<String>
)