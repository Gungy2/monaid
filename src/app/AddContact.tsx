import React, { useState, ChangeEvent } from "react";
import Contact from "../entity/Contact";
import { useHistory } from "react-router-dom";
import { ipcRenderer } from "electron";

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
    ipcRenderer.send("ADD_NEW_CONTACT", newContact);
    history.push("/contacts");
  }

  return (
    <>
      <h1>Adding new Contact</h1>
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
    </>
  );
}

export default AddContact;
