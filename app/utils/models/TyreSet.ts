import { Ref, getModelForClass, prop } from "@typegoose/typegoose";
import { TyreStates, TyreTypes } from "../consts/TyreConsts";
import mongoose, { Types } from "mongoose";

import { Session } from "./Session";

export class TyreSet {
  @prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  public _id!: Types.ObjectId;

  @prop({ required: true, enum: TyreTypes, type: String })
  public type!: TyreTypes;

  @prop({ required: true, enum: TyreStates, type: String })
  public state!: TyreStates;

  @prop({ ref: "Session", type: Types.ObjectId, required: false })
  public sessionsUsedIn?: Ref<Session>[];
}

export const TyreSetModel =
  mongoose.models.TyreSet || getModelForClass(TyreSet);
