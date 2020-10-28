import { ipcRenderer } from "electron";
import React, { useEffect, useState } from "react";
import Transaction from "../entity/Transaction";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  YAxis,
  Legend,
  ReferenceLine,
  TooltipPayload,
  TooltipProps,
  Brush,
} from "recharts";

interface Data {
  date: Date;
  loan: number;
  borrow: number;
}

export default function Statistics() {
  const [data, setData] = useState([] as Data[]);

  useEffect(() => {
    ipcRenderer.invoke("GET_ALL_TRANSACTIONS").then(convertTransactionsToData);

    function convertTransactionsToData(transactions: Transaction[]) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const oneMonthAgo = new Date();
      oneMonthAgo.setHours(0, 0, 0, 0);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      function reducer(acc: Data, curr: Transaction): Data {
        return {
          date: acc.date,
          loan: acc.loan - (curr.type === "loan" ? curr.sum : 0),
          borrow: acc.borrow + (curr.type === "borrow" ? curr.sum : 0),
        };
      }

      transactions.forEach((t) => {
        t.date = new Date(t.date);
        t.date.setHours(0, 0, 0, 0);
      });

      let data = [];
      for (var d = oneMonthAgo; d <= today; d.setDate(d.getDate() + 1)) {
        const dataElement = transactions
          .filter((t) => t.date.getTime() == d.getTime())
          .reduce(reducer, { date: new Date(d.getTime()), loan: 0, borrow: 0 });
        data.push(dataElement);
      }
      console.log(data);
      setData(data);
    }
  }, []);

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    console.log(active, payload);
    if (active) {
      if (!payload) {
        return null;
      }
      return (
        <div className="tooltip">
          <p>{`${payload[0].payload.date.toDateString()}`}</p>
          <p
            style={{ color: payload[0].fill }}
          >{`Loan: ${payload[0].payload.loan}`}</p>
          <p
            style={{ color: payload[1].fill }}
          >{`Borrow: ${payload[0].payload.borrow}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <h1>This Month's Statistics</h1>
      <BarChart
        width={800}
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
        <CartesianGrid  vertical={false} strokeDasharray="5 5"/>
        <ReferenceLine y={0} stroke="#f1faee" />
        <Brush />
        <Bar dataKey="loan" fill="#1d3557" stackId="stack" />
        <Bar dataKey="borrow" fill="#e63946" stackId="stack" />
      </BarChart>
    </>
  );
}
