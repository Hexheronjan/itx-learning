import { z } from "zod";

export const ClassroomSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  gradeLevel: z.string().min(1), // e.g. "Kelas 1", "Kelas 2", "Kelas 3"
  classCode: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  createdAt: z.string().optional(),
});
export type Classroom = z.infer<typeof ClassroomSchema>;

export const SubjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  code: z.string().min(1),
  gradeLevel: z.string().optional(),
  category: z.string().optional(), // "Wajib", "Peminatan", "Kedinasan/UTBK"
  status: z.enum(["active", "inactive"]).default("active"),
  createdAt: z.string().optional(),
});
export type Subject = z.infer<typeof SubjectSchema>;

export const TeacherAssignmentSchema = z.object({
  id: z.string(),
  teacherId: z.string(),
  teacherName: z.string(),
  teacherEmail: z.string().email(),
  classId: z.string(),
  className: z.string(),
  gradeLevel: z.string(), // "Kelas 1", "Kelas 2", "Kelas 3", etc.
  subjectId: z.string(),
  subjectName: z.string(),
  status: z.enum(["active", "inactive"]).default("active"),
  createdAt: z.string().optional(),
});
export type TeacherAssignment = z.infer<typeof TeacherAssignmentSchema>;

export const ValidateAccessRequestSchema = z.object({
  teacherEmail: z.string().email(),
  classId: z.string().optional(),
  className: z.string().optional(),
  subjectId: z.string().optional(),
  subjectName: z.string().optional(),
});
export type ValidateAccessRequest = z.infer<typeof ValidateAccessRequestSchema>;

export const ValidateAccessResponseSchema = z.object({
  allowed: z.boolean(),
  reason: z.string().optional(),
  teacherEmail: z.string(),
  activeAssignment: TeacherAssignmentSchema.optional().nullable(),
  availableAssignments: z.array(TeacherAssignmentSchema),
});
export type ValidateAccessResponse = z.infer<typeof ValidateAccessResponseSchema>;
