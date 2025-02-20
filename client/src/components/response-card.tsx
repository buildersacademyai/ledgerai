import { Card } from "@/components/ui/card";
import { Query } from "@shared/schema";

interface ResponseCardProps {
  query: string;
  response: Query;
}

export default function ResponseCard({ query, response }: ResponseCardProps) {
  return (
    <Card className="mt-4 p-4 bg-muted">
      <div className="mb-2 text-sm text-muted-foreground">
        Your query: {query}
      </div>

      <div className="space-y-2">
        {Object.entries(response.response as Record<string, unknown>).map(([key, value]) => (
          <div key={key} className="flex gap-2">
            <span className="font-semibold">{key}:</span>
            <span>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}