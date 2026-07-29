export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin = 0,
  outMax = 1,
  clamp = true
) {
  const t = (value - inMin) / (inMax - inMin);
  const result = outMin + t * (outMax - outMin);
  if (!clamp) return result;
  return Math.min(outMax, Math.max(outMin, result));
}
