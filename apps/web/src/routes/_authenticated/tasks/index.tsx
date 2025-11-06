import { Header } from "@/components/header/Header";
import { columns } from "@/components/tasks/columns";
import { DataTable } from "@/components/tasks/DataTable";
import { useTasks } from "@/hooks/useTasks";
import type { TaskPriority, TaskStatus } from "@monorepo/types";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

// Schema de validação para search params
const tasksSearchSchema = z.object({
  page: z.number().min(1).catch(1),
  size: z.number().min(1).max(100).catch(10),
  status: z.string().optional(),
  priority: z.string().optional(),
  search: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/tasks/")({
  validateSearch: tasksSearchSchema,
  component: TasksPage,
});

function TasksPage() {
  const navigate = useNavigate();
  const searchParams = Route.useSearch();

  // Prepara filtros para o hook
  const filters = {
    page: searchParams.page,
    size: searchParams.size,
    status: searchParams.status as TaskStatus | undefined,
    priority: searchParams.priority as TaskPriority | undefined,
    search: searchParams.search,
  };

  // Busca tasks com filtros e paginação
  const { data, isLoading } = useTasks(filters);

  // Handlers para paginação
  const handlePageChange = (page: number) => {
    navigate({
      to: ".",
      search: {
        ...searchParams,
        page,
      },
    });
  };

  const handlePageSizeChange = (size: number) => {
    navigate({
      to: ".",
      search: {
        ...searchParams,
        size,
        page: 1,
      },
    });
  };

  return (
    <div className="flex h-full flex-1 flex-col gap-8 py-6 px-12">
      <Header />
      <DataTable
        columns={columns}
        data={data?.items || []}
        totalItems={data?.total || 0}
        currentPage={searchParams.page}
        pageSize={searchParams.size}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        isLoading={isLoading}
      />
    </div>
  );
}
