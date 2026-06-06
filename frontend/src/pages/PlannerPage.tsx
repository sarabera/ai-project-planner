import { useState } from "react";
import { PlanForm } from "@/components/planner/PlanForm";
import { PlanOutput } from "@/components/planner/PlanOutput";
import { toast } from "@/hooks/use-toast";
import { ApiError, generatePlan, savePlan } from "@/lib/api";
import type { GeneratePlanRequest } from "@/types/plan";

const defaultValues: GeneratePlanRequest = {
  project_idea: "",
  industry: "SaaS",
  budget: "Medium",
  project_type: "MVP",
  experience_level: "Intermediate",
};

export function PlannerPage() {
  const [formValues, setFormValues] = useState<GeneratePlanRequest>(defaultValues);
  const [plan, setPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof GeneratePlanRequest, string>>
  >({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof GeneratePlanRequest, string>> = {};
    if (formValues.project_idea.trim().length < 10) {
      newErrors.project_idea =
        "Project idea must be at least 10 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = async () => {
    if (!validate()) return;

    setIsLoading(true);
    setPlan(null);

    try {
      const response = await generatePlan(formValues);
      setPlan(response.plan);
      toast({
        title: "Plan generated!",
        description: "Your development plan is ready.",
      });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to generate plan. Please try again.";
      toast({
        title: "Generation failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!plan) return;

    setIsSaving(true);
    try {
      await savePlan({ ...formValues, generated_plan: plan });
      toast({
        title: "Saved!",
        description: "Plan added to your history.",
      });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to save plan.";
      toast({
        title: "Save failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Project Planner</h1>
        <p className="mt-2 text-muted-foreground">
          Describe your project idea and get a complete software development
          plan powered by AI.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <PlanForm
          values={formValues}
          onChange={setFormValues}
          onSubmit={handleGenerate}
          isLoading={isLoading}
          errors={errors}
        />
        <div className="lg:sticky lg:top-24">
          <PlanOutput
            plan={plan}
            isLoading={isLoading}
            projectIdea={formValues.project_idea}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </div>
      </div>
    </div>
  );
}
