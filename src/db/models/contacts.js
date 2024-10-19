import { model, Schema } from 'mongoose';
import { CONTACT_TYPE } from '../../constants/index.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: [CONTACT_TYPE.PERSONAL, CONTACT_TYPE.HOME, CONTACT_TYPE.WORK],
      required: true,
      default: CONTACT_TYPE.PERSONAL,
    },
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    photo: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const contactsModel = model('contacts', contactSchema);
