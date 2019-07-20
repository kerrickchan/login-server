import mongoose, { Document, Schema } from 'mongoose';
import fakegoose from 'fakegoose';
import crypto from 'crypto'

import RandomHelper from '../helpers/random.helper'
import logger from '../../common/logger';

export enum UserGender {
    Male = 'M',
    Female = 'F',
}

export interface IUser extends Document {
  publicId: string;
  username: string;
  hash: string;
  salt: string;
  // Passport user profile data
  provider: string
  displayName: string
  name: {
    familyName: string,
    givenName: string,
    middleName: string
  }
  email: [
    {
      value: string,
      type: string
    }
  ]
  photos: [
    {
      value: string
    }
  ]
  // Profile data
  phone: string;
  gender: UserGender;
  birthday: Date;
  isActivated: boolean;
  createdAt: Date;
  updatedAt: Date;

  setPassword(password: string): void
  validPassword(hashedPassword: string): boolean
}

export const UserSchema = new Schema({
  publicId: {
    type: String,
    index: true,
    unique: true,
    default: () => `u_${mongoose.Types.ObjectId()}`,
  },
  username: {
    type: String,
    unique: true,
    required: true,
    fake: 'internet.email',
  },
  hash: {
    type: String,
    fake: () => {
      this.setPassword(crypto.randomBytes(8).toString('hex'))
    }
  },
  salt: {
    type: String
  },
  provider: {
    type: String,
    fake: () => {
      return 'local'
    }
  },
  displayName: {
    type: String,
    fake: 'name.firstName'
  },
  name: {
    familyName: {
      type: String,
      fake: 'name.lastName'
    },
    givenName: {
      type: String,
      fake: 'name.firstName'
    },
    middleName: {
      type: String,
      fake: 'name.findName'
    },
  },
  email: [
    {
      value: {
        type: String,
        fake: 'internet.email'
      },
      type: {
        type: String,
        fake: () => RandomHelper.randomPick(['home', 'work', 'other'])
      }
    }
  ],
  photos: [
    {
      type: String,
      fake: 'image.avatar',
    }
  ],
  phone: {
    type: String,
    fake: 'phone.phoneNumber',
  },
  gender: {
    type: String,
    enum: Object.values(UserGender),
    fake: () => RandomHelper.randomPick(Object.values(UserGender)),
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
UserSchema.plugin(fakegoose)

UserSchema.methods.setPassword = async function(password: string): Promise<void> {
  const salt = crypto.randomBytes(16)
  this.salt = salt.toString('hex')
  this.hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex')
  await this.save()
}

UserSchema.methods.validPassword = async function(password: string): Promise<boolean> {
  const hashedPassword = crypto.pbkdf2Sync(password, Buffer.from(this.salt), 10000, 512, 'sha512').toString('hex')
  return hashedPassword === this.hash
}

export const User = mongoose.model<IUser>('User', UserSchema);