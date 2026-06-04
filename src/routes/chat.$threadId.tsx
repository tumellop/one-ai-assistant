import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquareText, Plus, Trash2 } from "lucide-react";
import {
  loadThreads,
  saveThreads,
  newThreadId,
  deriveTitle,
  type ChatThread,
} from "@/lib/threads";
import { BrandMark } from "@/components/brand-mark";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat/$threadId")({
  head: () => ({
    meta: [
      { title: "Assistant Chat — Praxis" },
      {
        name: "description",
        content: "An always-on workspace copilot for ad-hoc questions and quick iteration.",
      },
    ],
  }),
  component: ChatThreadPage,
});

function ChatThreadPage() {
  const { threadId } = Route.useParams();
  return <ChatThreadView key={threadId} threadId={threadId} />;
}

function ChatThreadView({ threadId }: { threadId: string }) {
  const navigate = useNavigate();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount (per thread mount via key)
  useEffect(() => {
    const all = loadThreads();
    let next = all;
    if (!all.find((t) => t.id === threadId)) {
      next = [
        ...all,
        { id: threadId, title: "New conversation", updatedAt: Date.now(), messages: [] },
      ];
      saveThreads(next);
    }
    setThreads(next);
    setHydrated(true);
  }, [threadId]);

  const activeThread = useMemo(
    () => threads.find((t) => t.id === threadId),
    [threads, threadId],
  );

  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);

  const { messages, sendMessage, status, error } = useChat({
    id: threadId,
    messages: activeThread?.messages ?? [],
    transport,
  });

  // Persist messages when they change (after stream completes)
  const lastSavedRef = useRef<string>("");
  useEffect(() => {
    if (!hydrated) return;
    if (status === "streaming" || status === "submitted") return;
    const key = JSON.stringify(messages);
    if (key === lastSavedRef.current) return;
    lastSavedRef.current = key;
    const all = loadThreads();
    const idx = all.findIndex((t) => t.id === threadId);
    const updated: ChatThread = {
      id: threadId,
      title: deriveTitle(messages),
      updatedAt: Date.now(),
      messages,
    };
    if (idx >= 0) all[idx] = updated;
    else all.push(updated);
    saveThreads(all);
    setThreads(all);
  }, [messages, status, threadId, hydrated]);

  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [threadId, status]);

  const handleSubmit = useCallback(() => {
    const text = input.trim();
    if (!text || status === "submitted" || status === "streaming") return;
    setInput("");
    void sendMessage({ text });
  }, [input, status, sendMessage]);

  const onNewThread = () => {
    const id = newThreadId();
    const all = loadThreads();
    all.push({ id, title: "New conversation", updatedAt: Date.now(), messages: [] });
    saveThreads(all);
    navigate({ to: "/chat/$threadId", params: { threadId: id } });
  };

  const onDeleteThread = (id: string) => {
    const all = loadThreads().filter((t) => t.id !== id);
    saveThreads(all);
    setThreads(all);
    if (id === threadId) {
      if (all.length > 0) {
        navigate({
          to: "/chat/$threadId",
          params: { threadId: all[all.length - 1].id },
          replace: true,
        });
      } else {
        const nid = newThreadId();
        saveThreads([
          { id: nid, title: "New conversation", updatedAt: Date.now(), messages: [] },
        ]);
        navigate({ to: "/chat/$threadId", params: { threadId: nid }, replace: true });
      }
    }
  };

  const sortedThreads = [...threads].sort((a, b) => b.updatedAt - a.updatedAt);
  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full">
      {/* Thread list */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border/60 bg-surface md:flex">
        <div className="border-b border-border/60 p-3">
          <Button
            onClick={onNewThread}
            variant="outline"
            className="w-full justify-start gap-2 bg-card"
          >
            <Plus className="h-4 w-4" />
            New conversation
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {sortedThreads.map((t) => {
              const active = t.id === threadId;
              return (
                <div
                  key={t.id}
                  className={cn(
                    "group flex items-center gap-1 rounded-md transition-colors",
                    active ? "bg-accent" : "hover:bg-muted",
                  )}
                >
                  <Link
                    to="/chat/$threadId"
                    params={{ threadId: t.id }}
                    className={cn(
                      "flex-1 truncate px-2.5 py-2 text-sm",
                      active ? "text-accent-foreground font-medium" : "text-foreground/80",
                    )}
                  >
                    {t.title}
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onDeleteThread(t.id);
                    }}
                    aria-label="Delete conversation"
                    className="mr-1 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-background hover:text-destructive group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <div className="border-t border-border/60 p-3 text-[11px] leading-snug text-muted-foreground">
          Conversations are stored only in this browser.
        </div>
      </aside>

      {/* Chat surface */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Conversation className="flex-1">
          <ConversationContent className="mx-auto w-full max-w-3xl px-4 py-8 md:px-8">
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<BrandMark className="h-12 w-12" />}
                title="How can I help you work today?"
                description="Ask anything — drafting, planning, summarizing, decisions, code review, follow-ups."
              />
            ) : (
              <div className="space-y-5">
                {messages.map((m: UIMessage) => {
                  const text = m.parts
                    .map((p) => (p.type === "text" ? p.text : ""))
                    .join("");
                  return (
                    <Message key={m.id} from={m.role}>
                      <MessageContent>
                        {m.role === "assistant" ? (
                          <article className="prose prose-sm max-w-none text-foreground prose-headings:font-display prose-headings:tracking-tight prose-p:text-foreground/90 prose-li:text-foreground/90 prose-strong:text-foreground prose-code:text-foreground prose-code:before:hidden prose-code:after:hidden">
                            <ReactMarkdown>{text}</ReactMarkdown>
                          </article>
                        ) : (
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">{text}</p>
                        )}
                      </MessageContent>
                    </Message>
                  );
                })}
                {status === "submitted" && (
                  <Message from="assistant">
                    <MessageContent>
                      <Shimmer>Thinking…</Shimmer>
                    </MessageContent>
                  </Message>
                )}
                {error && (
                  <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {error.message || "Something went wrong. Please try again."}
                  </div>
                )}
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="border-t border-border/60 bg-surface/80 px-4 py-4 backdrop-blur-sm md:px-8">
          <div className="mx-auto w-full max-w-3xl">
            <PromptInput onSubmit={handleSubmit}>
              <PromptInputTextarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message your assistant…"
                disabled={isLoading}
              />
              <PromptInputFooter className="justify-between gap-3">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <MessageSquareText className="h-3 w-3" />
                  Press Enter to send, Shift+Enter for newline
                </div>
                <PromptInputSubmit
                  status={status}
                  disabled={!input.trim() || isLoading}
                />
              </PromptInputFooter>
            </PromptInput>
            <p className="mt-2.5 text-center text-[11px] text-muted-foreground">
              AI-generated content may require human review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
