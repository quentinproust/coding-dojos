package com.codingdojos.api.controller

import com.codingdojos.api.service.user.UserInfo
import com.codingdojos.api.service.user.UserInfoService
import com.codingdojos.api.service.user.mapAuthenticationToUserInfo
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ObjectNode
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.ResolvableType
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.ReactiveSecurityContextHolder
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken
import org.springframework.security.oauth2.client.registration.ClientRegistration
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Mono
import java.util.*

@RestController
@RequestMapping(path = ["/api/users"])
class UserController {

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @Autowired
    lateinit var userInfoService: UserInfoService

    @Autowired
    lateinit var clientRegistrationRepository: ReactiveClientRegistrationRepository

    @Value("#{'\${profile.user.admin}'.split(',')}")
    lateinit var listAdmin: List<String>

    @GetMapping(
        "/current",
        produces = [MediaType.APPLICATION_JSON_UTF8_VALUE]
    )
    fun getCurrentUser(
    ): Mono<ResponseEntity<ObjectNode>> {
        return ReactiveSecurityContextHolder.getContext()
            .map { Optional.of(it.authentication) }
            .defaultIfEmpty(Optional.empty())
            .map { authenticationOpt ->
                authenticationOpt.map<UserInfoDto> {
                    UserInfoDto.OAuthAuthenticated(
                        listAdmin.contains(it.details),
                        when (it) {
                            is OAuth2AuthenticationToken -> {
                                LoggerFactory.getLogger(this.javaClass).info("USer info : {}", it)
                                mapAuthenticationToUserInfo(it)
                            }
                            else -> throw RuntimeException("$it is not supported")
                        }
                    )
                }.orElseGet { UserInfoDto.NotAuthenticated }
            }
            .map {
                ResponseEntity.ok(objectMapper.convertValue(it, ObjectNode::class.java))
            }
    }

    sealed class UserInfoDto(val authenticated: Boolean) {
        object NotAuthenticated : UserInfoDto(false)
        data class OAuthAuthenticated(val admin: Boolean, val attributes: UserInfo) : UserInfoDto(true)
    }

    @GetMapping(
        "/available_authentications",
        produces = [MediaType.APPLICATION_JSON_UTF8_VALUE]
    )
    fun getAvailableAuthentications(): List<AvailableRegistration> {
        val type = ResolvableType.forInstance(clientRegistrationRepository)
            .`as`(Iterable::class.java)

        val registrations = if (type !== ResolvableType.NONE && ClientRegistration::class.java.isAssignableFrom(type.resolveGenerics()[0])) {
            clientRegistrationRepository as Iterable<ClientRegistration>
        } else {
            throw RuntimeException("Could not get all registrations")
        }

        return registrations.toList()
            .map { AvailableRegistration(it.registrationId, it.clientName) }
    }

    @GetMapping(
        "/authentications/{id}"
    )
    fun authenticate(
        @PathVariable id: String
    ): Mono<ClientRegistration> {
        return clientRegistrationRepository.findByRegistrationId(id)
    }
}

data class AvailableRegistration(
    val id: String,
    val name: String
)
