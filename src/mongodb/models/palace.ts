import mongoose from "mongoose";

const Palace = new mongoose.Schema({
  words: {
    type: [String], // Array de strings para 'words'
    required: true,
  },
  images: {
    type: [String], // Array de strings para 'images'
    required: true,
  },
  sentences: {
    type: [String], // Array de strings para 'sentences'
    required: true,
  },
  imagePrompts: {
    type: [String], // Array de strings para 'imagePrompts'
    required: true,
  },
});

export default mongoose.models.Post || mongoose.model("Palace", Palace);
