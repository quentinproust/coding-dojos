package com.codingdojos.api.controller

import com.codingdojos.api.extensions.ReactiveSecurityContextHolder
import com.codingdojos.api.infra.Capability
import com.codingdojos.api.model.DatePoll
import com.codingdojos.api.model.Dojo
import com.codingdojos.api.model.Subject
import com.codingdojos.api.repository.DojoReactiveRepository
import com.codingdojos.api.repository.SubjectReactiveRepository
import com.codingdojos.api.service.user.UserInfoService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.core.publisher.toFlux
import reactor.util.function.Tuple2
import java.util.*


@RestController
@RequestMapping("/api/dojos")
class DojoController @Autowired constructor(
    val dojoRepository: DojoReactiveRepository,
    val subjectRepository: SubjectReactiveRepository
) {
    val logger = LoggerFactory.getLogger(DojoController::class.java)

    @GetMapping
    fun list(): Flux<Dojo> {
        return ReactiveSecurityContextHolder.getAuthentication()
            .flatMapMany { auth ->
                dojoRepository.findAll().map {
                    val isAdmin = auth.map { it.authorities.contains(Capability.ADMIN.authority) }.orElse(false)
                    if (!isAdmin) {
                        val copy: DatePoll? = it.poll?.copy(adminDatePollUrl = "")
                        return@map it.copy(poll = copy)
                    }
                    it
                }
            }
    }

    @GetMapping("/{id}")
    fun get(@PathVariable id: String): Mono<Dojo> {
        return dojoRepository.findById(id)
    }

    @PostMapping
    fun create(@RequestBody dojo: Dojo): Mono<Dojo> {
        return dojoRepository.save(dojo)
    }

    @PostMapping(value = ["/{dojoId}/subject/affect/{subjectId}"])
    fun affectSubject ( @PathVariable dojoId: String, @PathVariable subjectId: String) :Mono<Dojo> {
        // TODO ONly for admin

        return Mono.zip(dojoRepository.findById(dojoId), subjectRepository.findById(subjectId))
        { t: Dojo, u: Subject? ->
            if (u == null) {
                //exeception 400 l'id xx subject inconnu        TODO
            }
            if (t == null) {
                //exeception 400 l'id xx dojo inconnu           TODO
            }
            if (t.subject === null) {
                //exception 400 le Dojo a deja un sujet            TODO
            }

            return@zip t.copy(subject = u)
        }.flatMap {
            dojoRepository.save(it)

        }.flatMap {dojo ->
            subjectRepository.deleteById(subjectId).map {
                return@map dojo
            }

        }
    }


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

}
