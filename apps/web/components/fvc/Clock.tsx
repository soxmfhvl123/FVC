'use client';

import { useSyncExternalStore } from 'react';

const TZ = 'Asia/Seoul';
const parts = new Intl.DateTimeFormat('en-GB', {
  timeZone: TZ,
  year: '2-digit',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

function seoulNow() {
  const p = Object.fromEntries(parts.formatToParts(new Date()).map((x) => [x.type, x.value]));
  return { full: `${p.month}.${p.day}.${p.year} ${p.hour}:${p.minute}:${p.second}`, short: `${p.hour}:${p.minute}` };
}

let snap = { full: '', short: '' };
let timer: ReturnType<typeof setInterval> | undefined;
const subs = new Set<() => void>();

function subscribe(cb: () => void) {
  subs.add(cb);
  if (!timer) {
    const tick = () => {
      snap = seoulNow();
      subs.forEach((s) => s());
    };
    tick();
    timer = setInterval(tick, 1000);
  }
  return () => {
    subs.delete(cb);
    if (!subs.size && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

/** Seoul time. `short` = HH:MM, `full` = MM.DD.YY HH:MM:SS (24h). Blank placeholder until hydrated. */
export function Clock({ format = 'short', prefix = '' }: { format?: 'short' | 'full'; prefix?: string }) {
  const now = useSyncExternalStore(
    subscribe,
    () => snap,
    () => snap,
  );
  const value = now[format] || (format === 'short' ? '--:--' : '--.--.-- --:--:--');
  return (
    <time suppressHydrationWarning aria-label={`${prefix}Seoul time ${value}`}>
      {prefix}
      {value}
    </time>
  );
}
