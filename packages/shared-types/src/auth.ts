import { z } from "zod";

export const UserRoleSchema = z.enum(["student", "teacher", "admin"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserStatusSchema = z.enum(["active", "inactive", "suspended"]);
export type UserStatus = z.infer<typeof UserStatusSchema>;

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  role: UserRoleSchema,
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  avatarUrl: z.string().url().optional().nullable(),
  status: UserStatusSchema.default("active"),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});
export type Profile = z.infer<typeof ProfileSchema>;

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const AuthResponseSchema = z.object({
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    role: UserRoleSchema,
    fullName: z.string(),
  }),
  token: z.string().optional(),
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
