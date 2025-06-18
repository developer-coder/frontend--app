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
                        'admin-app'
                    ]

                    for (app in reactApps) {
                        dir("${app}") {
                            echo "🔧 Building ${app}"
                            bat 'npm install'

                            // Extra safety for admin-app to avoid keycloak-js error
                            if (app == 'admin-app') {
                                echo "📦 Ensuring keycloak-js is installed for admin-app"
                                bat 'npm install keycloak-js'
                            }

                            bat 'npx cross-env CI=false npm run build'
                        }
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                bat 'docker build -t frontend-app .'
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Deploying application...'
                bat 'docker stop frontend-container || exit 0'
                bat 'docker rm frontend-container || exit 0'
                bat 'docker run -d -p 8091:80 --name frontend-container frontend-app'
            }
        }
    }
}
