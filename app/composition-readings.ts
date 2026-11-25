import type { ReadingDomain } from "./combination-readings";
import type { NumberGroup } from "./number-composition";
import type { PortraitStar } from "./star-portraits";
import { courseModifierReading } from "./course-modifiers";

type Voice = { title: string; scene: string };
type Reading = { lead: string; text: string; question: string };
export type CompositionReading = {
  id: string; group: NumberGroup; role: "trait" | "support";
  outside?: Voice; inside?: Voice;
  domains: Record<ReadingDomain, Reading>;
  ageExamples?: [string, string, string, string, string];
};
const r = (lead: string, text: string, question: string): Reading => ({ lead, text, question });
const v = (title: string, scene: string): Voice => ({ title, scene });

// Pure base readings remain separate from the course-specific 0/5 layer.
export function compositionReading(group: NumberGroup): CompositionReading | undefined {
  const course = courseModifierReading(group);
  if (course) return course;
  if (group.stars.length !== 1) return;
  const key = group.stars[0];
  if (group.base === "82" && !group.zeroCount && !group.fiveCount) {
    if (group.zeroCount > 2) return;
    const level = group.zeroCount;
    return {
      id: `help-${level}`, group, role: "support",
      inside: level ? v(level === 1 ? "不想把人想坏，又怕相信错了" : "已经失望过，还是不好意思把话说开", level === 1 ? "对方答应得热情，你愿意再相信一次；事情没办成，心里又会犹豫下次还该不该信。" : "嘴上说再等等，心里已经有顾虑。怕让人下不来台，有时又把同样的难处留给自己。") : undefined,
      domains: level === 0 ? {
        work: r("遇到难题，有人搭把手会省不少力。", "别人的介绍、提醒，或一起分担，都是可以留意的帮助。重点是对方实际做了什么，不只看说得热不热情。", "最近谁真正帮你解决过一件事？"),
        money: r("机会可以听熟人介绍，钱的事情还是要自己问清楚。", "朋友愿意牵线是一份帮助，但花多少、怎么结算，不能因为熟悉就省掉不问。", "别人介绍的机会，具体要花什么钱，你问清楚了吗？"),
        relationship: r("有人愿意帮，也要给对方说清楚怎么帮。", "与其等别人猜，不如把具体难处讲出来。看看哪些来往是彼此都愿意搭把手。", "需要帮助时，你有没有把具体的难处说清楚？"),
      } : {
        work: r(level === 1 ? "答应帮忙的人，关键时刻有没有真的帮上？" : "同样的帮忙承诺，是不是让你反复等、反复收尾？", level === 1 ? "对方说会帮，你就先把事情安排下去。最后没等到实际支持，剩下的事又得自己处理。可以对照有没有这种经历。" : "如果对方已经几次没做到，你却还在等下一次兑现，就容易把自己的安排也拖住。重点是核对实际做过什么，不是认定谁在害你。", "那个人上次答应的事，后来到底做了没有？"),
        money: r(level === 1 ? "熟人说没问题，钱的事也别只听一句保证。" : "已经几次没兑现的承诺，别再当成下一次付款的理由。", level === 1 ? "别人介绍的项目、代办或团购，先弄清钱交给谁、约好了做什么。关系熟，不等于每件事都可靠。" : "如果前面的事情还没办妥，对方又让你垫钱或继续等，就需要把每一笔实际情况重新核对，别只因为不好意思而答应。", "最近让你放心付钱的，是清楚的安排，还是对方一句保证？"),
        relationship: r(level === 1 ? "说得好听和真的对你好，是两回事。" : "让你反复失望的来往，别总替对方找理由。", level === 1 ? "可以想想：有没有人嘴上热情，真要一起担事时却没出现？这段提醒不是判断身边谁是小人，而是让你看实际行动。" : "一次没做到可以有原因；如果同样的事一再发生，你还不好意思说不，就容易一直委屈自己。留意具体发生过什么，不靠猜测给人定性。", "有没有一段来往，你一直体谅对方，对方却很少顾及你的难处？"),
      },
      ageExamples: level === 0 ? ["同学介绍资料、朋友帮你问实习，哪些帮助真的用上了？", "同事、朋友介绍的机会，有没有人愿意继续帮你问清楚？", "合作时，哪些人不仅会说，也会跟你一起把事情做完？", "找熟人帮忙时，你有没有说清具体想请他做什么？", "日常办事，有哪些亲友邻里是能互相搭把手的？"] : level === 1 ? ["小组作业里，答应分担的人有没有按时完成？", "同事说会帮忙，后来是一起做了，还是你自己做完的？", "合作中，口头说好的事，有没有到最后又要你来处理？", "熟人答应代办的事，是真在办，还是一直让你等？", "亲友说会帮着办的那件事，后来有没有明确回复？"] : ["同样的分工，是不是几次都变成你一个人收尾？", "有人几次说会帮，结果每次都得你接着做吗？", "合作里没兑现的安排，是一次耽误，还是已经反复发生？", "熟人反复让你等，你是不是还不好意思直接问进展？", "别人几次没办好的事，你是不是一直替对方找理由？"],
    };
  }
  if (group.base === "99" && !group.zeroCount && !group.fiveCount) return {
    id: "quiet-99", group, role: "trait",
    outside: v("看着安静，熟了才发现挺有意思", "不熟的时候话少，心里却有不少想法。到了熟人面前，接梗、开玩笑的一面才慢慢出来。"),
    inside: v("心里有热情，不太主动摆在脸上", "有喜欢的人和事，也不一定马上表现。常常等熟一点、确定对方的态度，再慢慢多说。"),
    domains: {
      work: r("心里有想法，开会时却未必先说。", "你更习惯先听、先想，等有把握了再开口。有时事情已经定下来了，才觉得自己其实也有个办法。", "最近有没有一个想法，等别人先说了，你才发现自己也想到了？"),
      money: r("钱怎么安排，习惯自己心里有数。", "买什么、存多少，不一定都跟别人讲。需要共同商量的开销，也可能先自己盘算了一阵。", "最近有没有一笔要一起商量的开销，你还只放在自己心里？"),
      relationship: r("不是没意思，是熟了才愿意多表现。", "陌生人觉得你安静，熟人却知道你也会开玩笑。想亲近一个人时，有时还是等对方先主动。", "有没有人以为你不想来往，其实你只是不太先开口？"),
    },
  };
}

export function compositionAgeExample(reading: CompositionReading, domain: ReadingDomain, age: number) {
  const stage = age <= 24 ? 0 : age <= 34 ? 1 : age <= 49 ? 2 : age <= 64 ? 3 : 4;
  if (reading.id.startsWith("course-")) {
    const setting = {
      work: ["同学一起做任务，或刚开始实习时", "同事一起做事、争取机会时", "跟人合作、安排事情时", "做熟悉的事，或想换个做法时", "日常办事、跟人商量安排时"],
      money: ["花生活费、拿到兼职收入时", "每月收入到账、安排开销时", "安排日常开销、跟人一起出钱时", "安排储蓄和日常花销时", "安排日常用钱、亲友往来时"],
      relationship: ["跟同学、朋友相处时", "跟同事、朋友相处时", "跟合作伙伴、熟人相处时", "跟老朋友或新认识的人来往时", "跟亲友、邻里相处时"],
    }[domain][stage];
    return `${setting}，${reading.domains[domain].lead}`;
  }
  if (reading.ageExamples && domain === "work") return reading.ageExamples[stage];
  const specific: Partial<Record<PortraitStar, Record<ReadingDomain, string[]>>> = {
    wugui: {
      work: ["刚学了一个方法，看到别人用别的，又想从头换。", "新工具试了几个，原来要做的那件事却还没做完。", "事情做到一半，又改分工、改做法，别人也得跟着重来。", "想做的事情不少，这个刚开始，另一个又觉得更合适。", "手机功能还没学熟，又装了另一个软件，最后两个都没弄明白。"],
      money: ["买课、买工具时觉得都能用上，后来很多只打开过一次。", "副业还没做起来，又想买新课程、新工具，再试一条路。", "原来的事情还在花钱，新的方向又想投一点，两边都得顾。", "体验课、兴趣班报了不少，换来换去，每次又要花一笔。", "听说这个好、那个方便，都想试试，买回来却不一定用得上。"],
      relationship: ["朋友少回一句话，你就开始想是不是自己哪里说错了。", "同事没把话说清，你想了好几个意思，又不好直接问。", "合作时对方临时改安排，你容易琢磨是不是还有事没告诉你。", "老朋友说改天再聊，你会想是不是他不愿意帮忙。", "消息发出去没回复，就容易惦记是不是别人嫌自己烦。"],
    },
    liusha: {
      work: ["同学说这样更好，你就又改一遍，自己的作业也跟着拖了。", "别人说再改一点，你不好意思拒绝，自己的工作越做越多。", "既想让合作的人满意，又怕得罪人，要求一加再加也接下来。", "一起做事时，明明有自己的想法，却总是先迁就别人的意见。", "一起安排活动，大家想法不同，你总想让每个人都满意。"],
      money: ["朋友约吃饭、买东西，不想扫兴，生活费就比计划花得快。", "买喜欢的、跟朋友聚会，单笔不算多，加起来却没存下钱。", "请客、送礼、应酬，哪笔都不好推，月底一算却花了不少。", "老朋友聚会想省一点，又怕显得小气，最后还是多花了钱。", "亲友往来想表示心意，花的时候没多想，回头才发现超了安排。"],
      relationship: ["朋友一句玩笑，你当时跟着笑，回去却越想越不是滋味。", "同事态度冷了一点，你嘴上没说，心里却一直惦记。", "熟人没给你留面子，当时不想闹僵，后来见面还是不自在。", "老朋友随口比较了一句，你知道未必有意，心里还是放不下。", "亲友一次没顾到你的感受，过后想起来，还是会有点委屈。"],
    },
  };
  const example = specific[reading.group.stars[0]]?.[domain]?.[stage];
  if (example) return example;
  // Domain-specific core is preserved; age only changes the setting for the
  // same question. No invented job, marital status or family history.
  const settings = {
    work: ["放在学习、小组任务或实习里想一想", "放在工作、学习新本事的时候想一想", "放在合作、安排事情的时候想一想", "放在做熟悉的事或尝试新事情时想一想", "放在日常办事、学新东西的时候想一想"],
    money: ["想想生活费、兼职收入怎么用", "想想每月收入和固定开销", "想想日常开销和合作中用到的钱", "想想平时花的钱和留给自己的钱", "想想日常花销和亲友往来"],
    relationship: ["想想同学、朋友之间的来往", "想想同事、朋友之间的来往", "想想合作伙伴、熟人之间的来往", "想想老朋友、新认识的人", "想想亲友、邻里之间的来往"],
  };
  return `${settings[domain][stage]}：${reading.domains[domain].text.split("。")[0]}。`;
}
