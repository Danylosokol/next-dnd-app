"use client";

import { TyreStates, TyreTypes } from "@/app/utils/consts/TyreConsts";

import React from "react";
import { TyreSet } from "@/types/TyreSet";
import { useDrag } from "react-dnd";

function TyreSetCard({ tyreSet }: { tyreSet: TyreSet }) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "tyre",
      item: { id: tyreSet._id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [tyreSet._id]
  );

  return (
    <div
      className={`${
        tyreSet.type === TyreTypes.SOFT
          ? "bg-green-300"
          : tyreSet.type === TyreTypes.MEDIUM
          ? "bg-yellow-300"
          : "bg-white"
      } box-border select-none rounded-md py-0.5 px-1 border-solid border-2 w-full ${
        tyreSet.state === TyreStates.NEW ? "border-green-500" : "border-red-500"
      } ${isDragging ? "opacity-50" : "opacity-100"}`}
      ref={drag}
    >
      {tyreSet._id &&
        tyreSet._id
          .toString()
          .substring(tyreSet._id.toString().length - 4)}{" "}
      {" - "}
      {tyreSet.state === TyreStates.NEW ? "New" : "Used"}
    </div>
  );
}

export default TyreSetCard;
