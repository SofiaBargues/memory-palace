import { z } from "zod";

const MemoryCueSchema = z.object({
  word: z.string(),
  interpretedAs: z.string(),
  mnemonicTechnique: z.enum([
    "normal_scale_odd_action",
    "enlarged",
    "miniaturized",
    "sensory",
    "personified_or_animated",
    "made_inanimate",
    "transformed_material",
    "secondary_character_interaction",
  ]),
  objectDescription: z.string(),
  weirdAction: z.string(),
  scaleChange: z.string(),
  sensoryDetail: z.string(),
  emotionalTone: z.string(),
  placementInScene: z.string(),
});

const PalaceSceneSchema = z.object({
  sceneIndex: z.number().int().min(0).max(2),
  place: z.string(),
  spatialRelation: z.string(),
  words: z.array(z.string()).length(3),
  memoryCues: z.array(MemoryCueSchema).length(3),
  storySentences: z.array(z.string()).length(3),
});

export const PalacePlanSchema = z.object({
  title: z.string(),
  sharedContext: z.object({
    name: z.string(),
    description: z.string(),
    confidence: z.enum(["high", "medium", "low"]),
    wordInterpretations: z.array(
      z.object({
        word: z.string(),
        interpretedAs: z.string(),
        reason: z.string(),
      })
    ).length(9),
  }),
  scenario: z.object({
    category: z.enum([
      "home",
      "school",
      "grandparents_house",
      "park",
      "playground",
      "famous_monument",
      "museum",
      "tourist_landmark",
      "natural_landmark",
      "public_square",
      "commute",
    ]),
    name: z.string(),
    reason: z.string(),
  }),
  pointOfView: z.object({
    camera: z.literal("third-person"),
    movement: z.string(),
    bodyPresence: z.string(),
  }),
  protagonist: z.object({
    name: z.string(),
    appearance: z.string(),
    clothing: z.string(),
    distinguishingFeature: z.string(),
  }),
  visualStyle: z.object({
    medium: z.string(),
    lighting: z.string(),
    palette: z.string(),
    mood: z.string(),
  }),
  route: z.array(PalaceSceneSchema).length(3),
  recurringSecondaryCharacters: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        role: z.string(),
        appearsInScenes: z.array(z.number().int().min(0).max(2)),
      })
    )
    .max(2),
});

export const TriptychPromptSchema = z.object({
  imagePrompt: z.string(),
});

export type PalacePlan = z.infer<typeof PalacePlanSchema>;
export type TriptychPrompt = z.infer<typeof TriptychPromptSchema>;
