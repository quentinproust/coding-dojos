package com.codingdojos.api.extensions

import org.springframework.security.core.context.ReactiveSecurityContextHolder as ReactiveSecurityContextHolderSpring

object ReactiveSecurityContextHolder {
    fun getCurrentAuthentication() = ReactiveSecurityContextHolderSpring.getContext().map { it.authentication }
    fun getAuthentication() = ReactiveSecurityContextHolderSpring.getContext().toOptional { it.authentication }
}
