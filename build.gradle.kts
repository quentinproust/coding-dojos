import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.springframework.boot.gradle.tasks.bundling.BootJar

plugins {
	id("org.springframework.boot") version "2.1.6.RELEASE"
	id("io.spring.dependency-management") version "1.0.7.RELEASE"
	kotlin("jvm") version "1.2.71"
	kotlin("plugin.spring") version "1.2.71"
}

java.sourceCompatibility = JavaVersion.VERSION_1_8

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-actuator")
	implementation("org.springframework.boot:spring-boot-starter-data-mongodb-reactive")
	implementation("org.springframework.boot:spring-boot-starter-webflux")
	implementation("org.springframework.boot:spring-boot-starter-security")

	// see : https://www.baeldung.com/spring-security-5-oauth2-login
	// https://www.baeldung.com/spring-oauth-login-webflux
	implementation("org.springframework.security:spring-security-oauth2-client")

    implementation("com.auth0:java-jwt:3.8.3")

	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")

	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("io.projectreactor:reactor-test")
}

tasks.withType<KotlinCompile> {
	kotlinOptions {
		freeCompilerArgs = listOf("-Xjsr305=strict")
		jvmTarget = "1.8"
	}
}

val copyClientBuild = tasks.register("copyClientBuild", Copy::class) {
    group = "other"
    description = "Copy client dist in public resources"
    dependsOn("client:build")
    from("client/dist") {
        include("*/**")
    }
    into("${project.buildDir}/resources/main/public/client")
}

tasks.named("bootJar", BootJar::class) {
    dependsOn(copyClientBuild)
    archiveVersion.set("")
    launchScript()
}
