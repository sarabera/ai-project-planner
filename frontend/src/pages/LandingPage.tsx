import { Link } from "react-router-dom";
import {
  ArrowRight,
  Database,
  Layers,
  Rocket,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Planning",
    description:
      "Transform any project idea into a comprehensive development plan in seconds.",
  },
  {
    icon: Layers,
    title: "Full Architecture",
    description:
      "Get tech stack recommendations, system design, database schemas, and API specs.",
  },
  {
    icon: Rocket,
    title: "Deployment Ready",
    description:
      "Includes deployment strategies, cost estimates, and a phased development roadmap.",
  },
];

const exampleSections = [
  "Project Overview",
  "Core Features",
  "Tech Stack",
  "System Architecture",
  "Database Design",
  "API Endpoints",
  "Development Roadmap",
  "Cost Estimation",
];

export function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">
              Powered by AI
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Turn Ideas Into{" "}
              <span className="text-primary">Production Plans</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              AI Project Planner helps developers, founders, and students
              transform project ideas into complete software development plans
              with architecture, tech stack, and roadmap.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link to="/planner">
                  Start Planning
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/history">View History</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Everything You Need to Build
          </h2>
          <p className="mt-4 text-muted-foreground">
            From idea to deployment — get actionable plans tailored to your
            industry, budget, and experience level.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="border-2 transition-colors hover:border-primary/50">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Example Output */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Example Output
              </h2>
              <p className="mt-4 text-muted-foreground">
                Input: &ldquo;I want to build an AI-powered hotel booking
                platform.&rdquo;
              </p>
              <p className="mt-2 text-muted-foreground">
                The AI generates a detailed markdown plan with 16+ sections
                covering every aspect of your project.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {exampleSections.map((section) => (
                  <Badge key={section} variant="outline">
                    {section}
                  </Badge>
                ))}
              </div>
            </div>
            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-muted/50 pb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Database className="h-4 w-4" />
                  Generated Plan Preview
                </div>
              </CardHeader>
              <CardContent className="space-y-3 p-6 font-mono text-xs">
                <p className="font-bold text-foreground"># Project Overview</p>
                <p className="text-muted-foreground">
                  An AI-powered hotel booking platform that uses machine
                  learning to personalize recommendations...
                </p>
                <p className="font-bold text-foreground"># Recommended Tech Stack</p>
                <p className="text-muted-foreground">
                  Frontend: React + TypeScript | Backend: FastAPI | DB:
                  PostgreSQL | AI: OpenAI API
                </p>
                <p className="font-bold text-foreground"># Development Roadmap</p>
                <p className="text-muted-foreground">
                  Phase 1 (Weeks 1-4): Core booking flow...
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Zap className="mb-4 h-10 w-10 text-primary" />
            <h2 className="text-2xl font-bold md:text-3xl">
              Ready to Plan Your Next Project?
            </h2>
            <p className="mt-2 max-w-md text-muted-foreground">
              Stop guessing. Get a professional development plan in minutes.
            </p>
            <Button asChild size="lg" className="mt-6 gap-2">
              <Link to="/planner">
                Generate Your Plan
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
