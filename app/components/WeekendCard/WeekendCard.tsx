import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import Link from "next/link";
import React from "react";
import { Types } from "mongoose";
import { Weekend } from "@/types/Weekend";
import { useRouter } from "next/navigation";

type Props = {
  weekend: Weekend;
  onDelete: (id: Types.ObjectId) => void;
};

function WeekendCard({ weekend, onDelete }: Props) {
  const { push } = useRouter();

  const openDashboard = () => {
    push(`/dashboard/${weekend._id}`);
  };

  return (
    <Card className="hover:cursor-pointer w-full sm:w-[49%] md:w-[30%]" onClick={openDashboard}>
      <CardContent>
        <h2 className="truncate select-none">{weekend.name}</h2>
        <ul className="m-0 p-0 list-none">
          <li className="mb-2 select-none">
            <b>Sessions: </b>
            {weekend.sessions.length}
          </li>
          <li className="select-none">
            <b>Sets: </b>
            {weekend.tyreSets.length}
          </li>
        </ul>
      </CardContent>
      <CardActions className="flex justify-around">
        <Link
          href={`/edit-weekend?id=${weekend._id}`}
          onClick={(event) => {
            event.stopPropagation();
          }}
          className="w-[1.5rem] h-[1.5rem] flex justify-center items-center"
        >
          <IconButton aria-label="edit weekend">
            <EditIcon className="text-gray-500 w-auto" />
          </IconButton>
        </Link>
        <IconButton
          aria-label="delete weekend"
          onClick={(event) => {
            event.stopPropagation();
            // @ts-ignore
            onDelete(weekend._id);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default WeekendCard;
