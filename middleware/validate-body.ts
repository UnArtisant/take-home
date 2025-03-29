import { ZodSchema } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'

export const validateBodyMiddleware = (schema: ZodSchema) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const result = schema.safeParse(request.body)
    if (result.success) {
      request.body = result.data
    } else {
      reply.status(400).send({
        error: 'Bad Request',
        details: result.error.issues,
      })
    }
  }
}
