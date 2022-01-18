import React from "react";
import { Grid } from "semantic-ui-react";

const Voter = ({ isSubmitted, isWinner }) => (
  <Grid.Column>
    <button
      className={
        isWinner
          ? "circular ui yellow icon button"
          : isSubmitted
          ? "circular ui green icon button"
          : "circular ui gray icon button"
      }
    ></button>
  </Grid.Column>
);

export default Voter;
