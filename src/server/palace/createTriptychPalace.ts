import dbConnect from "@/mongodb/connect";
import PalaceSchema from "@/mongodb/models/palace";
import { PalacePlan } from "./types";

type CreateTriptychPalaceInput = {
  words: string[];
  plan: PalacePlan;
  triptychImage: string;
  images: string[];
  imagePrompt: string;
};

function sanitizeBoldHtml(sentence: string) {
  const openTag = "__MEMORY_PALACE_B_OPEN__";
  const closeTag = "__MEMORY_PALACE_B_CLOSE__";

  return sentence
    .replace(/<\s*b\s*>/gi, openTag)
    .replace(/<\s*\/\s*b\s*>/gi, closeTag)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replaceAll(openTag, "<b>")
    .replaceAll(closeTag, "</b>");
}

export async function createTriptychPalace({
  words,
  plan,
  triptychImage,
  images,
  imagePrompt,
}: CreateTriptychPalaceInput) {
  await dbConnect();

  const route = plan.route.map((scene) => ({
    ...scene,
    storySentences: scene.storySentences.map(sanitizeBoldHtml),
  }));
  const sentences = route.flatMap((scene) => scene.storySentences);

  return PalaceSchema.create({
    schemaVersion: 3,
    generationMode: "third_person_triptych",
    title: plan.title,
    words,
    sentences,
    images,
    imagePrompts: [imagePrompt],
    triptychImage,
    imagePrompt,
    sharedContext: plan.sharedContext,
    scenario: plan.scenario,
    visualStyle: plan.visualStyle,
    pointOfView: plan.pointOfView,
    protagonist: plan.protagonist,
    route,
    recurringSecondaryCharacters: plan.recurringSecondaryCharacters,
  });
}
