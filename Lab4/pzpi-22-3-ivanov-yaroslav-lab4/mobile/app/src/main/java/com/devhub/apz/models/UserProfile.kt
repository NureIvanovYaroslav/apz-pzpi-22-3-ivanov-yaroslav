package com.devhub.apz.models

data class UserProfile(
    val name: String,
    val birthDate: String,
    val weight: Double,
    val height: Double,
    val country: String,
    val sex: String
)