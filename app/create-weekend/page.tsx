"use client";

import { copyFromTemplate, getWeekends } from "../utils/weekendService";
import { useEffect, useState } from "react";

import { Session } from "@/types/Session";
import { Types } from "mongoose";
import { Weekend } from "@/types/Weekend";
import WeekendForm from "../components/WeekendForm/WeekendForm";
import WeekendTemplate from "../components/WeekendTemplate/WeekendTemplate";
import { createWeekend } from "../utils/weekendService";
import { useRouter } from "next/navigation";
import { validateWeekendForm } from "../utils/inputValidation";

function CreateWeekend() {
  const [createdWeekends, setCreatedWeekends] = useState<Weekend[]>([]);
  const [name, setName] = useState("");
  const [softTyres, setSoftTyres] = useState<number | null>(null);
  const [mediumTyres, setMediumTyres] = useState<number | null>(null);
  const [hardTyres, setHardTyres] = useState<number | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const { push, back } = useRouter();

  useEffect(() => {
    getWeekends(setCreatedWeekends, back);
  }, []);

  const handleSubmit = async () => {
    const validationResponse = validateWeekendForm(
      name,
      softTyres,
      mediumTyres,
      hardTyres,
      sessions
    );
    if (validationResponse.isValid) {
      const response = await createWeekend(
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
        alert("Weekend was created successfully");
        push("/");
      }
    } else {
      alert(validationResponse.errorMessage);
    }
  };

  const setWeekendFromTemplate = (templateId: Types.ObjectId) => {
    // @ts-ignore
    const template: Weeked = createdWeekends.filter(
      (weekend) => weekend._id === templateId
    )[0];
    if (template) {
      copyFromTemplate(
        template,
        setSoftTyres,
        setMediumTyres,
        setHardTyres,
        setSessions
      );
    }
  };

  return (
    <div className="flex flex-col gap-3 justify-center">
      <h1 className="text-3xl mb-5">Create new Race Weekend</h1>
      {createWeekend.length && (
        <WeekendTemplate
          weekends={createdWeekends}
          setWeekendFromTemplate={setWeekendFromTemplate}
        />
      )}
      <WeekendForm
        creating={true}
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
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default CreateWeekend;
