import { useRef, useState } from "react";
import { Copy, Download, FileText, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MarkdownViewer } from "@/components/planner/MarkdownViewer";
import { toast } from "@/hooks/use-toast";
import {
  copyToClipboard,
  downloadMarkdown,
  downloadPdf,
  slugify,
} from "@/lib/export";

interface PlanOutputProps {
  plan: string | null;
  isLoading: boolean;
  projectIdea?: string;
  onSave?: () => void;
  isSaving?: boolean;
  showSave?: boolean;
}

export function PlanOutput({
  plan,
  isLoading,
  projectIdea = "project-plan",
  onSave,
  isSaving = false,
  showSave = true,
}: PlanOutputProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const filename = `${slugify(projectIdea) || "project-plan"}.md`;

  const handleCopy = async () => {
    if (!plan) return;
    try {
      await copyToClipboard(plan);
      toast({ title: "Copied!", description: "Plan copied to clipboard." });
    } catch {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadMd = () => {
    if (!plan) return;
    downloadMarkdown(plan, filename);
    toast({ title: "Downloaded", description: "Markdown file saved." });
  };

  const handleDownloadPdf = async () => {
    if (!plan || !contentRef.current) return;
    setIsExportingPdf(true);
    try {
      await downloadPdf(contentRef.current, filename.replace(".md", ".pdf"));
      toast({ title: "Downloaded", description: "PDF file saved." });
    } catch {
      toast({
        title: "PDF export failed",
        description: "Could not generate PDF. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Generated Plan</CardTitle>
        {plan && (
          <div className="flex flex-wrap gap-2">
            {showSave && onSave && (
              <Button
                variant="outline"
                size="sm"
                onClick={onSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadMd}>
              <Download className="h-4 w-4" />
              Markdown
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
            >
              {isExportingPdf ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              PDF
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {isLoading ? (
          <LoadingSkeleton />
        ) : plan ? (
          <div ref={contentRef} className="pb-4">
            <MarkdownViewer content={plan} />
          </div>
        ) : (
          <EmptyState />
        )}
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-sm font-medium">
          Generating your development plan...
        </span>
      </div>
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-6 w-1/2 mt-6" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <div className="relative overflow-hidden rounded-lg bg-muted p-4">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center text-muted-foreground">
      <FileText className="mb-4 h-12 w-12 opacity-40" />
      <p className="text-lg font-medium">No plan generated yet</p>
      <p className="mt-1 max-w-sm text-sm">
        Enter your project idea and click Generate Plan to get a complete
        software development roadmap.
      </p>
    </div>
  );
}
