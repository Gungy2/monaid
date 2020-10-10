import React, { useState, useEffect } from "react";
import Contact from "../entity/Contact";
import { ipcRenderer } from "electron";
import { Link } from "react-router-dom";
//import "./style/Contacts.scss"

export default function Contacts() {
  const [contacts, setContacts] = useState([] as Contact[]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    ipcRenderer.invoke("GET_ALL_CONTACTS").then(setContacts);
  }, []);

  return (
    <>
      <input
        type="search"
        name="search-contacts"
        id="search-contacts"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <div id="contacts">
        {contacts
          .filter(
            ({ firstName, lastName }) =>
              `${firstName} ${lastName}`
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              `${lastName} ${firstName}`
                .toLowerCase()
                .includes(search.toLowerCase())
          )
          .map(({ firstName, lastName, phone, email, id }) => (
            <div className="contact" key={id}>
              <h2>{`${firstName} ${lastName}`}</h2>
              <h3>{`Phone: ${phone}`}</h3>
              <h3>{`Email: ${email}`}</h3>
              <Link to={`/addTransaction/${id}`}>Add New Transaction</Link>
            </div>
          ))}
      </div>
    </>
  );
}
