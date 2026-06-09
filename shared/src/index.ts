/**
 * Shared Package - Common types, utilities, and configurations
 * Used by all Balloo applications (Web, Mobile, Desktop, Android Service)
 * 
 * BACKWARD COMPATIBILITY LAYER
 * ============================
 * This package re-exports from @balloo/core-types during migration (Phase 3).
 * Legacy applications continue to use @balloo/shared without changes.
 */

// Re-export from core-types for backward compatibility
export * from '@balloo/core-types';

// TODO: After full migration, remove this file and update all imports
