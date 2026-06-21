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
- Each panel is first-person POV at eye level, as if the viewer is walking through the place.
- The viewer is the main subject. Do not create a hero character, mascot, narrator, or posed central person.
- Any people are secondary background characters only. They must not dominate the frame or look like the protagonist.
- Avoid crowds, tiny people, distant visible faces, miniature characters, and many small figures. If people appear, keep them few, secondary, and not close-up.
- The three places must feel physically connected and walkable.
- Keep the same location continuity, point of view, camera height, and recurring secondary characters.
- Do not define or name a visual style. Let the image model choose its own style.
- Only specify what should be drawn: the place, panel layout, objects, positions, actions, scale, continuity, and sensory situation.
- The user's hands or lower body may be subtly visible near the edge only if it helps first-person POV.
- The 9 memory words must appear as physical objects, processes, materials, or creatures based on their contextual interpretations, never as written text.
- Each memory object should be large, simple, visually separated, and clearly recognizable inside its own square panel.
- Prefer three strong memory objects per panel over many small details. Avoid cluttered piles, repeated duplicates, and tiny background cues.
- Absolutely no readable text anywhere: no captions, labels, subtitles, UI, signs, posters, chalkboards, whiteboards, worksheets, books with visible writing, banners, logos, or floating words.
- If the location is a classroom or school, angle the view away from chalkboards/posters and use desks, floor, doorway, hallway, cafeteria, gym, lockers without labels, or playground structures instead.
- Make the memory cues strange and unforgettable with odd scale, unusual use, animation, sensory implication, chaos, comfort, sound, smell, taste, or texture.
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
