import redisClient from '../redis';
import * as uuid from 'uuid';
import { classToPlain, plainToClass, Exclude } from 'class-transformer';
import { IsUUID } from 'class-validator';
import { Job } from './job';

export class BaseEntity {
  @IsUUID()
  id: string = uuid.v4();

  @Exclude()
  name = this.constructor.name;

  async save(): Promise<this> {
    await redisClient().hset(this.name, this.id, JSON.stringify(classToPlain(this)));
    return this;
  }

  static async get<T extends typeof BaseEntity>(this: T, id: string): Promise<InstanceType<T>> {
    const item: string = await redisClient().hget(this.name, id);
    if (!item) {
      throw new Error(`${this.name} not found`);
    }
    const parsed = JSON.parse(item);
    return plainToClass(this, parsed) as InstanceType<T>;
  }

  static async getAll<T extends typeof BaseEntity>(this: T): Promise<InstanceType<T>[]> {
    const all: { [id: string]: string } = await redisClient().hgetall(this.name);
    const array = Object.values(all).map(item => JSON.parse(item));
    return array.map(n => plainToClass(this, n)) as InstanceType<T>[];
  }

  static async update<T extends typeof BaseEntity>(
    this: T,
    id: string,
    newKeys: Partial<InstanceType<T>>
  ): Promise<InstanceType<T>> {
    const item = await this.get(id);
    const newItem = {
      ...classToPlain(item),
      ...newKeys,
    };
    await redisClient().hset(this.name, item.id, JSON.stringify(newItem));
    return plainToClass(this, newItem) as InstanceType<T>;
  }

  static async delete<T extends typeof BaseEntity>(this: T, id: string): Promise<InstanceType<T>> {
    const item: string = await redisClient().hget(this.name, id);
    if (!item) {
      throw new Error(`${this.name} not found`);
    }
    const parsed = JSON.parse(item);
    try {
      await redisClient().hdel(this.name, id);
    } catch (e) {
      throw e;
    }
    return plainToClass(this, parsed) as InstanceType<T>;
  }
}
