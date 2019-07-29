package com.codingdojos.api.controller.io

import java.util.*

data class NewDojo(
        val id: String = UUID.randomUUID().toString(),
        val theme: String,
        val location: String
)
