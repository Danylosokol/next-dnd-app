"use client";

import { Dispatch, FC, SetStateAction } from "react";
import {
  handleDeleteTyreSet,
  handleDrop,
  handleReturnTyreSet,
} from "@/app/utils/sessionAreaHandlers";

import { AiFillDelete } from "react-icons/ai";
import Checkbox from "@mui/material/Checkbox";
import { Session } from "@/types/Session";
import { SessionType } from "@/app/utils/consts/SessionConsts";
import { TyreSet } from "@/types/TyreSet";
import TyreSetCard from "../TyreSetCard/TyreSetCard";
import { useDrop } from "react-dnd";

type pageProps = {
  sessions: Session[];
  session: Session;
  setSessions: Dispatch<SetStateAction<Session[]>>;
  tyreSets: TyreSet[];
  setTyreSets: Dispatch<SetStateAction<TyreSet[]>>;
};

type TyreId = {
  id: string;
};

const SessionArea: FC<pageProps> = ({
  sessions,
  session,
  setSessions,
  tyreSets,
  setTyreSets,
}) => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "tyre",
      drop: (item: TyreId, monitor) =>
        handleDrop(item, session, sessions, tyreSets, setTyreSets),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [session]
  );

  const findTyresForSession = (session: Session): TyreSet[] => {
    const matched: TyreSet[] = tyreSets.filter(
      (tyre) =>
        tyre.sessionsUsedIn &&
        tyre.sessionsUsedIn.some((s) => s._id?.toString() === session._id?.toString())
    );
    return matched;
  };

  return (
    <div
      className="inline-block box-border w-[13rem] h-[75dvh] rounded-md"
      ref={drop}
    >
      <div className="sticky top-0 z-10 bg-slate-600 pt-3 pb-1 px-2 text-center text-white rounded-t-md">
        <h1 className="my-0 text-xl select-none">{session.name}</h1>
        <p className="my-1 text-sm select-none">
          {session.type === SessionType.FREE_PRACTICE
            ? "Free Practise"
            : session.type === SessionType.QUALIFYING
            ? "Qualifying Session"
            : "Race Session"}
        </p>
        {session.type === SessionType.RACE ? (
          <p className="my-2 font-semibold select-none">No returns</p>
        ) : (
          <p className="my-2 font-semibold select-none">
            Returned: {session.tyresToReturn ? session.tyresToReturn.length : 0}/
            {session.numOfReturns}
          </p>
        )}
      </div>
      <div className="px-1 py-3 bg-gray-400 h-[58dvh] rounded-b-md overflow-y-auto">
        <div className="flex flex-col w-full">
          {findTyresForSession(session).map((tyre: TyreSet, key: number) => (
            <div
              className="flex w-full justify-between items-center"
              key={`tyresetWithCheck-${key}`}
            >
              {session.type !== SessionType.RACE && (
                <Checkbox
                  checked={session.tyresToReturn?.some((t) => t._id === tyre._id)}
                  onChange={() =>
                    handleReturnTyreSet(
                      tyre,
                      session,
                      sessions,
                      setTyreSets,
                      setSessions
                    )
                  }
                  inputProps={{ "aria-label": "controlled" }}
                  className="my-0"
                />
              )}
              <TyreSetCard tyreSet={tyre} />
              <AiFillDelete
                onClick={() =>
                  handleDeleteTyreSet(tyre, setTyreSets, session, setSessions)
                }
                className="text-[1.5rem] w-16 hover:opacity-75 hover:cursor-pointer active:opacity-50"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SessionArea;
