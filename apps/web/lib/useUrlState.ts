'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

type Primitive = string | number;

/**
 * Tool state that can live in the query string (`?seed=12&pal=riso`) so any result is shareable.
 * With `sync` off (the Lab hub, the home mini-lab) it is plain local state.
 */
export function useUrlState<T extends Record<string, Primitive>>(defaults: T, sync: boolean) {
  const params = useSearchParams();
  const pathname = usePathname();
  const [local, setLocal] = useState<T>(defaults);

  const fromUrl = (): T => {
    const out = { ...defaults };
    for (const k of Object.keys(defaults) as (keyof T)[]) {
      const raw = params.get(k as string);
      if (raw == null) continue;
      const def = defaults[k];
      if (typeof def === 'number') {
        const n = Number(raw);
        if (Number.isFinite(n)) out[k] = n as T[keyof T];
      } else out[k] = raw as T[keyof T];
    }
    return out;
  };

  const state = sync ? fromUrl() : local;
  const has = (k: keyof T) => sync && params.has(k as string);

  const set = useCallback(
    (patch: Partial<T>) => {
      if (!sync) {
        setLocal((s) => ({ ...s, ...patch }));
        return;
      }
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(patch)) next.set(k, String(v));
      // Native replaceState is picked up by useSearchParams without a server round trip,
      // so typing in the Mutator stays instant.
      window.history.replaceState(null, '', `${pathname}?${next.toString()}`);
    },
    [sync, params, pathname],
  );

  return [state, set, has] as const;
}

export const randomSeed = (max = 9999) => 1 + Math.floor(Math.random() * max);
