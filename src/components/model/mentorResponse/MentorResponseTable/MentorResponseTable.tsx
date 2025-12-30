"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { MentorResponse } from "@/models/mentorResponse/mentorResponse";
import { formatSlotDisplay } from "@/models/slot/slotFormat";

type MentorResponseTableProps = {
  responses: MentorResponse[];
};

export function MentorResponseTable({ responses }: MentorResponseTableProps) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const sortedResponses = [...responses].sort((a, b) => {
    // 名前でソート
    if (sortOrder === "asc") {
      return a.mentorName.localeCompare(b.mentorName);
    }
    return b.mentorName.localeCompare(a.mentorName);
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
                  {sortOrder === "asc" ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                回答日時スロット
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                回答日時
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                詳細
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedResponses.map((response) => {
              const isExpanded = expandedRows.has(response.id);
              const displaySlots = isExpanded
                ? response.slots
                : response.slots.slice(0, 2);
              const hasMore = response.slots.length > 2;

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
                      {displaySlots.map((slot) => (
                        <Badge key={slot.id} variant="outline">
                          {formatSlotDisplay(slot)}
                        </Badge>
                      ))}
                      {hasMore && !isExpanded && (
                        <span className="text-xs text-gray-500">
                          他{response.slots.length - 2}件...
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(response.createdAt).toLocaleString("ja-JP", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {hasMore && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => toggleRow(response.id)}
                      >
                        {isExpanded ? "閉じる" : "すべて表示"}
                      </Button>
                    )}
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
