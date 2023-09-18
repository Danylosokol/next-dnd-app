import {Ref, getModelForClass, prop} from "@typegoose/typegoose";
import mongoose, { Types } from "mongoose";

import { Session } from "./Session";
import { TyreSet } from "./TyreSet";

export class Weekend {
  @prop({type: Types.ObjectId, default: () => new Types.ObjectId() })
  public _id!: Types.ObjectId;

  @prop({required: true})
  public name!: string;

  @prop({ref: "TyreSet", type: Types.ObjectId, required: false})
  public tyreSets?: Ref<TyreSet>[];

  @prop({ref: "Session", type: Types.ObjectId, required: false})
  public sessions?: Ref<Session>[];
}

export const WeekendModel =
  mongoose.models.Weekend ||
  getModelForClass(Weekend);