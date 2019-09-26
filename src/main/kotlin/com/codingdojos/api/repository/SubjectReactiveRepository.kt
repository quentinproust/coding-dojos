package com.codingdojos.api.repository

import com.codingdojos.api.model.Subject
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository

@Repository
interface SubjectReactiveRepository : ReactiveMongoRepository<Subject, String>
