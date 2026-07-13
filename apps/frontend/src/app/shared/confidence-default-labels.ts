/** Story 1.2i: Standard-Ecklabels für die 5-Stufen-Sicherheitsskala (i18n). */
export function confidenceDefaultLabelLow(): string {
  return $localize`:@@confidence.defaultLabelLow:sehr unsicher`;
}

export function confidenceDefaultLabelHigh(): string {
  return $localize`:@@confidence.defaultLabelHigh:absolut sicher`;
}

export function resolveConfidenceLabelLow(custom: string | null | undefined): string {
  const trimmed = custom?.trim() ?? '';
  return trimmed || confidenceDefaultLabelLow();
}

export function resolveConfidenceLabelHigh(custom: string | null | undefined): string {
  const trimmed = custom?.trim() ?? '';
  return trimmed || confidenceDefaultLabelHigh();
}
