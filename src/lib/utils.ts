import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { type JwtPayload } from "jsonwebtoken";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

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

export async function sendMail(email: string, otp: string) {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [email],
    subject: "Hello World",
    html: `<h1>OTP For Your Verification</h1>
    <p>Please enter the code below to verify your email address.</p>
    <p>If you did not request this email, please ignore this message.</p>
    <p>Your code is: <strong>${otp}</strong></p>
    <p>This code will expire in 1 hour.</p>
    <p>Thank you for using Resend.</p>
    <p>The Resend Team</p>
    `,
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
}
