import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type {
  Budget,
  ExperienceLevel,
  GeneratePlanRequest,
  Industry,
  ProjectType,
} from "@/types/plan";
import {
  BUDGETS,
  EXPERIENCE_LEVELS,
  INDUSTRIES,
  PROJECT_TYPES,
} from "@/types/plan";

interface PlanFormProps {
  values: GeneratePlanRequest;
  onChange: (values: GeneratePlanRequest) => void;
  onSubmit: () => void;
  isLoading: boolean;
  errors: Partial<Record<keyof GeneratePlanRequest, string>>;
}

export function PlanForm({
  values,
  onChange,
  onSubmit,
  isLoading,
  errors,
}: PlanFormProps) {
  const update = <K extends keyof GeneratePlanRequest>(
    key: K,
    value: GeneratePlanRequest[K],
  ) => {
    onChange({ ...values, [key]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Project Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project_idea">Project Idea</Label>
            <Textarea
              id="project_idea"
              placeholder="I want to build an AI-powered hotel booking platform..."
              value={values.project_idea}
              onChange={(e) => update("project_idea", e.target.value)}
              rows={5}
              disabled={isLoading}
              className={errors.project_idea ? "border-destructive" : ""}
            />
            {errors.project_idea && (
              <p className="text-sm text-destructive">{errors.project_idea}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormSelect
              label="Industry"
              value={values.industry}
              options={INDUSTRIES}
              onChange={(v) => update("industry", v as Industry)}
              disabled={isLoading}
            />
            <FormSelect
              label="Budget"
              value={values.budget}
              options={BUDGETS}
              onChange={(v) => update("budget", v as Budget)}
              disabled={isLoading}
            />
            <FormSelect
              label="Project Type"
              value={values.project_type}
              options={PROJECT_TYPES}
              onChange={(v) => update("project_type", v as ProjectType)}
              disabled={isLoading}
            />
            <FormSelect
              label="Experience Level"
              value={values.experience_level}
              options={EXPERIENCE_LEVELS}
              onChange={(v) => update("experience_level", v as ExperienceLevel)}
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Plan
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

interface FormSelectProps {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

function FormSelect({
  label,
  value,
  options,
  onChange,
  disabled,
}: FormSelectProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
