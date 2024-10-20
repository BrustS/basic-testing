import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import path from 'path';
import fs from 'fs';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.spyOn(global, 'setTimeout');
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 3000);
    expect(setTimeout).toHaveBeenCalledWith(callback, 3000);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, 3000);
    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(3000);
    expect(callback).toBeCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 2000);
    expect(callback).not.toBeCalled();
    jest.advanceTimersByTime(2000);
    expect(callback).toBeCalledTimes(1);
    jest.advanceTimersByTime(2000);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, 1000);
    jest.advanceTimersByTime(4000);
    expect(callback).toHaveBeenCalledTimes(4);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const fileName = 'test.txt';
    const spy = jest.spyOn(path, 'join');
    await readFileAsynchronously(fileName);
    expect(spy).toHaveBeenCalledWith(__dirname, fileName);
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'text.txt';
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const read = jest.spyOn(fs.promises, 'readFile');
    const result = await readFileAsynchronously(pathToFile);
    expect(read).not.toHaveBeenCalled();
    expect(result).toBe(null);
    jest.restoreAllMocks();
  });

  test('should return file content if file exists', async () => {
    const pathToFile = 'text.txt';
    const content = 'text';
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const read = jest
      .spyOn(fs.promises, 'readFile')
      .mockReturnValue(Promise.resolve(content));
    const result = await readFileAsynchronously(pathToFile);
    expect(read).toHaveBeenCalled();
    expect(result).toBe(content);
    jest.restoreAllMocks();
  });
});
