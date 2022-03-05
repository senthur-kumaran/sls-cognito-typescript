import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { sendResponse, validateInput } from '../../utils/helpers';
import { statusCode } from '../../utils/statusCode';

const cognito = new AWS.CognitoIdentityServiceProvider();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const eventBody = event.body ?? '';
    const isValid = validateInput(eventBody);
    if (!isValid) return sendResponse(statusCode.BAD_REQUEST, { message: 'Invalid input' });

    const { email, password } = JSON.parse(eventBody);
    const { userPoolId = '' } = process.env;
    const params: AWS.CognitoIdentityServiceProvider.Types.AdminCreateUserRequest = {
      UserPoolId: userPoolId,
      Username: email,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'email_verified',
          Value: 'true', // Email verified manually only testing purpose.
        }],
      MessageAction: 'SUPPRESS', // Suppress sending the email
    };
    const response = await cognito.adminCreateUser(params).promise();
    if (response.User) {
      const paramsForSetPass: AWS.CognitoIdentityServiceProvider.Types.AdminSetUserPasswordRequest = {
        Password: password,
        UserPoolId: userPoolId,
        Username: email,
        Permanent: true,
      };
      await cognito.adminSetUserPassword(paramsForSetPass).promise();
    }
    return sendResponse(statusCode.OK, { message: 'User registration successful' });
  } catch (error) {
    const message = error.message ? error.message : 'Internal server error';
    return sendResponse(statusCode.INTERNAL_SERVER_ERROR, { message });
  }
};
