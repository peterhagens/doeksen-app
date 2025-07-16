// __tests__/math.test.ts
function add(a: number, b: number): number {
  return a + b
}

test('adds two numbers', () => {

  console.log('Doing stuff');

  expect(add(2, 3)).toBe(5)
})
