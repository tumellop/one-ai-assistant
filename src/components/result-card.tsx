import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ResultCard({
  title,
  content,
  loading,
  emptyHint,
}: {
  title: string;
  content: string;
  loading: boolean;
  emptyHint: string;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <h3 className="text-sm font-semibold tracking-tight text-slate-900">{title}</h3>
        {content && !loading && (
          <Button variant="ghost" size="sm" onClick={onCopy} className="h-8 gap-1.5 rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        )}
      </div>
      <div className="px-6 py-6">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ) : content ? (
          <article className="prose prose-sm max-w-none text-slate-700 prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 prose-p:text-slate-700 prose-li:text-slate-700 prose-strong:text-slate-900 prose-table:text-sm prose-code:text-slate-900 prose-code:before:hidden prose-code:after:hidden">
            <ReactMarkdown>{content}</ReactMarkdown>
          </article>
        ) : (
          <p className="text-sm text-slate-500">{emptyHint}</p>
        )}
      </div>
    </div>
  );
}
