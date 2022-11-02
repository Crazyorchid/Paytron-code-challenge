import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse, parseInput } from './lib/apigateway';
import { createPayment, Payment } from './lib/payments';
import { randomUUID } from 'crypto';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const payment = parseInput(event.body || '{}') as Payment;
  payment.id = randomUUID();
  try {
    await createPayment(payment);
    return buildResponse(201, { result: payment.id });
  } catch (error) {
    return buildResponse(442, { result: 'Unprocessable Entity response' });
  }
};
