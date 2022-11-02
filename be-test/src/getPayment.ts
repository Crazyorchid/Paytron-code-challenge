import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getPayment, Payment } from './lib/payments';
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const paymentId = event?.pathParameters?.id;
  try {
    const result = await getPayment(paymentId ?? '');
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (err) {
    return { statusCode: 404, body: JSON.stringify(err) };
  }
};
