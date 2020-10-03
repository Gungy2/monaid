import React, { useState, useEffect } from "react";
import Contact from "../entity/Contact";
import { ipcRenderer } from "electron";

function Contacts() {
  const [contacts, setContacts] = useState([] as Contact[]);

  useEffect(() => {
    ipcRenderer.invoke("GET_ALL_CONTACTS").then(setContacts);
  }, []);

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
