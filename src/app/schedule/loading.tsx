import Skeleton from "@/components/ui/Skeleton";

export default function ScheduleLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>
      <Skeleton className="h-[520px] rounded-xl" />
    </div>
  );
}
