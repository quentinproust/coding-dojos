package com.codingdojos.api.service.user

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient
import org.springframework.security.oauth2.client.web.reactive.function.client.ServerOAuth2AuthorizedClientExchangeFilterFunction
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono


@Component
class UserInfoService @Autowired constructor (
        @Qualifier("google-oauth-web-client")
        private val webClient: WebClient
) {
    fun of(client: OAuth2AuthorizedClient): Mono<UserInfo> {
        val userInfoEndpointUri = client.clientRegistration.providerDetails.userInfoEndpoint.uri

        if (userInfoEndpointUri.isNotBlank()) {
            return webClient
                    .get()
                    .uri("https://www.googleapis.com/oauth2/v3/userinfo")
                    .attributes(ServerOAuth2AuthorizedClientExchangeFilterFunction.oauth2AuthorizedClient(client))
                    .retrieve()
                    .bodyToMono(UserInfo::class.java)
        }
        else {
            throw IllegalStateException("No user info endpoint uri")
        }
    }

}
