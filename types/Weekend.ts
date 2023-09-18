import { Session } from "./Session";
import { Types } from "mongoose";
import { TyreSet } from "./TyreSet";

export type Weekend = {
  _id?: Types.ObjectId,
  name: string,
  tyreSets: TyreSet[],
  sessions: Session[],
}