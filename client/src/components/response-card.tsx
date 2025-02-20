import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Query } from "@shared/schema";
import { Wallet, Search, FileText, ArrowRight, Database, BarChart } from "lucide-react";

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

function getResponseIcon(type: string | undefined) {
  const responseType = type?.toLowerCase() || 'unknown';
  switch (responseType) {
    case 'wallet':
      return <Wallet className="h-6 w-6" />;
    case 'transaction':
      return <Database className="h-6 w-6" />;
    case 'analysis':
      return <BarChart className="h-6 w-6" />;
    default:
      return <FileText className="h-6 w-6" />;
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
    <Card className="mt-6 border-2 border-primary/20 shadow-lg">
      <CardHeader className="pb-2 border-b border-border/30">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Search className="h-4 w-4" />
          <span className="font-medium">Query:</span>
          <span className="text-primary">{query}</span>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Response Type Header */}
        <div className="flex items-center gap-3 text-primary">
          {getResponseIcon(data?.type)}
          <div>
            <CardTitle className="capitalize text-xl">
              {data?.type || 'Unknown'} Response
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Blockchain data analysis results
            </p>
          </div>
        </div>

        {/* Explanation Section */}
        {data?.explanation && (
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
            <p className="text-sm leading-relaxed text-card-foreground">
              {data.explanation}
            </p>
          </div>
        )}

        {/* Data Display */}
        <div className="grid gap-4">
          {data?.data && typeof data.data === 'object' && (
            <div className="grid gap-3">
              {Object.entries(data.data).map(([key, value]) => (
                <div
                  key={key}
                  className="flex flex-col p-4 bg-muted/50 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary/90 capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className="text-sm text-card-foreground pl-6">
                    {formatValue(value)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}