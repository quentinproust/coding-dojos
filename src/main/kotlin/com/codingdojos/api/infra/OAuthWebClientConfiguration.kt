package com.codingdojos.api.infra

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository
import org.springframework.security.oauth2.client.web.reactive.function.client.ServerOAuth2AuthorizedClientExchangeFilterFunction
import org.springframework.security.oauth2.client.web.server.ServerOAuth2AuthorizedClientRepository
import org.springframework.web.reactive.function.client.WebClient

// See : ReactiveOAuth2ClientAutoConfiguration
@Configuration
class OAuthWebClientConfiguration {
    @Bean("google-oauth-web-client")
    fun webClient(
            clientRegistrationRepo: ReactiveClientRegistrationRepository,
            authorizedClientRepo: ServerOAuth2AuthorizedClientRepository
    ): WebClient {
        val filter = ServerOAuth2AuthorizedClientExchangeFilterFunction(clientRegistrationRepo, authorizedClientRepo)
        return WebClient.builder().filter(filter).build();
    }
}
