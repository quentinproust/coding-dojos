package com.codingdojos.api.extensions

import reactor.core.publisher.Mono
import reactor.core.publisher.switchIfEmpty
import java.util.*

fun <T> Mono<T>.toOptional() : Mono<Optional<T>> {
    return this.map { Optional.of(it) }
        .switchIfEmpty { Mono.just(Optional.empty()) }
}

fun <T, Y> Mono<T>.toOptional(mapper: (T) -> Y) : Mono<Optional<Y>> {
    return this.map { mapper.invoke(it) }
        .map { Optional.of(it) }
        .switchIfEmpty { Mono.just(Optional.empty()) }
}
