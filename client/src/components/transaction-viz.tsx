import { Transaction } from "@shared/schema";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

interface TransactionVizProps {
  transactions: Transaction[];
}

export default function TransactionViz({ transactions }: TransactionVizProps) {
  // Sort transactions by timestamp in descending order (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const chartData = sortedTransactions.map((tx) => ({
    time: tx.timestamp ? new Date(tx.timestamp).toLocaleTimeString() : 'Unknown',
    amount: parseFloat(tx.amount.replace(" ETH", "")) || 0,
  }));

  return (
    <div className="space-y-6">
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
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

      {/* Animated Transaction List */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {sortedTransactions.map((tx) => (
            <motion.div
              key={tx.hash}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="p-3 bg-muted/50 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="flex justify-between items-center text-sm">
                <div className="truncate max-w-[200px]">
                  <span className="text-primary/80">From:</span> {tx.from.slice(0, 8)}...
                </div>
                <div className="truncate max-w-[200px]">
                  <span className="text-primary/80">To:</span> {tx.to.slice(0, 8)}...
                </div>
                <div className="font-medium text-primary">{tx.amount}</div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(tx.timestamp).toLocaleString()}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}