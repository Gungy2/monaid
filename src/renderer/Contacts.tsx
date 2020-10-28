import React, { useState, useEffect } from "react";
import { Contact } from "../entities";
import { ipcRenderer } from "electron";
import { Link } from "react-router-dom";
import "./style/Contacts.scss";
import Icon from "../../assets/add_trans.svg";

export default function Contacts() {
  const [contacts, setContacts] = useState([] as Contact[]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    ipcRenderer.invoke("GET_ALL_CONTACTS").then(setContacts);
  }, []);

  return (
    <main id="contacts">
      <h1>Contacts</h1>
      <input
        type="search"
        name="search-contacts"
        id="search-contacts"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th id="row-name">Name</th>
            <th id="row-phone">Phone</th>
            <th id="row-email">Email</th>
            <th id="row-trans"></th>
          </tr>
        </thead>
        <tbody>
          {contacts
            .filter(
              ({ firstName, lastName }) =>
                `${firstName} ${lastName}`.includes(search.toLowerCase()) ||
                `${lastName} ${firstName}`.includes(search.toLowerCase())
            )
            .map(({ firstName, lastName, phone, email, id }) => (
              <tr key={id}>
                <td>{`${firstName} ${lastName}`}</td>
                <td>{phone}</td>
                <td>{email}</td>
                <td>
                  <Link to={`/addTransaction/${id}`}>
                    <img src={Icon} alt="Add Transaction" />
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </main>
  );
}
