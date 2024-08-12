export function maskFields(fields: string[], body: any): any {
  const maskedBody = { ...body };
  for (const field of fields) {
    if (maskedBody[field]) {
      maskedBody[field] = "***MASKED***";
    }
  }
  return maskedBody;
}

export function extractTokenData(authHeader: string): any {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.split(" ")[1];
  // Assuming you are using JWT
  const tokenData = parseJWT(token);
  if (tokenData) {
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = tokenData.exp < currentTime;
    return {
      sub: tokenData.sub,
      oid: tokenData.oid,
      isExpired: isExpired,
    };
  }
  return null;
}

export function parseJWT(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      Buffer.from(base64, "base64").toString("utf-8"),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}
