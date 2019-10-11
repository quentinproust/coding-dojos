package com.codingdojos.api.controller

import com.codingdojos.api.extensions.ReactiveSecurityContextHolder
import com.codingdojos.api.infra.ADMIN_AUTHORITY
import com.codingdojos.api.model.DatePoll
import com.codingdojos.api.model.Dojo
import com.codingdojos.api.repository.DojoReactiveRepository
import com.codingdojos.api.service.user.UserInfoService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono


@RestController
@RequestMapping("/api/dojos")
class DojoController @Autowired constructor(
    val dojoRepository: DojoReactiveRepository,
    val userInfoService: UserInfoService
) {
    val logger = LoggerFactory.getLogger(DojoController::class.java)

    @GetMapping
    fun list(): Flux<Dojo> {
        return ReactiveSecurityContextHolder.getAuthentication()
            .flatMapMany { auth ->
                dojoRepository.findAll().map {
                    val isAdmin = auth.map { it.authorities.contains(ADMIN_AUTHORITY) }.orElse(false)
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

}
