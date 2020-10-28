import React, { useEffect, useState } from "react";
import Transaction from "../entity/Transaction";
import { useHistory, useParams } from "react-router-dom";
import { ipcRenderer } from "electron";
import { useForm } from "react-hook-form";
import Contact from "../entity/Contact";
import "./style/AddTransaction.scss";

export default function AddTransaction() {
  const { register, handleSubmit, watch } = useForm<Transaction>();
  const [contact, setContact] = useState<Contact | null>(null);
  const history = useHistory();
  const params: { [key: string]: string } = useParams();
  const watchType = watch("type");

  useEffect(() => {
    ipcRenderer.invoke("GET_CONTACT", params.contactId).then(setContact);
  }, []);

  async function storeTransaction(transaction: Transaction) {
    transaction.sum = +transaction.sum;

    transaction.date = new Date(transaction.date);
    transaction.date.setHours(0, 0, 0, 0);

    if (contact) {
      transaction.contact = contact;
    }
    ipcRenderer.send("ADD_NEW_TRANSACTION", transaction);
    history.push("/transactions");
  }

  return (
    <div id="add-transaction">
      <h1>
        Adding New Transaction to
        {contact ? ` ${contact.firstName} ${contact.lastName}` : "..."}
      </h1>
      <form id="transactionFrom" onSubmit={handleSubmit(storeTransaction)}>
        <h2>You are {watchType == "loan" ? "lend" : "borrow"}ing money.</h2>
        <div id="options">
          <label
            htmlFor="loan-choice"
            id={watchType == "loan" ? "active" : "inactive"}
          >
            -
          </label>
          <input
            type="radio"
            id="loan-choice"
            name="type"
            value="loan"
            ref={register}
            defaultChecked
          />

          <label
            htmlFor="borrow-choice"
            id={watchType == "borrow" ? "active" : "inactive"}
          >
            +
          </label>
          <input
            type="radio"
            id="borrow-choice"
            name="type"
            value="borrow"
            ref={register}
          />
        </div>

        <label htmlFor="date">Date</label>
        <input
          type="date"
          name="date"
          id="date"
          defaultValue={new Date().toISOString().substring(0, 10)}
          ref={register({
            required: true,
            validate: (value) => new Date(value) <= new Date(),
          })}
        />

        <label htmlFor="sum">Sum</label>
        <input
          type="number"
          name="sum"
          id="sum"
          step="0.01"
          ref={register({ required: true })}
        />

        <label htmlFor="mentions">Mentions</label>
        <textarea
          name="mentions"
          id="mentions"
          rows={5}
          cols={50}
          ref={register}
        />

        <input type="submit" value="Create New Transaction" />
      </form>
    </div>
  );
}
