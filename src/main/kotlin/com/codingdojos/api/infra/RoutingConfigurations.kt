package com.codingdojos.api.infra

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.server.HandlerFunction
import org.springframework.web.reactive.function.server.RequestPredicates
import org.springframework.web.reactive.function.server.RouterFunction
import org.springframework.web.reactive.function.server.RouterFunctions
import org.springframework.web.reactive.function.server.ServerResponse

@Configuration
class RoutingConfiguration {
    @Bean
    fun routerFunction(): RouterFunction<ServerResponse> {
        return RouterFunctions.route(
                RequestPredicates.path("/api/**")
                    .or(RequestPredicates.path("/oauth2/authorization/**"))
                    .or(RequestPredicates.path("/logout"))
                    .negate(),
                HandlerFunction { req ->
                    WebClient.create("http://localhost:1234/${req.path()}").method(req.method()
                            ?: HttpMethod.GET)
                            .exchange()
                            .flatMap { response ->
                                ServerResponse.status(response.statusCode())
                                        .headers {
                                            response.headers().asHttpHeaders().forEach { key, values ->
                                                it[key] = values
                                            }
                                        }
                                        .body(BodyInserters.fromPublisher(response.bodyToMono(String::class.java), String::class.java))
                            }
                }
        )
    }
}
