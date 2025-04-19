import { Schema, model, models } from 'mongoose';

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this category.'],
  },
  description: {
    type: String,
  },
});

const Category = models.Category || model('Category', CategorySchema);

export default Category;