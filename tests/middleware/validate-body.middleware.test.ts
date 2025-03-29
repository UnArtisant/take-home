import t from 'tap'
import Fastify from 'fastify'
import { z } from 'zod'
import { validateBodyMiddleware } from '../../middleware'

t.test('validateBodyMiddleware', async (t) => {
  const fastify = Fastify()

  const schema = z.object({
    name: z.string(),
    age: z.number().int().positive(),
  })

  // Register test route using middleware
  fastify.post('/test', {
    preHandler: validateBodyMiddleware(schema),
    handler: (request, reply) => {
      reply.send({ validated: true, data: request.body })
    },
  })

  await fastify.ready()

  t.test('valid request body', async (t) => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/test',
      payload: {
        name: 'Raphaël',
        age: 23,
      },
    })

    t.equal(response.statusCode, 200, 'should return 200 for valid body')
    const json = response.json()
    t.same(json, { validated: true, data: { name: 'Raphaël', age: 23 } })
  })

  t.test('invalid request body', async (t) => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/test',
      payload: {
        name: 'Raphaël',
        age: -5,
      },
    })

    t.equal(response.statusCode, 400, 'should return 400 for invalid body')
    const json = response.json()
    t.equal(json.error, 'Bad Request', 'should have correct error message')
    t.ok(Array.isArray(json.details), 'details should be an array')
    t.ok(json.details.length > 0, 'details should have at least one issue')
    t.type(json.details[0], Object, 'each issue should be an object')
    t.ok('path' in json.details[0], 'issue should include a path field')
  })
})
