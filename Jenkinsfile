pipeline {
  agent any

  environment {
    BASE_URL = 'https://rahulshettyacademy.com/client/'
    API_BASE_URL = 'https://rahulshettyacademy.com/api/ecom'
    PRODUCT_NAME = 'ZARA COAT 3'
    COUNTRY = 'India'
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install') {
      steps {
        sh 'npm install'
        sh 'npx playwright install --with-deps'
      }
    }

    stage('Test') {
      steps {
        withCredentials([
          usernamePassword(
            credentialsId: 'rahulshetty-test-user',
            usernameVariable: 'USER_EMAIL',
            passwordVariable: 'USER_PASSWORD'
          )
        ]) {
          sh 'npm test'
        }
      }
    }
  }

  post {
    always {
      sh 'npm run dashboard || true'
      archiveArtifacts artifacts: 'playwright-report/**,test-results/**,docs/**', allowEmptyArchive: true
    }
  }
}
