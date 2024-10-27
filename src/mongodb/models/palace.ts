import mongoose from "mongoose";

const palaceSchema = new mongoose.Schema({
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
