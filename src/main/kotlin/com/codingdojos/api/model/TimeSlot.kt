package com.codingdojos.api.model

import java.time.LocalDate
import java.util.*

data class TimeSlot(
        val id: String = UUID.randomUUID().toString(),
        val date: LocalDate,
        val timeSlot: String?,
        val votes: List<TimeSlotVote> = emptyList()
)
