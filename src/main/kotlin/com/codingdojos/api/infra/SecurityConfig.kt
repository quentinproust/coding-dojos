package com.codingdojos.api.infra

import org.springframework.context.annotation.Bean
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.web.server.SecurityWebFilterChain

@EnableWebFluxSecurity
class SecurityConfig {
    @Bean
    fun configure(http: ServerHttpSecurity): SecurityWebFilterChain {
        return http
                .authorizeExchange()
                .pathMatchers("/api/users/available_authentications").permitAll()
                .pathMatchers("/api/users/authentications/**").permitAll()
                .anyExchange().authenticated()
                .and().oauth2Login()
                .and().build()
    }
}
