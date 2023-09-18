import { Dispatch, SetStateAction } from "react";
import { TyreStates, TyreTypes } from "./consts/TyreConsts";

import { Session } from "@/types/Session";
import { SessionType } from "./consts/SessionConsts";
import { TyreSet } from "@/types/TyreSet";
import { Weekend } from "@/types/Weekend";
import axios from "axios";

interface ErrorReturn {
  error: boolean;
}

export const getWeekend = async (
  id: string,
  setWeekend: Dispatch<SetStateAction<Weekend | null>>,
  setName: Dispatch<SetStateAction<string>>,
  setSoftTyres: Dispatch<SetStateAction<number | null>>,
  setMediumTyres: Dispatch<SetStateAction<number | null>>,
  setHardTyres: Dispatch<SetStateAction<number | null>>,
  setSessions: Dispatch<SetStateAction<Session[]>>,
  back: () => void
) => {
  try {
    const response = await axios.get(`/api/weekend?id=${id}`);
    const weekend = response.data as Weekend;
    setWeekend(weekend);
    setName(weekend.name);
    setSoftTyres(
      weekend.tyreSets.filter(
        (tyreSet: TyreSet) => tyreSet.type === TyreTypes.SOFT
      ).length
    );
    setMediumTyres(
      weekend.tyreSets.filter(
        (tyreSet: TyreSet) => tyreSet.type === TyreTypes.MEDIUM
      ).length
    );
    setHardTyres(
      weekend.tyreSets.filter(
        (tyreSet: TyreSet) => tyreSet.type === TyreTypes.HARD
      ).length
    );
    setSessions(
      weekend.sessions.filter(
        (session: Session) => session.type !== SessionType.RACE
      )
    );
  } catch (error) {
    alert("Something went wrong!");
    back();
  }
};

export const copyFromTemplate = async (
  template: Weekend,
  setSoftTyres: Dispatch<SetStateAction<number | null>>,
  setMediumTyres: Dispatch<SetStateAction<number | null>>,
  setHardTyres: Dispatch<SetStateAction<number | null>>,
  setSessions: Dispatch<SetStateAction<Session[]>>,
) => {
  setSoftTyres(
        template.tyreSets.filter(
          (tyreSet: TyreSet) => tyreSet.type === TyreTypes.SOFT
        ).length
      );
      setMediumTyres(
        template.tyreSets.filter(
          (tyreSet: TyreSet) => tyreSet.type === TyreTypes.MEDIUM
        ).length
      );
      setHardTyres(
        template.tyreSets.filter(
          (tyreSet: TyreSet) => tyreSet.type === TyreTypes.HARD
        ).length
      );
      setSessions(
        template.sessions.filter(
          (session: Session) => session.type !== SessionType.RACE
        ).map((session: Session) => {
          return {
            name: session.name,
            numOfReturns: session.numOfReturns,
            type: session.type
          }
        })
      );
};

export const getWeekends = async (
  setCreatedWeekends: Dispatch<SetStateAction<Weekend[]>>,
  back: () => void
) => {
  try {
    const response = await axios.get("/api/weekends");
    setCreatedWeekends(response.data as Weekend[]);
  } catch (error) {
    alert("Something went wrong!");
    back();
  }
};

export const createWeekend = async (
  name: string,
  softTyres: number,
  mediumTyres: number,
  hardTyres: number,
  sessions: Session[]
): Promise<Weekend | ErrorReturn> => {
  const sortedSessions = [...sessions].sort((a, b) =>
    a.type === SessionType.FREE_PRACTICE ? -1 : 1
  );
  sortedSessions.push({
    name: "Race",
    type: SessionType.RACE,
    numOfReturns: 0,
  });
  const tyreSets: TyreSet[] = [];
  for (let i = 0; i < softTyres; i++) {
    tyreSets.push({ type: TyreTypes.SOFT, state: TyreStates.NEW });
  }
  for (let i = 0; i < mediumTyres; i++) {
    tyreSets.push({ type: TyreTypes.MEDIUM, state: TyreStates.NEW });
  }
  for (let i = 0; i < hardTyres; i++) {
    tyreSets.push({ type: TyreTypes.HARD, state: TyreStates.NEW });
  }
  const data = {
    name,
    tyreSets: tyreSets,
    sessions: sortedSessions,
  };
  try {
    const newWeekend = await axios.post("/api/weekend", data);
    return newWeekend.data as Weekend;
  } catch (error) {
    console.error(error);
    return { error: true } as ErrorReturn;
  }
};

export const updateWeekend = async (
  weekend: Weekend,
  name: string,
  softTyres: number,
  mediumTyres: number,
  hardTyres: number,
  sessions: Session[]
): Promise<Weekend | ErrorReturn> => {
  const sortedSessions = [...sessions].sort((a, b) =>
    a.type === SessionType.FREE_PRACTICE ? -1 : 1
  );
  sortedSessions.push(weekend.sessions[weekend.sessions.length - 1]);
  // reset dashboard connections
  sortedSessions.map((session: Session) => (session.tyresToReturn = []));
  const tyreSets: TyreSet[] = [];
  for (let i = 0; i < softTyres; i++) {
    tyreSets.push({ type: TyreTypes.SOFT, state: TyreStates.NEW });
  }
  for (let i = 0; i < mediumTyres; i++) {
    tyreSets.push({ type: TyreTypes.MEDIUM, state: TyreStates.NEW });
  }
  for (let i = 0; i < hardTyres; i++) {
    tyreSets.push({ type: TyreTypes.HARD, state: TyreStates.NEW });
  }
  const oldSessions = weekend.sessions.filter((session) => !sortedSessions.some((newSession) => newSession._id === session._id));
  const data = {
    _id: weekend._id,
    name,
    tyreSets: tyreSets,
    sessions: sortedSessions,
    oldTyreSetsIds: weekend.tyreSets.map((tyreSet) => tyreSet._id),
    oldSessionsIds: oldSessions.map((session) => session._id),
  };
  try {
    const newWeekend = await axios.put("/api/weekend", data);
    return newWeekend.data;
  } catch (error) {
    console.error(error);
    return { error: true };
  }
};
