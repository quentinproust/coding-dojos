package com.codingdojos.api.service.user

import com.fasterxml.jackson.annotation.JsonProperty

data class UserInfo(
        val sub: String,
        val name: String,
        @get:JsonProperty("given_name") val givenName: String,
        @get:JsonProperty("family_name") val familyName: String,
        val profile: String?,
        val picture: String,
        val email: String,
        @get:JsonProperty("email_verified") val emailVerified: Boolean,
        val hd: String?
)
