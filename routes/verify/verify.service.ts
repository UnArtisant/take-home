import { signPayload } from '../sign/sign.service'

export function verifyPayload(
  signature: string,
  data: Record<string, unknown>,
  secret: string,
): boolean {
  const expectedSignature = signPayload(data, secret)
  return signature === expectedSignature
}
