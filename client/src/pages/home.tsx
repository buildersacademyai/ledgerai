import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import ChatInput from "@/components/chat-input";
import ResponseCard from "@/components/response-card";
import TransactionViz from "@/components/transaction-viz";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [currentQuery, setCurrentQuery] = useState("");
  const { toast } = useToast();

  const { data: transactions } = useQuery({
    queryKey: ["/api/transactions"],
  });

  const { data: recentQueries } = useQuery({
    queryKey: ["/api/recent-queries"],
  });

  const queryMutation = useMutation({
    mutationFn: async (query: string) => {
      const res = await apiRequest("POST", "/api/query", { query });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recent-queries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (query: string) => {
    setCurrentQuery(query);
    await queryMutation.mutateAsync(query);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-primary mb-8">
          Blockchain Explorer
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <Card className="p-6">
              <ChatInput
                onSubmit={handleSubmit}
                isLoading={queryMutation.isPending}
              />
              {queryMutation.data && (
                <ResponseCard
                  query={currentQuery}
                  response={queryMutation.data}
                />
              )}
            </Card>
          </div>

          <div className="lg:col-span-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
              <TransactionViz transactions={transactions || []} />
            </Card>

            <Card className="p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Recent Queries</h2>
              <div className="space-y-2">
                {(recentQueries || []).map((query: any) => (
                  <div
                    key={query.id}
                    className="p-3 bg-muted rounded-lg text-sm"
                  >
                    {query.query}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}