/**
 * Converts value to its string representation.
 * If not a string, use JSON.stringify.
 * it can convert any JavaScript value into a string : https://www.w3schools.com/js/js_json_stringify.asp
 */
export function toStringValue(value: unknown): string {
  return typeof value === 'string' ? value : JSON.stringify(value)
}
