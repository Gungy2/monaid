import React, { useState, useEffect } from "react";
import Transaction from "../entity/Transaction";
import { ipcRenderer } from "electron";
import TransactionRow from "./TransactionRow";
import "./style/Transactions.scss";

export default function Transactions() {
  const [transactions, setTransactions] = useState([] as Transaction[]);
  const [showLoans, setShowLoans] = useState(true);

  useEffect(() => {
    ipcRenderer.invoke("GET_ALL_TRANSACTIONS").then(setTransactions);
  }, []);

  async function deleteTransaction(transactionId: number) {
    const answer: boolean = await ipcRenderer.invoke("SURE_DELETE_TRANSACTION");
    if (answer) {
      ipcRenderer.send("DELETE_TRANSACTION", transactionId);
      ipcRenderer.invoke("GET_ALL_TRANSACTIONS").then(setTransactions);
      console.log("ok, deleting");
    }
  }

  return (
    <div id="transactions">
      <div id="options">
        <button
          onClick={() => {
            setShowLoans(true);
          }}
          id={showLoans ? "activated" : ""}
        >
          <h1>Loans</h1>
        </button>
        <button
          onClick={() => {
            setShowLoans(false);
          }}
          id={!showLoans ? "activated" : ""}
        >
          <h1>Burrows</h1>
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th id="row-delete"></th>
            <th id="row-date">Date</th>
            <th id="row-name">Name</th>
            <th id="row-sum">Sum</th>
          </tr>
        </thead>
        <tbody>
          {transactions
            .filter(
              (transaction) => (transaction.type === "loan") === showLoans
            )
            .map(({ date, contact, sum, id }: Transaction) => (
              <TransactionRow
                date={date}
                contact={contact}
                sum={sum}
                key={id}
                deleteTransaction={() => {
                  deleteTransaction(id);
                }}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
}
