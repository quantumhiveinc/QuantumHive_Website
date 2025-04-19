import { Schema, model, models } from 'mongoose';

const CaseStudySchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this case study.'],
  },
  description: {
    type: String,
  },
  industry: {
    type: Schema.Types.ObjectId,
    ref: 'Industry',
  },
});

const CaseStudy = models.CaseStudy || model('CaseStudy', CaseStudySchema);

export default CaseStudy;