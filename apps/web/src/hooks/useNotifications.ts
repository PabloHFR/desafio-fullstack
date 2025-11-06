import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { getSocket } from "@/lib/websocket";
import { authStore } from "@/stores/authStore";
import type {
  Notification,
  NotificationHistoryResponse,
} from "@monorepo/types";

/**
 * Hook para gerenciar notificações em tempo real
 * - Escuta eventos do WebSocket
 * - Mostra toast notifications
 * - Mantém lista de notificações recentes em memória
 */
export const useNotifications = () => {
  const navigate = useNavigate();
  const isAuthenticated = authStore((state) => state.isAuthenticated);

  // Estado local de notificações (últimas recebidas)
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = getSocket();
    if (!socket) {
      console.warn("Socket não conectado");
      return;
    }

    console.log("🔔 Iniciando listeners de notificações");

    // ==========================================
    // EVENTO: task:created
    const handleTaskCreated = (notification: Notification) => {
      console.log("📨 task:created recebida:", notification);

      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Toast com ação
      toast.success(notification.title, {
        description: notification.message,
        action: notification.metadata?.taskId
          ? {
              label: "Ver Tarefa",
              onClick: () =>
                navigate({
                  to: "/tasks/$taskId",
                  params: { taskId: notification.metadata.taskId! },
                }),
            }
          : undefined,
        duration: 5000,
      });
    };

    // EVENTO: task:updated
    const handleTaskUpdated = (notification: Notification) => {
      console.log("📨 task:updated recebida:", notification);

      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      toast.info(notification.title, {
        description: notification.message,
        action: notification.metadata?.taskId
          ? {
              label: "Ver Tarefa",
              onClick: () =>
                navigate({
                  to: "/tasks/$taskId",
                  params: { taskId: notification.metadata.taskId! },
                }),
            }
          : undefined,
        duration: 5000,
      });
    };

    // EVENTO: comment:new
    const handleCommentNew = (notification: Notification) => {
      console.log("📨 comment:new recebida:", notification);

      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      toast.info(notification.title, {
        description: notification.message,
        action: notification.metadata?.taskId
          ? {
              label: "Ver Comentário",
              onClick: () =>
                navigate({
                  to: "/tasks/$taskId",
                  params: { taskId: notification.metadata.taskId! },
                }),
            }
          : undefined,
        duration: 5000,
      });
    };

    // ==========================================
    // EVENTO: notifications:history
    // Recebido ao conectar (notificações perdidas)
    // ==========================================
    const handleNotificationsHistory = (data: NotificationHistoryResponse) => {
      console.log(
        `📨 notifications:history recebida: ${data.count} notificações`
      );

      if (data.count === 0) return;

      setNotifications((prev) => [...data.notifications, ...prev]);
      setUnreadCount(data.count);

      // Toast agrupado
      toast.info(`${data.count} notificações enquanto você estava offline`, {
        description: "Clique para ver suas tarefas",
        action: {
          label: "Ver Tarefas",
          onClick: () => navigate({ to: "/tasks" }),
        },
        duration: 8000,
      });
    };

    // Registra listeners
    socket.on("task:created", handleTaskCreated);
    socket.on("task:updated", handleTaskUpdated);
    socket.on("comment:new", handleCommentNew);
    socket.on("notifications:history", handleNotificationsHistory);

    // Cleanup ao desmontar
    return () => {
      console.log("🔕 Removendo listeners de notificações");
      socket.off("task:created", handleTaskCreated);
      socket.off("task:updated", handleTaskUpdated);
      socket.off("comment:new", handleCommentNew);
      socket.off("notifications:history", handleNotificationsHistory);
    };
  }, [isAuthenticated, navigate]);

  // Função para limpar notificações locais
  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    clearNotifications,
  };
};
