import t from 'tap'
import { signPayload } from '../../routes/sign/sign.service'

t.test('signPayload', (t) => {
  t.test('should produce a 64-character hex string', (t) => {
    t.plan(2)
    const payload = { foo: 'bar' }
    const secret = 'mySecretKey123'

    const signature = signPayload(payload, secret)

    t.type(signature, 'string', 'signature should be a string')

    t.match(signature, /^[0-9a-f]{64}$/, 'should be a 64-character hex string')
  })

  t.test('same payload & same secret => same signature', (t) => {
    t.plan(1)
    const payload = { foo: 'bar' }
    const secret = 'mySecretKey123'

    const sig1 = signPayload(payload, secret)
    const sig2 = signPayload(payload, secret)

    t.equal(sig1, sig2, 'signatures should match')
  })

  t.test('same payload & different secrets => different signatures', (t) => {
    t.plan(1)
    const payload = { foo: 'bar' }
    const secret1 = 'secretOne'
    const secret2 = 'secretTwo'

    const sig1 = signPayload(payload, secret1)
    const sig2 = signPayload(payload, secret2)

    t.notSame(sig1, sig2, 'signatures should differ')
  })

  t.test('different payloads & same secret => different signatures', (t) => {
    t.plan(1)
    const secret = 'constantSecret'
    const payloadA = { foo: 'bar' }
    const payloadB = { foo: 'baz' }

    const sigA = signPayload(payloadA, secret)
    const sigB = signPayload(payloadB, secret)

    t.notSame(sigA, sigB, 'signatures should differ')
  })

  t.test(
    '(Optional) order of object properties (may or may not match)',
    (t) => {
      t.plan(1)
      const secret = 'orderSecret'
      const payloadA = { foo: 'bar', baz: 123 }
      const payloadB = { baz: 123, foo: 'bar' }

      const sigA = signPayload(payloadA, secret)
      const sigB = signPayload(payloadB, secret)

      t.equal(
        sigA,
        sigB,
        'signatures match if fast-safe-stringify preserves the same structure (not guaranteed!)',
      )
    },
  )

  t.end()
})
