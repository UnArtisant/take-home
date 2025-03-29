import crypto from 'crypto'
import stringify from 'fast-json-stable-stringify'

export function signPayload(payload: unknown, secret: string): string {
  // deterministic version to always get a consistent hash from stringified results
  const canonical = stringify(payload)
  return crypto
    .createHmac('sha256', secret)
    .update(canonical, 'utf8')
    .digest('hex')
}
