import { computed, Component, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { WordCloudComponent } from '../session-present/word-cloud.component';
import type { WordCloudTerm } from '../session-present/word-cloud-term.service';

type FreetextWordCloudMode = 'WORDS' | 'PHRASES';

export type FreetextWordCloudDialogData = {
  responses: () => string[];
  terms: () => WordCloudTerm[];
  selectionScopeKey: () => string | null;
  eyebrow: string | null;
  description: string | null;
  analysisVariant: () => FreetextWordCloudMode;
  setAnalysisVariant: (variant: FreetextWordCloudMode) => void | Promise<void>;
  frozen: () => boolean;
  freezeLabel: () => string;
  toggleFreeze: () => void | Promise<void>;
};

@Component({
  selector: 'app-freetext-word-cloud-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatDialogClose,
    MatIcon,
    MatIconButton,
    WordCloudComponent,
  ],
  templateUrl: './freetext-word-cloud-dialog.component.html',
  styleUrl: './freetext-word-cloud-dialog.component.scss',
})
export class FreetextWordCloudDialogComponent {
  readonly data = inject<FreetextWordCloudDialogData>(MAT_DIALOG_DATA);

  readonly responses = computed(() => this.data.responses());
  readonly terms = computed(() => this.data.terms());
  readonly selectionScopeKey = computed(() => this.data.selectionScopeKey());
  readonly analysisVariant = computed(() => this.data.analysisVariant());
  readonly frozen = computed(() => this.data.frozen());
  readonly freezeLabel = computed(() => this.data.freezeLabel());

  setAnalysisVariant(variant: FreetextWordCloudMode): void {
    if (variant === this.analysisVariant()) {
      return;
    }

    void this.data.setAnalysisVariant(variant);
  }

  toggleFreeze(): void {
    void this.data.toggleFreeze();
  }
}
