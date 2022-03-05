export const sendResponse = (statusCode: number, body: object) => ({
  statusCode,
  body: JSON.stringify(body),
});

export const validateInput = (data: string) => {
  const body = JSON.parse(data);
  const { email, password } = body;
  if (!email || !password || password.length < 6) return false;
  return true;
};
