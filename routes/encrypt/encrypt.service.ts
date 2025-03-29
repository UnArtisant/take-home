import { CryptoStrategy } from '../../interfaces/CryptoInterface'

/**
 * Encrypts each top-level property of a JSON payload using the given crypto strategy.
 *
 */
export function encryptPayload(
  payload: Record<string, unknown>,
  strategy: CryptoStrategy,
): Record<string, string> {
  return Object.entries(payload).reduce(
    (acc, [key, value]) => {
      acc[key] = strategy.encrypt(value)
      return acc
    },
    {} as Record<string, string>,
  )
}
