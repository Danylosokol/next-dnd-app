"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { Button } from "@mui/material";
import { Card } from "@mui/material";
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import ListOfSessions from "../ListOfSessions/ListOfSessions";
import { MenuItem } from "@mui/material";
import { Session } from "@/types/Session";
import { SessionType } from "@/app/utils/consts/SessionConsts";
import { TextField } from "@mui/material";
import { validateNumberInput } from "@/app/utils/inputValidation";

function SessionForm({
  sessions,
  setSessions,
}: {
  sessions: Session[];
  setSessions: Dispatch<SetStateAction<Session[]>>;
}) {
  const [name, setName] = useState("");
  const [returns, setReturns] = useState<number | null>(null);
  const [type, setType] = useState<SessionType | null>(null);
  const [editingSessionIndex, setEditingSessionIndex] = useState<number | null>(
    null
  );

  const handleTypeChange = (event: SelectChangeEvent) => {
    setType(event.target.value as SessionType);
  };

  const handleAddOrEditSession = () => {
    if (!type) {
      alert("Select valid type of the session!");
      return;
    }
    if (!name.length) {
      alert("Enter name of the session!");
      return;
    }
    if (typeof returns !== "number" || returns < 0) {
      alert("Enter a valid number of returns for the session!");
      return;
    }
    const newSession: Session = {
      name: name,
      type: type,
      numOfReturns: returns,
    };
    if (typeof editingSessionIndex === "number") {
      const updatedSessions = [...sessions];
      updatedSessions[editingSessionIndex] = newSession;
      setSessions(updatedSessions);
      setEditingSessionIndex(null);
    } else {
      setSessions([...sessions, newSession]);
    }
    setName("");
    setReturns(null);
    setType(null);
  };

  const handleDeleteSession = (index: number) => {
    const updatedSessions = sessions.filter((_, indx) => indx !== index);
    setSessions(updatedSessions);
  };

  const handleEditSession = (index: number) => {
    const session = sessions[index];
    setName(session.name);
    setReturns(session.numOfReturns);
    setType(session.type);
    setEditingSessionIndex(index);
  };

  return (
    <Card variant="outlined" className="p-3 box-border">
      <h2 className="text-xl mb-2">Create sessions</h2>
      <p className="mb-5">Race session will be created automatically</p>
      <div className="flex flex-col gap-5 mb-5">
        <TextField
          id="session-name"
          label="Session Name"
          variant="outlined"
          className="w-full md:w-[50%]"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
        />
        <TextField
          id="returns"
          label="Number of returns"
          variant="outlined"
          className="w-full md:w-[50%]"
          type="number"
          value={returns ?? ""}
          onChange={(event) =>
            setReturns(
              event.currentTarget.value === ""
                ? null
                : parseInt(event.currentTarget.value)
            )
          }
          onBlur={(event) => {
            if (!validateNumberInput(event.currentTarget.value)) {
              alert("Value must be 0 or greater.");
            }
          }}
        />
        <FormControl className="w-full md:w-[50%]">
          <InputLabel id="demo-simple-select-label">Session Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={type ?? ""}
            label="Age"
            onChange={handleTypeChange}
          >
            <MenuItem value={SessionType.FREE_PRACTICE}>Free Practice</MenuItem>
            <MenuItem value={SessionType.QUALIFYING}>
              Qualifying Session
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      <Button variant="outlined" onClick={handleAddOrEditSession}>
        {editingSessionIndex ? "Edit Session" : "Add Session"}
      </Button>
      <ListOfSessions
        sessions={sessions}
        onDeleteSession={handleDeleteSession}
        onEditSession={handleEditSession}
      />
    </Card>
  );
}

export default SessionForm;
