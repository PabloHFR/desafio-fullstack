import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Calendar, User, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTask } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EditTaskDialog } from "@/components/tasks/EditTaskDialog";
import { DeleteTaskDialog } from "@/components/tasks/DeleteTaskDialog";
import { CommentSection } from "@/components/tasks/CommentSection";
import { TaskHistorySection } from "@/components/tasks/TaskHistorySection";
import {
  getStatusLabel,
  getStatusVariant,
  getPriorityIcon,
  getPriorityLabel,
  getPriorityColor,
  formatDeadline,
  isOverdue,
} from "@/lib/task-utils";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/tasks/$taskId")({
  component: TaskDetailPage,
});

function TaskDetailPage() {
  const { taskId } = Route.useParams();
  const navigate = useNavigate();
  const { data: task, isLoading, error } = useTask(taskId);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Loading State
  if (isLoading) {
    return <TaskDetailSkeleton />;
  }

  // Error State
  if (error || !task) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <AlertTitle>Erro ao carregar tarefa</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "Tarefa não encontrada"}
          </AlertDescription>
        </Alert>
        <Button variant="outline" className="mt-4" asChild>
          <Link to="/tasks">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para tarefas
          </Link>
        </Button>
      </div>
    );
  }

  const deadlineText = formatDeadline(task.deadline);
  const overdue = isOverdue(task.deadline);

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link to="/tasks">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={getStatusVariant(task.status)}>
              {getStatusLabel(task.status)}
            </Badge>
            <Badge
              variant="outline"
              className={cn("font-medium", getPriorityColor(task.priority))}
            >
              {getPriorityIcon(task.priority)} {getPriorityLabel(task.priority)}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="outline"
            onClick={() => setDeleteDialogOpen(true)}
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description Card */}
          <Card>
            <CardHeader>
              <CardTitle>Descrição</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {task.description}
              </p>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <CommentSection taskId={task.id} />
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Deadline */}
              {deadlineText && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Prazo</span>
                  </div>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      overdue && "text-destructive"
                    )}
                  >
                    {deadlineText}
                  </p>
                </div>
              )}

              {/* Assigned Users */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Atribuído a</span>
                </div>
                <p className="text-sm font-medium">
                  {task.assignedTo.length === 0
                    ? "Ninguém atribuído"
                    : `${task.assignedTo.length} ${task.assignedTo.length === 1 ? "pessoa" : "pessoas"}`}
                </p>
              </div>

              <Separator />

              {/* Timestamps */}
              <div className="space-y-2 text-xs text-muted-foreground">
                <div>
                  <span className="font-medium">Criado em:</span>{" "}
                  {new Date(task.createdAt).toLocaleString("pt-BR")}
                </div>
                <div>
                  <span className="font-medium">Atualizado em:</span>{" "}
                  {new Date(task.updatedAt).toLocaleString("pt-BR")}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* History Section */}
          <TaskHistorySection history={task.history || []} />
        </div>
      </div>

      {/* Dialogs */}
      <EditTaskDialog
        task={task}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
      <DeleteTaskDialog
        task={task}
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open && !task) {
            // Se deletou, volta para lista
            navigate({ to: "/tasks" });
          }
        }}
      />
    </div>
  );
}

// Loading Skeleton
function TaskDetailSkeleton() {
  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
