import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { type JwtPayload } from "jsonwebtoken";

export async function decrypt(
  input: string,
  secretKey: string,
): Promise<JwtPayload> {
  const key = new TextEncoder().encode(secretKey);
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });

  return payload;
}

export async function isAuthenticated(): Promise<
  (JwtPayload & { userId: number; email: string; name: string }) | null
> {
  try {
    const session = cookies().get("session")?.value;

    if (!session) {
      return null;
    }

    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
    if (!secretKey) {
      throw new Error("Secret key is not defined");
    }

    const decryptedToken = await decrypt(session, secretKey);

    if (!decryptedToken) {
      return null;
    }

    if (decryptedToken.exp && decryptedToken.exp < Date.now() / 1000) {
      console.log("Token expired:", decryptedToken.exp, Date.now());
      return null;
    }

    return decryptedToken as JwtPayload & {
      userId: number;
      email: string;
      name: string;
    };
  } catch (error) {
    console.error("Error during authentication:", error);
    return null;
  }
}

export async function logout() {
  cookies().set("session", "", { expires: new Date(0) });
}
