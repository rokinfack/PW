pipeline {
    agent any

    environment {
        PROJECT_NAME = "Stromae Devis/Commande Integ"
        NPM_CONFIG_CACHE = "${WORKSPACE}/npm-cache"
        DOCKER_IMAGE = 'playwright-tests:latest'
        BROWSERS_PATH = '/opt/appli/jenkinsSlave/workspace/playwright-browsers/browsers'
        MAILING_LIST = 'test@google.com'
        FIREFOX_REPORT_NAME = 'Rapport-de-test-firefox'
        CHROME_REPORT_NAME = 'Rapport-de-test-chrome'
        EDGE_REPORT_NAME = 'Rapport-de-test-edge'

    }
    stages {
        stage('Remove Docker Images') {
            steps {
               sh 'docker images'
               sh 'docker rmi ${DOCKER_IMAGE} | true'
               sh 'yes | docker buildx prune -a'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    // Construire l'image Docker
                    sh "docker build --no-cache -t ${DOCKER_IMAGE} ."
                }
            }
        }
        stage('Install dependancies') {
            steps {
                script {
                    def myImage = docker.image('playwright-tests:latest')
                        myImage.inside('-u root') {	
                            sh 'npm ci'		
                        }
                }
            }
        }
        stage('Run Playwright Tests') {
            parallel {
                stage('Run with firefox') {
                    steps {
                        script {
                            def myImage = docker.image('playwright-tests:latest')
                            myImage.inside("-u root  -e ENVIRONNEMENT=integ -e BROWSER=firefox -e RUNNER=2") {
                                sh "npm test"	
                            }
                        }
                    }
                }
                stage('Run with Edge') {
                   steps {
                        script {
                            def myImage = docker.image('playwright-tests:latest')
                            myImage.inside("-u root -v ${BROWSERS_PATH}:/opt -e ENVIRONNEMENT=integ -e BROWSER=edge -e RUNNER=2") {
                                sh "npm test:firefox"		
                            }
                        }
                    }
                }
                stage('Run with Chrome') {
                    steps {
                        script {
                            def myImage = docker.image('playwright-tests:latest')
                            myImage.inside("-u root -v ${BROWSERS_PATH}:/opt -e ENVIRONNEMENT=integ -e BROWSER=chrome -e RUNNER=2") {
                                	
                                sh "npm test:chrome"		
                            }
                        }
                    }
                }
                // stage('Run with Chromium') {
                //     steps {
                //         script {
                //             def myImage = docker.image('playwright-tests:latest')
                //             myImage.inside('-u root -e ENVIRONNEMENT=integ -e BROWSER=chromium -e RUNNER=1') {	
                //                 sh "npx cucumber-js --config=cucumber.js --retry 2 --tags \"@integ and \"@current"	
                //             }
                //         }
                //     }
                // }
            }
        }
    }
    post {
        always {
            script {
    //             // publishHTML (
    //             //     target : [
    //             //             allowMissing: false,
    //             //             alwaysLinkToLastBuild: true,
    //             //             keepAll: true,
    //             //             reportDir: 'reports/chromium',
    //             //             reportFiles: 'results.html',
    //             //             reportName: 'Rapport de test chromium',
    //             //             reportTitles: 'Rapport de test chromium'
    //             //     ]
    //             // )
                publishHTML (
                    target : [
                            allowMissing: false,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'playwright-report',
                            reportFiles: 'index.html',
                            reportName: CHROME_REPORT_NAME,
                            reportTitles: 'Rapport de test chrome'
                    ]
                )
                publishHTML (
                    target : [
                            allowMissing: false,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'playwright-report',
                            reportFiles: 'index.html',
                            reportName: FIREFOX_REPORT_NAME,
                            reportTitles: 'Rapport de test firefox'
                    ]
                )
                publishHTML (
                    target : [
                            allowMissing: false,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'playwright-report',
                            reportFiles: 'index.html',
                            reportName: EDGE_REPORT_NAME,
                            reportTitles: 'Rapport de test edge'
                    ]
                )

                def status = currentBuild.resultIsBetterOrEqualTo('SUCCESS') ? 'SUCCES ✅' : 'ECHEC ❌'
                emailext (
                    to: "${MAILING_LIST}",
                    subject: "[${PROJECT_NAME}] - Résultats des tests E2E | [${status}]",
                    body: """
                        Salut l'équipe, <br/><br/>

                        Les tests E2E pour ${PROJECT_NAME} sont terminés. Vous pouvez consulter les résultats détaillés via les liens ci-dessous : <br/><br/>

                        <h2>Rapport complet des tests: </h2>
                        <ul>
                            <li>Firefox: <a href='${BUILD_URL}${FIREFOX_REPORT_NAME}'>Voir le rapport</a></li>
                            <li>Chrome: <a href='${BUILD_URL}${CHROME_REPORT_NAME}'>Voir le rapport</a></li>
                            <li>Edge: <a href='${BUILD_URL}${EDGE_REPORT_NAME}'>Voir le rapport</a></li>
                        </ul><br/><br/>

                        N'hésitez pas à me faire signe si vous avez des questions ou si vous avez besoin de plus de détails.<br/><br/>

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
