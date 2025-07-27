pipeline {
    agent {
        label 'jenkinsqa'
    }

    environment {
        PROJECT_NAME = "Stromae Devis/Commande Integ"
        NPM_CONFIG_CACHE = "${WORKSPACE}/npm-cache"
        DOCKER_IMAGE = 'playwright-tests:latest'
        MAILING_LIST = 'f.zengue.ext@hubone.fr'
        FIREFOX_REPORT_NAME = 'Rapport-de-test-firefox'
        CHROME_REPORT_NAME = 'Rapport-de-test-chrome'
        EDGE_REPORT_NAME = 'Rapport-de-test-edge'
    }

    stages {
        stage('Test Simple Shell') {
            steps {
                echo "Testing simple shell commands"
                sh 'echo "Hello from shell"'
                sh 'ls -la ${WORKSPACE}'
            }
        }

        stage('Remove Docker Images') {
            steps {
                echo "Listing Docker images"
                sh 'docker images || true'
                echo "Removing Docker image if exists"
                sh 'docker rmi ${DOCKER_IMAGE} || true'
                echo "Pruning Docker builder"
                sh 'yes | docker buildx prune -a || true'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image"
                script {
                    sh "docker build --no-cache -t ${DOCKER_IMAGE} ."
                }
            }
        }

        stage('Run Playwright Tests') {
            parallel {
                stage('Run with Firefox') {
                    steps {
                        script {
                            echo "Running tests with Firefox"
                             sh 'npx playwright test --project=firefox'
                        }
                    }
                }

                stage('Run with Edge') {
                    steps {
                        script {
                            echo "Running tests with Edge"
                             sh 'npx playwright test --project=firefox'
                        }
                    }
                }

                stage('Run with Chrome') {
                    steps {
                        script {
                            echo "Running tests with Chrome"
                             sh 'npx playwright test --project=firefox'
                        }
                    }
                }
            }
        }

        stage('Debug Report Directories') {
            steps {
                echo "Listing reports directories"
                sh 'ls -l ${WORKSPACE}/reports || echo "No Chrome reports found"'
                sh 'ls -l ${WORKSPACE}/reports || echo "No Firefox reports found"'
                sh 'ls -l ${WORKSPACE}/reports || echo "No Edge reports found"'
            }
        }
    }

    post {
        always {
            script {
                echo "Publishing HTML reports"
                publishHTML(target: [
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'reports',
                    reportFiles: 'results.html',
                    reportName: CHROME_REPORT_NAME,
                    reportTitles: 'Rapport de test Chrome'
                ])

                publishHTML(target: [
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'reports',
                    reportFiles: 'results.html',
                    reportName: FIREFOX_REPORT_NAME,
                    reportTitles: 'Rapport de test Firefox'
                ])

                publishHTML(target: [
                    allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'reports',
                    reportFiles: 'results.html',
                    reportName: EDGE_REPORT_NAME,
                    reportTitles: 'Rapport de test Edge'
                ])

                def status = currentBuild.resultIsBetterOrEqualTo('SUCCESS') ? 'SUCCES ✅' : 'ECHEC ❌'
                emailext(
                    to: MAILING_LIST,
                    subject: "[${PROJECT_NAME}] - Résultats des tests E2E | [${status}]",
                    body: """
                        Salut l'équipe, <br/><br/>
                        Les tests E2E pour ${PROJECT_NAME} sont terminés. Vous pouvez consulter les résultats détaillés via les liens ci-dessous : <br/><br/>
                        <h2>Rapport complet des tests :</h2>
                        <ul>
                            <li>Firefox: <a href='${BUILD_URL}${FIREFOX_REPORT_NAME}'>Voir le rapport</a></li>
                            <li>Chrome: <a href='${BUILD_URL}${CHROME_REPORT_NAME}'>Voir le rapport</a></li>
                            <li>Edge: <a href='${BUILD_URL}${EDGE_REPORT_NAME}'>Voir le rapport</a></li>
                        </ul><br/><br/>
                        N'hésitez pas à me faire signe si vous avez des questions ou besoin de plus de détails.<br/><br/>
                        Bonne journée à tous !<br/><br/>
                        Fred Zengue
                    """,
                    attachLog: true,
                    mimeType: 'text/html'
                )
            }
        }
    }
}
