import path from 'node:path'
import AutoLoad from '@fastify/autoload'
import type { FastifyInstance, FastifyPluginOptions } from 'fastify'

export default async function app(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
) {
  // This loads all plugins defined in plugins
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: { ...opts },
  })

  // This loads all plugins defined in routes
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: { ...opts },
  })

  return fastify
}
