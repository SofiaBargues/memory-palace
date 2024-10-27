import mongoose, { Document } from "mongoose";

// Define la interfaz para los documentos de Palace
export interface MongoPalace extends Document {
  _id: string; // Especificar que siempre estará presente
  words: string[];
  images: string[];
  sentences: string[];
  imagePrompts: string[];
}

const palaceSchema = new mongoose.Schema<MongoPalace>({
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
});

// Exporta el modelo
export default mongoose.models.Palace || mongoose.model("Palace", palaceSchema);
