import { Schema, model, models } from 'mongoose';

const IndustrySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this industry.'],
  },
  description: {
    type: String,
  },
});

const Industry = models.Industry || model('Industry', IndustrySchema);

export default Industry;