import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Loader2,
  RefreshCw,
  Trash2,
  History as HistoryIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MarkdownViewer } from "@/components/planner/MarkdownViewer";
import { PlanOutput } from "@/components/planner/PlanOutput";
import { toast } from "@/hooks/use-toast";
import { ApiError, deletePlan, generatePlan, getHistory } from "@/lib/api";
import { formatDate } from "@/lib/export";
import type { GeneratePlanRequest, PlanHistoryItem } from "@/types/plan";

export function HistoryPage() {
  const [plans, setPlans] = useState<PlanHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewPlan, setViewPlan] = useState<PlanHistoryItem | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<number | null>(null);
  const [regeneratedPlan, setRegeneratedPlan] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getHistory();
      setPlans(data);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to load history.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deletePlan(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Deleted", description: "Plan removed from history." });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to delete plan.";
      toast({
        title: "Delete failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleRegenerate = async (plan: PlanHistoryItem) => {
    setRegeneratingId(plan.id);
    setRegeneratedPlan(null);

    const request: GeneratePlanRequest = {
      project_idea: plan.project_idea,
      industry: plan.industry as GeneratePlanRequest["industry"],
      budget: plan.budget as GeneratePlanRequest["budget"],
      project_type: plan.project_type as GeneratePlanRequest["project_type"],
      experience_level:
        plan.experience_level as GeneratePlanRequest["experience_level"],
    };

    try {
      const response = await generatePlan(request);
      setRegeneratedPlan(response.plan);
      setViewPlan(plan);
      toast({
        title: "Regenerated!",
        description: "A new plan has been generated.",
      });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to regenerate plan.";
      toast({
        title: "Regeneration failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setRegeneratingId(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Plan History</h1>
        <p className="mt-2 text-muted-foreground">
          View, regenerate, or delete your previously generated plans.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-center">
            <HistoryIcon className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <p className="text-lg font-medium">No plans yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate your first plan to see it here.
            </p>
            <Button className="mt-4" onClick={() => navigate("/planner")}>
              Go to Planner
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base line-clamp-2">
                      {plan.project_idea}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(plan.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{plan.industry}</Badge>
                    <Badge variant="outline">{plan.project_type}</Badge>
                    <Badge variant="secondary">{plan.experience_level}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setRegeneratedPlan(null);
                    setViewPlan(plan);
                  }}
                >
                  <Eye className="h-4 w-4" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRegenerate(plan)}
                  disabled={regeneratingId === plan.id}
                >
                  {regeneratingId === plan.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Regenerate
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(plan.id)}
                  disabled={deletingId === plan.id}
                >
                  {deletingId === plan.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={viewPlan !== null}
        onOpenChange={(open) => {
          if (!open) {
            setViewPlan(null);
            setRegeneratedPlan(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="line-clamp-2 pr-8">
              {viewPlan?.project_idea}
            </DialogTitle>
          </DialogHeader>
          {regeneratedPlan ? (
            <PlanOutput
              plan={regeneratedPlan}
              isLoading={false}
              projectIdea={viewPlan?.project_idea}
              showSave={false}
            />
          ) : viewPlan ? (
            <div className="max-h-[70vh] overflow-y-auto">
              <MarkdownViewer content={viewPlan.generated_plan} />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
