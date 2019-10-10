package com.codingdojos.api.infra

import com.codingdojos.api.service.user.UserInfo
import com.codingdojos.api.service.user.mapAuthenticationToUserInfo
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.http.HttpMethod.GET
import org.springframework.http.HttpStatus
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.SecurityWebFiltersOrder
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.core.context.ReactiveSecurityContextHolder
import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.security.web.server.authentication.HttpStatusServerEntryPoint
import org.springframework.security.web.server.authentication.logout.RedirectServerLogoutSuccessHandler
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers
import org.springframework.stereotype.Repository
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebFilter
import org.springframework.web.server.WebFilterChain
import reactor.core.publisher.Mono
import java.net.URI


@EnableWebFluxSecurity
class SecurityConfig {
    @Autowired
    lateinit var userRepository: PersistedUserInfoReactiveRepository

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
            .and().exceptionHandling().authenticationEntryPoint(HttpStatusServerEntryPoint(HttpStatus.UNAUTHORIZED))
            .and().addFilterAt(PersistUserWebFilter(userRepository), SecurityWebFiltersOrder.AUTHENTICATION)
            .build()
    }
}

@Repository
interface PersistedUserInfoReactiveRepository : ReactiveMongoRepository<UserInfo, String>

class PersistUserWebFilter(
    val persistence: PersistedUserInfoReactiveRepository
) : WebFilter {
    override fun filter(exchange: ServerWebExchange, chain: WebFilterChain): Mono<Void> {
        return ServerWebExchangeMatchers.pathMatchers("/login/oauth2/code/**").matches(exchange)
            .flatMap { match ->
                if (match.isMatch) {
                    chain.filter(exchange)
                        .map { Unit }
                        .defaultIfEmpty(Unit)
                        .flatMap {
                            ReactiveSecurityContextHolder.getContext()
                                .flatMap {
                                    val userInfo = mapAuthenticationToUserInfo(it.authentication)
                                    persistence.save(userInfo).flatMap {
                                        Mono.fromRunnable<Void> {}
                                    }
                                }
                        }
                } else {
                    chain.filter(exchange)
                }
            }
    }
}

