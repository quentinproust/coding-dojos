package com.codingdojos.api.model

data class DatePoll(
    val externalDatePoll: String?,
    val timeSlots: List<TimeSlot> = emptyList()
)
