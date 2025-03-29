import fp from 'fastify-plugin'
import sensible from '@fastify/sensible'
import type { FastifyInstance } from 'fastify'

/**
 * This plugin adds some utilities to handle HTTP errors.
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp(async function (fastify: FastifyInstance) {
  fastify.register(sensible)
})
