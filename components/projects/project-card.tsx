import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { IProjectItem } from '@/lib/projects-data';

interface IProjectCardProps {
  project: IProjectItem;
}

export function ProjectCard({ project }: IProjectCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-3">
        <CardTitle className="text-2xl">{project.name}</CardTitle>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {project.summary}
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
          <p>
            <span className="font-semibold">Problem:</span> {project.problem}
          </p>
          <p>
            <span className="font-semibold">Solution:</span> {project.solution}
          </p>
          <p>
            <span className="font-semibold">Impact:</span> {project.impact}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <Badge key={`${project.slug}-${tech}`}>{tech}</Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {project.links.map((link) => {
            if (link.external) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand)] underline-offset-4 hover:underline"
                >
                  {link.label}
                  <ArrowUpRight className="size-3.5" />
                </a>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand)] underline-offset-4 hover:underline"
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
