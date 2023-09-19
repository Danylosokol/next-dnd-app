import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Link from "next/link";
import React from "react";

function AddWeekendBtn() {
  return (
    <Fab
      style={{
        position: "absolute",
        bottom: "30px",
        right: "30px",
      }}
      color="primary"
      aria-label="add weekend"
      variant="extended"
    >
      <Link
        href="/create-weekend"
        className="outline-none text-white no-underline h-full flex items-center"
      >
        <AddIcon />
        Weekend
      </Link>
    </Fab>
  );
}

export default AddWeekendBtn;
