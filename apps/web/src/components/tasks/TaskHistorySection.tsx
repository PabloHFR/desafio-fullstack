import { History, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getHistoryMessage } from "@/lib/task-history-utils";
import type { TaskHistory } from "@monorepo/types";

interface TaskHistorySectionProps {
  history: TaskHistory[];
}

/**
 * Seção de Histórico de Alterações
 * - Timeline de mudanças na task
 */
export const TaskHistorySection = ({ history }: TaskHistorySectionProps) => {
  if (!history || history.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="h-4 w-4" />
          Histórico
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {history.map((entry, index) => (
          <div key={entry.id}>
            <div className="flex gap-2 text-sm">
              <Clock className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium text-xs">{entry.username}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(entry.createdAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {getHistoryMessage(entry)}
                </p>
              </div>
            </div>
            {index < history.length - 1 && <Separator className="my-2" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
