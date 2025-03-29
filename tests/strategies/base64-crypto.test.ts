import t from 'tap'
import { Base64Crypto } from '../../strategies/base64-crypto'

const crypto = new Base64Crypto()

t.test('Base64Crypto', (t) => {
  t.test('encrypt()', (t) => {
    t.plan(3)

    t.equal(
      crypto.encrypt('hello'),
      Buffer.from('hello').toString('base64'),
      'should encode string to base64',
    )

    t.equal(
      crypto.encrypt(123),
      Buffer.from('123').toString('base64'),
      'should encode number to base64',
    )

    t.equal(
      crypto.encrypt(true),
      Buffer.from('true').toString('base64'),
      'should encode boolean to base64',
    )
  })

  t.test('decrypt()', (t) => {
    t.plan(3)

    const encodedString = Buffer.from('John Doe').toString('base64')
    const encodedNumber = Buffer.from('123').toString('base64')
    const encodedObject = Buffer.from(
      JSON.stringify({ email: 'john@example.com' }),
    ).toString('base64')

    t.equal(
      crypto.decrypt(encodedString),
      'John Doe',
      'should decode base64 string',
    )

    t.equal(
      crypto.decrypt(encodedNumber),
      '123',
      'should decode base64 number string',
    )

    t.same(
      crypto.decrypt(encodedObject),
      '{"email":"john@example.com"}',
      'should return JSON string for base64 input',
    )
  })

  t.test('isEncrypted()', (t) => {
    t.plan(3)

    const valid = Buffer.from('hello').toString('base64')
    const invalid = 'NotBase64AtAll'
    const unpadded = Buffer.from('foo').toString('base64') // Zm9v

    t.ok(crypto.isEncrypted(valid), 'should detect valid base64 string')
    t.notOk(crypto.isEncrypted(invalid), 'should reject non-base64 string')
    t.ok(crypto.isEncrypted(unpadded), 'should handle unpadded base64')
  })

  t.end()
})
