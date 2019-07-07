import mongoose, { Document, Schema } from 'mongoose';
import fakegoose from 'fakegoose';
import { sha256 } from 'crypto-hash';
import FakeHelper from '../helpers/fake.helper'

export enum UserGender {
    Male = 'M',
    Female = 'F',
}

export interface IUser extends Document {
    publicId: string;
    email: string;
    password: string;
    phone: string;
    image: string;
    firstName: string;
    lastName: string;
    gender: UserGender;
    birthday: Date;
    refreshToken: string;
    isActivated: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export const UserSchema = new Schema({
  publicId: {
    type: String,
    index: true,
    unique: true,
    default: () => `u_${mongoose.Types.ObjectId()}`,
  },
  email: {
    type: String,
    fake: 'internet.email',
  },
  password: {
    type: String,
    fake: () => sha256('12'),
  },
  phone: {
    type: String,
    fake: 'phone.phoneNumber',
  },
  image: {
    type: String,
    fake: 'image.avatar',
  },
  firstName: {
    type: String,
    fake: 'name.firstName',
  },
  lastName: {
    type: String,
    fake: 'name.lastName',
  },
  gender: {
    type: String,
    enum: Object.values(UserGender),
    fake: () => FakeHelper.randomPick(Object.values(UserGender)),
  },
  birthday: {
    type: Date,
    fake: 'date.past'
  },
  refreshToken: {
    type: String,
  },
  isActivated: {
    type: Boolean,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: (doc: any, data: any, options: any) => {
      const ret = { ...data };
      ret.id = ret.publicId;
      delete ret.publicId;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    },
  },
});
UserSchema.plugin(fakegoose);

export const User = mongoose.model<IUser>('User', UserSchema);