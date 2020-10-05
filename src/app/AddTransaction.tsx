import React, { useEffect, useState } from "react";
import Transaction from "../entity/Transaction";
import { useHistory, useParams } from "react-router-dom";
import { ipcRenderer } from "electron";
import { useForm } from "react-hook-form";
import Contact from "../entity/Contact";

export default function AddTransaction() {
  const { register, handleSubmit } = useForm<Transaction>();
  const [contact, setContact] = useState<Contact | null>(null);
  const history = useHistory();
  let params: { [key: string]: string } = useParams();

  useEffect(() => {
    ipcRenderer.invoke("GET_CONTACT", params.id).then(setContact);
  }, []);

  async function storeTransaction(transaction: Transaction) {
    transaction.sum = +transaction.sum;
    if (contact) {
      transaction.contact = contact;
    }
    console.log(transaction);
    ipcRenderer.send("ADD_NEW_TRANSACTION", transaction);
    history.push("/transactions");
  }

  return (
    <>
      <h1>
        Adding New Transaction to{" "}
        {contact ? `${contact.firstName} ${contact.lastName}` : "..."}
      </h1>
      <form id="transactionFrom" onSubmit={handleSubmit(storeTransaction)}>
        <label htmlFor="loan-choice">Loan</label>
        <input
          type="radio"
          id="loan-choice"
          name="type"
          value="loan"
          ref={register}
          defaultChecked
        />

        <label htmlFor="borrow-choice">Borrow</label>
        <input
          type="radio"
          id="borrow-choice"
          name="type"
          value="borrow"
          ref={register}
        />

        <label htmlFor="date">Date</label>
        <input
          type="date"
          name="date"
          id="date"
          defaultValue={new Date().toISOString().substring(0, 10)}
          ref={register({ required: true })}
        />

        <label htmlFor="sum">Sum</label>
        <input
          type="number"
          name="sum"
          id="sum"
          step="0.01"
          ref={register({ required: true })}
        />

        <label htmlFor="mentions"></label>
        <textarea name="mentions" id="mentions" ref={register} />

        <input type="submit" value="Create New Transaction" />
      </form>
    </>
  );
}
