import fastify, { FastifyInstance } from 'fastify'
import buildApp from '../../app'
import t from 'tap'

t.test('/sign endpoint', async (t) => {
  const app: FastifyInstance = await buildApp(fastify({}), {})
  await app.ready()

  t.teardown(async () => {
    await app.close()
  })

  const payloadA = { message: 'Hello World', timestamp: 1616161616 }
  const payloadB = { timestamp: 1616161616, message: 'Hello World' }

  const respA = await app.inject({
    method: 'POST',
    url: '/sign',
    payload: payloadA,
  })
  const respB = await app.inject({
    method: 'POST',
    url: '/sign',
    payload: payloadB,
  })

  t.equal(respA.statusCode, 200, 'A → returns 200')
  t.equal(respB.statusCode, 200, 'B → returns 200')

  const jsonA = respA.json()
  const jsonB = respB.json()

  t.ok(jsonA.signature, 'A has signature')
  t.ok(jsonB.signature, 'B has signature')
  t.equal(jsonA.signature, jsonB.signature, 'Both signatures should match')

  t.end()
})
