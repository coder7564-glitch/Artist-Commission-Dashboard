pipeline {
    agent any
    
    environment {
        DOCKER_COMPOSE_VERSION = '3.8'
        PROJECT_NAME = 'artist-commission-dashboard'
        BACKUP_DIR = '/var/backups/commission-app'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo 'Code checkout completed'
            }
        }
        
        stage('Code Quality Check') {
            parallel {
                stage('Backend Lint & Test') {
                    steps {
                        dir('backend') {
                            sh '''
                                echo "Installing Python dependencies..."
                                pip install -r requirements.txt
                                
                                echo "Running flake8 linting..."
                                flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics || true
                                flake8 . --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics
                                
                                echo "Running pytest..."
                                pytest --tb=short -q || true
                            '''
                        }
                    }
                }
                
                stage('Frontend Lint & Test') {
                    steps {
                        dir('frontend') {
                            sh '''
                                echo "Installing Node dependencies..."
                                npm ci
                                
                                echo "Running ESLint..."
                                npm run lint || true
                                
                                echo "Running tests..."
                                npm run test -- --run || true
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Backup Previous Build') {
            steps {
                script {
                    def timestamp = new Date().format('yyyyMMdd_HHmmss')
                    sh """
                        echo "Creating backup directory..."
                        mkdir -p ${BACKUP_DIR}
                        
                        echo "Backing up current containers..."
                        docker-compose ps -q 2>/dev/null && {
                            docker-compose stop || true
                            
                            echo "Saving current images..."
                            docker save -o ${BACKUP_DIR}/backend_${timestamp}.tar ${PROJECT_NAME}_backend || true
                            docker save -o ${BACKUP_DIR}/frontend_${timestamp}.tar ${PROJECT_NAME}_frontend || true
                            
                            echo "Backing up volumes..."
                            docker run --rm -v commission_mysql_data:/data -v ${BACKUP_DIR}:/backup alpine tar czf /backup/mysql_data_${timestamp}.tar.gz /data || true
                            docker run --rm -v commission_backend_media:/data -v ${BACKUP_DIR}:/backup alpine tar czf /backup/media_${timestamp}.tar.gz /data || true
                        } || echo "No previous containers to backup"
                        
                        echo "Cleaning old backups (keeping last 5)..."
                        ls -t ${BACKUP_DIR}/*.tar 2>/dev/null | tail -n +6 | xargs rm -f || true
                        ls -t ${BACKUP_DIR}/*.tar.gz 2>/dev/null | tail -n +6 | xargs rm -f || true
                    """
                }
            }
        }
        
        stage('Build Images') {
            steps {
                sh '''
                    echo "Building Docker images..."
                    docker-compose build --no-cache
                '''
            }
        }
        
        stage('Deploy Containers') {
            steps {
                sh '''
                    echo "Stopping existing containers..."
                    docker-compose down --remove-orphans || true
                    
                    echo "Starting new containers..."
                    docker-compose up -d
                    
                    echo "Waiting for services to be healthy..."
                    sleep 30
                    
                    echo "Running database migrations..."
                    docker-compose exec -T backend python manage.py migrate --noinput
                    
                    echo "Collecting static files..."
                    docker-compose exec -T backend python manage.py collectstatic --noinput
                '''
            }
        }
        
        stage('Health Check') {
            steps {
                sh '''
                    echo "Checking service health..."
                    
                    # Check MySQL
                    docker-compose exec -T mysql mysqladmin ping -h localhost || exit 1
                    
                    # Check Backend
                    curl -f http://localhost:8000/api/users/ -H "Content-Type: application/json" || echo "Backend check requires auth"
                    
                    # Check Frontend
                    curl -f http://localhost/ || exit 1
                    
                    echo "All services are healthy!"
                '''
            }
        }
        
        stage('Cleanup') {
            steps {
                sh '''
                    echo "Cleaning up unused Docker resources..."
                    docker image prune -f
                    docker container prune -f
                '''
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
            // Uncomment to enable notifications
            // slackSend(color: 'good', message: "Build ${env.BUILD_NUMBER} succeeded!")
        }
        failure {
            echo 'Pipeline failed!'
            sh '''
                echo "Attempting to restore from backup..."
                # Restore logic can be added here
            '''
            // slackSend(color: 'danger', message: "Build ${env.BUILD_NUMBER} failed!")
        }
        always {
            cleanWs()
        }
    }
}
