pipeline {
    agent any

    stages {
        stage('Build React Apps') {
            steps {
                script {
                    def reactApps = [
                        'shop-app',
                        'react-keycloak-app',
                        'product-app',
                        'my-login-app',
                        'keycloak',
                        'admin-app'
                    ]

                    for (app in reactApps) {
                        dir(app) {
                            echo "🔧 Building ${app}"
                            bat 'npm install'
                            bat 'set CI=false && npm run build'
                        }
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t frontend-app .'
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Deploying application...'
                // Add your deployment steps here
            }
        }
    }
}
