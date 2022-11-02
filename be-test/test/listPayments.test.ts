import * as payments from '../src/lib/payments';
import { randomUUID } from 'crypto';
import { handler } from '../src/listPayments';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('When the user requests the records list based on currency', () => {
  it('Returns the payment matching their input parameter(SGD here!).', async () => {
    const expectCurrency = 'SGD';
    const paymentId = randomUUID();
    const mockPaymentList = [
      {
        id: paymentId,
        currency: 'SGD',
        amount: 2000,
      },
      {
        id: paymentId,
        currency: 'SGD',
        amount: 2000,
      },
      {
        id: paymentId,
        currency: 'AUD',
        amount: 2000,
      },
      {
        id: paymentId,
        currency: 'USD',
        amount: 2000,
      },
      {
        id: paymentId,
        currency: 'USD',
        amount: 2000,
      },
    ];
    const expectPaymentList = [
      {
        id: paymentId,
        currency: 'SGD',
        amount: 2000,
      },
      {
        id: paymentId,
        currency: 'SGD',
        amount: 2000,
      },
    ];
    // console.log(paymentId);
    const listPaymentMock = jest
      .spyOn(payments, 'listPayments')
      .mockResolvedValueOnce(mockPaymentList);

    const result = await handler({
      pathParameters: {
        currency: expectCurrency,
      },
    } as unknown as APIGatewayProxyEvent);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ data: expectPaymentList });

    expect(listPaymentMock).toHaveBeenCalledWith(expectCurrency);
  });
});
describe('When the user requests the records list with no params', () => {
  it('Returns the whole list.', async () => {
    const expectCurrency = undefined;
    const paymentId = randomUUID();
    const mockPaymentList = [
      {
        id: paymentId,
        currency: 'SGD',
        amount: 2000,
      },
      {
        id: paymentId,
        currency: 'SGD',
        amount: 2000,
      },
      {
        id: paymentId,
        currency: 'AUD',
        amount: 2000,
      },
      {
        id: paymentId,
        currency: 'USD',
        amount: 2000,
      },
      {
        id: paymentId,
        currency: 'USD',
        amount: 2000,
      },
    ];
    const listPaymentMock = jest
      .spyOn(payments, 'listPayments')
      .mockResolvedValueOnce(mockPaymentList);

    const result = await handler({
      pathParameters: { currency: expectCurrency },
    } as unknown as APIGatewayProxyEvent);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ data: mockPaymentList });

    expect(listPaymentMock).toHaveBeenCalledWith();
  });
});

afterEach(() => {
  jest.resetAllMocks();
});
