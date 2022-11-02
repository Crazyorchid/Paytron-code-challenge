import * as payments from '../src/lib/payments';
import * as crypto from 'crypto';
import { randomUUID } from 'crypto';
import { handler } from '../src/createPayment';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('When the user create a new payment', () => {
  it('Returns the unique id which should not equal to the one user picked.', async () => {
    const paymentId = randomUUID();
    const expectedPaymentId = randomUUID();
    const mockPayment = {
      id: paymentId,
    };
    const createPaymentMock = jest
      .spyOn(payments, 'createPayment')
      .mockImplementationOnce(jest.fn());
    const randomUUIDMock = jest
      .spyOn(crypto, 'randomUUID')
      .mockReturnValueOnce(expectedPaymentId);
    const result = await handler({
      body: JSON.stringify(mockPayment),
    } as unknown as APIGatewayProxyEvent);

    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body)).not.toEqual({ result: mockPayment.id });
    expect(JSON.parse(result.body)).toEqual({ result: expectedPaymentId });

    expect(createPaymentMock).toHaveBeenCalledWith({
      ...mockPayment,
      id: expectedPaymentId,
    });
    expect(randomUUIDMock).toHaveBeenCalled();
  });
});

afterEach(() => {
  jest.resetAllMocks();
});
