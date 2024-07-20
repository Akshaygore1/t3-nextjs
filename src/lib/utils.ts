import { jwtVerify } from "jose";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { JwtPayload } from "jsonwebtoken";

export function obfuscateEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return email;
  if (localPart.length < 5) return email;

  const visibleStart = localPart.slice(0, 2);
  const visibleEnd = localPart.slice(-3);
  const hiddenPart = "*".repeat(localPart.length - 2);

  const obfuscatedLocalPart = `${visibleStart}${hiddenPart}${visibleEnd}`;

  return `${obfuscatedLocalPart}@${domain}`;
}

export function generateOtp(): string {
  const otp = Math.floor(10000000 + Math.random() * 90000000); // Ensure 8 digits
  return otp.toString();
}

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
  (JwtPayload & { userId: number; email: string }) | null
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

    return decryptedToken as JwtPayload & { userId: number; email: string };
  } catch (error) {
    console.error("Error during authentication:", error);
    return null;
  }
}
