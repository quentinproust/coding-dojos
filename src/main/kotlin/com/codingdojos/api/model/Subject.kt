package com.codingdojos.api.model

import java.time.LocalDate
import java.util.*

data class Subject(
        val id: String = UUID.randomUUID().toString(),
        val active: Boolean = true,
        val theme: String,
        val interested: List<String> = emptyList()
)
