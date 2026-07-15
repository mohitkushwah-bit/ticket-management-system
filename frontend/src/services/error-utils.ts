import { ApiErrorResponse } from '../types';

/**
 * Extract a human-readable error message from an API error response.
 * Joins all error messages if there are multiple.
 */
export function getApiErrorMessage(err: unknown, fallback = 'An unexpected error occurred'): string {
  const apiErr = err as ApiErrorResponse;
  if (apiErr?.errors?.length) {
    return apiErr.errors.map((e) => e.message).join('. ');
  }
  return fallback;
}
