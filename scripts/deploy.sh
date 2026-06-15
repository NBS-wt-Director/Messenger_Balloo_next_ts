#!/bin/bash
# Balloo Platform - Deployment Script
# Usage: ./scripts/deploy.sh [environment]

set -e

# ==================== CONFIGURATION ====================

ENVIRONMENT=${1:-production}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ==================== FUNCTIONS ====================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    log_info "Checking requirements..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_warning "Node.js is not installed (optional for deployment)"
    fi
    
    log_success "All requirements met"
}

check_env() {
    log_info "Checking environment configuration..."
    
    if [ ! -f "$PROJECT_ROOT/.env" ]; then
        log_error ".env file not found"
        log_info "Creating from .env.example..."
        cp "$PROJECT_ROOT/.env.example" "$PROJECT_ROOT/.env"
        log_warning "Please edit .env file with your configuration"
        exit 1
    fi
    
    # Check required variables
    required_vars=(
        "DB_PASSWORD"
        "DATABASE_URL"
        "REDIS_URL"
        "JWT_SECRET"
        "YANDEX_CLIENT_ID"
        "YANDEX_CLIENT_SECRET"
    )
    
    missing_vars=()
    for var in "${required_vars[@]}"; do
        if ! grep -q "^${var}=" "$PROJECT_ROOT/.env"; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        log_error "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        exit 1
    fi
    
    log_success "Environment configuration OK"
}

build_images() {
    log_info "Building Docker images..."
    
    cd "$PROJECT_ROOT"
    
    docker-compose build
    
    log_success "Docker images built"
}

start_services() {
    log_info "Starting services..."
    
    cd "$PROJECT_ROOT"
    
    docker-compose up -d
    
    log_success "Services started"
}

stop_services() {
    log_info "Stopping services..."
    
    cd "$PROJECT_ROOT"
    
    docker-compose down
    
    log_success "Services stopped"
}

health_check() {
    log_info "Running health checks..."
    
    services=(
        "balloo-postgres:postgres"
        "balloo-redis:redis"
        "balloo-main:balloo"
        "balloo-messenger:messenger"
    )
    
    failed=0
    
    for service_pair in "${services[@]}"; do
        IFS=':' read -r container check_type <<< "$service_pair"
        
        if ! docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
            log_error "Container $container is not running"
            failed=1
            continue
        fi
        
        case $check_type in
            postgres)
                if ! docker exec "$container" pg_isready -U balloo &> /dev/null; then
                    log_error "PostgreSQL health check failed"
                    failed=1
                fi
                ;;
            redis)
                if ! docker exec "$container" redis-cli ping &> /dev/null; then
                    log_error "Redis health check failed"
                    failed=1
                fi
                ;;
            balloo|messenger)
                if ! docker exec "$container" wget --spider http://localhost:3000/health &> /dev/null; then
                    log_error "$container health check failed"
                    failed=1
                fi
                ;;
        esac
    done
    
    if [ $failed -eq 0 ]; then
        log_success "All health checks passed"
    else
        log_error "Some health checks failed"
        exit 1
    fi
}

show_status() {
    log_info "Service status:"
    echo ""
    docker-compose ps
    echo ""
}

show_logs() {
    local service=$1
    
    if [ -n "$service" ]; then
        docker-compose logs -f "$service"
    else
        docker-compose logs -f
    fi
}

cleanup() {
    log_info "Cleaning up unused Docker resources..."
    
    docker system prune -f
    docker volume prune -f
    
    log_success "Cleanup completed"
}

backup_db() {
    log_info "Creating database backup..."
    
    backup_dir="$PROJECT_ROOT/backups"
    mkdir -p "$backup_dir"
    
    timestamp=$(date +"%Y%m%d_%H%M%S")
    backup_file="$backup_dir/balloo_db_$timestamp.sql"
    
    docker exec balloo-postgres pg_dump -U balloo balloo > "$backup_file"
    
    # Compress
    gzip "$backup_file"
    
    log_success "Database backup created: ${backup_file}.gz"
}

restore_db() {
    local backup_file=$1
    
    if [ ! -f "$backup_file" ]; then
        log_error "Backup file not found: $backup_file"
        exit 1
    fi
    
    log_info "Restoring database from backup..."
    
    # Decompress if needed
    if [[ "$backup_file" == *.gz ]]; then
        gunzip -k "$backup_file"
        backup_file="${backup_file%.gz}"
    fi
    
    docker exec -i balloo-postgres psql -U balloo balloo < "$backup_file"
    
    log_success "Database restored from backup"
}

print_help() {
    echo "Balloo Platform Deployment Script"
    echo ""
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  deploy      Deploy to production (default)"
    echo "  start       Start all services"
    echo "  stop        Stop all services"
    echo "  restart     Restart all services"
    echo "  status      Show service status"
    echo "  logs        Show logs (option: service name)"
    echo "  build       Build Docker images"
    echo "  health      Run health checks"
    echo "  cleanup     Clean up unused Docker resources"
    echo "  backup      Create database backup"
    echo "  restore     Restore database from backup"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy"
    echo "  $0 logs messenger"
    echo "  $0 restore ./backups/balloo_db_20260614_120000.sql"
}

# ==================== MAIN ====================

main() {
    command=${1:-deploy}
    
    case $command in
        deploy)
            check_requirements
            check_env
            stop_services
            build_images
            start_services
            sleep 10
            health_check
            show_status
            log_success "Deployment completed successfully!"
            ;;
        start)
            check_requirements
            start_services
            show_status
            ;;
        stop)
            stop_services
            ;;
        restart)
            stop_services
            sleep 5
            start_services
            show_status
            ;;
        status)
            show_status
            ;;
        logs)
            show_logs "$2"
            ;;
        build)
            check_requirements
            build_images
            ;;
        health)
            health_check
            ;;
        cleanup)
            cleanup
            ;;
        backup)
            backup_db
            ;;
        restore)
            restore_db "$2"
            ;;
        help|--help|-h)
            print_help
            ;;
        *)
            log_error "Unknown command: $command"
            print_help
            exit 1
            ;;
    esac
}

main "$@"
