import React, { useState } from "react";
import { Link } from "react-router-dom";
import Transaction from "../entity/Transaction";
import "./style/TransactionRow.scss";

export default function TransactionRow({
  transaction,
  deleteTransaction,
}: {
  transaction: Transaction;
  deleteTransaction: () => void;
}) {
  const [mentions, setMentions] = useState(false);

  return (
    <>
      <tr
        className="transaction-row"
        onClick={() => {
          setMentions(!mentions);
        }}
        style={{ borderBottom: mentions ? "none" : undefined }}
      >
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
      {mentions ? (
        <tr className="transaction-row">
          <td colSpan={4}>
            <em>Mentions: </em>
            {transaction.mentions}
          </td>
        </tr>
      ) : null}
    </>
  );
}
