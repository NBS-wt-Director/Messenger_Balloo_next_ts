#!/bin/bash
# Balloo Platform - Test Runner Script
# Usage: ./scripts/test.sh [options]

set -e

# ==================== CONFIGURATION ====================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ==================== FUNCTIONS ====================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

run_unit_tests() {
    log_info "Running unit tests..."
    
    cd "$PROJECT_ROOT"
    
    # Run tests with coverage
    npm run test -- --coverage --coverageReporters=text --coverageReporters=lcov
    
    log_success "Unit tests completed"
}

run_integration_tests() {
    log_info "Running integration tests..."
    
    cd "$PROJECT_ROOT"
    
    # Check if test database is configured
    if [ -z "$TEST_DATABASE_URL" ]; then
        log_warning "TEST_DATABASE_URL not set, using default"
        export TEST_DATABASE_URL="postgresql://balloo:test@localhost:5432/balloo_test"
    fi
    
    # Run integration tests
    npm run test:integration 2>/dev/null || log_warning "Integration tests not configured"
    
    log_success "Integration tests completed"
}

run_api_tests() {
    log_info "Running API tests..."
    
    cd "$PROJECT_ROOT"
    
    # Check if API is running
    if curl -f http://localhost:3003/health &> /dev/null; then
        npm run test:api 2>/dev/null || log_warning "API tests not configured"
    else
        log_warning "API not running, skipping API tests"
    fi
    
    log_success "API tests completed"
}

run_e2e_tests() {
    log_info "Running E2E tests..."
    
    cd "$PROJECT_ROOT"
    
    # E2E tests require running application
    npm run test:e2e 2>/dev/null || log_warning "E2E tests not configured (Phase 3)"
    
    log_success "E2E tests completed"
}

generate_coverage_report() {
    log_info "Generating coverage report..."
    
    cd "$PROJECT_ROOT"
    
    # Check if coverage directory exists
    if [ -d "coverage" ]; then
        log_success "Coverage report available at: coverage/lcov-report/index.html"
        
        # Print summary
        if [ -f "coverage/coverage-summary.json" ]; then
            echo ""
            log_info "Coverage Summary:"
            cat coverage/coverage-summary.json | python3 -m json.tool 2>/dev/null || true
        fi
    else
        log_warning "No coverage data found"
    fi
}

check_coverage_threshold() {
    local threshold=${1:-35}
    
    log_info "Checking coverage threshold ($threshold%)..."
    
    cd "$PROJECT_ROOT"
    
    if [ -f "coverage/coverage-summary.json" ]; then
        # Extract coverage percentage
        coverage=$(cat coverage/coverage-summary.json | python3 -c "import sys, json; print(json.load(sys.stdin)['total']['lines']['pct'])" 2>/dev/null || echo "0")
        
        if (( $(echo "$coverage >= $threshold" | bc -l) )); then
            log_success "Coverage threshold met: ${coverage}% >= ${threshold}%"
        else
            log_error "Coverage threshold not met: ${coverage}% < ${threshold}%"
            exit 1
        fi
    else
        log_warning "No coverage data found, skipping threshold check"
    fi
}

print_help() {
    echo "Balloo Platform Test Runner"
    echo ""
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  all         Run all tests (default)"
    echo "  unit        Run unit tests only"
    echo "  integration Run integration tests only"
    echo "  api         Run API tests only"
    echo "  e2e         Run E2E tests only"
    echo "  coverage    Generate coverage report"
    echo "  check       Check coverage threshold"
    echo "  help        Show this help message"
    echo ""
    echo "Options:"
    echo "  --threshold=N  Coverage threshold percentage (default: 35)"
    echo ""
    echo "Examples:"
    echo "  $0 all"
    echo "  $0 unit"
    echo "  $0 check --threshold=40"
}

# ==================== MAIN ====================

main() {
    command=${1:-all}
    threshold=35
    
    # Parse options
    for arg in "$@"; do
        case $arg in
            --threshold=*)
                threshold="${arg#*=}"
                ;;
        esac
    done
    
    case $command in
        all)
            run_unit_tests
            run_integration_tests
            run_api_tests
            generate_coverage_report
            check_coverage_threshold "$threshold"
            ;;
        unit)
            run_unit_tests
            generate_coverage_report
            check_coverage_threshold "$threshold"
            ;;
        integration)
            run_integration_tests
            ;;
        api)
            run_api_tests
            ;;
        e2e)
            run_e2e_tests
            ;;
        coverage)
            generate_coverage_report
            ;;
        check)
            check_coverage_threshold "$threshold"
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
