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

t.test(
  'POST /decrypt should Base64-decode all encoded properties',
  async (t) => {
    const payload = {
      name: 'Sm9obiBEb2U=',
      age: 'MzA=',
      contact:
        'eyJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJwaG9uZSI6IjEyMy00NTYtNzg5MCJ9',
      birth_date: '1998-11-19',
    }

    const response = await app.inject({
      method: 'POST',
      url: '/decrypt',
      payload,
    })

    t.equal(response.statusCode, 200, 'Response status code should be 200')

    const body = JSON.parse(response.body)
    t.equal(body.name, 'John Doe', 'Name should decode back to original string')
    t.equal(body.age, 30, 'Age should decode back to original number')

    t.same(
      body.contact,
      {
        email: 'john@example.com',
        phone: '123-456-7890',
      },
      'Contact should decode and parse back to the original object',
    )

    t.equal(
      body.birth_date,
      '1998-11-19',
      'Unencrypted property should remain unchanged',
    )

    t.end()
  },
)
