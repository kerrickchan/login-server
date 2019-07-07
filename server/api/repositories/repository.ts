import { Model, Document } from 'mongoose';

export class Repository<T extends Document> {
  model: Model<T, any>;

  find(conditions = undefined) {
    return this.model.find(conditions);
  }

  findOne(conditions = undefined) {
    return this.model.findOne(conditions);
  }

  findByPublicId(publicId:string, conditions = undefined) {
    return this.model.findOne(conditions).where('publicId', publicId);
  }

  findById(id: string, conditions = undefined) {
    return this.model.findOne(conditions).where('_id', id);
  }

  create(data:any) {
    return this.model.create(data);
  }

  updateMany(conditions, doc) {
    return this.model.updateMany(conditions, doc);
  }

  updateByPublicId(publicId:string, data:any) {
    return this.model.findOneAndUpdate({ publicId }, { ...data, updatedAt: Date() });
  }

  updateById(id: string, data: any) {
    return this.model.findOneAndUpdate({ _id: id }, { ...data, updatedAt: Date() });
  }

  removeByPublicId(publicId:string) {
    return this.model.findOneAndDelete({ publicId });
  }

  removeById(id: string) {
    return this.model.findByIdAndDelete(id);
  }
}