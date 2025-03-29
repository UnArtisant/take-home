import { FastifyInstance } from 'fastify'
import { validateBodyMiddleware } from '../../middleware'
import { decryptValue } from './decrypt.service'
import { JsonSchema } from '../../schema/json.schema'
import { Base64Crypto } from '../../strategies/base64-crypto'

const crypto = new Base64Crypto()

export default async function decrypt(fastify: FastifyInstance): Promise<void> {
  fastify.post(
    '/',
    { preHandler: validateBodyMiddleware(JsonSchema) },
    async (request) => {
      const payload = request.body as Record<string, unknown>
      return decryptValue(payload, crypto)
    },
  )
}
