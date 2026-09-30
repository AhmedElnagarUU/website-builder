// Shared period helper. Polar webhook and manual verification both extend the
// subscription by +30 days via setDate, mirroring the trial pattern in
// monetization/repository.ts.
export function nextPeriodEnd(now: Date): Date {
  const end = new Date(now);
  end.setDate(end.getDate() + 30);
  return end;
}