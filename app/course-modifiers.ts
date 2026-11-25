import { STAR_PORTRAITS, type PortraitStar } from "./star-portraits";
import type { NumberGroup } from "./number-composition";
import type { CompositionReading } from "./composition-readings";
import type { ReadingDomain } from "./combination-readings";

// Course PDF pp.17–20: A5B = visible, AB5 = growing; 0 = hidden/missing,
// AB0 = empty ending. This supersedes "5 always amplifies the bad".
// These are edited cultural narratives, not diagnoses or outcome predictions.
const voices: Record<PortraitStar, {
  visible: [string, string, string]; hidden: [string, string, string]; empty: [string, string, string];
}> = {
  shengqi: {
    visible: ["会主动找人帮忙，也愿意给别人牵线。", "有人推荐新的选择，你愿意继续了解用途、条件和费用。", "人缘好，遇到热心帮忙的人，也会记着回报。"],
    hidden: ["有事不好意思求人；别人答应帮忙，你又不好意思催。", "听了推荐就先付钱，具体费用、结算和退出条件却没问完整。", "别人嘴上答应得好，你就信了；迟迟没办，又不好意思催。"],
    empty: ["前面说好有人帮，做到后面却又变成自己收尾。", "听到对方保证就先付了钱，约好的事情却迟迟没有完成。", "一开始聊得热络，真有事找对方时，却没有了下文。"],
  },
  tianyi: {
    visible: ["肯把事情做好，也愿意让别人看见自己的本事。", "愿意主动挣钱，也在意付出能不能换来实在的收入。", "在乎谁就愿意付出，喜欢和不喜欢都比较明显。"],
    hidden: ["活做了不少，该多收的钱却不好意思提。", "能挣到钱，但货款没结、借出去的钱没还，急用时拿不出来。", "希望对方多关心自己，却不肯直接说，等着对方来猜。"],
    empty: ["活越做越多，钱却没多拿多少。", "能挣钱，也容易花钱，忙了一阵还是没攒下多少。", "一开始什么都愿意做，失望多了，就不想再主动联系。"],
  },
  yannian: {
    visible: ["有能力，也肯站出来负责；只是容易把别人的活一起接过来。", "愿意靠本事挣钱，正事上该花的钱也舍得花。", "有主见，想把事情安排好，有时不自觉就替别人做了主。"],
    hidden: ["活能干好，却不爱替自己争机会，常常忙了自己、成全别人。", "账算得清，轮到谈自己的报酬，又不好意思多要。", "希望别人按你的要求做，要求却没说清，做完又觉得不满意。"],
    empty: ["什么都想管，最后忙不过来，反而有事情没做完。", "工作上该买的都买了，留给自己急用的钱却不多。", "替别人操了不少心，一句谢谢没听到，就不想再管了。"],
  },
  fuwei: {
    visible: ["做熟的事情很能坚持，但也容易检查了一遍又一遍。", "花钱有自己的习惯，认准了就不太愿意换。", "熟了会多说一些，但真正在意的事，还是会反复想。"],
    hidden: ["想做，又怕做不好。准备了很久，还是没动手。", "买东西反复比价，怕买贵、怕不好用，最后一直没买。", "心里不同意，嘴上却说都行，对方就以为你答应了。"],
    empty: ["计划做了不少，事情却停在准备这一步，迟迟没开始。", "本来想把钱存下来，后来总有别的开销，计划又搁下了。", "想联系又一直没联系，慢慢就少了来往。"],
  },
  jueming: {
    visible: ["看准了就敢干，接事情快，有时也答应得太快。", "看到机会就想投，容易先把钱拿出去，再补问细节。", "讲义气，愿意替人出头，急了也容易把话说绝。"],
    hidden: ["不想让人觉得你不行，遇到难处也不说，宁愿自己硬撑。", "钱投进去了，什么时候能拿回来却没问清，急用时才着急。", "不高兴先忍着，忍到受不了，一开口就说得很重。"],
    empty: ["一开始什么都敢接，后来才发现时间不够、自己忙不过来。", "前面投的钱还没收回来，后面又在加钱，能用的钱越来越少。", "答应得爽快，后来做不到，又不好意思告诉对方。"],
  },
  wugui: {
    visible: ["点子多，也敢提出来；就是容易做着做着又换个办法。", "这个机会想试，那个也想试，钱容易分散在几个方向。", "反应快，别人一句话没说完，你已经想了好几个意思。"],
    hidden: ["自己想换个办法，却没告诉别人，大家还在照原来的做。", "想试的挣钱办法不少，这里花一点、那里花一点，没仔细算过。", "觉得对方有事瞒你，却不直接问，自己越猜越不放心。"],
    empty: ["办法换了几次，最早想做的事反而没做完。", "新的尝试一直在花钱，上一个到底赚没赚钱，却没算清。", "心里反复想，后来干脆不问、不解释，来往也淡了。"],
  },
  liusha: {
    visible: ["会留意对方的偏好，也容易为了让人满意反复修改。", "喜欢的东西想买，人情上的钱也舍不得省。", "很会照顾人的情绪，自己在意的态度也容易写在脸上。"],
    hidden: ["怕得罪人，明明不想做，还是先答应了。", "请客送礼舍得花，自己的钱不够用了，又不好意思说。", "别人语气冷一点，你就放在心上；问你怎么了，你又说没事。"],
    empty: ["为了让别人满意改了又改，自己的时间和安排却顾不上了。", "喜欢就买，心情不好也想下单，月底一看又没存下钱。", "前面很用心，失望多了却不解释，慢慢就不想再主动了。"],
  },
  huohai: {
    visible: ["会介绍、会说服人；一着急，语气也容易太冲。", "谈得投机就容易答应，额外开销却没先算清。", "有话直说，能讲清道理，也容易一句话让人下不来台。"],
    hidden: ["明明知道该怎么说，到了要开口的时候，又怕得罪人。", "钱的事没讲清，却不好意思再问，最后自己多出了钱。", "有不满却说不出口，嘴上说算了，心里还是过不去。"],
    empty: ["讨论了半天，谁负责、哪天做完没定好，事情还是没动。", "答应时没算要花多少钱，后来超了，只能自己补。", "越解释越吵，最后谁也不想说，误会也没解开。"],
  },
};

// Follow-up questions must ask about the same issue as the selected reading,
// not attach a generic "you did not speak up" question to every hidden mode.
const questions: Record<PortraitStar, {hidden:[string,string,string];empty:[string,string,string]}> = {
  shengqi:{hidden:["别人答应帮你的那件事，后来有明确回复吗？","你付钱的那件事，具体包含什么、什么时候完成，问清楚了吗？","那个人答应你的事，后来到底做了没有？"],empty:["说好一起做的事，最后是不是变成你一个人做？","事没办好、钱也没退的那一笔，你还在等吗？","平时聊得来的人，真有事时靠得住吗？"]},
  tianyi:{hidden:["多做的那些活，你有没有提过应该多算一点报酬？","有没有一笔说好要回来的钱，到现在还没收到？","你希望对方为你做的那件事，有没有直接说过？"],empty:["做的比原来说好的多，拿的钱也跟着多了吗？","最近一笔收入到账后，最大几笔花在了哪里？","不再主动联系，是不在乎了，还是失望太多？"]},
  yannian:{hidden:["最近做成的事，你有说过自己负责了哪一部分吗？","谈自己的报酬时，你是不是又少说了一句？","你想让对方怎么做，当时有没有说清楚？"],empty:["一直没做完的事，是不想做，还是同时管得太多？","给事情垫完钱，自己手里还留了多少急用的钱？","你不想再管，是太累，还是觉得好心没被理解？"]},
  fuwei:{hidden:["一直想做却没开始的那件事，你最怕哪一步出错？","反复比较却没买的东西，你到底在担心什么？","你那句都行，是真的愿意，还是不好意思拒绝？"],empty:["已经准备了很久的事，你定过哪天开始吗？","原本想存的钱，后来是被什么开销用掉的？","想联系却一直没联系的人，你还在等什么？"]},
  jueming:{hidden:["明明忙不过来，却不肯让人帮的那件事，是什么？","已经投出去的钱，什么时候能收回来，说清楚了吗？","那次突然发火，之前是不是已经忍了好几次？"],empty:["接下的几件事，哪些已经超出了你能做的范围？","还没收回前一笔钱，就又加了多少进去？","答应了却做不到的事，你告诉对方了吗？"]},
  wugui:{hidden:["你想换办法时，有没有先告诉一起做事的人？","最近试过的几个挣钱办法，总共花了多少？","你不放心的那件事，是亲口问过，还是自己猜的？"],empty:["总想换方向，是原来的办法不行，还是刚遇到难处？","新尝试开始前，上一个到底花了多少、挣了多少？","你不想再问，是已经问清了，还是怕听到不想听的回答？"]},
  liusha:{hidden:["你最近一次答应帮忙，是愿意，还是怕得罪人？","给别人花完钱后，你自己的开销还够不够？","最近一次说没事，你心里真的不介意吗？"],empty:["为了让别人满意，你已经改了几次自己的安排？","买完后悔的东西，是需要，还是当时心情不好？","那件让你不想再主动的事，你跟对方说过吗？"]},
  huohai:{hidden:["那句一直没说出口的话，你在怕谁不高兴？","本来没说好却让你多出的钱，你问过为什么吗？","嘴上说算了的事，心里真的过去了吗？"],empty:["已经商量过的事，最后定了谁做、哪天完成吗？","为了兑现一句承诺，你后来多花了多少钱？","那次没说通就不说的误会，现在解决了吗？"]},
};

export function courseModifierReading(group: NumberGroup): CompositionReading | undefined {
  if (!group.zeroCount && !group.fiveCount) return;
  if (group.stars.length !== 1) return;
  const key = group.stars[0], star = STAR_PORTRAITS[key], voice = voices[key];
  const runs = group.modifierRuns;
  if (!runs.length) return;
  const effects = runs.flatMap(run => [...run.digits].filter((digit, i, digits) => !i || digit !== digits[i - 1])
    .map(digit => ({ digit, position: run.position,
      mode: digit === "0" ? run.position === "trailing" ? "empty" : "hidden"
        : run.position === "trailing" ? "growing" : "visible" })));
  const domains = Object.fromEntries((["work", "money", "relationship"] as const).map((domain, i) => {
    const sentences = effects.map(effect => {
      if (effect.mode === "growing") return [
        voice.visible[0] + "做过几次之后，这会逐渐变成你习惯采用的处理方式。",
        key === "tianyi" ? "更愿意做回头生意，让老客户下次还来找你。" : voice.visible[1] + "同类开销重复出现时，你容易沿用上一次的决定。",
        voice.visible[2] + "这种表现也容易在持续的相处中反复出现。",
      ][i];
      const sentence = voice[effect.mode as "visible" | "hidden" | "empty"][i];
      return sentence;
    });
    const unique = [...new Set(sentences)];
    const mode = effects[0].mode;
    const question = mode === "empty" ? questions[key].empty[i]
      : mode === "hidden" ? questions[key].hidden[i]
      : star[domain].question;
    return [domain, {lead: unique.join(""), text: unique.join(""), question}];
  })) as CompositionReading["domains"];
  // Preserve the course's concrete 86 and 14 examples without promising gains.
  if (group.raw === "856") domains.money = {lead:"肯下功夫挣钱，但忙起来也容易觉得钱挣得辛苦。",text:"有活就接，做出来的收入别人看得见，自己却知道花了多少时间和精力。",question:"最近多赚的那部分钱，是效率提高了，还是用更多时间换来的？"};
  if (group.raw === "154") domains.work = {lead:"愿意请教有经验的人，也能通过介绍得到具体帮助。",text:"需要建议或介绍时，你愿意主动把问题讲清，再联系能提供相应帮助的人。",question:"最近愿意帮你的那个人，具体帮你解决了什么？"};
  if (group.raw === "145") domains.work = {lead:"会维系老关系，也愿意把一次帮忙变成长期来往。",text:"别人给过你机会，你会记着回应。熟悉的人越积越多，但也要分清谁是真能一起做事的人。",question:"哪些来往是能互相帮忙的，哪些只是平时聊得热闹？"};
  if (key === "shengqi" && group.zeroCount >= 2 && !group.fiveCount && group.modifierPosition === "middle") {
    domains.work = {lead:"别人说好会帮，等来等去，最后还是得自己做。",text:"对方几次说会帮，你就再给一次机会。事情没有办成，自己的安排却跟着一拖再拖。",question:"那个人前几次答应的事，最后到底做了没有？"};
    domains.money = {lead:"前一笔钱还没拿回来，听到新的保证，又继续付了一笔。",text:"已经几次没兑现的安排，你还是不好意思追问，想着再等一下，结果自己的钱也一直用不上。",question:"有没有一件事，你已经等了好几次，对方却还只有口头答应？"};
    domains.relationship = {lead:"被同一个人反复放鸽子，还是习惯替对方找理由。",text:"一次没做到，你能理解。可同样的事发生几次，你还是不愿说重话，自己的委屈也就一直放着。",question:"这段来往，是真有难处，还是每次都只有你在体谅？"};
  }
  const dominant = effects[0].mode;
  const titles = dominant === "empty" ? [voice.empty[0].split(/[；。]/)[0], voice.empty[2].split(/[；。]/)[0]]
    : dominant === "hidden" ? [voice.hidden[0].split(/[；。]/)[0], voice.hidden[2].split(/[；。]/)[0]]
    : [star.outside, star.inside];
  if (group.base === "99" && !group.zeroCount && group.modifierPosition === "middle") {
    titles[0] = "看着安静，熟了也会主动逗人";
    titles[1] = "想跟人亲近，又怕自己太主动";
    domains.relationship = {lead:"熟了会主动开玩笑，想让人注意，又怕表现得太明显。",text:"刚认识时话不多，熟悉以后会接话、逗人开心。对方反应冷一点，又忍不住想，是不是自己说多了。",question:"想让对方明白的那句话，你是认真说过，还是只开过玩笑？"};
  }
  return {id:`course-${key}-${effects.map(e=>e.position+"-"+e.mode).join("-")}`,group,role:"trait",
    outside:{title:titles[0],scene:domains.work.text},
    inside:{title:titles[1],scene:domains.relationship.text},
    domains};
}
