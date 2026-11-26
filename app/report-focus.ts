import type { PortraitStar } from "./star-portraits";
import type { NumberGroup } from "./number-composition";
import type { ReadingDomain } from "./combination-readings";
import type { CompositionReading } from "./composition-readings";

// Presentation synthesis, not a new numerology scoring system. The analyser
// still reads every group left to right and computes the existing type/radar.
export type FocusEntry = {
  group: NumberGroup; lead: string; text: string; question: string;
  composition?: CompositionReading;
  matches: { key: PortraitStar; strength: number; tail: boolean }[];
};
type FocusSource = { primary: { key: PortraitStar }; work: { ordered?: FocusEntry[] } };
export type ModifierMood = "plain" | "visible" | "growing" | "hidden" | "empty" | "mixed";

export const TYPE_IDENTITIES: Record<PortraitStar, { role: string; motto: string; domain: ReadingDomain }> = {
  shengqi: { role: "人缘好，心也软", motto: "别人有事愿意找你，你有难处却不爱麻烦别人。", domain: "relationship" },
  tianyi: { role: "重感情，讲信用", motto: "答应别人的事记得牢，自己的要求却不好意思提。", domain: "money" },
  yannian: { role: "能干，也爱操心", motto: "事情交给你，别人放心；交给别人，你又忍不住盯着。", domain: "work" },
  fuwei: { role: "做事稳，顾虑多", motto: "熟悉的事能坚持，换个做法就总怕出错。", domain: "work" },
  jueming: { role: "有冲劲，不服输", motto: "认准了就敢干，难处来了也不爱说自己做不到。", domain: "work" },
  wugui: { role: "脑子活，主意多", motto: "这个办法刚开始试，心里又冒出一个新点子。", domain: "work" },
  liusha: { role: "心思细，容易想多", motto: "别人一句话你能记很久，自己的不高兴却常说成没事。", domain: "relationship" },
  huohai: { role: "嘴上直，心里急", motto: "本来想把事情讲清楚，一着急却把话说重了。", domain: "relationship" },
};

export function modifierMood(group?: NumberGroup): ModifierMood {
  if (!group || (!group.zeroCount && !group.fiveCount)) return "plain";
  if (group.zeroCount && group.fiveCount) return "mixed";
  const trailing = group.modifierRuns.some(run => run.position === "trailing");
  return group.zeroCount ? trailing ? "empty" : "hidden" : trailing ? "growing" : "visible";
}

export function selectReportFocus(analysis: FocusSource) {
  const star = analysis.primary.key;
  const entries = analysis.work.ordered ?? [];
  const candidates = entries.filter(entry => entry.group.stars.includes(star));
  // Within the already-selected type, explicit modifier readings have more
  // specific copy than a broad star portrait. No new numeric bonus is added.
  const detailed = candidates.filter(entry => entry.composition);
  const pool = detailed.length ? detailed : candidates;
  const weight = (entry: FocusEntry) => entry.matches.reduce((sum, match) => {
    const effective = match.key === "fuwei" && entry.group.stars.length === 1
      ? entry.group.stars[0] : match.key;
    return sum + (effective === star ? match.strength + (match.tail ? 2 : 0) : 0);
  }, 0);
  const anchor = pool.reduce<FocusEntry | undefined>((best, entry) =>
    !best || weight(entry) > weight(best) ? entry : best, undefined);
  return { star, anchor, mood: modifierMood(anchor?.group), ...TYPE_IDENTITIES[star] };
}

// Short summaries of the existing star/0/5 narratives. Kept separate from the
// evidence paragraphs so the cover and detailed sections do not repeat them.
const TRAPS: Record<PortraitStar, [string, string, string]> = {
  shengqi: ["不想扫兴，自己的事却总往后排。", "别人说会帮，你就不好意思再问。", "等着别人搭把手，最后还是自己收尾。"],
  tianyi: ["人越熟，钱和条件越不好意思问。", "钱放在别人那里，轮到自己用时拿不回来。", "忙着挣钱，也忙着花，最后没留下多少。"],
  yannian: ["不放心别人做，最后什么都得自己做。", "活做了不少，机会却没替自己争取。", "什么都想顾好，忙到最后反而顾不过来。"],
  fuwei: ["总想准备得更好，开始就一拖再拖。", "怕选错，问了很多人，还是没决定。", "计划改了一遍又一遍，事情还没开始。"],
  jueming: ["答应时很爽快，做起来才发现接太多。", "难处不爱说，撑不住了也自己扛。", "开头用力太猛，后面反而跟不上。"],
  wugui: ["新办法越想越多，手里的事反而没做完。", "心里已经想换办法，别人却还不知道。", "换了几条路，最初想做的事还没做成。"],
  liusha: ["顾着别人开不开心，自己的委屈没说。", "嘴上说都可以，心里其实很介意。", "失望了不说，慢慢就不想再主动。"],
  huohai: ["本来想把事说清，着急了却把话说重。", "怕话说开了伤和气，自己又咽不下这口气。", "解释了很多，真正想说的反而没说清。"],
};
export function focusTrap(star: PortraitStar, mood: ModifierMood) {
  if (mood === "visible" || mood === "growing") return {
    shengqi:"热心牵线帮忙，自己的安排却被挤掉。", tianyi:"认准一个人，就容易把付出越加越多。",
    yannian:"能做的事情越多，别人越习惯全来找你。", fuwei:"认准了一套办法，改起来就有点费劲。",
    jueming:"一口答应的事，后来得花更多力气补。", wugui:"新主意来得太快，旧计划就被放下了。",
    liusha:"太在意别人的态度，一句话就影响心情。", huohai:"话说得太快，别人先记住了你的语气。",
  }[star];
  return TRAPS[star][mood === "hidden" ? 1 : mood === "empty" ? 2 : 0];
}

// The cover names one concern. Ordered mixed effects remain in the detailed
// reading; neither modifier is cancelled or turned into a numeric penalty.
// A plain pair may describe caution or steady cooperation. Its cover must not
// automatically inherit an unrelated type-wide borrowing or overwork story.
export function pairFocusConcern(star:PortraitStar,group?:NumberGroup) {
  if(!group || group.stars.length!==1 || modifierMood(group)!=='plain') return;
  const domain=TYPE_IDENTITIES[star].domain;
  const concerns:Record<string,Partial<Record<ReadingDomain,string>>>={
    '13':{money:'愿意多做一点，却容易忽略自己的时间和开销'},
    '31':{money:'自己的预算没说清，一起用钱时容易各想各的'},
    '68':{money:'在意能存下多少，也容易忽略买完以后持续的费用'},
    '86':{money:'价格算得细，付款之后的安排也需要问完整'},
    '49':{money:'几个机会都想尝试，总投入却容易没有算清'},
    '94':{money:'重视别人给的推荐，也容易省掉新一次合作的确认'},
    '81':{work:'备用办法准备得多，主要任务却可能还没顾完'},
    '24':{work:'想把可能的问题都弄清，反而迟迟没有开始'},
    '43':{work:'希望条件都明确，事情容易停在选择阶段'},
    '34':{work:'安排排得细，条件变了却可能还守着旧步骤'},
    '26':{work:'熟悉步骤做得稳，换一种问题还需要弄懂原因'},
    '62':{work:'开始有劲头，看不到进展时却容易停下来'},
    '19':{work:'问题处理好了，别人却未必知道你做过哪些事'},
    '91':{work:'分工能安排好，也容易把不同做法当成没有照做'},
    '16':{relationship:'先顾对方的反应，自己的需要容易没讲完整'},
    '92':{relationship:'客气地听完，容易被对方当成已经同意'},
    '27':{relationship:'当面愿意听，心里的保留意见却没有说出来'},
  };
  for(let i=0;i<group.base.length-1;i++) {
    const concern=concerns[group.base.slice(i,i+2)]?.[domain];
    if(concern) return concern+'。';
  }
}

export function focusHook(focus: ReturnType<typeof selectReportFocus>, _lead: string) {
  const specific=pairFocusConcern(focus.star,focus.anchor?.group);
  if(specific) return specific;
  const mood = focus.mood === "mixed" ? focus.anchor?.group.modifierRuns.some(run=>run.position==="trailing" && run.digits.includes("0")) ? "empty" : "hidden" : focus.mood;
  return _lead || focusTrap(focus.star,mood);
}

export function freshDetails(text: string, alreadyVisible: string[]) {
  const sentences = (copy: string) => copy.match(/[^。！？]+[。！？]?/g) ?? [];
  const used = new Set(alreadyVisible.flatMap(sentences).map(s => s.trim()));
  return [...new Set(sentences(text).map(s => s.trim()))].filter(s => s && !used.has(s));
}
