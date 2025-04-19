import { Schema, model, models, Document } from 'mongoose';

// Interface defining the document structure
export interface ISetting extends Document {
  key: string;
  value: string;
  category: string; // To group settings (e.g., 'general', 'unsplash', 'email')
}

const SettingSchema = new Schema<ISetting>({
  key: {
    type: String,
    required: [true, 'Setting key is required.'],
    unique: true, // Each setting key must be unique
    trim: true,
  },
  value: {
    type: String,
    required: [true, 'Setting value is required.'],
    // Value can be anything, including encrypted strings
  },
  category: {
    type: String,
    required: [true, 'Setting category is required.'],
    trim: true,
    index: true, // Index category for faster lookups by category
  },
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps automatically
});

const Setting = models.Setting || model<ISetting>('Setting', SettingSchema);

export default Setting;