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
  'POST /encrypt should Base64-encode all top-level properties',
  async (t) => {
    const payload = {
      name: 'John Doe',
      age: 30,
      contact: {
        email: 'john@example.com',
        phone: '123-456-7890',
      },
    }

    const response = await app.inject({
      method: 'POST',
      url: '/encrypt',
      payload,
    })
    t.equal(response.statusCode, 200, 'Response status code should be 200')

    const body = JSON.parse(response.body)

    t.ok(body.name, 'Encoded name should exist')
    t.ok(body.age, 'Encoded age should exist')
    t.ok(body.contact, 'Encoded contact should exist')

    const decodedName = Buffer.from(body.name, 'base64').toString('utf8')
    const decodedAge = Buffer.from(body.age, 'base64').toString('utf8')
    const decodedContactString = Buffer.from(body.contact, 'base64').toString(
      'utf8',
    )

    t.equal(
      decodedName,
      payload.name,
      'Name should decode back to original string',
    )
    t.equal(
      decodedAge,
      payload.age.toString(),
      'Age should decode back to original number as string',
    )

    const decodedContact = JSON.parse(decodedContactString)
    t.same(
      decodedContact,
      payload.contact,
      'Contact should decode and parse back to the original object',
    )

    t.end()
  },
)
