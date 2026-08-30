// Date-only values (birth dates, training start dates, driving-log dates) are
// persisted as UTC midnight. Rendering or doing arithmetic on them in the
// viewer's local timezone shifts the calendar day by up to 24h — e.g. a birth
// date of Nov 1 stored as `2010-11-01T00:00:00Z` renders as Oct 31 for anyone
// west of UTC. Always interpret these values in UTC so the calendar date is
// stable regardless of where the viewer is.
//
// This does NOT apply to true instants (createdAt, completedAt): those are real
// timestamps and should stay in the viewer's local timezone.

/** Format a date-only value in UTC so the stored calendar date is preserved. */
export function formatDateOnly(
  value: string | Date,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' },
): string {
  return new Date(value).toLocaleDateString('en-US', { ...options, timeZone: 'UTC' })
}

/**
 * Midnight UTC for a stored date-only value, using its UTC calendar fields.
 * Use for whole-day arithmetic together with {@link todayAsUTC}.
 */
export function startOfUTCDay(value: string | Date): Date {
  const d = new Date(value)
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}

/**
 * The viewer's local calendar "today", expressed as a midnight-UTC instant so it
 * can be compared against {@link startOfUTCDay} values without timezone drift.
 */
export function todayAsUTC(now: Date = new Date()): Date {
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

/** Whole calendar days from `from` (inclusive start) to `to`, never negative. */
export function daysBetweenUTC(from: Date, to: Date): number {
  return Math.max(0, Math.round((to.getTime() - from.getTime()) / MS_PER_DAY))
}

/** Completed years from a date-only birth value to `now` (age in years). */
export function ageInYears(birthValue: string | Date, now: Date = new Date()): number {
  const birth = startOfUTCDay(birthValue)
  const today = todayAsUTC(now)
  let age = today.getUTCFullYear() - birth.getUTCFullYear()
  const beforeBirthday =
    today.getUTCMonth() < birth.getUTCMonth() ||
    (today.getUTCMonth() === birth.getUTCMonth() && today.getUTCDate() < birth.getUTCDate())
  if (beforeBirthday) age--
  return age
}

/**
 * The date of the `targetAge`-th birthday for a date-only birth value, as a
 * midnight-UTC instant.
 */
export function birthdayAtAge(birthValue: string | Date, targetAge: number): Date {
  const birth = startOfUTCDay(birthValue)
  return new Date(Date.UTC(birth.getUTCFullYear() + targetAge, birth.getUTCMonth(), birth.getUTCDate()))
}
