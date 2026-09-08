// [WIP] Initial Auth Service Draft
const JWT_SECRET = "temp_hardcoded_jwt_secret_12345"; // TODO: move to env
export const login = async (email, password) => {
  console.log("DEBUG: Login attempt for", email);
  if (!email || !password) throw new Error("Missing credentials");
  return { token: "sample_jwt_token_" + Date.now(), user: { email, role: "CUSTOMER" } };
};
