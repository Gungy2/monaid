import React from "react";
import Contact from "../entity/Contact";
import { useHistory } from "react-router-dom";
import { ipcRenderer } from "electron";
import { useForm } from "react-hook-form";

export default function AddContact() {
  const { register, handleSubmit } = useForm<Contact>();
  const history = useHistory();

  function storeContact(contact: Contact) {
    contact.firstName = contact.firstName.toLowerCase().trim();
    contact.lastName = contact.lastName.toLowerCase().trim();
    contact.email = contact.email.trim();
    contact.phone = contact.phone.trim();
    ipcRenderer.send("ADD_NEW_CONTACT", contact);
    history.push("/contacts");
  }

  return (
    <>
      <h1>Adding new Contact</h1>
      <form id="contactForm" onSubmit={handleSubmit(storeContact)}>
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          name="firstName"
          id="firstName"
          ref={register({ required: true })}
        />

        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          name="lastName"
          id="lastName"
          ref={register({ required: true })}
        />

        <label htmlFor="phone">Phone:</label>
        <input
          type="tel"
          name="phone"
          id="phone"
          ref={register({ pattern: /\d{10,15}/ })}
        />

        <label htmlFor="email">Email:</label>
        <input type="email" name="email" id="email" ref={register} />

        <input type="submit" value="Create New Contact" />
      </form>
    </>
  );
}
