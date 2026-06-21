import { z } from "zod";

export const Story = z.object({
  sentences: z.string().array(),
});
export const StoryImages = z.object({
  title: z.string(),
  imagePrompts: z.string().array(),
});

export type Story = z.infer<typeof Story>;
export type StoryImages = z.infer<typeof StoryImages>;

export const Palace = z.object({
  title: z.string().optional(),
  schemaVersion: z.number().optional(),
  generationMode: z.string().optional(),
  words: z.string().array(),
  images: z.string().array(),
  sentences: z.string().array(),
  imagePrompts: z.string().array(),
  triptychImage: z.string().optional(),
  imagePrompt: z.string().optional(),
  sharedContext: z
    .object({
      name: z.string(),
      description: z.string(),
      confidence: z.enum(["high", "medium", "low"]),
      wordInterpretations: z.array(
        z.object({
          word: z.string(),
          interpretedAs: z.string(),
          reason: z.string(),
        })
      ),
    })
    .optional(),
  scenario: z
    .object({
      category: z.string(),
      name: z.string(),
      reason: z.string(),
    })
    .optional(),
  visualStyle: z
    .object({
      medium: z.string(),
      lighting: z.string(),
      palette: z.string(),
      mood: z.string(),
    })
    .optional(),
  pointOfView: z
    .object({
      camera: z.string(),
      movement: z.string(),
      bodyPresence: z.string(),
    })
    .optional(),
  route: z
    .array(
      z.object({
        sceneIndex: z.number(),
        place: z.string(),
        spatialRelation: z.string(),
        words: z.array(z.string()),
        memoryCues: z.array(
          z.object({
            word: z.string(),
            interpretedAs: z.string().optional(),
            objectDescription: z.string(),
            weirdAction: z.string(),
            scaleChange: z.string().optional(),
            sensoryDetail: z.string().optional(),
            emotionalTone: z.string(),
            placementInScene: z.string(),
          })
        ),
        storySentences: z.array(z.string()),
      })
    )
    .optional(),
  recurringSecondaryCharacters: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        role: z.string(),
        appearsInScenes: z.array(z.number()),
      })
    )
    .optional(),
});

export type Palace = z.infer<typeof Palace>;
