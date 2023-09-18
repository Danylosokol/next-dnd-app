"use client";

import React, { FC, useEffect, useState } from "react";
import { calculateAvailableTyreSets, checkForShortage } from "@/app/utils/dashboardLogic";

import { Button } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { Session } from "@/types/Session";
import SessionArea from "@/app/components/SessionArea/SessionArea";
import { TyreSet } from "@/types/TyreSet";
import TyreSetCard from "@/app/components/TyreSetCard/TyreSetCard";
import { Weekend } from "@/types/Weekend";
import axios from "axios";
import stringify from "json-stringify-safe";
import { useConfirm } from "material-ui-confirm";
import { useRouter } from "next/navigation";

interface pageProps {
  params: { id: string };
}

const Dashboard: FC<pageProps> = ({ params }) => {
  const [weekend, setWeekend] = useState<Weekend | null>(null);
  const [tyreSets, setTyreSets] = useState<TyreSet[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [availableTyreSets, setAvailableTyreSets] = useState<TyreSet[]>([]);
  const { back } = useRouter();
  const confirm = useConfirm();

  useEffect(() => {
    const id = params.id;
    if (typeof id === null) {
      alert("Weekend ID is required.");
      back();
    }
    getWeekendData(id);
  }, []);

  useEffect(() => {
    calculateAvailableTyreSets(sessions, tyreSets, setAvailableTyreSets);
    if(!checkForShortage(sessions, availableTyreSets, tyreSets)){
      alert(
        "You have allocated all tyre sets to other sessions. Please ensure at least one new tyre set is reserved for the Race session!"
      );
    }
  }, [sessions, tyreSets]);

  const getWeekendData = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/weekend?id=${id}`);
      const weekend = response.data as Weekend;
      setWeekend(weekend);
      setTyreSets(weekend.tyreSets);
      setSessions(weekend.sessions);
    } catch (error) {
      alert("Couldn't find weekend with this ID.");
      console.error("Error while opening dashboard: ", error);
      back();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const cleanData = JSON.parse(stringify({ sessions, tyreSets }));
      await axios.put('/api/dashboard', cleanData);
      alert("Dashboard saved successfully!");
    } catch (error) {
      console.error("Error while saving dashboard: ", error);
      alert("Something went wrong. Please try again later!");
    }
  }

  const handleBack = () => {
    confirm({
      description: "Make sure to save changes",
    })
      .then(async () => {
        back();
      })
      .catch(() => {});
  };

  return (
    <>
      {!loading ? (
        <section className="flex w-full flex-col items-center">
          <h1 className="text-2xl my-3">{weekend?.name}</h1>
          <section className="flex flex-col justify-center md:flex-row w-full gap-5 mb-5">
            <div className="max-w-full md:max-w-[12%] h-auto md:h-[75dvh] rounded-mb">
              <div className="sticky top-0 left-0 bg-gray-50">
                <h2>Tyre sets:</h2>
              </div>
              <div className="h-auto md:h-[62dvh] lg:h-[61dvh] xl:h-[65dvh] 2xl:h-[62dvh] overflow-x-auto md:overflow-y-auto">
                <div className="flex flex-row md:flex-col gap-2 w-full">
                  {availableTyreSets.map((tyreSets: TyreSet, key: number) => (
                    <TyreSetCard tyreSet={tyreSets} key={`tyreset-${key}`} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex w-auto max-w-full md:max-w-[87%] overflow-x-scroll">
              <div className="flex flex-nowrap gap-5">
                {sessions.map((session: Session, key: number) => (
                  <SessionArea
                    key={`session-${key}`}
                    sessions={sessions}
                    session={session}
                    setSessions={setSessions}
                    tyreSets={tyreSets}
                    setTyreSets={setTyreSets}
                  />
                ))}
              </div>
            </div>
          </section>
          <section className="flex gap-5">
            <Button variant="contained" onClick={() => handleSave()}>
              Save Changes
            </Button>
            <Button variant="contained" onClick={() => handleBack()}>
              Back
            </Button>
          </section>
        </section>
      ) : (
        <CircularProgress
          style={{
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "25dvh",
          }}
        />
      )}
    </>
  );
};

export default Dashboard;
