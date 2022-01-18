import React from "react";

const Blackboard = ({ isSubmitted, iter, round, isWinner }) => (
  <div className="ui inverted segment">
    {/* <h1>Black Board</h1> */}
    <h2>
      {round === 0
        ? " Now is commitment"
        : round < 3
        ? `Now is iteration ${iter}, round ${round}`
        : `Auction end... You ${isWinner ? "win!":"lose"}` }
    </h2>

    {isSubmitted && round < 3 ? (
      <h3>You have submitted proof, wait for others...</h3>
    ) : (
        <div>
        {round < 3 &&
            <h2>
                You have to submit {round === 1 ? "your public key" : "your bij"} and
                its zk-proof
            </h2> 
        }
        </div>
    )}
  </div>
);

export default Blackboard;
