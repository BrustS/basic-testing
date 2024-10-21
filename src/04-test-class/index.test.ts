import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';
import lodash from 'lodash';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const balance = 1000;
    const account = getBankAccount(balance);
    expect(account.getBalance()).toBe(balance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const balance = 1000;
    const account = getBankAccount(balance);
    expect(() => account.withdraw(balance + 100)).toThrowError(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const balance1 = 1000;
    const balance2 = 1500;
    const account1 = getBankAccount(balance1);
    const account2 = getBankAccount(balance2);
    expect(() => account1.transfer(balance1 + 100, account2)).toThrowError(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const balance = 1000;
    const account = getBankAccount(balance);
    expect(() => account.transfer(balance - 100, account)).toThrowError(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const balance = 1000;
    const deposit = 500;
    const account = getBankAccount(balance);
    expect(account.deposit(deposit).getBalance()).toBe(balance + deposit);
  });

  test('should withdraw money', () => {
    const balance = 1000;
    const withdraw = 500;
    const account = getBankAccount(balance);
    expect(account.withdraw(withdraw).getBalance()).toBe(balance - withdraw);
  });

  test('should transfer money', () => {
    const balance1 = 1000;
    const balance2 = 1500;
    const account1 = getBankAccount(balance1);
    const account2 = getBankAccount(balance2);
    const transfer = 300;
    expect(account1.transfer(transfer, account2).getBalance()).toBe(
      balance1 - transfer,
    );
    expect(account2.getBalance()).toBe(balance2 + transfer);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    jest.spyOn(lodash, 'random').mockReturnValueOnce(15).mockReturnValueOnce(1);
    const balance = 100;
    const account = getBankAccount(balance);
    const result = await account.fetchBalance();
    expect(typeof result).toBe('number');
    jest.restoreAllMocks();
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const fetchBalance = 50;
    const balance = 100;
    const account = getBankAccount(balance);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(fetchBalance);

    await account.synchronizeBalance();

    expect(account.getBalance()).toBe(fetchBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const balance = 100;
    const account = getBankAccount(balance);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(null);

    await expect(account.synchronizeBalance()).rejects.toThrowError(
      SynchronizationFailedError,
    );
  });
});
