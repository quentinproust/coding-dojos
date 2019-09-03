package com.codingdojos.api.controller

import com.codingdojos.api.controller.io.NewDojo
import com.codingdojos.api.model.Dojo
import com.codingdojos.api.model.InterestedVote
import com.codingdojos.api.repository.DojoReactiveRepository
import com.codingdojos.api.service.user.UserInfoService
import com.fasterxml.jackson.databind.JsonNode
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient
import org.springframework.web.bind.annotation.GetMapping
import reactor.util.function.Tuple2


@RestController
@RequestMapping("/api/dojos")
class DojoController @Autowired constructor(
        val dojoRepository: DojoReactiveRepository,
        val userInfoService: UserInfoService
) {

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

    @PostMapping("/{dojoId}/interests")
    fun interested(
            @PathVariable dojoId: String,
            @RequestBody payload: JsonNode,
            @RegisteredOAuth2AuthorizedClient client: OAuth2AuthorizedClient
    ): Mono<Dojo> {
        val interested = payload.get("interested").asBoolean()

        return dojoRepository.findById(dojoId)
                .switchIfEmpty(Mono.error<Dojo>(RuntimeException("No dojo found for $dojoId")))
                .zipWith(userInfoService.of(client))
                .flatMap { (dojo, user) ->
                    dojoRepository.save(dojo.copy(interested = dojo.interested
                            .filter { it.name != user.name }
                            .plus(InterestedVote(
                                    name = user.name,
                                    interested = interested
                            ))))
                }
    }
}

private operator fun <T1, T2> Tuple2<T1, T2>.component1(): T1 = this.t1
private operator fun <T1, T2> Tuple2<T1, T2>.component2(): T2 = this.t2
