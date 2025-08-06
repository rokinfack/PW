pipeline {
    agent any

    environment {
        PROJECT_NAME = "Stromae Devis/Commande Integ"
        NPM_CONFIG_CACHE = "${WORKSPACE}/npm-cache"
        DOCKER_IMAGE = 'playwright-tests:latest'
        MAILING_LIST = 'test@google.com'
        FIREFOX_REPORT_NAME = 'Rapport-de-test-firefox'
        CHROME_REPORT_NAME = 'Rapport-de-test-chrome'
        EDGE_REPORT_NAME = 'Rapport-de-test-edge'
    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    withEnv(['DOCKER_HOST=']) {
                        sh "docker build --no-cache -t ${DOCKER_IMAGE} ."
                    }
                }
            }
        }

        stage('Run Playwright Tests') {
            parallel {
                stage('Run with firefox') {
                    steps {
                        script {
                            docker.image(DOCKER_IMAGE).inside("-u root -e ENVIRONNEMENT=integ -e BROWSER=firefox -e RUNNER=2") {
                                sh "npm run test:allure1"
                            }
                        }
                    }
                }
                stage('Run with Edge') {
                    steps {
                        script {
                            docker.image(DOCKER_IMAGE).inside("-u root -e ENVIRONNEMENT=integ -e BROWSER=edge -e RUNNER=2") {
                                sh "npm run test:allure1"
                            }
                        }
                    }
                }
              stage('Run with Chrome') {
                steps {
                  withCredentials([file(credentialsId: 'env-file', variable: 'ENV_FILE')]) {
                 script {
                     docker.image(DOCKER_IMAGE).inside("-u root -e ENVIRONNEMENT=integ -e BROWSER=chrome -e RUNNER=2") {
                    // Copier le fichier .env dans le conteneur
                      sh "cp ${ENV_FILE} .env"
                      sh 'ls -l .env'
                    sh "npm run test:allure2"
                }
            }
        }
    }
}

            }
        }

        stage('Generate Allure & HTML Reports') {
            steps {
                script {
                    docker.image(DOCKER_IMAGE).inside("-u root") {
                        // Générer le rapport Allure
                        sh "npx allure generate allure-results --clean -o allure-report || true"
                        sh "ls -la allure-report || true"

                        // Générer le rapport HTML Playwright
                        sh "npx playwright show-report --output playwright-report || true"
                        sh "ls -la playwright-report || true"
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                // Publication des rapports HTML dans Jenkins
                publishHTML (
                    target : [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: CHROME_REPORT_NAME,
                        reportTitles: 'Rapport de test Chrome'
                    ]
                )
                publishHTML (
                    target : [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: FIREFOX_REPORT_NAME,
                        reportTitles: 'Rapport de test Firefox'
                    ]
                )
                publishHTML (
                    target : [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: EDGE_REPORT_NAME,
                        reportTitles: 'Rapport de test Edge'
                    ]
                )

                // Envoi email de résumé
                def status = currentBuild.resultIsBetterOrEqualTo('SUCCESS') ? 'SUCCES ✅' : 'ECHEC ❌'
                emailext (
                    to: "${MAILING_LIST}",
                    subject: "[${PROJECT_NAME}] - Résultats des tests E2E | [${status}]",
                    body: """
                        Salut l'équipe, <br/><br/>
                        Les tests E2E pour ${PROJECT_NAME} sont terminés. Vous pouvez consulter les rapports : <br/><br/>
                        <ul>
                            <li>Firefox: <a href='${BUILD_URL}${FIREFOX_REPORT_NAME}'>Voir le rapport</a></li>
                            <li>Chrome: <a href='${BUILD_URL}${CHROME_REPORT_NAME}'>Voir le rapport</a></li>
                            <li>Edge: <a href='${BUILD_URL}${EDGE_REPORT_NAME}'>Voir le rapport</a></li>
                        </ul><br/><br/>
                        Bonne journée à tous !
                    """,
                    attachLog: true,
                    mimeType: 'text/html'
                )
            }
        }
    }
}
