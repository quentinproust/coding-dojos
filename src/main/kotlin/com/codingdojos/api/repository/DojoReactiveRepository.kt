package com.codingdojos.api.repository

import com.codingdojos.api.model.Dojo
import org.springframework.data.mongodb.repository.ReactiveMongoRepository
import org.springframework.stereotype.Repository

@Repository
interface DojoReactiveRepository : ReactiveMongoRepository<Dojo, String>
