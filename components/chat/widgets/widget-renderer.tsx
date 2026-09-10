"use client";

import React from "react";
import {
  InteractiveChoiceData,
  ThreatRadarData,
  ActionChecklistData,
  DomainInspectorData,
} from "@/lib/generative-ui-schema";
import { InteractiveChoiceCard } from "./interactive-choice-card";
import { ThreatAnalysisRadar } from "./threat-analysis-radar";
import { SecurityActionChecklist } from "./security-action-checklist";
import { InspectDomainSnippet } from "./inspect-domain-snippet";

interface WidgetRendererProps {
  widgetType?: string | null;
  widgetData?: Record<string, unknown> | null;
  onSelectChoice?: (choice: { id: string; label: string; isSafeOption?: boolean }) => void;
  disabled?: boolean;
}

export function WidgetRenderer({
  widgetType,
  widgetData,
  onSelectChoice,
  disabled = false,
}: WidgetRendererProps) {
  if (!widgetType || !widgetData) return null;

  switch (widgetType) {
    case "interactive_choice":
      return (
        <InteractiveChoiceCard
          data={widgetData as unknown as InteractiveChoiceData}
          onSelectChoice={onSelectChoice}
          disabled={disabled}
        />
      );

    case "threat_radar":
      return (
        <ThreatAnalysisRadar
          data={widgetData as unknown as ThreatRadarData}
        />
      );

    case "action_checklist":
      return (
        <SecurityActionChecklist
          data={widgetData as unknown as ActionChecklistData}
        />
      );

    case "domain_inspector":
      return (
        <InspectDomainSnippet
          data={widgetData as unknown as DomainInspectorData}
        />
      );

    default:
      return null;
  }
}
