"use client";

import { SurveySummaryCard } from "@/components/model/survey/SurveySummaryCard";
import { Button } from "@/components/ui/Button";
import type { Survey } from "@/models/survey/survey";
import { Plus } from "lucide-react";
import Link from "next/link";

type SurveyWithCount = Survey & {
  responseCount: number;
};

type OrganizerSurveyListProps = {
  surveys: SurveyWithCount[];
};

export function OrganizerSurveyList({ surveys }: OrganizerSurveyListProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">アンケート管理</h1>
            <p className="text-gray-600 mt-2">
              メンター日程調整アンケートの作成と管理
            </p>
          </div>
          <Link href="/organizer/create">
            <Button variant="default" size="lg" className="cursor-pointer">
              <Plus className="h-5 w-5" />
              新規作成
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {surveys.map((survey) => (
            <SurveySummaryCard
              key={survey.id}
              survey={survey}
              responseCount={survey.responseCount}
            />
          ))}
        </div>

        {surveys.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-500 mb-4">
              まだアンケートが作成されていません
            </p>
            <Link href="/organizer/create">
              <Button variant="default" className="cursor-pointer">
                <Plus className="h-5 w-5" />
                最初のアンケートを作成
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
