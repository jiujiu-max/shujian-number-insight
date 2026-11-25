import type { PortraitStar } from "./star-portraits";
import type { NumberGroup } from "./number-composition";

export const SITE_URL = "https://jiaming27.cn/";
export const DIMENSIONS = ["行动", "表达", "感受", "坚持", "变通"] as const;
export type DimensionVector = [number, number, number, number, number];

// Editorial mapping v1, not a validated psychometric scale. Values mean only
// emphasis within the supplied eight-star narratives; no population percentiles.
export const EIGHT_TYPES: Record<PortraitStar, {
  name: string; word: string; star: string; tagline: string; strength: string;
  consultation: string; dimensions: DimensionVector;
}> = {
  shengqi: { name: "热心肠", word: "缘", star: "生气", tagline: "朋友多、路子广，就是不好意思拒绝人。", strength: "跟人聊得来，遇到事知道找谁帮忙。", consultation: "人缘好，也不必每个忙都答应。", dimensions: [2, 3, 3, 1, 4] },
  tianyi: { name: "实在人", word: "情", star: "天医", tagline: "对人掏心掏肺，谈钱却怕伤感情。", strength: "说到做到，肯下功夫，让人信得过。", consultation: "对人实在，也别委屈了自己。", dimensions: [2, 2, 4, 3, 1] },
  yannian: { name: "主心骨", word: "担", star: "延年", tagline: "有事大家都找你，你却不好意思喊累。", strength: "事情再多也能排好先后，出了问题敢负责。", consultation: "能扛事，也不必什么都自己扛。", dimensions: [4, 2, 1, 4, 1] },
  fuwei: { name: "稳当派", word: "稳", star: "伏位", tagline: "做熟的事很靠谱，没做过的事总怕出错。", strength: "有耐心，坐得住，别人嫌烦的事也能认真做完。", consultation: "想稳一点，也别一直停在原地。", dimensions: [1, 1, 2, 4, 1] },
  jueming: { name: "行动派", word: "勇", star: "绝命", tagline: "说干就干，有时答应得太快、接得太多。", strength: "敢试、敢争取，遇到难题不轻易退缩。", consultation: "敢往前走，也值得先想清楚。", dimensions: [4, 3, 1, 2, 2] },
  wugui: { name: "点子王", word: "思", star: "五鬼", tagline: "新主意一个接一个，就是容易半路换方向。", strength: "学得快，办法多，一条路走不通会换个办法。", consultation: "点子这么多，先聊哪一个值得做下去。", dimensions: [3, 2, 2, 1, 4] },
  liusha: { name: "细心派", word: "感", star: "六煞", tagline: "别人脸色一变，你就开始想是不是自己做错了。", strength: "心细，会照顾人，小事也愿意替别人多想一步。", consultation: "照顾别人，也别总委屈自己。", dimensions: [1, 2, 4, 2, 3] },
  huohai: { name: "直性子", word: "言", star: "祸害", tagline: "有话直说，一着急就容易把人得罪了。", strength: "会说、敢开口，能把一件事讲明白。", consultation: "话能讲明白，关系也可以少一点别扭。", dimensions: [3, 4, 2, 2, 1] },
};

type RadarMatch = { key: PortraitStar; index: number; endIndex: number; strength: number; tail: boolean };
export type RadarProfile = {
  values: DimensionVector; labels: typeof DIMENSIONS; prominent: string[];
  // Kept in memory for tests/auditing; never included in a share payload.
  contributions: { index: number; endIndex: number; star: PortraitStar; weight: number }[];
};

// Plain-language descriptions of the displayed chart, not extra scores or
// new claims about the input. Thresholds are editorial, not population norms.
const DIMENSION_READINGS = [
  {meaning:"做事是先动手，还是先想清楚", levels:[
    ["先想清楚，再动手", "不急着跟风，想弄明白再开始。稳是长处，但也可能想了很久，第一步还没迈出去。"],
    ["看准了就做，没把握会再想想", "熟悉的事不太拖，遇到新事情会多问几句。有人催你时，也想先确认自己能不能接下来。"],
    ["说干就干，接事也快", "机会来了愿意先试，遇到事情敢站出来。只是有时答应得快，后来才发现时间不够、事情比想的多。"],
  ]},
  {meaning:"心里的想法，会不会直接说", levels:[
    ["心里有数，嘴上不一定说", "不喜欢抢着讲话，熟了才愿意多说。别人可能以为你没意见，其实你只是在找合适的时候开口。"],
    ["该说的时候说，也会看场合", "愿意讲自己的想法，但会顾及对方的感受。碰到不太好开口的事，有时还是先放在心里。"],
    ["会说，也敢开口争取", "介绍事情、替自己争取机会，你不太怕开口。只是着急时容易话说得太满，让人只记住了语气。"],
  ]},
  {meaning:"会多在意别人的情绪和态度", levels:[
    ["先看事情，不太绕着情绪走", "更在意事情有没有讲清、有没有做好。别人话里没说出的委屈，有时需要直接告诉你，你才会留意到。"],
    ["能顾到别人，也有自己的想法", "会留意气氛，也不是什么事都顺着别人。只是碰到在乎的人，一句话也可能让你惦记一阵。"],
    ["心细，很在意别人的态度", "对方语气变了、回复冷了，你容易注意到。会照顾人是长处，但也容易想多了，有委屈又不好意思说。"],
  ]},
  {meaning:"认准一件事，能不能一直做下去", levels:[
    ["喜欢有新意，重复久了会腻", "新事情容易提起兴趣，同样的事做久了就想换一换。开了不少头，后面怎么继续，有时还没安排好。"],
    ["值得的事愿意做，也会看回报", "知道为什么要做时，能坚持一阵。可一直没进展，或觉得只有自己在忙，就会犹豫要不要继续。"],
    ["认准了，愿意一直做下去", "别人嫌麻烦的重复事，你能耐着性子做。只是投入多了，即使发现不合适，也容易舍不得停。"],
  ]},
  {meaning:"遇到变化，会不会换个办法", levels:[
    ["熟悉的办法，用着更踏实", "有一套用顺手的做法，不喜欢总改来改去。环境变了，有时还是想先照原来的办法试一试。"],
    ["能调整，但不想没想清就改", "旧办法行不通时，愿意试新的。你希望改动有个理由，而不是别人说什么就马上跟着换。"],
    ["办法多，换个方向也快", "一条路走不通，能想到别的办法。只是这个也想试、那个也想试，容易改来改去，事情还没做完。"],
  ]},
] as const;

export function describeTypeRadar(radar: RadarProfile) {
  const balanced = Math.max(...radar.values) - Math.min(...radar.values) < .08;
  const featured = balanced ? [] : radar.values.map((value,index)=>({value,index}))
    .sort((a,b)=>b.value-a.value || a.index-b.index).slice(0,2).map(item=>DIMENSIONS[item.index]);
  return {
    featured,
    summary: balanced ? "这份画像里，五种特点比较接近，没有哪一项特别突出。"
      : `这份画像里，${radar.prominent.join("、")}更突出。看看这些特点在日常里会怎么表现。`,
    dimensions: DIMENSIONS.map((name,i)=>{
      const level = radar.values[i] >= .7 ? 2 : radar.values[i] <= .4 ? 0 : 1;
      const [title,text] = DIMENSION_READINGS[i].levels[level];
      return {name,meaning:DIMENSION_READINGS[i].meaning,title,text,
        prominent:!balanced && radar.prominent.includes(name)};
    }),
  };
}

export function buildTypeRadar(matches: RadarMatch[], groups: NumberGroup[]): RadarProfile {
  const sums = [0, 0, 0, 0, 0];
  const contributions: RadarProfile["contributions"] = [];
  const seen = new Set<string>();
  for (const match of matches) {
    const span = `${match.index}:${match.endIndex}`;
    if (seen.has(span)) continue;
    seen.add(span);
    // Same continuation rule as the analyser: 2959's 99 belongs to six-sha,
    // while standalone 99 stays fuwei. Do not count overlapping windows twice.
    const parent = match.key === "fuwei" ? groups.find(group => group.index <= match.index
      && group.endIndex >= match.endIndex && group.stars.length === 1 && group.stars[0] !== "fuwei") : undefined;
    const star = parent?.stars[0] ?? match.key;
    const weight = match.strength + (match.tail ? 2 : 0);
    if (!Number.isFinite(weight) || weight <= 0) continue;
    contributions.push({ index: match.index, endIndex: match.endIndex, star, weight });
    EIGHT_TYPES[star].dimensions.forEach((value, i) => sums[i] += value * weight);
  }
  const total = contributions.reduce((n, item) => n + item.weight, 0);
  const values = sums.map(n => total ? Math.round(n / total / 4 * 1000) / 1000 : 0) as DimensionVector;
  const highest = Math.max(...values);
  const prominent = total ? DIMENSIONS.filter((_, i) => values[i] === highest) : [];
  return { values, labels: DIMENSIONS, prominent, contributions };
}

// Strict public-data boundary. Never accept the phone, age, gender, raw match
// spans or a report URL with query parameters in the export renderer.
export type TypeShareData = {
  name: string; word: string; tagline: string; strength: string; watchout: string;
  secondary: string; values: DimensionVector; url: string; role: string;
};
export function makeTypeShareData(key: PortraitStar, secondary: PortraitStar | undefined, radar: RadarProfile, watchout: string, role = "", motto?: string): TypeShareData {
  const type = EIGHT_TYPES[key];
  return { name: type.name, word: type.word, tagline: motto ?? type.tagline, strength: type.strength,
    watchout, role, secondary: secondary ? EIGHT_TYPES[secondary].name : "", values: [...radar.values], url: SITE_URL };
}

export function radarPoints(values: readonly number[], cx = 160, cy = 150, radius = 100) {
  return values.map((value, i) => {
    const angle = -Math.PI / 2 + i * Math.PI * 2 / 5;
    return [cx + Math.cos(angle) * radius * value, cy + Math.sin(angle) * radius * value] as const;
  });
}
