import { FastifyInstance } from 'fastify'
import { validateBodyMiddleware } from '../../middleware'
import { verifyPayload } from './verify.service'
import { BodySchema } from './verify.schema'
import { z } from 'zod'

/**
 * For the sake of simplicity and to keep the example straightforward, I’ve hardcoded the secret key directly in the code:
 * In a real-world scenario, this value should always be stored securely in an .env file or a secret manager,
 * and never committed to version control.
 */
const SECRET =
  '4471d7eb5410aa4ea28378e00403f6d5e86786829d4701c68091bf707ce57f0b'

type Payload = z.infer<typeof BodySchema>

export default async function sign(fastify: FastifyInstance): Promise<void> {
  fastify.post(
    '/',
    { preHandler: validateBodyMiddleware(BodySchema) },
    async (request, reply) => {
      const payload = request.body as Payload

      const isValid = verifyPayload(payload.signature, payload.data, SECRET)

      if (isValid) {
        return reply.status(204).send()
      } else {
        return reply.status(400).send({ error: 'Invalid signature' })
      }
    },
  )
}
