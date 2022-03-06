import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { sendError, sendSuccess, validateInput } from '../../utils/helpers';
import { statusCode } from '../../utils/statusCode';

const cognito = new AWS.CognitoIdentityServiceProvider();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const eventBody = event.body ?? '';
    const isValid = validateInput(eventBody);
    if (!isValid) return sendSuccess(statusCode.BAD_REQUEST, { message: 'Invalid input' });

    const { email, password } = JSON.parse(eventBody);
    const { userPoolId = '', clientId = '' } = process.env;
    // Non-SRP authentication flow;
    // you can pass in the USERNAME and PASSWORD directly if the flow is enabled for calling the app client
    const params: AWS.CognitoIdentityServiceProvider.Types.AdminInitiateAuthRequest = {
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      UserPoolId: userPoolId,
      ClientId: clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };
    const response = await cognito.adminInitiateAuth(params).promise();
    return sendSuccess(statusCode.OK, { message: 'Success', token: response.AuthenticationResult?.IdToken });
  } catch (error: unknown) {
    return sendError(statusCode.INTERNAL_SERVER_ERROR, error);
  }
};
