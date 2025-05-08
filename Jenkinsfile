pipeline {
  agent { label 'docker' } // pour build/push l’image

  environment {
    IMAGE_TAG = "${BUILD_NUMBER}"
    IMAGE_NAME = "kinfack/playwright-ci:${IMAGE_TAG}"
  }

  stages {
    stage('Build and Push Docker Image') {
      steps {
        sh './docker-build-push.sh ${IMAGE_TAG}'
      }
    }

    stage('Run Tests in Kubernetes') {
      agent {
        kubernetes {
          yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
    - name: playwright
      image: ${IMAGE_NAME}
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
      steps {
        container('playwright') {
          sh 'npx playwright test'
        }
      }
    }

   stage('Publish Results') {
  steps {
    container('playwright') {
      junit 'test-results/results.xml'
      allure([
        includeProperties: false,
        results: [[path: 'allure-results']]
      ])
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
