package com.codingdojos.api.service.user

import com.fasterxml.jackson.annotation.JsonProperty
import org.slf4j.LoggerFactory
import org.springframework.security.core.Authentication
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken

data class UserInfo(
    val sub: String,
    val name: String,
    val profile: String? = null,
    val picture: String? = null,
    val email: String,
    @get:JsonProperty("email_verified") val emailVerified: Boolean,
    val isAdmin: Boolean = false,
    val hd: String? = null,
    val grantedAuthorities: List<String> = emptyList()
)

fun mapAuthenticationToUserInfo(auth: Authentication): UserInfo {
    return when (auth) {
        is OAuth2AuthenticationToken -> {
            LoggerFactory.getLogger(UserInfo::class.java).info("User info : {}", auth)
            mapAttributesToUserInfo(auth)
        }
        else -> throw RuntimeException("$auth is not supported")
    }
}

private fun mapAttributesToUserInfo(auth: OAuth2AuthenticationToken): UserInfo {
    val attributes = auth.principal.attributes
    return UserInfo(
        sub = attributes["sub"] as String,
        name = attributes["name"] as String,
        profile = attributes["profile"] as String?,
        picture = attributes["picture"] as String,
        email = attributes["email"] as String,
        emailVerified = attributes["email_verified"] as Boolean,
        hd = attributes["hd"] as String?,
        grantedAuthorities = auth.authorities.map { it.authority }
    )
}
