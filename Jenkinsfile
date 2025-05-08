// Jenkinsfile
pipeline {
  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
metadata:
  labels:
    app: playwright
spec:
  containers:
    - name: playwright
      image: mcr.microsoft.com/playwright:v1.43.1-jammy
      command: ["cat"]
      tty: true
      volumeMounts:
        - name: results
          mountPath: /app/test-results
        - name: allure
          mountPath: /app/allure-results
  volumes:
    - name: results
      emptyDir: {}
    - name: allure
      emptyDir: {}
"""
    }
  }

  environment {
    CI_BASE_URL = 'http://localhost:3000' // change si besoin
  }

  stages {
    stage('Install dependencies') {
      steps {
        container('playwright') {
          sh '''
            npm ci --legacy-peer-deps
            npx playwright install --with-deps
          '''
        }
      }
    }

    stage('Run Playwright tests') {
      steps {
        container('playwright') {
          sh 'npx playwright test'
        }
      }
    }

    stage('Publish test results') {
      steps {
        container('playwright') {
          junit 'test-results/results.xml'
          allure includeProperties: false, results: [[path: 'allure-results']]
        }
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}
