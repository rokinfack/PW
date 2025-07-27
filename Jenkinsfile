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
        stage('Remove Docker Images') {
            steps {
                sh 'docker images'
                sh 'docker rmi ${DOCKER_IMAGE} || true'
                sh 'yes | docker buildx prune -a'
            }
        }

        stage('Build Docker Image') {
            steps {
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
                            def myImage = docker.image(DOCKER_IMAGE)
                            myImage.inside("-u root -v ${WORKSPACE}/reports/firefox:/app/reports") {
                                sh 'export BROWSER=firefox && npm test'
                            }
                        }
                    }
                }

                stage('Run with Edge') {
                    steps {
                        script {
                            def myImage = docker.image(DOCKER_IMAGE)
                            myImage.inside("-u root -v ${WORKSPACE}/reports/edge:/app/reports") {
                                sh 'export BROWSER=edge && npm test'
                            }
                        }
                    }
                }

                stage('Run with Chrome') {
                    steps {
                        script {
                            def myImage = docker.image(DOCKER_IMAGE)
                            myImage.inside("-u root -v ${WORKSPACE}/reports/chrome:/app/reports") {
                                sh 'export BROWSER=chrome && npm test'
                            }
                        }
                    }
                }
            }
        }

        stage('Debug Report Directories') {
            steps {
                sh 'ls -l ${WORKSPACE}/reports/chrome || echo "No Chrome reports found"'
                sh 'ls -l ${WORKSPACE}/reports/firefox || echo "No Firefox reports found"'
                sh 'ls -l ${WORKSPACE}/reports/edge || echo "No Edge reports found"'
            }
        }
    }

    post {
        always {
            script {
                publishHTML(target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'reports/chrome',
                    reportFiles: 'results.html',
                    reportName: CHROME_REPORT_NAME,
                    reportTitles: 'Rapport de test Chrome'
                ])

                publishHTML(target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'reports/firefox',
                    reportFiles: 'results.html',
                    reportName: FIREFOX_REPORT_NAME,
                    reportTitles: 'Rapport de test Firefox'
                ])

                publishHTML(target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: 'reports/edge',
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
                        Les tests E2E pour ${PROJECT_NAME} sont terminés. Vous pouvez consulter les résultats détaillés via les liens ci-des_
