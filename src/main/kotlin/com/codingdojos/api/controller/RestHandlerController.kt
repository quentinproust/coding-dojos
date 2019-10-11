package com.codingdojos.api.controller

import com.codingdojos.api.exception.BadRequestException
import org.springframework.http.HttpHeaders
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.http.HttpStatus
import org.springframework.web.context.request.WebRequest
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import java.util.*


@ControllerAdvice
class RestHandlerController {

    @ExceptionHandler(value = [( BadRequestException::class )])
    protected fun handleBadRequest(
        ex: BadRequestException, request: WebRequest): ResponseEntity<Any> {
        val bodyOfResponse = "This should be application specific ${ex.code}"
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Optional.ofNullable(bodyOfResponse))
    }
}
