import { Button, Grid, TextField } from "@mui/material";
import { useState } from "react";

const menus = ["youtubeCode", "stockName", "description"];

const initBoard = {
  youtubeCode: "",
  thumbnailUrl: "",
  stockName: "",
  description: "",
};

export const Boards = ({ boards, setBoards }) => {
  const [currentBoard, setCurrentBoard] = useState(initBoard);
  return (
    <Grid item xs={4}>
      <div>
        {menus.map((menu) => {
          return (
            <TextField
              id={menu}
              name={menu}
              value={currentBoard[menu]}
              onChange={(e) =>
                setCurrentBoard({ ...currentBoard, [menu]: e.target.value })
              }
              label={menu}
              InputLabelProps={{ shrink: true }}
              sx={{ marginBottom: 2 }}
            />
          );
        })}
        <Button
          onClick={() => {
            setBoards([currentBoard, ...boards]);
            setCurrentBoard(initBoard);
          }}
        >
          Add
        </Button>
      </div>
      {JSON.stringify(boards)}
    </Grid>
  );
};
