import crypto from 'crypto'
import mongoose, { Document, Schema } from 'mongoose'
import fakegoose from 'fakegoose'
import { IUser } from './user.model'

export interface IToken extends Document {
  user: IUser['_id']
  token: string
  expiredAt: Date
  createdAt: Date
  updatedAt: Date
}

export const TokenSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    fake: () => {
      // FIXME: pick user object id from the users collection
      return mongoose.Types.ObjectId()
    }
  },
  token: {
    type: String,
    fake: () => {
      return crypto.randomBytes(64).toString('hex')
    }
  },
  expiredAt: {
    type: Date,
    fake: 'date.future'
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc: any, data: any, options: any) => {
      const ret = { ...data };
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
})
TokenSchema.plugin(fakegoose)

export const Token = mongoose.model<IToken>('Token', TokenSchema)