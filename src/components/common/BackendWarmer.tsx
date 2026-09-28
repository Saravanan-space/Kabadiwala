'use client';

import { useEffect } from 'react';
import { warmupBackend } from '../../services/aiService';

export function BackendWarmer() {
  useEffect(() => {
    // Initial warmup on site open
    warmupBackend();

    // Periodic ping every 4 minutes while the tab remains open
    const interval = setInterval(() => {
      warmupBackend();
    }, 4 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
