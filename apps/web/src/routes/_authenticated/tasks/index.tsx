import { Header } from "@/components/header/Header";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/tasks/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-full flex-1 flex-col gap-8 py-6 px-12">
      <Header />
    </div>
  );
}
