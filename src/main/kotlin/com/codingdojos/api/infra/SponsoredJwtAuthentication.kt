package com.codingdojos.api.infra

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTCreator
import com.auth0.jwt.algorithms.Algorithm
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.authentication.ReactiveAuthenticationManager
import org.springframework.security.core.authority.AuthorityUtils
import org.springframework.security.web.server.authentication.AuthenticationWebFilter
import org.springframework.security.web.server.context.WebSessionServerSecurityContextRepository
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import java.security.KeyFactory
import java.security.interfaces.RSAPrivateKey
import java.security.interfaces.RSAPublicKey
import java.security.spec.PKCS8EncodedKeySpec
import java.security.spec.X509EncodedKeySpec
import java.util.*

@Service
class JwtAuthentificationService(
    val sponsoredUserJwtConverter: SponsoredUserJwtConverter
) {
    fun getToken(user: SponsoredUser): String {
        return sponsoredUserJwtConverter.toJwt(user)
    }

    fun getAuthentication(user: SponsoredUser): SponsoredJwtAuthentication {
        val token = sponsoredUserJwtConverter.toJwt(user)
        return SponsoredJwtAuthentication(user, token)
    }

    fun fromToken(token: String): SponsoredJwtAuthentication {
        val user = sponsoredUserJwtConverter.fromJwt(token)
        return SponsoredJwtAuthentication(user, token)
    }
}


// Note : https://www.baeldung.com/spring-security-multiple-auth-providers
// https://www.baeldung.com/spring-webflux-filters

fun sponsoredAuthenticationFilterFactory(
    jwtAuthentificationService: JwtAuthentificationService
): AuthenticationWebFilter {
    val authenticationManager = ReactiveAuthenticationManager { Mono.just(it) }

    return AuthenticationWebFilter(authenticationManager).apply {
        setServerAuthenticationConverter { exchange ->
            val token = exchange.request.queryParams["token"]?.firstOrNull()
                ?: throw RuntimeException("No token found in request")

            val authentication = jwtAuthentificationService.fromToken(token)
            Mono.just(authentication)
        }
        setRequiresAuthenticationMatcher { exchange ->
            ServerWebExchangeMatchers.pathMatchers("/sponsored/login/**").matches(exchange)
        }
        setSecurityContextRepository(WebSessionServerSecurityContextRepository())
    }
}

class SponsoredJwtAuthentication(
    val sponsoredUser: SponsoredUser,
    val jwtToken: String
) : AbstractAuthenticationToken(AuthorityUtils.NO_AUTHORITIES) {
    override fun getCredentials() = jwtToken

    override fun getPrincipal() = sponsoredUser
}

data class SponsoredUser(
    val email: String,
    val name: String? = null,
    val company: String? = null
) {
    fun toJwt(): JWTCreator.Builder {
        return JWT.create()
            .withIssuer("auth0")
    }
}

/**
 * See https://github.com/auth0/java-jwt
 */
@Service
class SponsoredUserJwtConverter(
    @Value("\${sponsored.public-key}") publicKeyB64: String,
    @Value("\${sponsored.private-key}") privateKeyB64: String,
    @Value("\${application.env}") env: String,
    @Value("\${application.name}") appName: String
) {
    val algorithm = getAlgorithm(publicKeyB64, privateKeyB64)
    val issuer = "$appName-$env"

    fun toJwt(user: SponsoredUser): String {
        return JWT.create()
            .withIssuer(issuer)
            .withSubject(user.email)
            .let { jwt ->
                user.company?.let { jwt.withClaim("company", it) } ?: jwt
            }.let { jwt ->
                user.name?.let { jwt.withClaim("name", it) } ?: jwt
            }
            .sign(algorithm)
    }

    fun fromJwt(token: String): SponsoredUser {
        val verifier = JWT.require(algorithm)
            .withIssuer(issuer)
            .build() //Reusable verifier instance
        val jwt = verifier.verify(token)

        return SponsoredUser(
            email = jwt.subject,
            name = jwt.claims["name"]?.asString(),
            company = jwt.claims["company"]?.asString()
        )
    }
}

/**
 * See https://www.novixys.com/blog/how-to-generate-rsa-keys-java/
 */
fun getAlgorithm(publicKeyB64: String, privateKeyB64: String): Algorithm {
    val decoder = Base64.getDecoder()

    val rsaKeyFactory = KeyFactory.getInstance("RSA")

    val privateKeySpec = PKCS8EncodedKeySpec(decoder.decode(privateKeyB64))

    val privateKey = rsaKeyFactory.generatePrivate(privateKeySpec)

    val publicKeySpec = X509EncodedKeySpec(decoder.decode(publicKeyB64))
    val publicKey = rsaKeyFactory.generatePublic(publicKeySpec)

    return Algorithm.RSA256(publicKey as RSAPublicKey, privateKey as RSAPrivateKey)
}
