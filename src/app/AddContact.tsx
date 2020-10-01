import React, { useState, ChangeEvent } from "react";
import Contacts from "./Contacts";
import { ContactModel } from "../database";
import { Contact } from "../types";
import { useHistory } from "react-router-dom";

function AddContact() {
  const [newContact, setNewContact] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  } as Contact);
  const history = useHistory();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setNewContact({ ...newContact, [event.target.name]: event.target.value });
  }

  async function storeContact() {
    const person = await ContactModel.create(newContact);
    console.log(await ContactModel.findAll());
    history.push("/contacts");
  }

  return (
    <div id="contactForm">
      <label htmlFor="firstName">First Name:</label>
      <input
        type="text"
        name="firstName"
        id="firstName"
        value={newContact.firstName}
        onChange={handleChange}
      />
      <label htmlFor="lastName">Last Name:</label>
      <input
        type="text"
        name="lastName"
        id="lastName"
        value={newContact.lastName}
        onChange={handleChange}
      />
      <label htmlFor="phone">Phone:</label>
      <input
        type="tel"
        name="phone"
        id="phone"
        value={newContact.phone}
        onChange={handleChange}
      />
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        name="email"
        id="email"
        value={newContact.email}
        onChange={handleChange}
      />
      <button onClick={storeContact}>Create New Contact</button>
    </div>
  );
}

export default AddContact;
