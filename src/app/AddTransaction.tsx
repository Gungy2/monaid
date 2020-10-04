import React, { useState, ChangeEvent } from "react";
import Transaction from "../entity/Transaction";
import { useHistory, useParams } from "react-router-dom";
import { ipcRenderer } from "electron";

function AddTransaction() {
  const [newTransaction, setNewTransaction] = useState({
    sum: 0,
    date: new Date(),
    mentions: "",
    type: "loan",
  } as Transaction);
  const history = useHistory();
  let params: { [key: string]: string } = useParams();
  console.log(params.contactId);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setNewTransaction({
      ...newTransaction,
      [event.target.name]: event.target.value,
    });
  }

  async function storeTransaction() {
    ipcRenderer.send("ADD_NEW_TRANSACTION", newTransaction);
    history.push("/transactions");
  }

  return (
    <>
      <h1>Adding new Transaction</h1>
      <div id="transactionFrom">
        <div>
          <input
            type="radio"
            id="loan-choice"
            name="type"
            value="loan"
            defaultChecked
          />
          <label htmlFor="loan-choice">Loan</label>
        </div>

        <div>
          <input type="radio" id="borrow-choice" name="type" value="borrow" />
          <label htmlFor="borrow-choice">Borrow</label>
        </div>
        <button onClick={storeTransaction}>Create New Transaction</button>
      </div>
    </>
  );
}

export default AddTransaction;
