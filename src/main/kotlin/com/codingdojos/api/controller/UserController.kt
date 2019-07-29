package com.codingdojos.api.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.http.MediaType
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient
import org.springframework.security.oauth2.client.web.reactive.function.client.ServerOAuth2AuthorizedClientExchangeFilterFunction
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository
import org.springframework.security.oauth2.client.registration.ClientRegistration
import org.springframework.core.ResolvableType
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository
import org.springframework.web.bind.annotation.PathVariable
import java.lang.RuntimeException


@RestController
@RequestMapping(path = ["/api/users"])
class UserController {

    @Autowired
    @Qualifier("google-oauth-web-client")
    lateinit var webClient: WebClient

    @Autowired
    lateinit var clientRegistrationRepository: ReactiveClientRegistrationRepository

    @GetMapping(
            "/current",
            produces = [MediaType.APPLICATION_JSON_UTF8_VALUE]
    )
    fun getCurrentUser(
            @RegisteredOAuth2AuthorizedClient("google")
            client: OAuth2AuthorizedClient
    ): Mono<String> {
        return webClient
                .get()
                .uri("https://www.googleapis.com/oauth2/v3/userinfo")
                .attributes(ServerOAuth2AuthorizedClientExchangeFilterFunction.oauth2AuthorizedClient(client))
                .retrieve()
                .bodyToMono(String::class.java)
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
            "/authentications/:id"
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
