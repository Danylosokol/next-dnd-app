import { Ref, getModelForClass, prop } from "@typegoose/typegoose";
import mongoose, { Types } from "mongoose";

import { SessionType } from "../consts/SessionConsts";
import { TyreSet } from "./TyreSet";

export class Session {
  @prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  public _id!: Types.ObjectId;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true, enum: SessionType, type: String })
  public type!: SessionType;

  @prop({ required: true })
  public numOfReturns!: number;

  @prop({ ref: "TyreSet", type: Types.ObjectId, required: false })
  public tyresToReturn?: Ref<TyreSet>[];
}

export const SessionModel =
  mongoose.models.Session || getModelForClass(Session);
