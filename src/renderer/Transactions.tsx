import React, { useState, useEffect } from "react";
import { Transaction } from "../entities";
import { ipcRenderer } from "electron";
import TransactionRow from "./TransactionRow";
import "./style/Transactions.scss";

export default function Transactions() {
  const [transactions, setTransactions] = useState([] as Transaction[]);
  const [showLoans, setShowLoans] = useState(true);
  const [{ descending, attr }, setOrdering] = useState({
    descending: true,
    attr: "date",
  });

  useEffect(() => {
    ipcRenderer.invoke("GET_ALL_TRANSACTIONS").then(setTransactions);
  }, []);

  async function deleteTransaction(transactionId: number) {
    const answer: boolean = await ipcRenderer.invoke("SURE_DELETE_TRANSACTION");
    if (answer) {
      ipcRenderer.send("DELETE_TRANSACTION", transactionId);
      ipcRenderer.invoke("GET_ALL_TRANSACTIONS").then(setTransactions);
    }
  }

  function orderBy(attributeClicked: "date" | "name" | "sum") {
    if (attr == attributeClicked) {
      setOrdering({ attr: attr, descending: !descending });
    } else {
      setOrdering({ attr: attributeClicked, descending: false });
    }
  }

  function sortByName(t1: Transaction, t2: Transaction, descending: boolean) {
    const result = descending ? -1 : 1;
    return result * t1.contact.lastName.localeCompare(t2.contact.lastName);
  }

  function sortByDate(t1: Transaction, t2: Transaction, descending: boolean) {
    const result = descending ? -1 : 1;
    if (t1.date > t2.date) {
      return result;
    }
    if (t1.date < t2.date) {
      return -result;
    }
    return result * t1.contact.lastName.localeCompare(t2.contact.lastName);
  }

  function sortBySum(t1: Transaction, t2: Transaction, descending: boolean) {
    const result = descending ? -1 : 1;
    if (t1.sum > t2.sum) {
      return result;
    }
    if (t1.sum < t2.sum) {
      return -result;
    }
    return result * t1.contact.lastName.localeCompare(t2.contact.lastName);
  }

  function sortingFunction(t1: Transaction, t2: Transaction) {
    switch (attr) {
      case "date":
        return sortByDate(t1, t2, descending);
      case "sum":
        return sortBySum(t1, t2, descending);
      default:
        return sortByName(t1, t2, descending);
    }
  }

  return (
    <main id="transactions">
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
            <th id="row-date">
              <button onClick={() => orderBy("date")}>
                Date {attr == "date" ? (descending ? "▼" : "▲") : ""}
              </button>
            </th>
            <th id="row-name">
              <button onClick={() => orderBy("name")}>
                Name {attr == "name" ? (descending ? "▼" : "▲") : ""}
              </button>
            </th>
            <th id="row-sum">
              <button onClick={() => orderBy("sum")}>
                Sum {attr == "sum" ? (descending ? "▼" : "▲") : ""}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions
            .filter(
              (transaction) => (transaction.trans === "loan") === showLoans
            )
            .sort(sortingFunction)
            .map((transaction: Transaction) => (
              <TransactionRow
                transaction={transaction}
                key={transaction.id}
                deleteTransaction={() => {
                  deleteTransaction(transaction.id);
                }}
              />
            ))}
        </tbody>
      </table>
    </main>
  );
}
