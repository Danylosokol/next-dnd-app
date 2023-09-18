import { Dispatch, SetStateAction } from "react";

import { Session } from "@/types/Session";
import { TyreSet } from "@/types/TyreSet";
import { TyreStates } from "@/app/utils/consts/TyreConsts";

type TyreId = {
  id: string;
};

export const handleDrop = (
  tyreId: TyreId,
  session: Session,
  sessions: Session[],
  tyreSets: TyreSet[],
  setTyreSets: Dispatch<SetStateAction<TyreSet[]>>
) => {
  const tyre = tyreSets.find(
    (t: TyreSet) => t._id && t._id.toString() === tyreId.id
  );
  if (!tyre) {
    console.error("Tyre is not found");
    return;
  }

  // check if the tyre set was returned in previous sessions
  const previousSessions = sessions.slice(
    0,
    sessions.findIndex((s) => s._id === session._id)
  );
  if (
    previousSessions.some((s) => s.tyresToReturn?.some((t) => t._id === tyre._id))
  ) {
    alert(
      "This tyre set was returned in previous session and cannot be used here!"
    );
    return;
  }

  tyre.state = TyreStates.USED;
  if (tyre.sessionsUsedIn) {
    if (tyre.sessionsUsedIn.some((s) => s._id === session._id)) {
      return;
    }
    tyre.sessionsUsedIn.push(session);
  } else {
    tyre.sessionsUsedIn = [session];
  }
  setTyreSets((prevTyreSets) => {
    const updatedTyreSets = [...prevTyreSets];
    const targetTyreIndex = updatedTyreSets.findIndex(
      // @ts-ignore
      (t) => t._id.toString() === tyre._id
    );
    updatedTyreSets[targetTyreIndex] = tyre;
    return updatedTyreSets;
  });
};

export const handleReturnTyreSet = (
  tyre: TyreSet,
  session: Session,
  sessions: Session[],
  setTyreSets: Dispatch<SetStateAction<TyreSet[]>>,
  setSessions: Dispatch<SetStateAction<Session[]>>
) => {
  // Get future sessions right after current session
  const sessionIndex = sessions.findIndex((s) => s._id === session._id);
  const futureSessions = sessions.slice(sessionIndex + 1);
  if (session.tyresToReturn?.some((r) => r._id === tyre._id)) {
    session.tyresToReturn = session.tyresToReturn.filter((r) => r._id !== tyre._id);
  } else {
    if (session.tyresToReturn && session.tyresToReturn.length >= session.numOfReturns) {
      alert("Maximum tyre returns reached for this session");
      return;
    }
    if (!session.tyresToReturn) {
      session.tyresToReturn = [];
    }
    session.tyresToReturn.push(tyre);

    // Remove tyre set from future sessions
    futureSessions.forEach((futureSession) => {
      if (tyre.sessionsUsedIn) {
        tyre.sessionsUsedIn = tyre.sessionsUsedIn.filter(
          (s) => s._id !== futureSession._id
        );
      }
      // Remove tyre set from any future session's return list
      if (futureSession.tyresToReturn) {
        futureSession.tyresToReturn = futureSession.tyresToReturn.filter(
          (r) => r._id !== tyre._id
        );
      }
    });
    setTyreSets((prevTyreSets) => {
      const updatedTyreSets = [...prevTyreSets];
      const targetTyreIndex = updatedTyreSets.findIndex(
        (t) => t._id && t._id === tyre._id
      );
      updatedTyreSets[targetTyreIndex] = tyre;
      return updatedTyreSets;
    });
  }
  setSessions((prevSessions) => {
    const updatedSessions = [...prevSessions];
    futureSessions.forEach((futureSession) => {
      const targetFuruteSessionIndex = updatedSessions.findIndex(
        (s) => s._id === futureSession._id
      );
      updatedSessions[targetFuruteSessionIndex] = futureSession;
    });
    const targetSessionIndex = updatedSessions.findIndex(
      (s) => s._id === session._id
    );
    updatedSessions[targetSessionIndex] = session;
    return updatedSessions;
  });
};

export const handleDeleteTyreSet = (
  tyre: TyreSet,
  setTyreSets: Dispatch<SetStateAction<TyreSet[]>>,
  session: Session,
  setSessions: Dispatch<SetStateAction<Session[]>>
) => {
  if (session.tyresToReturn?.some((t) => t._id === tyre._id)) {
    session.tyresToReturn = session.tyresToReturn.filter((t) => t._id !== tyre._id);
    setSessions((prevSessions) => {
      const updatedSessions = [...prevSessions];
      const targetSessionIndex = updatedSessions.findIndex(
        (s) => s._id === session._id
      );
      updatedSessions[targetSessionIndex] = session;
      return updatedSessions;
    });
  }
  // @ts-ignore
  tyre.sessionsUsedIn = tyre.sessionsUsedIn.filter((s) => s._id !== session._id);
  if (!tyre.sessionsUsedIn.length) {
    tyre.state = TyreStates.NEW;
  }
  setTyreSets((prevTyreSets) => {
    const updatedTyreSets = [...prevTyreSets];
    const targetTyreIndex = updatedTyreSets.findIndex(
      (t) => t._id === tyre._id
    );
    updatedTyreSets[targetTyreIndex] = tyre;
    return updatedTyreSets;
  });
};
