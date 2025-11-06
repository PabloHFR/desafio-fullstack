import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";
import { TaskStatus, TaskPriority } from "@monorepo/types";
import { formatDistanceToNow, isPast, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

// STATUS HELPERS
export const getStatusLabel = (status: TaskStatus): string => {
  const labels: Record<TaskStatus, string> = {
    [TaskStatus.TODO]: "A Fazer",
    [TaskStatus.IN_PROGRESS]: "Em Progresso",
    [TaskStatus.REVIEW]: "Em Revisão",
    [TaskStatus.DONE]: "Concluído",
  };
  return labels[status];
};

export const getStatusVariant = (status: TaskStatus) => {
  const variants: Record<
    TaskStatus,
    "secondary" | "default" | "outline" | "success"
  > = {
    [TaskStatus.TODO]: "secondary",
    [TaskStatus.IN_PROGRESS]: "default",
    [TaskStatus.REVIEW]: "outline",
    [TaskStatus.DONE]: "success",
  };
  return variants[status];
};

export const getStatusIcon = (status: TaskStatus) => {
  const icons: Record<
    TaskStatus,
    React.ComponentType<{ className?: string }>
  > = {
    [TaskStatus.TODO]: Circle,
    [TaskStatus.IN_PROGRESS]: Clock,
    [TaskStatus.REVIEW]: AlertCircle,
    [TaskStatus.DONE]: CheckCircle2,
  };
  return icons[status];
};

// PRIORITY HELPERS
export const getPriorityLabel = (priority: TaskPriority): string => {
  const labels: Record<TaskPriority, string> = {
    [TaskPriority.LOW]: "Baixa",
    [TaskPriority.MEDIUM]: "Média",
    [TaskPriority.HIGH]: "Alta",
    [TaskPriority.URGENT]: "Urgente",
  };
  return labels[priority];
};

export const getPriorityIcon = (priority: TaskPriority) => {
  const icons: Record<TaskPriority, string> = {
    [TaskPriority.LOW]: "🟢",
    [TaskPriority.MEDIUM]: "🟡",
    [TaskPriority.HIGH]: "🟠",
    [TaskPriority.URGENT]: "🔴",
  };
  return icons[priority];
};

export const getPriorityColor = (priority: TaskPriority): string => {
  const colors: Record<TaskPriority, string> = {
    [TaskPriority.LOW]: "text-green-600 dark:text-green-400",
    [TaskPriority.MEDIUM]: "text-yellow-600 dark:text-yellow-400",
    [TaskPriority.HIGH]: "text-orange-600 dark:text-orange-400",
    [TaskPriority.URGENT]: "text-red-600 dark:text-red-400",
  };
  return colors[priority];
};

// DEADLINE HELPERS
export const formatDeadline = (deadline: string | null): string | null => {
  if (!deadline) return null;

  try {
    const date = parseISO(deadline);
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: ptBR,
    });
  } catch {
    return null;
  }
};

export const isOverdue = (deadline: string | null): boolean => {
  if (!deadline) return false;

  try {
    const date = parseISO(deadline);
    return isPast(date);
  } catch {
    return false;
  }
};

// DATE FORMATTERS
export const formatDate = (date: string): string => {
  try {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "-";
  }
};

export const formatDateTime = (date: string): string => {
  try {
    return new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
};
