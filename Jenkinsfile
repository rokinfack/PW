pipeline {
    agent any

    environment {
        PROJECT_NAME       = "Stromae Devis/Commande Integ"
        NPM_CONFIG_CACHE   = "${WORKSPACE}/npm-cache"
        DOCKER_IMAGE       = 'playwright-tests:latest'
        MAILING_LIST       = 'rostand@test.com'
        FIREFOX_REPORT_NAME= 'Rapport-de-test-firefox'
        CHROME_REPORT_NAME = 'Rapport-de-test-chrome'
        EDGE_REPORT_NAME   = 'Rapport-de-test-edge'
        REPORT_DIR         = "${WORKSPACE}/playwright-report"
    }

    stages {
        stage('Build Docker Image') {
            steps {
                echo "Building Docker image for Playwright tests"
                sh "docker build -t ${DOCKER_IMAGE} ."
            }
        }

        stage('Run Playwright Tests in Docker') {
            parallel {
                stage('Run with Firefox') {
                    steps {
                        sh """
                            docker run --rm \
                                -v /var/run/docker.sock:/var/run/docker.sock \
                                -v ${WORKSPACE}:/app \
                                ${DOCKER_IMAGE} \
                                npx playwright test --browser=firefox --reporter=html,allure-playwright
                        """
                    }
                }

                stage('Run with Chrome') {
                    steps {
                        sh """
                            docker run --rm \
                                -v /var/run/docker.sock:/var/run/docker.sock \
                                -v ${WORKSPACE}:/app \
                                ${DOCKER_IMAGE} \
                                npx playwright test --browser=chromium --reporter=html,allure-playwright
                        """
                    }
                }

                stage('Run with Edge') {
                    steps {
                        sh """
                            docker run --rm \
                                -v /var/run/docker.sock:/var/run/docker.sock \
                                -v ${WORKSPACE}:/app \
                                ${DOCKER_IMAGE} \
                                npx playwright test --browser=msedge --reporter=html,allure-playwright
                        """
                    }
                }
            }
        }

        stage('Publish Reports') {
            steps {
                echo "Publishing Playwright HTML reports"
                publishHTML(
                    target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Rapport Playwright'
                    ]
                )
            }
        }
    }

    post {
        always {
            script {
                def status = currentBuild.resultIsBetterOrEqualTo('SUCCESS') ? 'SUCCES ✅' : 'ECHEC ❌'
                emailext(
                    to: MAILING_LIST,
                    subject: "[${PROJECT_NAME}] - Résultats des tests E2E | [${status}]",
                    body: """
                        <h2>Rapport Playwright</h2>
                        <p>Les tests sont terminés. Consultez Jenkins pour le rapport détaillé.</p>
                    """,
                    attachLog: true,
                    mimeType: 'text/html'
                )
            }
        }
    }
}
