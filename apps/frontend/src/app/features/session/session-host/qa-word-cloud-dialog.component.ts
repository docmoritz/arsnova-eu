import { computed, Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import type {
  QaQuestionSortMode,
  WordCloudAnalysisEntryDTO,
  WordCloudAnalysisVariant,
} from '@arsnova/shared-types';
import { WordCloudComponent } from '../session-present/word-cloud.component';
import type { WeightedWordSource } from '../session-present/word-cloud.util';

export type QaWordCloudDialogData = {
  responses: () => string[];
  weightedResponses: () => WeightedWordSource[];
  analysisEntries: () => WordCloudAnalysisEntryDTO[] | null;
  title: () => string;
  eyebrow: string | null;
  description: string | null;
  weightingHint: () => string | null;
  tooltipMetricLabel: () => string | null;
  analysisVariant: () => WordCloudAnalysisVariant;
  setAnalysisVariant: (variant: WordCloudAnalysisVariant) => void | Promise<void>;
  themeModeAvailable: () => boolean;
  themeFallbackHint: () => string | null;
  sortMode: () => QaQuestionSortMode;
  setSortMode: (mode: QaQuestionSortMode) => void | Promise<void>;
  itemLabelSingular: string;
  itemLabelPlural: string;
};

@Component({
  selector: 'app-qa-word-cloud-dialog',
  standalone: true,
  imports: [
    MatIconButton,
    MatDialogClose,
    MatIcon,
    MatButtonToggleGroup,
    MatButtonToggle,
    WordCloudComponent,
  ],
  templateUrl: './qa-word-cloud-dialog.component.html',
  styleUrl: './qa-word-cloud-dialog.component.scss',
})
export class QaWordCloudDialogComponent {
  readonly data = inject<QaWordCloudDialogData>(MAT_DIALOG_DATA);

  readonly responses = computed(() => this.data.responses());
  readonly weightedResponses = computed(() => this.data.weightedResponses());
  readonly analysisEntries = computed(() => this.data.analysisEntries());
  readonly title = computed(() => this.data.title());
  readonly weightingHint = computed(() => this.data.weightingHint());
  readonly tooltipMetricLabel = computed(() => this.data.tooltipMetricLabel());
  readonly analysisVariant = computed(() => this.data.analysisVariant());
  readonly themeModeAvailable = computed(() => this.data.themeModeAvailable());
  readonly themeFallbackHint = computed(() => this.data.themeFallbackHint());
  readonly sortMode = computed(() => this.data.sortMode());

  setSortMode(mode: QaQuestionSortMode): void {
    if (mode === this.sortMode()) {
      return;
    }

    void this.data.setSortMode(mode);
  }

  setAnalysisVariant(variant: WordCloudAnalysisVariant): void {
    if (variant === this.analysisVariant()) {
      return;
    }

    void this.data.setAnalysisVariant(variant);
  }
}
