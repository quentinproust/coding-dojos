import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import java.security.KeyPairGenerator
import java.security.interfaces.RSAPrivateKey
import java.security.interfaces.RSAPublicKey
import java.util.*

fun main(args: Array<String>) {
    val kpg = KeyPairGenerator.getInstance("RSA")

    kpg.initialize(2048)
    val kp = kpg.generateKeyPair()

    val pub = kp.public
    val pvt = kp.private

    val encoder = Base64.getEncoder()

    println("-----BEGIN RSA PRIVATE KEY-----")
    println(encoder.encodeToString(pvt.encoded))
    println("-----END RSA PRIVATE KEY-----")

    println("-----BEGIN RSA PUBLIC KEY-----")
    println(encoder.encodeToString(pub.encoded))
    println("-----END RSA PUBLIC KEY-----")

    val algorithm = Algorithm.RSA256(pub as RSAPublicKey, pvt as RSAPrivateKey);

    val token = JWT.create()
        .withIssuer("serli.codingdojo")
        .sign(algorithm)

    println("JWT Token : $token")

    val verifier = JWT.require(algorithm)
        .withIssuer("serli.codingdojo")
        .build() //Reusable verifier instance
    val jwt = verifier.verify(token)

    println("Decoded Jwt : $jwt")
}
