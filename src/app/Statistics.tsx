import { ipcRenderer } from "electron";
import React, { useEffect, useState } from "react";
import Transaction from "../entity/Transaction";
import {
  Bar,
  CartesianGrid,
  Tooltip,
  YAxis,
  ReferenceLine,
  TooltipProps,
  Brush,
  Line,
  ComposedChart,
} from "recharts";
import "./style/Statistics.scss";

interface Data {
  date: Date;
  loan: number;
  borrow: number;
  total: number;
}

export default function Statistics() {
  const [data, setData] = useState([] as Data[]);
  const [transactions, setTransactions] = useState([] as Transaction[]);
  const [totals, setTotals] = useState({ borrows: 0, loans: 0, total: 0 });
  const [{ start, end }, setDates] = useState(() => getInitialDates());

  function getInitialDates() {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var oneMonthAgo = new Date();
    oneMonthAgo.setHours(0, 0, 0, 0);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return { start: oneMonthAgo, end: today };
  }

  useEffect(() => {
    ipcRenderer
      .invoke("GET_ALL_TRANSACTIONS")
      .then((transactions: Transaction[]) => {
        setTransactions(
          transactions.map((t) => {
            const date = new Date(t.date);
            date.setHours(0, 0, 0, 0);
            return { ...t, date };
          })
        );
      });
  }, []);

  useEffect(() => {
    function reducer(
      acc: {
        date: Date;
        loan: number;
        borrow: number;
      },
      curr: Transaction
    ): {
      date: Date;
      loan: number;
      borrow: number;
    } {
      return {
        date: acc.date,
        loan: acc.loan - (curr.type === "loan" ? curr.sum : 0),
        borrow: acc.borrow + (curr.type === "borrow" ? curr.sum : 0),
      };
    }

    function totalReducer(acc: number, curr: Transaction): number {
      return (
        acc -
        (curr.type === "loan" ? curr.sum : 0) +
        +(curr.type === "borrow" ? curr.sum : 0)
      );
    }

    let data = [];
    const { start: oneMonthAgo, end: today } = getInitialDates();
    for (
      let d = new Date(oneMonthAgo.getTime());
      d <= today;
      d.setDate(d.getDate() + 1)
    ) {
      const dataElement = transactions
        .filter((t) => t.date.getTime() == d.getTime())
        .reduce(reducer, {
          date: new Date(d.getTime()),
          loan: 0,
          borrow: 0,
        });

      const total = transactions
        .filter(
          (t) =>
            t.date.getTime() <= d.getTime() &&
            t.date.getTime() >= oneMonthAgo.getTime()
        )
        .reduce(totalReducer, 0);
      data.push({ total, ...dataElement });
    }
    setData(data);
  }, [transactions]);

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active) {
      if (!payload) {
        return null;
      }
      return (
        <div className="tooltip">
          <p className="date">{payload[0].payload.date.toDateString()}</p>
          <p
            style={{ textShadow: "2px 2px #1d3557" }}
          >{`Total: ${payload[0].payload.total}`}</p>
          <p
            style={{ color: payload[1].fill }}
          >{`Borrows: ${payload[1].payload.borrow}`}</p>
          <p style={{ color: payload[0].fill }}>{`Loans: ${-payload[0].payload
            .loan}`}</p>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    function reducer(
      acc: { borrows: number; loans: number; total: number },
      curr: Data
    ) {
      return {
        borrows: acc.borrows + curr.borrow,
        loans: acc.loans - curr.loan,
        total: acc.total + curr.borrow + curr.loan,
      };
    }
    setTotals(
      data
        .filter(
          (t) =>
            t.date.getTime() <= end.getTime() &&
            t.date.getTime() >= start.getTime()
        )
        .reduce(reducer, { borrows: 0, loans: 0, total: 0 })
    );
  }, [data, start, end]);

  return (
    <main id="statistics">
      <h1>This Month's Statistics</h1>
      <h2>
        From {start.toDateString()} to {end.toDateString()} you gave{" "}
        <span style={{ color: "#1d3557", textShadow: "0.5px 0.5px #f1faee" }}>
          {totals.loans}
        </span>{" "}
        and you received{" "}
        <span style={{ color: "#e63946", textShadow: "0.5px 0.5px #f1faee" }}>
          {totals.borrows}
        </span>{" "}
        !
      </h2>

      <ComposedChart
        width={750}
        height={300}
        data={data}
        stackOffset="sign"
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <YAxis stroke="#f1faee" />
        <Tooltip content={<CustomTooltip />} />
        <CartesianGrid vertical={false} strokeDasharray="5 5" />
        <ReferenceLine y={0} stroke="#f1faee" />
        <Brush
          dataKey="date"
          tickFormatter={(tick) => tick.toDateString()}
          width={400}
          height={30}
          stroke="#1d3557"
          travellerWidth={7}
          x={180}
          y={-50}
          onChange={({ startIndex, endIndex }) => {
            setDates({
              start: data[startIndex].date,
              end: data[endIndex].date,
            });
          }}
        />
        <Bar dataKey="loan" fill="#e63946" stackId="stack" />
        <Bar dataKey="borrow" fill="#1d3557" stackId="stack" />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#a8dadc"
          strokeWidth={2}
        />
      </ComposedChart>
      <table>
        <thead>
          <tr>
            <th id="row-date">Date</th>
            <th id="row-name">Name</th>
            <th id="row-sum">Sum</th>
          </tr>
        </thead>
        <tbody>
          {transactions
            .sort()
            .reverse()
            .filter(
              (transaction) =>
                transaction.date.getTime() >= start.getTime() &&
                transaction.date.getTime() <= end.getTime()
            )
            .map((transaction: Transaction) => (
              <tr
                key={transaction.id}
                style={{
                  color: transaction.type === "loan" ? "#e63946" : "#1d3557",
                  textShadow: `1px 1px ${
                    transaction.type === "loan" ? "black" : "#e63946"
                  })`,
                }}
              >
                <td>{transaction.date.toDateString()}</td>
                <td>
                  {`${transaction.contact.firstName} ${transaction.contact.lastName}`}
                </td>
                <td>{`${transaction.sum}`}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </main>
  );
}
