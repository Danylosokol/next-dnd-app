import { Dispatch, SetStateAction } from "react";

import { Session } from "@/types/Session";
import { SessionType } from "./consts/SessionConsts";
import { TyreSet } from "@/types/TyreSet";
import { TyreStates } from "./consts/TyreConsts";

export const calculateAvailableTyreSets = (
  sessions: Session[],
  tyreSets: TyreSet[],
  setAvailableTyreSets: Dispatch<SetStateAction<TyreSet[]>>
) => {
  const returnedTyreSetIds: string[] = sessions.reduce(
    (acc, session: Session) => {
      if (session.tyresToReturn && session.tyresToReturn.length > 0) {
        // @ts-ignore
        const ids: string[] = session.tyresToReturn.map(
          (r) => r._id && r._id.toString()
        );
        return [...acc, ...ids];
      }
      return acc;
    },
    [] as string[]
  );
  const computedAvailableTyreSets = tyreSets.filter(
    // @ts-ignore
    (tyreSet) => !returnedTyreSetIds.includes(tyreSet._id)
  );
  setAvailableTyreSets(computedAvailableTyreSets);
};

export const checkForShortage = (
  sessions: Session[],
  availableTyreSets: TyreSet[],
  tyreSets: TyreSet[]
) => {
  if (
    availableTyreSets.length &&
    !availableTyreSets.some((s) => s.state === TyreStates.NEW)
  ) {
    const raceSession = sessions.filter(
      (session: Session) => session.type === SessionType.RACE
    )[0] as Session;
    for (let tyreSet of tyreSets) {
      if (
        tyreSet.sessionsUsedIn &&
        tyreSet.sessionsUsedIn.some((s) => s._id === raceSession._id)
      ) {
        return true;
      }
    }
    return false;
  }
  return true;
};
