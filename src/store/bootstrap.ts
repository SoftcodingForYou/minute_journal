import { useEffect, useState } from 'react';

import { initI18n } from '@/i18n';

import { useCategories } from './categories';
import { useEntries } from './entries';
import { useSettings } from './settings';

/**
 * Hydrates all stores from SQLite and initializes i18n exactly once at startup.
 * Returns `true` when the app is ready to render.
 */
export function useBootstrap(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await useSettings.getState().load();
      await initI18n(useSettings.getState().language);
      await Promise.all([useCategories.getState().load(), useEntries.getState().load()]);
      if (mounted) setReady(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return ready;
}
