import React from 'react'
import { Segment } from 'semantic-ui-react'


const Timer = ({timeLeft}) => (
  <Segment>
      <p>Timer</p>
      <p>{timeLeft && `Remain: ${timeLeft.days} Days ${timeLeft.hours} Hours ${timeLeft.minutes} min ${timeLeft.seconds} sec`}</p>
  </Segment>
)

export default Timer
