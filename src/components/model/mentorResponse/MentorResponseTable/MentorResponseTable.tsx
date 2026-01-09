"use client";

import { Badge } from "@/components/ui/Badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import type { MentorResponse } from "@/models/mentorResponse/mentorResponse";
import { formatSlotDisplay } from "@/models/slot/slotFormat";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

type MentorResponseTableProps = {
  responses: MentorResponse[];
};

export function MentorResponseTable({ responses }: MentorResponseTableProps) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const sortedResponses = [...responses].sort((a, b) => {
    // 回答数が多い順にソート
    if (sortOrder === "asc") {
      return a.slots.length - b.slots.length;
    }
    return b.slots.length - a.slots.length;
  });

  if (responses.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
        <p className="text-gray-500">まだ回答がありません</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                <button
                  type="button"
                  onClick={toggleSort}
                  className="flex items-center gap-2 hover:text-black transition-colors"
                >
                  メンター名
                </button>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                <button
                  type="button"
                  onClick={toggleSort}
                  className="flex items-center gap-2 hover:text-black transition-colors"
                >
                  可能時間帯
                  <Tooltip>
                    <TooltipTrigger>?</TooltipTrigger>
                    <TooltipContent>
                      <p>メンターの可能時間帯の候補数でソートされます</p>
                    </TooltipContent>
                  </Tooltip>
                  {sortOrder === "asc" ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedResponses.map((response) => {
              return (
                <tr
                  key={response.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {response.mentorName}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="space-y-1">
                      {response.slots.map((slot) => (
                        <Badge key={slot.id} variant="outline" className="m-1">
                          {formatSlotDisplay(slot)}
                        </Badge>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
