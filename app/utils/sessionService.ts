import { Session } from "@/types/Session";
import { SessionType } from "./consts/SessionConsts";

const sessionOrder = {
  [SessionType.FREE_PRACTICE]: 1,
  [SessionType.QUALIFYING]: 2,
  [SessionType.RACE]: 3,
};

export const SortSessions = (a:Session, b:Session) => {
  if (sessionOrder[a.type] !== sessionOrder[b.type]) {
    return sessionOrder[a.type] - sessionOrder[b.type];
  }

  const aNumber = getNumberFromName(a.name);
  const bNumber = getNumberFromName(b.name);

  if (aNumber !== null && bNumber !== null) {
    return aNumber - bNumber;
  }

  if (aNumber !== null) {
    return 1;
  }
  if (bNumber !== null) {
    return -1;
  }

  return a.name.localeCompare(b.name);
};

const getNumberFromName = (name: string) => {
  const match = name.match(/\d+/);
  console.log(match);
  return match ? parseInt(match[0], 10) : null;
};
