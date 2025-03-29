import t from 'tap'
import fastify, { FastifyInstance } from 'fastify'
import buildApp from '../../app'

let app: FastifyInstance

t.before(async () => {
  app = await buildApp(fastify({}), {})
  await app.ready()
})

t.teardown(async () => {
  await app.close()
})

t.test('/verify endpoint', async (t) => {
  t.test('Should return 204 if signature is valid', async (t) => {
    t.plan(1)

    const data = { message: 'Hello World', timestamp: 1616161616 }
    const signResponse = await app.inject({
      method: 'POST',
      url: '/sign',
      payload: data,
    })

    const { signature } = signResponse.json() as { signature: string }

    const verifyResponse = await app.inject({
      method: 'POST',
      url: '/verify',
      payload: {
        signature,
        data,
      },
    })

    t.equal(
      verifyResponse.statusCode,
      204,
      'should return 204 No Content for valid signature',
    )
  })

  t.test(
    'Should return 400 if signature is invalid (tampered data)',
    async (t) => {
      t.plan(1)

      const data = { message: 'Hello World', timestamp: 1616161616 }
      const signResponse = await app.inject({
        method: 'POST',
        url: '/sign',
        payload: data,
      })

      const { signature } = signResponse.json() as { signature: string }

      const tamperedData = { message: 'Goodbye World', timestamp: 1616161616 }

      const verifyResponse = await app.inject({
        method: 'POST',
        url: '/verify',
        payload: {
          signature,
          data: tamperedData,
        },
      })

      t.equal(
        verifyResponse.statusCode,
        400,
        'should return 400 Bad Request for invalid signature/data',
      )
    },
  )

  t.test('Should return 400 if signature is missing', async (t) => {
    t.plan(1)

    const verifyResponse = await app.inject({
      method: 'POST',
      url: '/verify',
      payload: {
        data: { message: 'Hello World' },
      },
    })

    t.equal(
      verifyResponse.statusCode,
      400,
      'should return 400 if signature not provided',
    )
  })

  t.test(
    'Order of properties should produce same signature → valid',
    async (t) => {
      t.plan(1)

      const dataA = { message: 'Hello World', timestamp: 1616161616 }
      const dataB = { timestamp: 1616161616, message: 'Hello World' }

      const signResponse = await app.inject({
        method: 'POST',
        url: '/sign',
        payload: dataA,
      })
      const { signature } = signResponse.json() as { signature: string }

      const verifyResponse = await app.inject({
        method: 'POST',
        url: '/verify',
        payload: {
          signature,
          data: dataB,
        },
      })

      t.equal(
        verifyResponse.statusCode,
        204,
        'should return 204 because dataA & dataB produce same signature if canonical',
      )
    },
  )

  t.end()
})
