import type { Locale } from '@/algorithms/types';

export const playerLabels: Record<
  Locale,
  { start: string; pause: string; next: string; back: string; reset: string; step: string; of: string }
> = {
  vi: {
    start: 'Bắt đầu',
    pause: 'Tạm dừng',
    next: 'Bước sau',
    back: 'Bước trước',
    reset: 'Làm lại',
    step: 'Bước',
    of: '/',
  },
  en: {
    start: 'Start',
    pause: 'Pause',
    next: 'Next step',
    back: 'Back',
    reset: 'Reset',
    step: 'Step',
    of: '/',
  },
};
