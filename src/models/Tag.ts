import { Schema, model, models, Document, Model } from 'mongoose';
import { slugify } from '@/lib/slugify';

// Interface defining the document structure
export interface ITag extends Document {
  name: string;
  slug: string;
}

const TagSchema = new Schema<ITag>({
  name: {
    type: String,
    required: [true, 'Tag name is required.'],
    unique: true, // Ensure tag names are unique
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Slug is required.'],
    unique: true, // Ensure slugs are unique
    trim: true,
  },
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps automatically
});

// Pre-save hook to generate slug automatically if not provided or if name changes
TagSchema.pre<ITag>('save', async function(next) {
  if (this.isModified('name') || !this.slug) {
    const TagModel = this.constructor as Model<ITag>;
    const baseSlug = slugify(this.name);
    let slug = baseSlug;
    let counter = 1;
    // Ensure uniqueness
    while (await TagModel.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
      if (counter > 100) { // Safety break
          throw new Error(`Could not generate unique slug for tag name "${this.name}"`);
      }
    }
    this.slug = slug;
  }
  next();
});

// Indexing
TagSchema.index({ slug: 1 });
TagSchema.index({ name: 1 });

const Tag = models.Tag || model<ITag>('Tag', TagSchema);

export default Tag;