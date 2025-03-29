import { CryptoStrategy } from '../interfaces/CryptoInterface'
import { toStringValue } from '../helpers'

export class Base64Crypto implements CryptoStrategy {
  encrypt(value: unknown): string {
    const str = toStringValue(value)
    return Buffer.from(str, 'utf8').toString('base64')
  }

  decrypt(value: unknown): unknown {
    if (typeof value !== 'string' || !this.isEncrypted(value)) {
      return value
    }

    return Buffer.from(value, 'base64').toString('utf8')
  }

  isEncrypted(value: string): boolean {
    try {
      const decoded = this.decodeBase64(value)
      const reEncoded = this.encrypt(decoded)
      return this.normalize(value) === this.normalize(reEncoded)
    } catch {
      return false
    }
  }

  private decodeBase64(base64Value: string): string {
    return Buffer.from(base64Value, 'base64').toString('utf8')
  }

  private normalize(str: string): string {
    return str.replace(/=+$/, '')
  }
}
