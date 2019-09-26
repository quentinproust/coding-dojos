package com.codingdojos.api.model

import java.time.LocalDate
import java.util.*

data class Dojo(
        val id: String = UUID.randomUUID().toString(),
        val label: String,
        val status: DojoStatus = DojoStatus.Proposed,
        val subject: Subject? = null,
        val location: String? = null,
        val date: LocalDate? = null,
        val poll: DatePoll? = null
)
