"use client";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export const LoadingSpinner = () => (
  <div className="mx-auto justify-self-center gap-8">
    <Spinner
      variant="infinite"
      className="h-[100px] w-[100px] text-blue-400 relative"
    />
  </div>
);
