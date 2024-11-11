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
  words: z.string().array(),
  images: z.string().array(),
  sentences: z.string().array(),
  imagePrompts: z.string().array(),
});

export type Palace = z.infer<typeof Palace>;
