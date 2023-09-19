"use client";

import React, { useEffect, useState } from "react";
import { getWeekend, updateWeekend } from "../utils/weekendService";

import CircularProgress from "@mui/material/CircularProgress";
import { Session } from "@/types/Session";
import { Weekend } from "@/types/Weekend";
import WeekendForm from "../components/WeekendForm/WeekendForm";
import { useRouter } from "next/navigation";
import { validateWeekendForm } from "../utils/inputValidation";

function EditWeekend() {
  const [weekend, setWeekend] = useState<Weekend | null>(null);
  const [name, setName] = useState("");
  const [softTyres, setSoftTyres] = useState<number | null>(null);
  const [mediumTyres, setMediumTyres] = useState<number | null>(null);
  const [hardTyres, setHardTyres] = useState<number | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const { back, push } = useRouter();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const id: string | null = query.get("id");
    if (typeof id === null) {
      alert("Weekend ID is required.");
      back();
    }
    getWeekend(
      id as string,
      setWeekend,
      setName,
      setSoftTyres,
      setMediumTyres,
      setHardTyres,
      setSessions,
      back
    );
  }, []);

  const handleUpdate = async () => {
    const validationResponse = validateWeekendForm(
      name,
      softTyres,
      mediumTyres,
      hardTyres,
      sessions
    );
    if (validationResponse.isValid) {
      const response = await updateWeekend(
        weekend as Weekend,
        name,
        // @ts-ignore
        softTyres,
        mediumTyres,
        hardTyres,
        sessions
      );
      // @ts-ignore
      if (response.error) {
        alert("Something went wrong...");
      } else {
        alert("Weekend was updated successfully");
        push("/");
      }
    } else {
      alert(validationResponse.errorMessage);
    }
  };

  return (
    <div className="flex flex-col gap-3 justify-center">
      <h1 className="text-3xl mb-5">Edit Race Weekend</h1>
      {name ? (
        <WeekendForm
          creating={false}
          name={name}
          setName={setName}
          softTyres={softTyres}
          setSoftTyres={setSoftTyres}
          mediumTyres={mediumTyres}
          setMediumTyres={setMediumTyres}
          hardTyres={hardTyres}
          setHardTyres={setHardTyres}
          sessions={sessions}
          setSessions={setSessions}
          handleSubmit={handleUpdate}
        />
      ) : (
        <CircularProgress className="block mx-auto mt-20" />
      )}
    </div>
  );
}

export default EditWeekend;
