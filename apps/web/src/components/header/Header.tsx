import { NotificationBell } from "../notifications/NotificationBell";
import { UserNav } from "./UserNav";

export function Header() {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Bem-vindo de volta!
        </h2>
        <p className="text-muted-foreground">Aqui está sua lista de tarefas</p>
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <UserNav />
      </div>
    </div>
  );
}
