import React, { useState, useEffect } from "react";
import Transaction from "../entity/Transaction";
import { ipcRenderer } from "electron";

export default function Transactions() {
  const [transactions, setTransactions] = useState([] as Transaction[]);

  useEffect(() => {
    ipcRenderer.invoke("GET_ALL_TRANSACTIONS").then(setTransactions);
  }, []);

  return (
    <div id="contacts">
      <h1>Loans</h1>
      {transactions
        .filter((transaction) => transaction.type === "loan")
        .map(({ date, contact, sum, id }: Transaction) => (
          <div className="transaction" key={id}>
            <h3>{`${date}`}</h3>
            <h3>{`Contact: ${contact.firstName} ${contact.lastName}`}</h3>
            <h3>{`Sum: ${sum}`}</h3>
          </div>
        ))}
      <h1>Burrows</h1>
      {transactions
        .filter((transaction) => transaction.type === "burrow")
        .map(({ date, contact, sum, id }) => (
          <div className="transaction" key={id}>
            <h3>{`${date}`}</h3>
            <h3>{`Contact: ${contact}`}</h3>
            <h3>{`Sum: ${sum}`}</h3>
          </div>
        ))}
    </div>
  );
}
