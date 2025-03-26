import { z } from 'zod'

export const LoginBody = z
  .object({
    email: z.string().min(1, { message: 'Email is required' }).email({
      message: 'Invalid email'
    }),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(50, 'Password must be at most 50 characters')
      .regex(/[a-z]/, { message: 'Password must contain at least 1 lowercase letter' })
      .regex(/[A-Z]/, { message: 'Password must contain at least 1 uppercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least 1 number' })
      .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least 1 symbol' })
  })
  .strict()

export type LoginBodyType = z.TypeOf<typeof LoginBody>

export const RegisterBody = z
  .object({
    email: z.string().min(1, { message: 'Email is required' }).email({
      message: 'Invalid email'
    }),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(50, 'Password must be at most 50 characters')
      .regex(/[a-z]/, { message: 'Password must contain at least 1 lowercase letter' })
      .regex(/[A-Z]/, { message: 'Password must contain at least 1 uppercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least 1 number' })
      .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least 1 symbol' }),
    confirm_password: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters')
      .max(50, 'Confirm password must be at most 50 characters')
  })
  .strict()
  .superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirm_password']
      })
    }
  })

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>

export const RegisterRes = z.object({
  message: z.string()
})

export type RegisterResType = z.TypeOf<typeof RegisterRes>

export const AuthRes = z.object({
  result: z.object({
    access_token: z.string(),
    refresh_token: z.string()
  }),
  message: z.string()
})

export type AuthResType = z.TypeOf<typeof AuthRes>

export const LogoutRes = RegisterRes

export type LogoutResType = z.TypeOf<typeof LogoutRes>

export const VerifyEmailBody = z.object({
  email_verify_token: z.string()
})

export type VerifyEmailBodyType = z.TypeOf<typeof VerifyEmailBody>

export const VerifyEmailRes = AuthRes

export type VerifyEmailResType = z.TypeOf<typeof VerifyEmailRes>
