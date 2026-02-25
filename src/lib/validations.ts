import { z } from "zod";

// ── Analyze frames ──

export const frameInputSchema = z.object({
  base64: z.string().min(1),
  timestamp: z.number().min(0),
});

export const analyzeFramesSchema = z.object({
  frames: z
    .array(
      frameInputSchema.extend({
        transcriptContext: z.string().optional(),
        previousTexts: z.array(z.string()).optional(),
      })
    )
    .min(1)
    .max(10),
  model: z.string().optional(),
  language: z.enum(["fr", "en", "fr+en"]).optional(),
});

// ── Analyze SRT ──

export const analyzeSrtSchema = z.object({
  srtContent: z.string().min(1),
  fileName: z.string().optional(),
  model: z.string().optional(),
  language: z.enum(["fr", "en", "fr+en"]).optional(),
  estimatedCost: z.number().optional(),
});

// ── Save analysis ──

export const saveAnalysisSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.string().min(1),
  totalErrors: z.number().int().min(0).optional(),
  failedFrames: z.number().int().min(0).optional(),
  frames: z.array(z.record(z.string(), z.unknown())).optional(),
  srtErrors: z.array(z.record(z.string(), z.unknown())).optional(),
  tokenUsage: z.record(z.string(), z.unknown()).nullable().optional(),
  estimatedCost: z.number().nullable().optional(),
});

// ── Settings ──

export const updateSettingsSchema = z.object({
  model: z.string().optional(),
  language: z.enum(["fr", "en", "fr+en"]).optional(),
  frameInterval: z.number().min(0.5).max(10).optional(),
  ownApiKey: z.string().nullable().optional(),
});

// ── Dictionary ──

export const dictionaryWordSchema = z.object({
  word: z.string().min(1).max(100),
});

// ── Feedback ──

export const feedbackSchema = z.object({
  analysisId: z.string().min(1),
  errorKey: z.string().min(1),
  feedback: z.enum(["correct", "false_positive"]).nullable(),
});

// ── Stripe checkout ──

export const checkoutSchema = z.object({
  priceId: z.string().min(1),
});

// ── Helper ──

export function parseBody<T>(schema: z.ZodSchema<T>, data: unknown):
  | { success: true; data: T }
  | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    return {
      success: false,
      error: `${firstIssue.path.join(".")}: ${firstIssue.message}`,
    };
  }
  return { success: true, data: result.data };
}
