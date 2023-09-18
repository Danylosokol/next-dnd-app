import React, { useState } from "react";

import { Button } from "@mui/material";
import { FormControl } from "@mui/material";
import { InputLabel } from "@mui/material";
import { MenuItem } from "@mui/material";
import { Paper } from "@mui/material";
import Select from "@mui/material/Select";
import { Types } from "mongoose";
import { Weekend } from "@/types/Weekend";

type Props = {
  weekends: Weekend[];
  setWeekendFromTemplate: (id: Types.ObjectId) => void;
};

function WeekendTemplate({ weekends, setWeekendFromTemplate }: Props) {
  const [templateId, setTemplateId] = useState<Types.ObjectId | null>(null);
  return (
    <Paper className="w-full md:w-[90%] p-10 box-border">
      <h2 className="text-2xl mb-5">Copy existing weekend:</h2>
      <FormControl className="w-full md:w-[50%]">
        <InputLabel id="demo-simple-select-label">Weekend template</InputLabel>
        <Select
          value={templateId ?? ""}
          label="Weekend template"
          onChange={(event) =>
            setTemplateId(event.target.value as Types.ObjectId)
          }
        >
          {weekends.map((weekend: Weekend, indx: number) => (
            <MenuItem key={indx} value={weekend._id?.toString()}>
              {weekend.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div>
        <Button
          variant="outlined"
          className="mt-3"
          onClick={() => setWeekendFromTemplate(templateId as Types.ObjectId)}
        >
          Copy
        </Button>
      </div>
    </Paper>
  );
}

export default WeekendTemplate;
