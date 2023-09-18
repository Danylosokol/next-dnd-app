import { SessionType } from "@/app/utils/consts/SessionConsts";
import { Types } from "mongoose";
import { TyreSet } from "./TyreSet";

export type Session = {
  _id?: Types.ObjectId;
  name: string;
  type: SessionType;
  numOfReturns: number;
  tyresToReturn?: TyreSet[];
};
