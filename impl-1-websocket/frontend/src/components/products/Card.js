import React from "react";
import { Button, Header, Icon, Image, Segment } from "semantic-ui-react";
import { deleteAuction } from "../api/utils";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const cardStyle = {
  height: "40vh",
};

const imgStyle = {
  width: "30vw",
  height: "20vh",
};
const Card = ({ id, name, img, expired_date, setFetch }) => {
  const handleDelete = () => {
    deleteAuction(id)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setFetch((fetch) => !fetch);
  };

  return (
    <Segment style={cardStyle}>
      <Link to={`/${id}`}>
        <Header>
          <Image src={require("../../img/bid.png")} style={imgStyle} rounded />
        </Header>
        <h2>{name}</h2>
        <p>Expired Date: {expired_date}</p>
      </Link>
      <Segment.Inline>
        {/* <button class="ui primary button" onClick={() => window.location = '/objectpage'}>Join</button> */}
        <Link to={`/${id}`}>
          <button className="ui primary button">Join</button>
        </Link>

        <button className="ui red button" onClick={handleDelete}>
          Delete
        </button>
        {/* <button className="ui button">View</button> */}
      </Segment.Inline>
    </Segment>
  );
};

export default Card;
