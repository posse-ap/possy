"use client";

import { Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import type { Survey } from "@/models/survey/survey";

type SurveySummaryCardProps = {
  survey: Survey;
  responseCount?: number;
};

export function SurveySummaryCard({
  survey,
  responseCount = 0,
}: SurveySummaryCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <Link href={`/organizer/${survey.id}`}>
      <Card className="border-2 hover:shadow-lg hover:border-gray-400 transition-all cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl">{survey.title}</CardTitle>
              <CardDescription className="mt-2">
                {survey.description}
              </CardDescription>
            </div>
            <ExternalLink className="h-5 w-5 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(survey.startDate)} - {formatDate(survey.endDate)}
            </Badge>
            <Badge variant="secondary">{responseCount}件の回答</Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
