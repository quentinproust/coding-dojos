package com.codingdojos.api.infra

import org.springframework.context.annotation.Bean
import org.springframework.http.HttpMethod.GET
import org.springframework.http.HttpStatus
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.security.web.server.authentication.HttpStatusServerEntryPoint
import org.springframework.security.web.server.authentication.logout.RedirectServerLogoutSuccessHandler
import java.net.URI


@EnableWebFluxSecurity
class SecurityConfig {
    @Bean
    fun configure(http: ServerHttpSecurity): SecurityWebFilterChain {
        return http
            .csrf().disable()
            .authorizeExchange()
            .pathMatchers("/api/users/available_authentications").permitAll()
            .pathMatchers("/api/users/authentications/**").permitAll()
            .pathMatchers(GET, "/api/dojos").permitAll()
            .pathMatchers(GET, "/api/subjects").permitAll()
            .pathMatchers(GET, "/api/users/current").permitAll()
            .pathMatchers("/api/**").authenticated()
            .anyExchange().permitAll()
            .and().oauth2Login()
            .and().logout().logoutSuccessHandler(RedirectServerLogoutSuccessHandler().also {
                it.setLogoutSuccessUrl(URI("/"))
            })
            .and().exceptionHandling()
            .authenticationEntryPoint(HttpStatusServerEntryPoint(HttpStatus.UNAUTHORIZED))
            .and().build()
    }
}
