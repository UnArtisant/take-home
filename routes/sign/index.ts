import { FastifyInstance } from 'fastify'
import { validateBodyMiddleware } from '../../middleware'
import { JsonSchema } from '../../schema/json.schema'
import { signPayload } from './sign.service'

/**
 * For the sake of simplicity and to keep the example straightforward, I’ve hardcoded the secret key directly in the code:
 * In a real-world scenario, this value should always be stored securely in an .env file or a secret manager,
 * and never committed to version control.
 */
const SECRET =
  '4471d7eb5410aa4ea28378e00403f6d5e86786829d4701c68091bf707ce57f0b'

export default async function sign(fastify: FastifyInstance): Promise<void> {
  fastify.post(
    '/',
    { preHandler: validateBodyMiddleware(JsonSchema) },
    async (request) => {
      const payload = request.body as Record<string, unknown>
      const signature = signPayload(payload, SECRET)
      return { signature }
    },
  )
}
