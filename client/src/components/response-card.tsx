import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Query } from "@shared/schema";
import { Wallet, Search, FileText } from "lucide-react";

interface ResponseCardProps {
  query: string;
  response: Query;
}

function formatValue(value: unknown): string {
  if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) {
      return value.map(item => formatValue(item)).join(', ');
    }
    return Object.entries(value)
      .map(([k, v]) => `${k}: ${formatValue(v)}`)
      .join(', ');
  }
  return String(value);
}

function getResponseIcon(type: string) {
  switch (type) {
    case 'wallet':
      return <Wallet className="h-5 w-5" />;
    case 'transaction':
      return <Search className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
}

export default function ResponseCard({ query, response }: ResponseCardProps) {
  if (!response?.response) return null;

  const data = response.response as {
    type: string;
    data: Record<string, unknown>;
    explanation?: string;
  };

  return (
    <Card className="mt-4 bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Search className="h-4 w-4" />
          Your query: {query}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Response Type Header */}
        <div className="flex items-center gap-2 text-primary">
          {getResponseIcon(data.type)}
          <CardTitle className="capitalize">{data.type} Response</CardTitle>
        </div>

        {/* Explanation Section */}
        {data.explanation && (
          <div className="text-sm text-card-foreground/90 bg-muted p-3 rounded-lg">
            {data.explanation}
          </div>
        )}

        {/* Data Display */}
        <div className="grid gap-2">
          {data.data && typeof data.data === 'object' && (
            <div className="space-y-2">
              {Object.entries(data.data).map(([key, value]) => (
                <div
                  key={key}
                  className="flex flex-col p-2 bg-background/50 rounded-md"
                >
                  <span className="text-xs font-medium text-muted-foreground capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm">{formatValue(value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}