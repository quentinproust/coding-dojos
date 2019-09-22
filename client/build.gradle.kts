plugins {
	id("com.moowork.node") version "1.3.1"
}

node {
    download = true
    version = "12.10.0"
    npmVersion = "6.10.3"
    workDir = file("${project.buildDir}/nodejs")
    npmWorkDir = file("${project.buildDir}/npm")
    nodeModulesDir = file("${project.projectDir}")
}

tasks.register("build") {
    group = "Build"
    description = "Build client project"
    dependsOn("npm_run_build-prod")
}

tasks.register("run") {
    group = "Run"
    description = "Run client project"
    dependsOn("npm_run_start")
}
