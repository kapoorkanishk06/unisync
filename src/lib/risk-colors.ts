import type { RiskLevel } from "../types/api";

export function getRiskColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    critical: "var(--risk-critical)",
    high: "var(--risk-high)",
    medium: "var(--risk-medium)",
    low: "var(--risk-low)",
  };
  return colors[level];
}

export function getRiskGlow(level: RiskLevel): string {
  const glows: Record<RiskLevel, string> = {
    critical: "var(--risk-critical-glow)",
    high: "var(--risk-high-glow)",
    medium: "var(--risk-medium-glow)",
    low: "var(--risk-low-glow)",
  };
  return glows[level];
}

export function getRiskLabel(level: RiskLevel): string {
  const labels: Record<RiskLevel, string> = {
    critical: "Critical",
    high: "High",
    medium: "Medium",
    low: "Low",
  };
  return labels[level];
}

export function getRiskScoreColor(score: number): string {
  if (score >= 70) return "var(--risk-critical)";
  if (score >= 50) return "var(--risk-high)";
  if (score >= 30) return "var(--risk-medium)";
  return "var(--risk-low)";
}
