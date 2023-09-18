import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from '@mui/material';
import { List } from '@mui/material';
import { ListItem } from '@mui/material';
import { ListItemText } from '@mui/material';
import React from 'react';
import { Session } from '@/types/Session';

type Props = {
  sessions: Session[];
  onDeleteSession: (index: number) => void;
  onEditSession: (index: number) => void;
}

function ListOfSessions({sessions, onDeleteSession, onEditSession}: Props) {
  return (
    <List>
      {sessions.map((session:Session, index) => (
        <ListItem
          key={index}
          secondaryAction={
            <div>
              <IconButton edge="end" onClick={() => onEditSession(index)} aria-label="edit" className="mr-3">
                <EditIcon/>
              </IconButton>
              <IconButton edge="end" onClick={() => onDeleteSession(index)} aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </div>
          }
        >
          <ListItemText
            primary={session.name}
            secondary={`${session.type} - ${session.numOfReturns} tyres to return`}
          />
        </ListItem>
      ))}
    </List>
  );
}

export default ListOfSessions