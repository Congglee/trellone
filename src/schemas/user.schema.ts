import { z } from 'zod'
import { Role, UserVerifyStatus } from '~/constants/type'

export const UserSchema = z.object({
  _id: z.string(),
  email: z.string(),
  username: z.string(),
  display_name: z.string(),
  avatar: z.string().optional(),

  role: z.enum([Role.Client, Role.Admin]),

  is_active: z.boolean(),
  verify: z.nativeEnum(UserVerifyStatus),

  _destroy: z.boolean(),
  created_at: z.date(),
  updated_at: z.date()
})

export type UserType = z.TypeOf<typeof UserSchema>

export const UserRes = z.object({
  result: UserSchema,
  message: z.string()
})

export type UserResType = z.TypeOf<typeof UserRes>

export const UpdateMeBody = z.object({
  display_name: z
    .string()
    .trim()
    .min(1, 'Display name is required')
    .max(100, 'Display name must be less than 100 characters'),
  avatar: z.string().url().optional()
})

export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>
