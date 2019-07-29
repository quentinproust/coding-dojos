package com.codingdojos.api.controller

import com.codingdojos.api.controller.io.NewDojo
import com.codingdojos.api.model.Dojo
import com.codingdojos.api.model.InterestedVote
import com.codingdojos.api.repository.DojoReactiveRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient
import org.springframework.security.oauth2.client.web.reactive.function.client.ServerOAuth2AuthorizedClientExchangeFilterFunction.oauth2AuthorizedClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.reactive.function.client.WebClient


@RestController
@RequestMapping("/api/dojos")
class DojoController {

    @Autowired
    lateinit var dojoRepository: DojoReactiveRepository

    @GetMapping
    fun list(): Flux<Dojo> {
        return dojoRepository.findAll()
    }

    @PostMapping
    fun create(@RequestBody dojo: NewDojo): Mono<Dojo> {
        return dojoRepository.save(Dojo(
                theme = dojo.theme,
                location = dojo.location
        ))
    }

    @PostMapping("/{:dojoId}/interests")
    fun interested(
            @PathVariable dojoId: String,
            @RequestBody interest: InterestedVote
    ): Mono<Dojo> {
        return dojoRepository.findById(dojoId)
                .switchIfEmpty(Mono.error<Dojo>(RuntimeException("No dojo found for ${dojoId}")))
                .flatMap {
                    dojoRepository.save(it.copy(interested = it.interested.plus(interest)))
                }
    }
/*
    @DeleteMapping("/{:dojoId}/interests/{:name}")
    fun removeInterested(
            @PathVariable("dojoId") dojoId: String,
            @PathVariable("name") name: String
    ): Mono<ResponseEntity<InterestedVote>> {
        return dojoRepository.findById(dojoId)
                .switchIfEmpty(Mono.error<Dojo>(RuntimeException("No dojo found for $dojoId")))
                .flatMap {dojo ->
                    dojoRepository.save(dojo.copy(interested = dojo.interested.filter { it.name != name }))
                }
                .map { ResponseEntity.noContent().build<InterestedVote>() }
    }
 */
}
