import { CryptoStrategy } from '../../interfaces/CryptoInterface'

/**
 * Recursively decrypt an unknown value:
 *
 * 1) If it's a string :
 *    - Check if it's truly valid Base64 (e.g. "Sm9obiBEb2U=").
 *    - If valid, decode.
 *      - If the decoded string is valid JSON, parse and decrypt.
 *      - Otherwise, return the decoded string as is.
 * 2) If it's an array, decrypt each item.
 * 3) If it's an object, decrypt each property.
 * 4) Otherwise, return the value as-is.
 */
export function decryptValue(
  encryptedValue: unknown,
  decryptionStrategy: CryptoStrategy,
): unknown {
  const decrypted = decryptionStrategy.decrypt(encryptedValue)

  if (typeof decrypted === 'string') {
    try {
      const parsedJson = JSON.parse(decrypted)
      return decryptValue(parsedJson, decryptionStrategy)
    } catch {
      return decrypted
    }
  }

  if (Array.isArray(decrypted)) {
    return decrypted.map((element) => decryptValue(element, decryptionStrategy))
  }

  if (decrypted !== null && typeof decrypted === 'object') {
    const decryptedObject: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(decrypted)) {
      decryptedObject[key] = decryptValue(value, decryptionStrategy)
    }
    return decryptedObject
  }

  return decrypted
}
