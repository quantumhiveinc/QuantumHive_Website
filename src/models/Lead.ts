import { Schema, model, models, Document } from 'mongoose';

// Interface defining the document structure (optional but good practice)
export interface ILead extends Document {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  message?: string; // Optional
  sourceFormName: string;
  submissionUrl: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost'; // Example statuses
  submissionTimestamp: Date;
}

const LeadSchema = new Schema<ILead>({
  fullName: {
    type: String,
    required: [true, 'Please provide a full name.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email address.'],
    trim: true,
    lowercase: true,
    // Consider adding unique: true if emails should be unique
    // unique: true,
    // Consider adding email validation
    // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number.'],
    trim: true,
  },
  company: {
    type: String,
    required: [true, 'Please provide a company name.'],
    trim: true,
  },
  message: {
    type: String,
    trim: true,
  },
  sourceFormName: {
    type: String,
    required: [true, 'Please provide the source form name.'],
    trim: true,
  },
  submissionUrl: {
    type: String,
    required: [true, 'Please provide the submission URL.'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Qualified', 'Lost'], // Define allowed statuses
    default: 'New',
    required: true,
  },
  submissionTimestamp: {
    type: Date,
    default: Date.now, // Automatically set the submission time
    required: true,
  },
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps automatically
});

// Indexing common query fields can improve performance
LeadSchema.index({ email: 1 });
LeadSchema.index({ status: 1 });
LeadSchema.index({ submissionTimestamp: -1 }); // Descending index for recent leads

const Lead = models.Lead || model<ILead>('Lead', LeadSchema);

export default Lead;