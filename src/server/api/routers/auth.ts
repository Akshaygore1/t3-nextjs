/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import bcrypt from "bcrypt";
import { generateOtp } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import { setCookies } from "@/lib/auth";

export const authRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  userSignUp: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(8),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, email, password } = input;

      const existingUser = await ctx.db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const hashedPassword: string = await bcrypt.hash(password, 10);
      const otp = generateOtp();
      const otpExpiry = new Date();
      otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);

      const user = await ctx.db.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          otp,
          otpExpiry,
        },
      });
      console.log(user);
      return {
        success: true,
        user: { id: user.id, name: user.name, email: user.email },
      };
    }),

  verifyOtp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        otp: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { email, otp } = input;
      const user = await ctx.db.user.findUnique({
        where: { email },
      });

      if (user?.verified) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User already verified",
        });
      }

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      if (!user.otpExpiry) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Otp not found",
        });
      }

      const otpExpiry = new Date(user.otpExpiry);
      const currentDate = new Date();

      if (otpExpiry < currentDate) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "OTP expired",
        });
      }

      if (otp !== user.otp) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "OTP incorrect",
        });
      }

      await ctx.db.user.update({
        where: { email },
        data: {
          otp: null,
          otpExpiry: null,
          verified: true,
        },
      });

      return { success: true };
    }),
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;
      const user = await ctx.db.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      if (!user.verified) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not verified",
        });
      }

      if (!user.password) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User password not found",
        });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      console.log("---", passwordMatch);

      if (!passwordMatch) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Password incorrect",
        });
      }
      console.log("---", process.env.NEXT_PUBLIC_SECRET_KEY);
      const token = jwt.sign(
        { userId: user.id, email: user.email, name: user.name },
        process.env.NEXT_PUBLIC_SECRET_KEY ?? "",
        {
          expiresIn: "12h",
        },
      );

      await setCookies(token);

      return { success: true, token };
    }),
});
