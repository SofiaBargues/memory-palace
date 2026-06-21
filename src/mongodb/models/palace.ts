import mongoose, { Document } from "mongoose";

export interface MongoPalace extends Document {
  _id: string;
  schemaVersion?: number;
  generationMode?: string;
  words: string[];
  images: string[];
  sentences: string[];
  imagePrompts: string[];
  triptychImage?: string;
  imagePrompt?: string;
  sharedContext?: {
    name: string;
    description: string;
    confidence: "high" | "medium" | "low";
    wordInterpretations: {
      word: string;
      interpretedAs: string;
      reason: string;
    }[];
  };
  scenario?: {
    category: string;
    name: string;
    reason: string;
  };
  visualStyle?: {
    medium: string;
    lighting: string;
    palette: string;
    mood: string;
  };
  pointOfView?: {
    camera: string;
    movement: string;
    bodyPresence: string;
  };
  route?: {
    sceneIndex: number;
    place: string;
    spatialRelation: string;
    words: string[];
    memoryCues: {
      word: string;
      interpretedAs?: string;
      objectDescription: string;
      weirdAction: string;
      scaleChange?: string;
      sensoryDetail?: string;
      emotionalTone: string;
      placementInScene: string;
    }[];
    storySentences: string[];
  }[];
  recurringSecondaryCharacters?: {
    name: string;
    description: string;
    role: string;
    appearsInScenes: number[];
  }[];
  title: string;
}

const memoryCueSchema = new mongoose.Schema(
  {
    word: String,
    interpretedAs: String,
    objectDescription: String,
    weirdAction: String,
    scaleChange: String,
    sensoryDetail: String,
    emotionalTone: String,
    placementInScene: String,
  },
  { _id: false }
);

const sceneSchema = new mongoose.Schema(
  {
    sceneIndex: Number,
    place: String,
    spatialRelation: String,
    words: [String],
    memoryCues: [memoryCueSchema],
    storySentences: [String],
  },
  { _id: false }
);

const palaceSchema = new mongoose.Schema<MongoPalace>(
  {
    schemaVersion: Number,
    generationMode: String,
    words: {
      type: [String],
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    sentences: {
      type: [String],
      required: true,
    },
    imagePrompts: {
      type: [String],
      required: true,
    },
    triptychImage: String,
    imagePrompt: String,
    sharedContext: {
      name: String,
      description: String,
      confidence: String,
      wordInterpretations: [
        {
          _id: false,
          word: String,
          interpretedAs: String,
          reason: String,
        },
      ],
    },
    scenario: {
      category: String,
      name: String,
      reason: String,
    },
    visualStyle: {
      medium: String,
      lighting: String,
      palette: String,
      mood: String,
    },
    pointOfView: {
      camera: String,
      movement: String,
      bodyPresence: String,
    },
    route: [sceneSchema],
    recurringSecondaryCharacters: [
      {
        _id: false,
        name: String,
        description: String,
        role: String,
        appearsInScenes: [Number],
      },
    ],
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

if (mongoose.models.Palace) {
  mongoose.deleteModel("Palace");
}

export default mongoose.model("Palace", palaceSchema);
