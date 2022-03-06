export const sendSuccess = (statusCode: number, body: object) => ({
  statusCode,
  body: JSON.stringify(body),
});

export const sendError = (statusCode: number, error: unknown) => {
  let errorMessage = 'Internal server error';
  if (error instanceof Error) {
    errorMessage = error.message;
  }
  return {
    statusCode,
    body: JSON.stringify(errorMessage),
  }
};

export const validateInput = (data: string) => {
  const body = JSON.parse(data);
  const { email, password } = body;
  if (!email || !password || password.length < 6) return false;
  return true;
};
