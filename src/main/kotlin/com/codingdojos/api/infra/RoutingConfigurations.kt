package com.codingdojos.api.infra

import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.Resource
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.server.HandlerFunction
import org.springframework.web.reactive.function.server.RequestPredicates
import org.springframework.web.reactive.function.server.RequestPredicates.GET
import org.springframework.web.reactive.function.server.RouterFunction
import org.springframework.web.reactive.function.server.RouterFunctions
import org.springframework.web.reactive.function.server.ServerResponse
import org.springframework.web.reactive.function.server.RequestPredicates.contentType
import org.springframework.web.reactive.function.server.RouterFunctions.route
import org.springframework.web.reactive.function.server.ServerResponse.ok
import org.springframework.core.io.ClassPathResource
import org.springframework.web.reactive.function.server.RouterFunctions.resources


@Configuration
class RoutingConfiguration {
    @Value("\${application.client.location}")
    lateinit var clientLocation: String

    val notApi = RequestPredicates.path("/api/**")
        .or(RequestPredicates.path("/oauth2/authorization/**"))
        .or(RequestPredicates.path("/logout"))
        .negate();

    @ConditionalOnProperty(name = ["application.client.from-parcel"], havingValue = "true")
    @Bean
    fun routerFunction(): RouterFunction<ServerResponse> {
        return RouterFunctions.route(
            notApi,
            HandlerFunction { req ->
                WebClient.create("$clientLocation/${req.path()}").method(req.method()
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

    @ConditionalOnProperty(name = ["application.client.from-parcel"], havingValue = "false", matchIfMissing = true)
    @Bean
    fun htmlRouter(@Value("classpath:/public/client/index.html") html: Resource): RouterFunction<ServerResponse> {
        val assets = resources("/*.*", ClassPathResource("public/client/"))
        val pages = route(notApi, HandlerFunction {
            ok().contentType(MediaType.TEXT_HTML).syncBody(html)
        })

        return assets.and(pages)
    }
}
