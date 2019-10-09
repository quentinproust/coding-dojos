package com.codingdojos.api.controller

import com.codingdojos.api.infra.JwtAuthentificationService
import com.codingdojos.api.infra.SponsoredUser
import com.fasterxml.jackson.databind.node.JsonNodeFactory
import com.fasterxml.jackson.databind.node.ObjectNode
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*


@RestController
class SponsoredController(
    val jwtAuthService: JwtAuthentificationService
) {

    @GetMapping("/sponsored/login")
    fun login(@RequestParam token: String): ResponseEntity<Any> {
        val headers = HttpHeaders()
        headers.add("Location", "/")
        return ResponseEntity(headers, HttpStatus.FOUND)
    }

    @PostMapping("/api/sponsored_token")
    fun generateToken(@RequestBody sponsoredUser: SponsoredUser): ResponseEntity<ObjectNode> {
        val token = jwtAuthService.getToken(sponsoredUser)

        return ResponseEntity.ok(
            JsonNodeFactory.instance.objectNode().put("token", token)
        )
    }

}
