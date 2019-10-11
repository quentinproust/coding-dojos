package com.codingdojos.api.controller

import com.codingdojos.api.model.DatePoll
import com.codingdojos.api.model.Subject
import com.codingdojos.api.repository.SubjectReactiveRepository
import com.codingdojos.api.service.user.UserInfoService
import com.fasterxml.jackson.databind.JsonNode
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient
import reactor.util.function.Tuple2
import java.util.*
import javax.validation.Valid
import javax.validation.constraints.NotBlank
import com.codingdojos.api.extensions.*
import com.codingdojos.api.model.toCoder


@RestController
@RequestMapping("/api/subjects")
class SubjectController @Autowired constructor(
    val subjectRepository: SubjectReactiveRepository
) {

    @GetMapping
    fun list(): Flux<Subject> {
        return subjectRepository.findAll()
    }

    @GetMapping("/{id}")
    fun get(@PathVariable id: String): Mono<Subject> {
        return subjectRepository.findById(id)
    }

    @PostMapping
    fun create(@RequestBody subject: Subject): Mono<Subject> {
        return subjectRepository.save(subject)
    }

    @PostMapping("/{subjectId}/interest") // FIXE ME pas toptop le path
    fun interest(
        @PathVariable subjectId: String
    ): Mono<Subject> {
        return subjectRepository.findById(subjectId)
            .switchIfEmpty(Mono.error<Subject>(RuntimeException("No subject found for $subjectId")))
            .zipWith(ReactiveSecurityContextHolder.getCurrentAuthentication())
            .flatMap { (subject, auth) ->
                val coder = auth.toCoder()

                val isAlreadyInList = subject.interested.any { it.sub == coder.sub }
                val newInterests = if (isAlreadyInList) {
                    subject.interested.filter { it.sub != coder.sub }
                } else {
                    subject.interested.plus(coder)
                }

                subjectRepository.save(subject.copy(interested = newInterests))
            }
    }

    @PutMapping
    fun save(@RequestBody subject: Subject): Mono<Subject> {
        return subjectRepository.existsById(subject.id)
            .flatMap { exists ->
                when (exists) {
                    true -> subjectRepository.save(subject)
                    false -> Mono.error(RuntimeException("subject ${subject.id} was not found"))
                }
            }
    }

    @DeleteMapping("/{subjectId}")
    fun deleteLogical(@PathVariable subjectId: String): Mono<Subject> {
        return subjectRepository.findById(subjectId)
            .switchIfEmpty(Mono.error<Subject>(RuntimeException("No subject found for $subjectId")))
            .flatMap {
                subjectRepository.save(it.copy(
                    active = false
                ))
            }
    }

}
