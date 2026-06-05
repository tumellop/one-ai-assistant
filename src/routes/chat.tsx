import { createFileRoute } from "@tanstack/react-router";
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
import { MessageSquareText } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Assistant Chat — ONE" },
      {
        name: "description",
        content:
          "An always-on workspace copilot for ad-hoc questions and quick iteration.",
      },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  // Fresh chat per page load — no persistence
  const sessionId = useMemo(
    () => `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    [],
  );
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);

  const { messages, sendMessage, status, error } = useChat({
    id: sessionId,
    messages: [],
    transport,
  });

  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [status]);

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = useCallback(() => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    void sendMessage({ text });
  }, [input, isLoading, sendMessage]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full flex-col">
      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl px-4 py-6 md:px-8 md:py-8">
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
                        <article className="prose prose-sm max-w-none text-slate-800 prose-headings:font-sans prose-headings:tracking-tight prose-p:text-slate-800 prose-li:text-slate-800 prose-strong:text-slate-900 prose-code:text-slate-900 prose-code:before:hidden prose-code:after:hidden">
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

      <div className="border-t border-white/60 bg-white/70 px-4 py-4 backdrop-blur-md md:px-8">
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
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <MessageSquareText className="h-3 w-3" />
                Press Enter to send, Shift+Enter for newline
              </div>
              <PromptInputSubmit
                status={status}
                disabled={!input.trim() || isLoading}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
