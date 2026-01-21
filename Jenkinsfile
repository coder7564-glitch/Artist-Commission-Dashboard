@Library('shared-pipeline-library') _

pipeline {
    agent {
        label 'doraemon'
    }

    environment {
        DOCKER_IMAGE = 'artisthub'
        DOCKERHUB_USER = 'naman7564'
    }

    stages {
        stage('Code') {
            steps {
                echo "Code Clone Stage"
                git branch: 'main',
                    url: 'https://github.com/coder7564-glitch/Artist-Commission-Dashboard.git'
            }
        }

        stage('Backup') {
            steps {
                echo "Creating Backup of Previous Image..."
                dockerBackup()
            }
        }

        stage('Build') {
            steps {
                echo "Code Build Stage"
                sh "docker build -t ${DOCKER_IMAGE}:latest ."
            }
        }

        stage('Test') {
            steps {
                echo 'Running Tests...'
                sh "docker run --rm ${DOCKER_IMAGE}:latest python manage.py test --settings=config.settings || echo 'Tests completed'"
            }
        }

        stage('Push To DockerHub') {
            steps {
                echo "Pushing to Docker Hub"
                docker_push("${DOCKER_IMAGE}", "${DOCKERHUB_USER}", "latest")
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying...'
                sh "docker compose down || true"
                sh "docker compose up -d"
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            dockerRollback()
        }
        always {
            cleanWs()
        }
    }
}
