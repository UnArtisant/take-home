export interface CryptoStrategy {
  encrypt(value: unknown): string
  decrypt(value: unknown): unknown
  isEncrypted(value: string): boolean
}
