import t from 'tap'
import { toStringValue } from '../../helpers'

t.test('toStringValue', (t) => {
  t.plan(5)

  t.equal(toStringValue('hello'), 'hello', 'should return the same string')

  t.equal(toStringValue(123), '123', 'should stringify a number')

  t.equal(toStringValue(true), 'true', 'should stringify a boolean')

  t.equal(
    toStringValue({ a: 1 }),
    JSON.stringify({ a: 1 }),
    'should stringify an object',
  )

  t.equal(
    toStringValue([1, 2, 3]),
    JSON.stringify([1, 2, 3]),
    'should stringify an array',
  )
})
