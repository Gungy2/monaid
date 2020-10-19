import React from "react";
import { Link } from "react-router-dom";
import Transaction from "../entity/Transaction";

export default function TransactionRow({
  transaction,
  deleteTransaction,
}: {
  transaction: Transaction;
  deleteTransaction: () => void;
}) {
  return (
    <tr className="transaction-row">
      <td>
        <button className="delete" onClick={deleteTransaction}>
          X
        </button>
      </td>
      <td>{`${transaction.date}`}</td>
      <td>
        <Link to="/contacts">{`${transaction.contact.firstName} ${transaction.contact.lastName}`}</Link>
      </td>
      <td>{`${transaction.sum}`}</td>
    </tr>
  );
}
