"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";
import { refreshWeather } from "./refreshWeatherAction";

export default function RefreshWeatherButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="w-max"
      aria-label="Refresh weather"
      disabled={isPending}
      onClick={async () => {
        startTransition(async () => {
          await refreshWeather();
          router.refresh();
        });
      }}
    >
      <RefreshCcw
        className={isPending ? "animate-spin mr-2 h-4 w-4" : "mr-2 h-4 w-4"}
      />
      Refresh
    </Button>
  );
}
