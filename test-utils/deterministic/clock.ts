/**
 * Deterministic clock that can be fixed for tests.
 * Reading time through this service keeps timestamps
 * repeatable instead of relying on Date.now() directly.
 */

export const createClock = (fixedTimeInput?: number | string | Date | null) => {
  let fixedTime: number | null = null;

  const parseTime = (t: number | string | Date): number => {
    if (typeof t === 'number') return t;
    if (typeof t === 'string') return new Date(t).getTime();
    return t.getTime();
  };

  if (fixedTimeInput !== undefined && fixedTimeInput !== null) {
    fixedTime = parseTime(fixedTimeInput);
  }

  return {
    setFixedTime(time: number | string | Date | null) {
      if (time === null) {
        fixedTime = null;
        return;
      }
      fixedTime = parseTime(time);
    },

    getNow(): Date {
      if (fixedTime !== null) {
        return new Date(fixedTime);
      }
      return new Date();
    },

    getNowIso(): string {
      return this.getNow().toISOString();
    },

    getNowTimestamp(): number {
      return this.getNow().getTime();
    },
  };
};

// Strapi service wrapper (used when running inside Strapi)
export const clockService = ({ strapi }: { strapi: any }) => {
  const clock = createClock();

  const getConfigFixedTime = () => {
    try {
      return strapi.config.get('plugin::content-lifecycle.clock.fixedTime');
    } catch {
      return null;
    }
  };

  return {
    setFixedTime: clock.setFixedTime,
    getNow(): Date {
      const cfgFixed = getConfigFixedTime();
      if (fixedTime !== null) {
        return clock.getNow();
      }
      if (cfgFixed) {
        return new Date(typeof cfgFixed === 'number' ? cfgFixed : new Date(cfgFixed).getTime());
      }
      return clock.getNow();
    },
    getNowIso(): string {
      return this.getNow().toISOString();
    },
    getNowTimestamp(): number {
      return this.getNow().getTime();
    },
  };
};
