package com.codingdojos.api.model

import java.time.LocalDate
import java.util.*

data class Dojo(
        val id: String = UUID.randomUUID().toString(),
        val status: DojoStatus = DojoStatus.Proposed,
        val theme: String,
        val location: String,
        val date: LocalDate? = null,
        val timeSlot: String? = null,
        val interested: List<InterestedVote> = emptyList(),
        val poll: DatePoll? = null
)
