import React from "react";
import Contact from "../entity/Contact";

export default function TransactionRow({
  date,
  contact,
  sum,
  deleteTransaction,
}: {
  date: Date;
  contact: Contact;
  sum: number;
  deleteTransaction: () => void;
}) {
  return (
    <tr className="transaction-row">
      <td>
        <button id="delete" onClick={deleteTransaction}>
          X
        </button>
      </td>
      <td>{`${date}`}</td>
      <td>{`${contact.firstName} ${contact.lastName}`}</td>
      <td>{`${sum}`}</td>
    </tr>
  );
}
