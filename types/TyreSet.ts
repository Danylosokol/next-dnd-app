import { Session } from "./Session";
import { Types } from "mongoose";
import { TyreStates } from "@/app/utils/consts/TyreConsts";
import { TyreTypes } from "@/app/utils/consts/TyreConsts";

export type TyreSet = {
  _id?: Types.ObjectId,
  type: TyreTypes,
  state: TyreStates,
  sessionsUsedIn?: Session[],
};