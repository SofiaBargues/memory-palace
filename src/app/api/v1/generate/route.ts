import { OpenAI } from "openai";
import { uploadToCloudinary } from "./uploadToCloudinary";
import { buildTriptychPrompt } from "@/server/palace/buildTriptychPrompt";
import { createTriptychPalace } from "@/server/palace/createTriptychPalace";
import { cropTriptychBase64 } from "@/server/palace/cropTriptych";
import { generatePalacePlan } from "@/server/palace/generatePalacePlan";
import { generateTriptychImage } from "@/server/palace/generateTriptychImage";
import { validateWords } from "@/server/palace/validateWords";

export const runtime = "nodejs";
export const maxDuration = 300;

function formatDuration(milliseconds: number) {
  return `${(milliseconds / 1000).toFixed(2)}s`;
}

export async function POST(request: Request) {
  const requestStartedAt = performance.now();
  const runId =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);

  async function timePhase<T>(phase: string, action: () => Promise<T>) {
    const phaseStartedAt = performance.now();
    console.info(`[generate:${runId}] ${phase} started`, {
      elapsed: formatDuration(phaseStartedAt - requestStartedAt),
    });

    try {
      const result = await action();
      const phaseEndedAt = performance.now();
      console.info(`[generate:${runId}] ${phase} finished`, {
        duration: formatDuration(phaseEndedAt - phaseStartedAt),
        elapsed: formatDuration(phaseEndedAt - requestStartedAt),
      });
      return result;
    } catch (error) {
      const phaseFailedAt = performance.now();
      console.error(`[generate:${runId}] ${phase} failed`, {
        duration: formatDuration(phaseFailedAt - phaseStartedAt),
        elapsed: formatDuration(phaseFailedAt - requestStartedAt),
        error,
      });
      throw error;
    }
  }

  function timeSyncPhase<T>(phase: string, action: () => T) {
    const phaseStartedAt = performance.now();
    console.info(`[generate:${runId}] ${phase} started`, {
      elapsed: formatDuration(phaseStartedAt - requestStartedAt),
    });

    try {
      const result = action();
      const phaseEndedAt = performance.now();
      console.info(`[generate:${runId}] ${phase} finished`, {
        duration: formatDuration(phaseEndedAt - phaseStartedAt),
        elapsed: formatDuration(phaseEndedAt - requestStartedAt),
      });
      return result;
    } catch (error) {
      const phaseFailedAt = performance.now();
      console.error(`[generate:${runId}] ${phase} failed`, {
        duration: formatDuration(phaseFailedAt - phaseStartedAt),
        elapsed: formatDuration(phaseFailedAt - requestStartedAt),
        error,
      });
      throw error;
    }
  }

  try {
    console.info(`[generate:${runId}] request started`);

    const body = await timePhase("parse request body", () => request.json());
    const words = timeSyncPhase("validate words", () =>
      validateWords(body.words)
    );

    console.info(`[generate:${runId}] starting pov triptych palace`, { words });

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const plan = await timePhase("create palace plan", () =>
      generatePalacePlan(openai, words)
    );
    console.info(`[generate:${runId}] palace plan ready`, {
      title: plan.title,
      scenario: plan.scenario.name,
    });
    const { imagePrompt } = await timePhase("create triptych prompt", () =>
      buildTriptychPrompt(openai, plan)
    );
    const triptychBase64 = await timePhase("generate triptych image", () =>
      generateTriptychImage(openai, imagePrompt)
    );
    const slideBase64Images = timeSyncPhase("crop triptych image", () =>
      cropTriptychBase64(triptychBase64)
    );

    const [triptychImage, ...images] = await timePhase("upload images", () =>
      Promise.all([
        uploadToCloudinary(triptychBase64, {
          runId,
          imageName: "triptych",
        }),
        ...slideBase64Images.map((image, index) =>
          uploadToCloudinary(image, {
            runId,
            imageName: `slide-${index + 1}`,
          })
        ),
      ])
    );

    const savedPalace = await timePhase("save palace", () =>
      createTriptychPalace({
        words,
        plan,
        triptychImage,
        images,
        imagePrompt,
      })
    );

    const requestEndedAt = performance.now();
    console.info(`[generate:${runId}] request finished`, {
      duration: formatDuration(requestEndedAt - requestStartedAt),
      palaceId: savedPalace._id,
    });

    return Response.json(savedPalace, {
      headers: {
        "x-generate-run-id": runId,
      },
    });
  } catch (error) {
    const requestFailedAt = performance.now();
    console.error(`[generate:${runId}] request failed`, {
      duration: formatDuration(requestFailedAt - requestStartedAt),
      error,
    });
    const errorMessage = (error as Error).message;

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: 500,
      headers: {
        "content-type": "application/json",
        "x-generate-run-id": runId,
      },
    });
  }
}
