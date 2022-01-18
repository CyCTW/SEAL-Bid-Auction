import React from "react";
import { Button, Header, Image, Modal, Form } from "semantic-ui-react";
import DateTimePicker from "react-datetime-picker";
import { addAuction, getMainContract } from "../utils";
import { useState, useEffect } from "react";

function NewAuctionModal() {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [expiredDate, setExpiredDate] = useState();

  const handleSubmit = async () => {
    const auctionInfo = {...name, ...description, expired_date: expiredDate}
    const mainContract = await getMainContract();
    addAuction(mainContract, auctionInfo).then((res) =>{
        console.log(res)
    }
    ).catch(err => {
        console.log(err)
    })
    setOpen(false)
  };
  const handleName = (e) => {
    setName({ name: e.target.value });
  };
  const handleDescription = (e) => {
    setDescription({ description: e.target.value });
  };

  const handleImage = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImage({
        image: URL.createObjectURL(img),
      });
    }
  };
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Create Auction</Button>}
    >
      <Modal.Header>Create an Auction</Modal.Header>
      <Modal.Content image>
        <Modal.Description>

          <Header>Auction Detail</Header>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <label>Name</label>
              <input placeholder="name" onChange={handleName} />
            </Form.Field>
            <Form.Field>
              <label>Description</label>
              <input placeholder="description" onChange={handleDescription} />
            </Form.Field>
            <Form.Field>
                <label>Expired Date</label>
            </Form.Field>
            {/* <img src={image} /> */}
            {/* <Form.Field>
              <label>Image</label>
              <input type="file" name="myImage" onChange={handleImage} />
            </Form.Field> */}
          </Form>
          <DateTimePicker onChange={setExpiredDate} value={expiredDate} />

        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          content="Create"
          labelPosition="right"
          icon="checkmark"
          onClick={handleSubmit}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}

export default NewAuctionModal;
