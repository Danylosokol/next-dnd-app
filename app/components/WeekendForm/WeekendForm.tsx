import React, { Dispatch, FC, SetStateAction } from "react";

import Alert from "@mui/material/Alert";
import { Button } from "@mui/material";
import { Paper } from "@mui/material";
import { Session } from "@/types/Session";
import SessionForm from "../SessionForm/SessionForm";
import { TextField } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useRouter } from "next/navigation";
import { validateNumberInput } from "@/app/utils/inputValidation";

type pageProps = {
  creating: boolean;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  softTyres: number | null;
  setSoftTyres: Dispatch<SetStateAction<number | null>>;
  mediumTyres: number | null;
  setMediumTyres: Dispatch<SetStateAction<number | null>>;
  hardTyres: number | null;
  setHardTyres: Dispatch<SetStateAction<number | null>>;
  sessions: Session[];
  setSessions: Dispatch<SetStateAction<Session[]>>;
  handleSubmit: () => void;
};

const WeekendForm: FC<pageProps> = ({
  creating,
  name,
  setName,
  softTyres,
  setSoftTyres,
  mediumTyres,
  setMediumTyres,
  hardTyres,
  setHardTyres,
  sessions,
  setSessions,
  handleSubmit,
}) => {
  const { back } = useRouter();
  const confirm = useConfirm();

  const handleBack = () => {
    confirm({
      description: "You will leave this page without saving changes?",
    })
      .then(async () => {
        back();
      })
      .catch(() => {});
  };

  return (
    <Paper className="w-full md:w-[90%] p-10 box-border">
      <h2 className="text-2xl mb-5">Weekend Form</h2>
      {!creating && (
        <Alert severity="warning" className="mb-5">
          Editing weekend will reset the dashboard for this weekend!
        </Alert>
      )}
      <div className="flex flex-col gap-5 mb-5">
        <TextField
          id="weekend-name"
          label="Weekend Name"
          variant="outlined"
          className="w-full md:w-[50%]"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
        />
        <TextField
          id="soft-tyres"
          label="Number of soft tyres"
          variant="outlined"
          className=" w-full md:w-[50%]"
          type="number"
          value={softTyres ?? ""}
          onChange={(event) =>
            setSoftTyres(
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
        <TextField
          id="medium-tyres"
          label="Number of meduim tyres"
          variant="outlined"
          className="w-full md:w-[50%]"
          type="number"
          value={mediumTyres ?? ""}
          onChange={(event) =>
            setMediumTyres(
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
        <TextField
          id="hard-tyres"
          label="Number of hard tyres"
          variant="outlined"
          className="w-full md:w-[50%]"
          type="number"
          value={hardTyres ?? ""}
          onChange={(event) =>
            setHardTyres(
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
        <SessionForm sessions={sessions} setSessions={setSessions} />
      </div>
      <div className="flex gap-10">
        <Button
          onClick={handleSubmit}
          variant="contained"
          data-testid="button-save"
        >
          {creating ? "Save weekend" : "Save changes"}
        </Button>
        <Button onClick={handleBack} variant="contained">
          Back
        </Button>
      </div>
    </Paper>
  );
};

export default WeekendForm;
