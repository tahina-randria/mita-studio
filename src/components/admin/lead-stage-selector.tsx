"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PIPELINE_STAGES,
  STAGE_LABELS,
  STAGE_TEXT_COLORS,
} from "@/types/crm";
import type { PipelineStage } from "@/types/crm";
import { Button } from "@/components/ui/button";

interface LeadStageSelectorProps {
  leadId: string;
  currentStage: PipelineStage;
}

export function LeadStageSelector({
  leadId,
  currentStage,
}: LeadStageSelectorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStageChange = async (newStage: PipelineStage) => {
    if (newStage === currentStage) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/crm/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update stage:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {PIPELINE_STAGES.map((stage) => (
        <Button
          key={stage}
          variant="ghost"
          size="sm"
          disabled={loading}
          onClick={() => handleStageChange(stage)}
          className={`text-xs ${
            stage === currentStage
              ? STAGE_TEXT_COLORS[stage] + " font-semibold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {STAGE_LABELS[stage]}
        </Button>
      ))}
    </div>
  );
}
