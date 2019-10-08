package com.codingdojos.api.controller

import com.codingdojos.api.model.DatePoll
import com.codingdojos.api.model.Dojo
import com.codingdojos.api.repository.DojoReactiveRepository
import com.codingdojos.api.service.user.UserInfoService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.context.ReactiveSecurityContextHolder
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.core.publisher.toFlux
import java.util.*


@RestController
@RequestMapping("/api/dojos")
class DojoController @Autowired constructor(
    val dojoRepository: DojoReactiveRepository,
    val userInfoService: UserInfoService
) {
    val logger = LoggerFactory.getLogger(DojoController::class.java)

    @GetMapping
    fun list(): Flux<Dojo> {
        logger.info("Get dojos")

        return ReactiveSecurityContextHolder.getContext()
            .map {
                logger.info("Context {}", it)
                it
            }
            .map { Optional.of(it.authentication) }
            .defaultIfEmpty(Optional.empty())
            .toFlux()
            .flatMap { auth ->
                logger.info("Authentication {}", auth)

                dojoRepository.findAll().map {
                    val isAdmin: Boolean = false
                    if (!isAdmin) {
                        val copy: DatePoll? = it.poll?.copy(adminDatePollUrl = "")
                        return@map it.copy(poll = copy)
                    }
                    it
                }
            }
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
