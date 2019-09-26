package com.codingdojos.api.controller

import com.codingdojos.api.model.DatePoll
import com.codingdojos.api.model.Dojo
import com.codingdojos.api.model.DojoStatus
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
import java.util.*
import javax.validation.Valid
import javax.validation.constraints.NotBlank


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
    fun create(@RequestBody dojo: Dojo): Mono<Dojo> {
        return dojoRepository.save(dojo)
    }

/* 
    @PutMapping
    fun save(@RequestBody dojo: Dojo): Mono<Dojo> {
        return dojoRepository.existsById(dojo.id)
            .flatMap { exists ->
                when (exists) {
                    true -> dojoRepository.save(dojo)
                    false -> Mono.error(RuntimeException("dojo ${dojo.id} was not found"))
                }
            }
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

    @PostMapping("/{dojoId}/external_date_poll")
fun saveExternalDatePoll(
        @PathVariable dojoId: String,
        @Valid @RequestBody payload: ExternalDatePollInput
    ): Mono<Dojo> {
        return dojoRepository.findById(dojoId)
            .switchIfEmpty(Mono.error<Dojo>(RuntimeException("No dojo found for $dojoId")))
            .flatMap {
                dojoRepository.save(it.copy(
                    status = DojoStatus.PollInProgress,
                    poll = DatePoll(externalDatePoll = payload.uri)
                ))
            }
    }

    data class ExternalDatePollInput(
        @NotBlank
        val uri: String
    )

    @PostMapping("/{dojoId}/time_slot")
    fun saveTimeSlot(
        @PathVariable dojoId: String,
        @Valid @RequestBody payload: TimeSlotInput
    ): Mono<Dojo> {
        return dojoRepository.findById(dojoId)
            .switchIfEmpty(Mono.error<Dojo>(RuntimeException("No dojo found for $dojoId")))
            .flatMap {
                dojoRepository.save(it.copy(
                    status = DojoStatus.Scheduled,
                    timeSlot = payload.timeSlot
                ))
            }
    }

    data class TimeSlotInput(
        @NotBlank
        val timeSlot: String
    )
    */
}
