import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { PalacePlan, PalacePlanSchema } from "./types";

export async function generatePalacePlan(
  openai: OpenAI,
  words: string[]
): Promise<PalacePlan> {
  const completion = await openai.chat.completions.parse({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: `You design first-person memory palaces for the method of loci.

Create one coherent PalacePlan for exactly 9 words.

Rules:
- First infer the shared context/domain that best explains the full word set before creating any scene or memory cue.
- Add sharedContext with a concise name, description, confidence, and one interpretation for every input word in the original order.
- Interpret each word according to that shared context, not as an isolated dictionary entry.
- If a word is ambiguous, choose the meaning that best fits the shared context. Example: in a water-cycle set, "solid" means the solid state of water, not "reliable".
- If one word is an obvious typo, misspelling, or near-match that conflicts with the set but a corrected term strongly fits the shared context, set interpretedAs to the corrected contextual term. Example: with condensation, evaporation, cloud, river, and water cycle, "perception" should be interpreted as "precipitation".
- Preserve the exact original input word in the word fields and wrap the exact original input word in story sentences, but make objectDescription, weirdAction, sensoryDetail, and interpretedAs express the contextual meaning.
- If there is no strong shared context, use the broadest sensible context and set confidence to "low"; do not force unrelated meanings.
- The palace is experienced from the user's first-person point of view. The user is the camera.
- Do not create a main hero character. Any people are secondary and must stay visually consistent.
- Choose one meaningful real-world scenario that many people can imagine: home, school, grandparents house, park, playground, commute, or famous monument.
- The three scenes must be walkable and spatially related in real life.
- The route has exactly 3 scenes, and each scene uses exactly 3 words in the original input order.
- Each word must become a visible memory cue based on its contextual interpretation, not written text.
- Make every cue strange, vivid, and memorable: unusual scale, odd use, animated objects, sensory details, chaos, comfort, noise, smell, taste, texture, or surprise.
- Keep memory cues large, simple, and clearly recognizable. Avoid tiny objects, crowded object clusters, and miniature people.
- Avoid crowds. Use no people unless a secondary character is truly useful for the memory cue.
- Every memory cue must include scaleChange and sensoryDetail. Use "none" if there is no special scale or sensory detail.
- Story sentences must be first-person, simple, concrete, and visual.
- Wrap the exact input word in each story sentence with a bold HTML tag, for example <b>lamp</b>.
- Avoid places where readable text would dominate the image, such as market stalls full of signs, classrooms with chalkboards, poster walls, book pages, or street signs.
- If the scenario is a school, do not use chalkboards, posters, worksheets, banners, or signs as important visual elements.
- Do not include captions, labels, signs, chalkboards, posters, worksheets, banners, or written words in the image plan.
- Keep the scenes visually continuous, as if they are three moments in the same place.
- Do not choose or name a visual art style. Only describe the scenario, route, objects, positions, actions, scale, and sensory cues.`,
      },
      {
        role: "user",
        content: JSON.stringify({ words }),
      },
    ],
    response_format: zodResponseFormat(PalacePlanSchema, "palace_plan"),
  });

  const plan = completion.choices[0].message.parsed;

  if (!plan) {
    throw new Error("Palace plan is null");
  }

  return plan;
}
