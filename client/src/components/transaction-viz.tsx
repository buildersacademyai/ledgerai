import { Transaction } from "@shared/schema";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TransactionVizProps {
  transactions: Transaction[];
}

export default function TransactionViz({ transactions }: TransactionVizProps) {
  const data = transactions.map((tx) => ({
    time: tx.timestamp ? new Date(tx.timestamp).toLocaleTimeString() : 'Unknown',
    amount: parseFloat(tx.amount.replace(" ETH", "")) || 0,
  }));

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}