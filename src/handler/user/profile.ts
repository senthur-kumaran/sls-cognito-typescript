import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { sendResponse } from '../../utils/helpers';
import { statusCode } from '../../utils/statusCode';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => sendResponse(
  statusCode.OK,
  { message: `Email ${event.requestContext.authorizer?.claims.email} has been authorized` },
);
