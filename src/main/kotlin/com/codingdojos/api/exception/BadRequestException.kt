package com.codingdojos.api.exception

class BadRequestException : RuntimeException {

    val code: String

    constructor(code: String) : super() {
        this.code = code
    }

    constructor(message: String, cause: Throwable, code: String) : super(message, cause) {
        this.code = code
    }

    constructor(message: String, code: String) : super(message) {
        this.code = code
    }

    constructor(cause: Throwable, code: String) : super(cause) {
        this.code = code
    }
}
