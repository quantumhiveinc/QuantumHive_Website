import { Schema, model, models } from 'mongoose';

export interface IImage {
  url: string;
  altText?: string;
  blogPostId: string;
  isGalleryImage: boolean;
}

const ImageSchema = new Schema({
  url: {
    type: String,
    required: [true, 'Please provide a URL for this image.'],
  },
  altText: {
    type: String,
  },
  blogPostId: {
    type: Schema.Types.ObjectId,
    ref: 'Blog',
    required: [true, 'Please provide a blogPostId for this image.'],
  },
  isGalleryImage: {
    type: Boolean,
    default: false,
  },
});

const Image = models.Image || model('Image', ImageSchema);

export default Image;