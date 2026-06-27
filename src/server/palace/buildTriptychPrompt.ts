import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { PalacePlan, TriptychPrompt, TriptychPromptSchema } from "./types";

export async function buildTriptychPrompt(
  openai: OpenAI,
  plan: PalacePlan,
): Promise<TriptychPrompt> {
  const completion = await openai.chat.completions.parse({
    model: "gpt-5.4-mini",
    messages: [
      {
        role: "system",
        content: `You write production prompts for GPT image generation.

Create one prompt for a single horizontal 3:1 triptych image.

Hard requirements:
- Read and follow sharedContext before describing the image. Every memory object must depict the contextual interpretation, not an unrelated meaning of the raw word.
- If a cue has interpretedAs because the raw word is ambiguous, misspelled, or context-dependent, draw interpretedAs while still keeping the original word only as metadata. Do not draw written words.
- Keep the whole triptych semantically unified around sharedContext so the panels feel like one coherent learning palace, not nine unrelated objects.
- The image is one wide horizontal triptych with three equal square panels.
- The three square panels must be arranged horizontally in one row: left square, center square, right square.
- Do not stack the panels vertically. Do not use diagonal panels, overlapping panels, or an irregular collage.
- The final composition reads left to right: panel 1, panel 2, panel 3.
- Every panel uses a third-person camera and visibly includes the same protagonist defined in the plan.
- Copy the protagonist's appearance, clothing, footwear, and distinguishing feature consistently into all three panel descriptions. Do not redesign, age, recolor, or replace the protagonist between panels.
- The protagonist is the "I" described by the first-person story sentences. Show the physical action happening to or around that character from an external viewpoint.
- The protagonist participates naturally but is not a hero, mascot, narrator, presenter, or posed central model.
- Prefer medium or wide three-quarter, profile, or rear three-quarter views. Avoid extreme close-ups, direct-to-camera posing, and compositions where the protagonist blocks the memory objects.
- Any other people are secondary background characters only and must not dominate the frame.
- Avoid crowds, tiny people, distant visible faces, miniature characters, and many small figures. If people appear, keep them few, secondary, and not close-up.
- The three places must feel physically connected and walkable.
- Keep the same location continuity, third-person visual language, protagonist identity, clothing, and recurring secondary characters.
- Do not define or name a visual style. Let the image model choose its own style.
- Only specify what should be drawn: the place, panel layout, objects, positions, actions, scale, continuity, and sensory situation.
- Never use first-person POV, body-camera framing, floating hands, disembodied arms, or legs entering from the bottom edge.
- The 9 memory words must appear as physical objects, processes, materials, or creatures based on their contextual interpretations, never as written text.
- Each memory object should be simple, visually separated, and clearly recognizable inside its own square panel. Make it prominent with composition, contrast, proximity, or action; do not automatically enlarge it.
- Prefer three strong memory objects per panel over many small details. Avoid cluttered piles, repeated duplicates, and tiny background cues.
- Absolutely no readable text anywhere: no captions, labels, subtitles, UI, signs, posters, chalkboards, whiteboards, worksheets, books with visible writing, banners, logos, or floating words.
- If the location is a classroom or school, angle the view away from chalkboards/posters and use desks, floor, doorway, hallway, cafeteria, gym, lockers without labels, or playground structures instead.
- Preserve each cue's chosen mnemonicTechnique precisely. Do not introduce extra scale changes that are absent from scaleChange, and do not enlarge all nine objects for emphasis.
- When mnemonicTechnique is miniaturized, make a normally large subject unmistakably tiny while keeping it readable near the protagonist. When it is enlarged, exaggerate a normally small subject. Keep believable scale for every other technique.
- Translate sensoryDetail into visible physical evidence: steam on glass, the protagonist or a secondary character recoiling from a smell, rippling liquid from loud sound, sticky residue, goosebumps, flushed skin, or another concrete reaction.
- For personified_or_animated, give an ordinarily inanimate object a clear purposeful action. For made_inanimate, freeze or turn a normally living or moving subject into a rigid object or material. Avoid generic cartoon faces unless they are essential to the cue.
- Keep every panel readable as its own square slide after cropping.
- Important memory cues must stay near the center of their square panel, with nothing important crossing panel borders.
- Keep backgrounds simpler than the memory objects so object shapes and faces do not become distorted.
- Do not add decorative confetti, sparkles, magical particles, or festive garlands unless one of the memory words requires it.`,
      },
      {
        role: "user",
        content: JSON.stringify(plan),
      },
    ],
    response_format: zodResponseFormat(TriptychPromptSchema, "triptych_prompt"),
  });

  const triptychPrompt = completion.choices[0].message.parsed;

  if (!triptychPrompt) {
    throw new Error("Triptych prompt is null");
  }

  return triptychPrompt;
}
