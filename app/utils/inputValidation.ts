import { Session } from "@/types/Session";
import { SessionType } from "./consts/SessionConsts";

interface ValidationResponse {
  isValid: boolean;
  errorMessage: string;
}

export function validateNumberInput(value: string) {
  if (value === "") return true;
  const parsedValue = parseInt(value);
  return !isNaN(parsedValue) && parsedValue >= 0;
}

export const validateWeekendForm = (
  name: string,
  softTyres: number | null,
  mediumTyres: number | null,
  hardTyres: number | null,
  sessions: Session[]
): ValidationResponse => {
  if(!name.length){
    return {
      isValid: false,
      errorMessage: "Name is required!",
    };
  }
  if (
    softTyres === null ||
    mediumTyres === null ||
    hardTyres === null ||
    softTyres < 0 ||
    mediumTyres < 0 ||
    hardTyres < 0
  ) {
    return {
      isValid: false,
      errorMessage: "All types of tyres have to have a valid number of sets"
    }
  }

  const totalTyres = softTyres + mediumTyres + hardTyres;

  const totalReturns = sessions.reduce((current, session) => (current += session.numOfReturns), 0);
  console.log(totalReturns);
  if(totalReturns >= totalTyres){
    return {
      isValid: false,
      errorMessage: "Total returning tyre sets have to be less than total tyre sets.",
    };
  }

  return {
    isValid: true,
    errorMessage: "",
  }
};
