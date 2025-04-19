import { Schema, model, models } from 'mongoose';

const BlogSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this blog post.'],
  },
  content: {
    type: String,
    required: [true, 'Please provide content for this blog post.'],
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
});

const Blog = models.Blog || model('Blog', BlogSchema);

export default Blog;