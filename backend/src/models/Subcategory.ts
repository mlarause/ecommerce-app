import mongoose, { Document, Schema } from 'mongoose';

export interface ISubcategory extends Document {
  name: string;
  description?: string;
  category: mongoose.Schema.Types.ObjectId;
}

const subcategorySchema = new Schema<ISubcategory>({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
});

// Ensure unique subcategory names per category
subcategorySchema.index({ name: 1, category: 1 }, { unique: true });

export default mongoose.model<ISubcategory>('Subcategory', subcategorySchema);