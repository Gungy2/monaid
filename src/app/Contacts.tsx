import React, { useState, useEffect } from "react";
import { ContactAttributes } from "../types";
import { ContactModel } from "../database";

function Contacts() {
  const [contacts, setContacts] = useState([] as ContactAttributes[]);

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    setContacts(await ContactModel.findAll());
  }

  return (
    <div id="contacts">
      {contacts.map(({ firstName, lastName, phone, email, id }) => (
        <div className="contact" key={id}>
          <h2>{`${firstName} ${lastName}`}</h2>
          <h3>{`Phone: ${phone}`}</h3>
          <h3>{`Email: ${email}`}</h3>
        </div>
      ))}
    </div>
  );
}

export default Contacts;
