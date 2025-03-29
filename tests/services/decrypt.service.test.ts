import t from 'tap'
import { decryptValue } from '../../routes/decrypt/decrypt.service'
import { Base64Crypto } from '../../strategies/base64-crypto'

const NAME_B64 = 'Sm9obiBEb2U='
const AGE_B64 = 'MzA='
const CONTACT_B64 =
  'eyJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJwaG9uZSI6IjEyMy00NTYtNzg5MCJ9'

const crypto = new Base64Crypto()

t.test('services/decrypt.service → decryptValue', async (t) => {
  t.test('string: valid base64', async (t) => {
    t.plan(1)
    const result = decryptValue(NAME_B64, crypto)
    t.equal(result, 'John Doe', 'should decode "John Doe"')
  })

  t.test('string: invalid base64 remains the same', async (t) => {
    t.plan(1)
    const invalid = '@@NotBase64@@'
    const result = decryptValue(invalid, crypto)
    t.equal(result, invalid, 'should leave invalid base64 unchanged')
  })

  t.test('string: base64 → JSON → nested decode', async (t) => {
    t.plan(1)
    const nested = {
      nestedB64: NAME_B64,
    }
    const nestedJson = JSON.stringify(nested)
    const nestedB64 = Buffer.from(nestedJson, 'utf8').toString('base64')

    const result = decryptValue(nestedB64, crypto)
    t.same(
      result,
      { nestedB64: 'John Doe' },
      'should decode nested JSON and then decode deeper base64 value',
    )
  })

  t.test('array of base64 values', async (t) => {
    t.plan(1)
    const input = [NAME_B64, AGE_B64]
    const result = decryptValue(input, crypto)
    t.same(result, ['John Doe', 30], 'should decode each item in the array')
  })

  t.test('object with mixed base64', async (t) => {
    t.plan(1)
    const input = {
      name: NAME_B64,
      age: AGE_B64,
      contact: CONTACT_B64,
      birth_date: '1998-11-19',
    }
    const result = decryptValue(input, crypto)
    t.same(result, {
      name: 'John Doe',
      age: 30,
      contact: {
        email: 'john@example.com',
        phone: '123-456-7890',
      },
      birth_date: '1998-11-19',
    })
  })

  t.test('object with partially invalid base64', async (t) => {
    t.plan(1)
    const input = {
      validB64: NAME_B64,
      invalid: '@@NotBase64@@',
    }
    const result = decryptValue(input, crypto)
    t.same(result, {
      validB64: 'John Doe',
      invalid: '@@NotBase64@@',
    })
  })
})
