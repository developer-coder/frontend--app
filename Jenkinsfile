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
							bat 'npx cross-env CI=false npm run build'
                        }
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
			dir('frontend--app') {
            bat 'docker build -t frontend-app .'
        }
               
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
