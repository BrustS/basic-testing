import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  // Check match by expect(...).toStrictEqual(...)
  test('should generate linked list from values 1', () => {
    const checkList = [12, 23, 34, 45, 56, 67];
    const expectedLinkedList = {
      value: 12,
      next: {
        value: 23,
        next: {
          value: 34,
          next: {
            value: 45,
            next: {
              value: 56,
              next: {
                value: 67,
                next: {
                  value: null,
                  next: null,
                },
              },
            },
          },
        },
      },
    };
    expect(generateLinkedList(checkList)).toStrictEqual(expectedLinkedList);
  });

  // Check match by comparison with snapshot
  test('should generate linked list from values 2', () => {
    const elements = [12, 23, 34];
    const list = generateLinkedList(elements);
    expect(list).toMatchSnapshot();
  });
});
