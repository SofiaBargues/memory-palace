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
        content: `You design third-person visual memory palaces for the method of loci.

Create one coherent PalacePlan for exactly 9 words.

Rules:
- First infer the shared context/domain that best explains the full word set before creating any scene or memory cue.
- Add sharedContext with a concise name, description, confidence, and one interpretation for every input word in the original order.
- Interpret each word according to that shared context, not as an isolated dictionary entry.
- If a word is ambiguous, choose the meaning that best fits the shared context. Example: in a water-cycle set, "solid" means the solid state of water, not "reliable".
- If one word is an obvious typo, misspelling, or near-match that conflicts with the set but a corrected term strongly fits the shared context, set interpretedAs to the corrected contextual term. Example: with condensation, evaporation, cloud, river, and water cycle, "perception" should be interpreted as "precipitation".
- Preserve the exact original input word in the word fields and wrap the exact original input word in story sentences, but make objectDescription, weirdAction, sensoryDetail, and interpretedAs express the contextual meaning.
- If there is no strong shared context, use the broadest sensible context and set confidence to "low"; do not force unrelated meanings.
- The image camera is always third-person. Create one recurring protagonist who represents the user and is visibly present in all three scenes.
- Define the protagonist once with a concise name, appearance, clothing, and one easy-to-recognize distinguishing feature. Keep these details simple enough to reproduce consistently.
- The protagonist must keep exactly the same apparent age, face, hair, body type, clothing colors, footwear, and distinguishing feature throughout the route.
- Show the protagonist naturally experiencing or interacting with the memory cues. They are not a superhero, mascot, presenter, or posed model.
- Prefer three-quarter, profile, or rear three-quarter views and medium or wide framing. Avoid extreme close-ups and avoid making the protagonist fill most of the scene.
- Other people are secondary and must stay visually consistent.
- Choose one vivid, coherent real-world scenario that supports the shared context. Consider the full range: a home, school, grandparents' house, park, playground, commute, museum, public square, famous tourist landmark, monument, or natural landmark.
- Do not default to a house or generic indoor room. Prefer a recognizable popular tourist location when it creates useful loci or a strong relationship with the subject. Name the real location (for example, the Eiffel Tower grounds, Rome's Colosseum, Times Square, Machu Picchu, the Taj Mahal, or Iguazu Falls) and use three genuinely connected stops within it. Otherwise choose the most meaningful everyday place.
- The three scenes must be walkable and spatially related in real life.
- The route has exactly 3 scenes, and each scene uses exactly 3 words in the original input order.
- Each word must become a visible memory cue based on its contextual interpretation, not written text.
- Make every cue strange, vivid, and memorable, but use one primary mnemonic technique per cue rather than piling techniques together.
- Diversify the 9 primary techniques. Use enlarged scale for at most 2 cues and miniature scale for at most 2 cues. Include at least 4 different technique types across the plan. Good alternatives are: a normal-sized object doing an impossible action; personifying or animating an inanimate object; making a normally living or moving thing rigid and inanimate; an unexpected material transformation; a strong sensory event; or interaction with a secondary character.
- Scale must express a meaningful contrast. Enlarge something normally small; miniaturize something normally huge. Otherwise preserve believable scale.
- Keep cues simple, clearly recognizable, and visually prominent through placement, contrast, proximity, or action—not automatically through size. Tiny objects may be shown close to the protagonist so they remain readable. Avoid crowded clusters and miniature people.
- Avoid crowds. Use no people unless a secondary character is truly useful for the memory cue.
- Set mnemonicTechnique to the cue's single primary technique. Set scaleChange to "none" unless enlarged or miniaturized is the selected technique.
- Sensory detail is valuable but not compulsory. Use it selectively on roughly 3–5 cues, spread across touch, sound, smell, taste, temperature, or bodily sensation instead of repeating only visual spectacle. Use "none" elsewhere.
- A recurring secondary character may reveal a cue through a concrete action (holding, smelling, tasting, recoiling from, polishing, feeding, or struggling with it). Keep that person secondary, consistent, and useful; do not add a person merely as decoration.
- Story sentences must remain first-person, simple, concrete, and visual. The visible protagonist is the "I" in every sentence, even though the image camera observes them from outside.
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
