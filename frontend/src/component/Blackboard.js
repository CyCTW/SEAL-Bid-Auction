import React from "react";

const Blackboard = ({ isSubmitted, iter, round, isWinner }) => (
  <div className="ui inverted segment">
    <h1>Black Board</h1>
    <h2>
      Now is{" "}
      {round === 0
        ? "commitment"
        : round < 3
        ? `iteration ${iter}, round ${round}`
        : `Auction end... You ${isWinner ? "win!":"lose"}` }
    </h2>

    {isSubmitted ? (
      <h3>You have submitted proof, wait for others...</h3>
    ) : (
        <div>
        {round < 3 &&
            <h2>
                You have to submit {round > 0 ? "your public key" : "your bij"} and
                its zk-proof
            </h2> 
        }
        </div>
    )}
  </div>
);

export default Blackboard;
