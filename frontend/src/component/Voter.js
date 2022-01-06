import React from 'react'
import { Grid } from 'semantic-ui-react';


const Voter = ({isSubmitted}) => (
  <Grid.Column>
      <button className={isSubmitted ? "circular ui green icon button":"circular ui gray icon button"}></button>
  </Grid.Column>
  
)

export default Voter


