import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import ChatInput from "@/components/chat-input";
import ResponseCard from "@/components/response-card";
import { useToast } from "@/hooks/use-toast";
import { Query } from "@shared/schema";

export default function Home() {
  const [currentQuery, setCurrentQuery] = useState("");
  const { toast } = useToast();

  const { data: recentQueries } = useQuery<Query[]>({
    queryKey: ["/api/recent-queries"],
  });

  const queryMutation = useMutation({
    mutationFn: async (query: string) => {
      const res = await apiRequest("POST", "/api/query", { query });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recent-queries"] });
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
        {/* Header with Branding */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-10 h-10 text-primary"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M20 12V8H6a2 2 0 01-2-2 2 2 0 012-2h12v4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 6v12a2 2 0 002 2h14v-4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18 12H4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <a href="/" className="text-4xl font-bold bg-gradient-to-r from-[#FFCB67] to-[#FFE5B1] text-transparent bg-clip-text">
                LedgerAI
              </a>
              <p className="text-sm text-primary/80">Powered by Sonic Blockchain</p>
            </div>
          </div>
        </div>

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
              <h2 className="text-xl font-semibold mb-4">Recent Queries</h2>
              <div className="space-y-2">
                {recentQueries && recentQueries.map((query: Query) => (
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