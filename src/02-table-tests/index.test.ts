import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Subtract, expected: 1 },
  { a: 8, b: 2, action: Action.Subtract, expected: 6 },
  { a: 2, b: 2, action: Action.Multiply, expected: 4 },
  { a: 3, b: 2, action: Action.Multiply, expected: 6 },
  { a: 9, b: 3, action: Action.Divide, expected: 3 },
  { a: 8, b: 2, action: Action.Divide, expected: 4 },
  { a: 3, b: 3, action: Action.Exponentiate, expected: 27 },
  { a: 5, b: 2, action: Action.Exponentiate, expected: 25 },
  { a: 2, b: 2, action: 'invalid action', expected: null },
  { a: '3', b: '2', action: Action.Add, expected: null },
];

describe.each(testCases)('table tests', ({ a, b, action, expected }) => {
  test(`${a} ${action} ${b} === ${expected}`, () => {
    const result = simpleCalculator({ a, b, action });
    expect(result).toBe(expected);
  });
});
