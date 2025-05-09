// Uncomment the code below and write your tests
import { getBankAccount, InsufficientFundsError, TransferFailedError, SynchronizationFailedError } from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initBalance = 100;
    expect(getBankAccount(initBalance).getBalance()).toBe(initBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const initBalance = 100;
    const amount = 200;
    expect(()=>getBankAccount(initBalance).withdraw(amount)).toThrow(new InsufficientFundsError(initBalance));
  });

  test('should throw error when transferring more than balance', () => {
    const initBalance = 100;
    const amount = 200;
    const accountFromTransfer = getBankAccount(initBalance);
    const accountToTransfer = getBankAccount(initBalance);
    expect(() => accountFromTransfer.transfer(amount,accountToTransfer)).toThrow(new InsufficientFundsError(initBalance));
  });

  test('should throw error when transferring to the same account', () => {
    const initBalance = 100;
    const amount = 200;
    const accountFromTransfer = getBankAccount(initBalance);
    expect(() => accountFromTransfer.transfer(amount, accountFromTransfer)).toThrow(TransferFailedError)
  });

  test('should deposit money', () => {
    const initBalance = 100;
    const amount = 150;
    const resultBalance = 250;
    expect(getBankAccount(initBalance).deposit(amount).getBalance()).toBe(resultBalance);
  });

  test('should withdraw money', () => {
    const initBalance = 250;
    const amount = 150;
    const resultBalance = 100;
    expect(getBankAccount(initBalance).withdraw(amount).getBalance()).toBe(resultBalance);
  });

  test('should transfer money', () => {
    const initBalance = 100;
    const amount = 50;
    const balanceFromTransferAccountAfterTransfer = 50;
    const balanceToTransferAccountAfterTransfer = 150;
    const accountFromTransfer = getBankAccount(initBalance);
    const accountToTransfer = getBankAccount(initBalance);
    accountFromTransfer.transfer(amount,accountToTransfer);
    expect(accountFromTransfer.getBalance()).toBe(balanceFromTransferAccountAfterTransfer);
    expect(accountToTransfer.getBalance()).toBe(balanceToTransferAccountAfterTransfer);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const balance = 100;
    const fetchBalance = 50;
    const account = getBankAccount(balance);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(fetchBalance);
    const result = await account.fetchBalance();
    expect(typeof result).toBe('number');
    expect(result).toBe(fetchBalance);
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
    const fetchBalance = null;
    const balance = 100;
    const account = getBankAccount(balance);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(fetchBalance);
    await expect(account.synchronizeBalance()).rejects.toThrow(new SynchronizationFailedError());
  });
});
