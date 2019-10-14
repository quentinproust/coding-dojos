package com.codingdojos.api.model

import com.codingdojos.api.service.user.mapAuthenticationToUserInfo
import org.springframework.security.core.Authentication

data class Coder(
    val sub: String,
    val name: String,
    val picture: String? = null,
    val email: String,
    val hd: String?
)

fun Authentication.toCoder(): Coder {
    val userInfo = mapAuthenticationToUserInfo(this)
    return Coder(
        sub = userInfo.sub,
        name = userInfo.name,
        email = userInfo.email,
        hd =  userInfo.hd,
        picture = userInfo.picture
    )
}
