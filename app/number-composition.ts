import type { PortraitStar } from "./star-portraits";

type PairTable = ReadonlyMap<string, { key: PortraitStar; strength: number }>;
export type NumberGroup = {
  raw: string;
  index: number;
  endIndex: number;
  base: string;
  stars: PortraitStar[];
  zeroCount: number;
  fiveCount: number;
  modifierPosition: "none" | "leading" | "middle" | "trailing" | "mixed";
  modifierRuns: { digits: string; index: number; position: "leading" | "middle" | "trailing" }[];
  baseReference?: string;
  repeated: boolean;
};

// Owner examples, 2026-11-05: 1700 -> 17, 3002 -> 32, 3599 -> 39.
// 0/5 are retained as modifiers, not independent stars. Repeated digits
// continue a preceding non-fuwei pair inside the SAME group; 99 alone is fuwei.
export function classifyNumberGroup(raw: string, table: PairTable) {
  const digits = raw.replace(/[05]/g, "");
  const pairs = Array.from({ length: Math.max(0, digits.length - 1) }, (_, i) => digits.slice(i, i + 2));
  const nonRepeats = pairs.filter(pair => pair[0] !== pair[1] && table.has(pair));
  // Leading fuwei is not a continuation of a future star (331 != 31).
  const leadingRepeat = nonRepeats.length && pairs[0]?.[0] === pairs[0]?.[1] ? pairs[0] : undefined;
  const selected = nonRepeats.length ? [...(leadingRepeat ? [leadingRepeat] : []), ...nonRepeats] : pairs.filter(pair => table.has(pair));
  const stars = [...new Set(selected.map(pair => table.get(pair)!.key))];
  const base = nonRepeats.length ? (leadingRepeat ? digits[0] : "") + digits.replace(/(.)\1+/g, "$1") : digits.slice(0, 2);
  const modifierRuns = [...raw.matchAll(/[05]+/g)].map(match => ({
    digits: match[0], index: match.index!,
    position: (match.index === 0 ? "leading" : match.index! + match[0].length === raw.length ? "trailing" : "middle") as "leading" | "middle" | "trailing",
  }));
  const positions = [...new Set(modifierRuns.map(run => run.position))];
  return {
    base, stars,
    zeroCount: (raw.match(/0/g) ?? []).length,
    fiveCount: (raw.match(/5/g) ?? []).length,
    modifierPosition: positions.length > 1 ? "mixed" as const : positions[0] ?? "none" as const,
    modifierRuns,
    repeated: pairs.some(pair => pair[0] === pair[1]),
  };
}

// 2026-11-06: the carrier is excluded completely. Scan adjacent significant
// digits left to right. Merge same-star runs (242, 272) and attached repeats,
// rather than imposing three-digit windows or whole-phone exceptions.
export function parseNumberComposition(phone: string, table: PairTable) {
  const anchors = Array.from({ length: Math.max(0, phone.length - 3) }, (_, i) => i + 3)
    .filter(index => /[1-46-9]/.test(phone[index]));
  const adjacent = anchors.slice(0, -1).map((index, i) => ({
    index, endIndex: anchors[i + 1], key: table.get(phone[index] + phone[anchors[i + 1]])?.key,
  }));
  // 4220 / 046: a zero closes the repeated ending, and starts the next
  // reading. Do not manufacture an extra 204 across that boundary.
  const pairs = adjacent.filter((pair, i) => !(i > 0 && adjacent[i - 1].key === "fuwei"
    && pair.key !== "fuwei" && phone.slice(pair.index + 1, pair.endIndex).includes("0")));
  const groups: NumberGroup[] = [];
  for (let i = 0; i < pairs.length;) {
    if (!pairs[i].key) { i++; continue; }
    let end = i;
    let active = pairs[i].key;
    // Initial repeated digits belong in the same reading as the next pair,
    // but classification still records that leading fuwei, e.g. 661.
    if (active === "fuwei") {
      while (pairs[end + 1]?.key === "fuwei" && pairs[end].endIndex === pairs[end + 1].index) end++;
      if (pairs[end + 1] && pairs[end].endIndex === pairs[end + 1].index) { end++; active = pairs[end].key; }
    }
    while (pairs[end + 1] && pairs[end].endIndex === pairs[end + 1].index
      && (pairs[end + 1].key === active || pairs[end + 1].key === "fuwei")) end++;
    let startIndex = pairs[i].index;
    let endIndex = pairs[end].endIndex;
    // Carry a closing 0 (4220 / 046), or the 0 after a mixed 5/0 run
    // (4509 / 092). Do not repeatedly carry the inner zeros of 8002
    // into an unrelated following 2959 reading.
    while (startIndex > 3 && phone[startIndex - 1] === "0") startIndex--;
    if (i > 0 && startIndex < pairs[i].index && !groups.at(-1)?.raw.endsWith("0")
      && phone[startIndex - 1] !== "5") startIndex = pairs[i].index;
    if (i === 0) startIndex = 3;
    // Intermediate 0s also close the previous group (370 + 7056).
    // A 5 belongs between its own endpoints, unless it is at the body end.
    while (phone[endIndex + 1] === "0") endIndex++;
    if (end === pairs.length - 1) endIndex = phone.length - 1;
    const raw = phone.slice(startIndex, endIndex + 1);
    const kind = classifyNumberGroup(raw, table);
    groups.push({ raw, index: startIndex, endIndex, ...kind,
      // Reference only: never a second scored match or duplicate paragraph.
      baseReference: startIndex < pairs[i].index ? phone.slice(pairs[i].index, pairs[end].endIndex + 1).replace(/[05]/g, "") : undefined });
    i = end + 1;
  }
  return { prefix: phone.slice(0, 3), groups };
}
