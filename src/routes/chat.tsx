import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { loadThreads, newThreadId, saveThreads } from "@/lib/threads";

export const Route = createFileRoute("/chat")({
  component: ChatIndex,
});

function ChatIndex() {
  const navigate = useNavigate();
  useEffect(() => {
    const threads = loadThreads();
    if (threads.length > 0) {
      const latest = [...threads].sort((a, b) => b.updatedAt - a.updatedAt)[0];
      navigate({ to: "/chat/$threadId", params: { threadId: latest.id }, replace: true });
      return;
    }
    const id = newThreadId();
    saveThreads([{ id, title: "New conversation", updatedAt: Date.now(), messages: [] }]);
    navigate({ to: "/chat/$threadId", params: { threadId: id }, replace: true });
  }, [navigate]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center text-sm text-muted-foreground">
      Opening conversation…
    </div>
  );
}
