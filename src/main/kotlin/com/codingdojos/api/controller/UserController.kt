package com.codingdojos.api.controller

import com.codingdojos.api.service.user.UserInfo
import com.codingdojos.api.service.user.UserInfoService
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.JsonNodeFactory
import com.fasterxml.jackson.databind.node.ObjectNode
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.MediaType
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Mono
import org.springframework.security.oauth2.client.registration.ClientRegistration
import org.springframework.core.ResolvableType
import org.springframework.http.ResponseEntity
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository
import org.springframework.web.bind.annotation.PathVariable
import java.lang.RuntimeException
import org.springframework.security.oauth2.client.web.reactive.function.client.ServletOAuth2AuthorizedClientExchangeFilterFunction.authentication
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService
import org.springframework.security.oauth2.client.ReactiveOAuth2AuthorizedClientService


@RestController
@RequestMapping(path = ["/api/users"])
class UserController {

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @Autowired
    lateinit var userInfoService: UserInfoService

    @Autowired
    lateinit var clientRegistrationRepository: ReactiveClientRegistrationRepository

    @Autowired
    lateinit var authorizedClientService: ReactiveOAuth2AuthorizedClientService


    @Value("#{'\${profile.user.admin}'.split(',')}")
    lateinit var listAdmin: List<String>

    @GetMapping(
        "/current",
        produces = [MediaType.APPLICATION_JSON_UTF8_VALUE]
    )
    fun getCurrentUser(
        //@RegisteredOAuth2AuthorizedClient client: OAuth2AuthorizedClient
        authentication: OAuth2AuthenticationToken?
    ): Mono<ResponseEntity<ObjectNode>> {
        if (authentication == null) {
            val notAuthenticated = JsonNodeFactory.instance.objectNode().put("authenticated", false)
            return Mono.just(ResponseEntity.ok(notAuthenticated));
        }
        return authorizedClientService
            .loadAuthorizedClient<OAuth2AuthorizedClient>(
                authentication.authorizedClientRegistrationId,
                authentication.name
            )
            .flatMap { userInfoService.of(it) }

            .map {
                ResponseEntity.ok(objectMapper.convertValue(it, ObjectNode::class.java)
                    .put("authenticated", true)
                    .put("admin",listAdmin.contains(it.email))
                )
            }
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
