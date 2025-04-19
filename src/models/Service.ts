import { Schema, model, models, Document, Model } from 'mongoose'; // Removed unused mongoose default import
import { slugify } from '@/lib/slugify'; // Assuming slugify exists

// Interface defining the document structure
export interface IService extends Document {
  title: string;
  description?: string; // Optional
  slug: string;
}

const ServiceSchema = new Schema<IService>({
  title: {
    type: String,
    required: [true, 'Please provide a title for the service.'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Slug is required.'],
    unique: true, // Ensure slug is unique
    trim: true,
  },
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps automatically
});

// Pre-save hook to generate slug automatically if not provided or if title changes
// Note: This assumes you want the slug generated based on the title.
// If the slug should be manually set or generated differently, adjust this logic.
ServiceSchema.pre<IService>('save', async function(next) {
  // Only generate slug if title is modified or slug doesn't exist
  if (this.isModified('title') || !this.slug) {
    const ServiceModel = this.constructor as Model<IService>; // Get the model constructor correctly typed
    const baseSlug = slugify(this.title); // Use const
    let slug = baseSlug;
    let counter = 1;
    // Ensure uniqueness if the base slug is taken
    while (await ServiceModel.findOne({ slug })) { // Use the typed model
      slug = `${baseSlug}-${counter}`;
      counter++;
      if (counter > 100) { // Safety break
          throw new Error(`Could not generate unique slug for service title "${this.title}"`);
      }
    }
    this.slug = slug;
  }
  next();
});


// Indexing
ServiceSchema.index({ slug: 1 });
ServiceSchema.index({ title: 1 });

const Service = models.Service || model<IService>('Service', ServiceSchema);

export default Service;