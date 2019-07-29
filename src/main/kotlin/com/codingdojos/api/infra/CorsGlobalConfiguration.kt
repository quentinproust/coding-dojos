package com.codingdojos.api.infra

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.config.CorsRegistry
import org.springframework.web.reactive.config.WebFluxConfigurer

@Configuration
class CorsGlobalConfiguration : WebFluxConfigurer {

    @Value("\${application.client.location}")
    lateinit var clientLocation: String

    override fun addCorsMappings(corsRegistry: CorsRegistry) {
        LoggerFactory.getLogger(CorsGlobalConfiguration::class.java).debug("Client Location : {}", clientLocation)

        if (clientLocation != "embedded") {
            corsRegistry.addMapping("/**")
                    .allowedOrigins(clientLocation)
                    .allowedMethods("*")
        }
    }
}
