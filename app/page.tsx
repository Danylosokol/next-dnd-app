"use client";

import React, { useEffect, useState } from "react";

import AddWeekendBtn from "./components/AddWeekendBtn/AddWeekendBtn";
import CircularProgress from "@mui/material/CircularProgress";
import { Types } from "mongoose";
import { Weekend } from "@/types/Weekend";
import WeekendCard from "./components/WeekendCard/WeekendCard";
import axios from "axios";
import { useConfirm } from "material-ui-confirm";

export default function Home() {
  const [allWeekends, setAllWeekends] = useState<Weekend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const confirm = useConfirm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/weekends");
      setAllWeekends(response.data as Weekend[]);
    } catch (error) {
      console.error("Error while getting all weekends: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWeekendDelete = async (id: Types.ObjectId) => {
    confirm({
      description: "Are you sure you want to delete this Race Weekend?",
    })
      .then(async () => {
        try {
          const response = await axios.delete(`/api/weekend?id=${id}`);
          alert("Selected Race Weekend have been successfully deleted!");
          const updatedWeekends = allWeekends.filter(
            (weekend) => weekend._id !== id
          );
          setAllWeekends(updatedWeekends);
        } catch (error) {
          alert("Something went wrong!");
          console.error("Error while deleting weekend:", error);
        }
      })
      .catch(() => {});
  };

  return (
    <>
      <h1 className="text-3xl mb-5">Race Weekends</h1>
      <section className="flex gap-10 flex-wrap">
        {!loading ? (
          allWeekends.length ? (
            allWeekends.map((weekend, key) => (
              <WeekendCard
                weekend={weekend}
                key={key}
                onDelete={handleWeekendDelete}
              />
            ))
          ) : (
            <span className="block mx-auto mt-20">No Weekends found...</span>
          )
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
      </section>
      <AddWeekendBtn />
    </>
  );
}
