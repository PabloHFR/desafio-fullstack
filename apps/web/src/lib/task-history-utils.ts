import type { TaskHistory } from "@monorepo/types";

// Helper para mensagens do histórico
export function getHistoryMessage(entry: TaskHistory): string {
  const { action, field, oldValue, newValue } = entry;

  switch (action) {
    case "CREATED":
      return "Criou a tarefa";

    case "STATUS_CHANGED":
      return `Mudou o status${oldValue ? ` de ${formatValue(oldValue)}` : ""} para ${formatValue(newValue!)}`;

    case "UPDATED":
      if (field === "title") return "Atualizou o título";
      if (field === "description") return "Atualizou a descrição";
      if (field === "priority") {
        return `Mudou a prioridade${oldValue ? ` de ${formatValue(oldValue)}` : ""} para ${formatValue(newValue!)}`;
      }
      if (field === "deadline") return "Atualizou o prazo";
      if (field === "assignedTo") return "Atualizou usuários atribuídos";
      return `Atualizou ${field}`;

    case "COMMENTED":
      return "Adicionou um comentário";

    case "ASSIGNED":
      return "Atribuiu usuários à tarefa";

    case "UNASSIGNED":
      return "Removeu usuários da tarefa";

    default:
      return "Fez uma alteração";
  }
}

// Helper para formatar valores do histórico
function formatValue(value: string): string {
  try {
    // Tenta parsear JSON se for string
    const parsed = JSON.parse(value);

    // Se for objeto, retorna string formatada
    if (typeof parsed === "object" && parsed !== null) {
      return JSON.stringify(parsed);
    }

    return String(parsed);
  } catch {
    // Se não for JSON, retorna o valor direto
    return value;
  }
}
