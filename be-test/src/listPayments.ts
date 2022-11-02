import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse } from './lib/apigateway';
import { listPayments } from './lib/payments';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const paymentCurrency = event?.pathParameters?.currency;
  if (paymentCurrency) {
    try {
      const payments = await listPayments(paymentCurrency ?? '');
      const filteredPayments = payments.filter(
        (payment) => payment.currency === paymentCurrency
      );
      return buildResponse(200, { data: filteredPayments });
    } catch (error) {
      return buildResponse(400, { data: error });
    }
  } else {
    try {
      const payments = await listPayments();
      return buildResponse(200, { data: payments });
    } catch (error) {
      return buildResponse(400, { data: error });
    }
  }
};
