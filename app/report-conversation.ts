import { PAIR_CHARACTERS } from './character-readings';
import type { PortraitStar } from "./star-portraits";
import { modifierMood, pairFocusConcern, type ModifierMood } from "./report-focus";
import type { ReadingDomain } from "./combination-readings";
import type { NumberGroup } from "./number-composition";

// Explicit source exceptions precede a broad star example. These are examples
// for reflection, not claims that the event happened or promises of earnings.
export function specificEverydayScene(group:NumberGroup|undefined,domain:ReadingDomain,age:number) {
  if(!group) return;
  const i=age<=24?0:age<=34?1:age<=49?2:age<=64?3:4;
  const contact=['刚认识的朋友','常联系的朋友','一起办事的人','老朋友','一起参加活动的人'][i];
  if(domain==='money' && group.stars[0]==='tianyi' && group.fiveCount && !group.zeroCount) {
    if(group.raw==='856' && age<=24) return `如果有兼职，一次又一次接下额外任务，你可能发现多挣的钱主要靠多花时间换来。账面进账增加了，留给学习和休息的时间却需要重新安排。`;
    if(group.raw==='856') return `如果你正在做有报酬的事情，${contact}又请你多帮一次，你可能很快答应。钱多拿了一些，原本留给自己的半天也没了；一算时间，才发现多挣的钱主要靠多花时间换来。`;
    return age<=24 ? `帮${contact}处理过一次任务，对方后来又请你一起做别的事。你会认真把每次任务做完，也会逐渐成为别人愿意合作的人，实际报酬仍要看具体约定。` : `如果做的是有报酬的事情，第一次认真做完后，${contact}又来找你处理类似的任务。你愿意继续做，但新要求是不是增加了时间、费用有没有跟着调整，仍得一项项算清。`;
  }
  if(domain==='work' && ['154','145'].includes(group.raw)) return group.raw==='154'
    ? `遇到自己不熟的事，你会问${contact}谁做过。对方介绍了人，你会主动联系，把需要什么、哪里卡住讲清楚。`
    : `${contact}以前帮过你，后来听说他也有事要办，你会问问能不能搭把手。有事没事也会来往，而不只是用得上时才找人。`;
  if(group.base==='82' && !group.zeroCount && !group.fiveCount) return {
    work:`第一次办一件不熟悉的事，${contact}提醒你少了什么、可以找谁。你照着补齐，比自己来回摸索省了不少事。`,
    money:`${contact}介绍了一个机会，你愿意听，也会问具体要付哪些钱。介绍归介绍，真正决定前，还得把每项开销弄明白。`,
    relationship:`你把需要人帮的地方讲清楚，${contact}知道自己能做哪一部分。不是只说一句最近很难，而是让对方知道怎么搭把手。`,
  }[domain];
  if(group.base==='99' && !group.zeroCount) return {
    work:`跟${contact}一起商量，你已经想到一个办法，却想听完再说。等大家快定下来，才想起自己那一条还没讲。`,
    money:`一笔要一起出的费用，你先自己算了几遍。${contact}问你准备花多少时，你才发现自己一直没把打算说出来。`,
    relationship:group.fiveCount ? `跟${contact}熟起来以后，你会用玩笑试探他对自己的态度。对方只是笑了一下，你又拿不准他有没有当真。` : `刚认识${contact}时话不多，熟了才会接话、开玩笑。对方以为你不想参加，你其实只是一直在等别人先叫你。`,
  }[domain];
}

export function everydayScene(star:PortraitStar,domain:ReadingDomain,age:number) {
  const i=age<=24?0:age<=34?1:age<=49?2:age<=64?3:4;
  const plan=['周末出游','周末聚餐','一次短途出游','一起办事','结伴出门'][i];
  const thing=['整理书桌','收拾房间','清理闲置物品','整理旧照片','收拾储物柜'][i];
  const spending=['这个月可用的钱','这个月的日常开销','留作备用的钱','原本想存下的钱','日常开销的钱'][i];
  const examples:Record<PortraitStar,Record<ReadingDomain,string>>={
    shengqi:{
      work:`你正准备${thing}，朋友发来消息，问哪里能修东西。你帮他问人、转发地址，刚放下手机，又有人来问进展。等这件事问清，你原来整理到哪一步都忘了。`,
      money:`本来只打算${plan}，有人提议结束后再去玩一会儿，你也跟着答应。吃饭、打车、买饮料，单看每笔都不多。晚上看付款记录，才发现花的钱比出门前想的多了一大截。`,
      relationship:`商量${plan}，两位朋友意见不合，分别来找你。你对两边都说“我明白你的意思”。后来两人当面争起来，都拿你的话证明自己有理，你反而不知道该怎么接。`
    },
    tianyi:{
      work:`大家商量${plan}，你只答应查地址，却顺手把路线、开放时间和要带的东西都确认了。下次大家直接问你“都安排好了吗”，你才发现，上次多做的事已经被当成每次都由你负责。`,
      money:`朋友请你先垫一笔，说过几天就转来。你觉得彼此信得过，没有再问日期。等到安排${spending}，才发现还少这笔钱；聊天框打开了几次，催款的话又删掉了。`,
      relationship:`你提过想安排${plan}，朋友说回头约。过了几天，他发来别的话题，却一直没提这件事。你想再问，又觉得每次都由自己张罗没意思，便只回了眼前那条消息。`
    },
    yannian:{
      work:`准备${plan}，朋友答应查路线，你负责定时间。看他还没回复，你自己把路线也查好，又把集合地点定了。下次朋友直接等你安排，你明明想有人分担，事情却又都到了自己手里。`,
      money:`为了${thing}，你先买了收纳用品，后来又添工具。每一件都觉得少不了。东西摆满一桌时才发现，还没开始整理，花的钱已经超过最初的打算。`,
      relationship:`你正和朋友商量${plan}的安排，他提起最近一件烦心事。刚说两句，你就接过话：“这有什么难的，你去问清楚就好了。”朋友说“你先听我讲完”，你才发现，自己还不知道事情到底怎么回事。`
    },
    fuwei:{
      work:`想${thing}，你先收藏了几种方法。准备动手时，又担心顺序不对，重新找教程。几天后打开相同的页面，收藏夹多了，东西却还在原来的地方。`,
      money:`想留出${spending}，买一件东西前会比好几家价格。翻账单时却发现，那个几个月没打开的会员仍在续费，累积的费用已经比当初省下的差价还多。`,
      relationship:`说好${plan}，朋友又临时改时间。你回“没事”，其实已经推掉了自己的另一件事。下次他照样临时改，你越来越不想去，他却一直以为你时间方便。`
    },
    jueming:{
      work:`已经约好${plan}，你又答应当天帮人取东西。到了出门那天才发现，两处地方隔得很远，时间根本接不上。你还想两边都赶到，一路都在看时间、解释自己快到了。`,
      money:`为了${thing}买了一套工具，试了一半发现还缺配件。你想着“都花了这么多，再补一个吧”。后来又添几样，算总数时，连${spending}也占用了一部分。`,
      relationship:`说好${plan}，你已经准备出门，朋友却说临时去不了。你马上回“怎么每次都等到现在才说”。对方开始解释，你又翻出上次的事，最后两人只顾争谁有理，今天怎么安排反而没说。`
    },
    wugui:{
      work:`想${thing}，按一个教程做到一半，又看到另一种方法更省事。你把刚分好的重新归类，没过多久又想换工具。忙了一下午，桌上的东西还是散着，自己先没了耐心。`,
      money:`想把照片修得好看一点，你先开了一款软件的会员，还没用熟，又买了另一款。后来只常用其中一个，另一个却还在自动续费。整理${spending}时，才发现已经多扣了好几个月。`,
      relationship:`你提议${plan}，朋友回“过几天再说”。你开始想，他是不是不想去，还是不愿和自己一起。想了几种可能，却没有直接问他哪天有空。后来他来找你聊天，你已经有点不想回。`
    },
    liusha:{
      work:`原本已经说好${plan}，有人说换个地方可能更好。你重新查了地址，另一个人又想改时间。你希望大家都满意，查来查去，自己原本想去的地方反而没再提。`,
      money:`本来想留好${spending}，心情不好时却点开了购物软件。看到喜欢的东西，想着“买一个让自己高兴一下”。包裹到了就放在一边，月底看账单，才发现这样的“一个”已经买了好几次。`,
      relationship:`在群里提议${plan}，暂时没人接话；另一位朋友发了张照片，大家却聊了起来。你反复看自己那句话，担心是不是没人想去。还没问清，就把原来的提议撤回了。`
    },
    huohai:{
      work:`商量${plan}，朋友刚说“那个地方可能不太方便”，你就开始解释路线很好走。说了半天才知道，他想说的是那天没有空。你急着回答了一个他并没问的问题。`,
      money:`商量${plan}，你顺口说“这次我来付”。结账时才知道，原来说的价格没包括几项额外费用。你不想再改口，就把多出的部分也付了，回来又得重新安排${spending}。`,
      relationship:`你把${plan}的时间发在群里，朋友没看到，问你为什么没告诉他。你马上回“我不是早就发了吗”。对方说你语气冲，你又解释自己明明发过，原本一句提醒就能解决的事，最后争了好几轮。`
    },
  };
  return examples[star][domain];
}

// Trait-based fallback descriptions of the existing character voices. These are not
// extra matching rules, factual life events, or a reason to change the scores.
const CHARACTER_EXAMPLES: Record<PortraitStar, [string,string]> = {
  "shengqi": [
    "你愿意了解新事物，也比较容易和人聊开。你有乐观、好相处的一面，不爱让气氛变僵；但配合得多时，自己的想法也容易被放到后面。",
    "你希望来往轻松，不愿因为一次拒绝影响关系。心里并非什么都无所谓，只是常先体谅别人，自己的需要反而说得少。"
  ],
  "tianyi": [
    "你待人实在，对认定的人和事比较用心。你重视信任，也愿意耐心投入，不喜欢只有好听的话却没有实际行动。",
    "你希望自己的认真被同样对待，心里的期待通常比说出来的多。没有得到回应时会失落，又不太愿意把需要说成要求。"
  ],
  "yannian": [
    "你做事有标准，愿意承担，也喜欢自己掌握节奏。你比较重视结果，不太容易敷衍过去；能力越能用得上，越容易把责任都往自己身上放。",
    "你习惯对结果负责，也希望自己值得信赖。事情不如预期时，容易先责怪自己没有管好，即使不是自己的责任，也很难彻底放下。"
  ],
  "fuwei": [
    "你喜欢稳定和熟悉的节奏，不轻易被一时热闹带动。认真、有耐心是你的长处，面对变化又会比较谨慎，需要多一点适应时间。",
    "你需要有把握才愿意改变，心里对风险比较敏感。反复权衡能让你慎重，也容易让你怀疑自己的判断，迟迟定不下来。"
  ],
  "jueming": [
    "你愿意尝试，也不太怕承担，是比较敢想敢做的性子。认准以后肯投入，不轻易服输；但耐心相对少一些，容易高估自己能同时承担多少。",
    "你希望用结果证明自己，对已经作出的决定比较坚持。投入越多越难收手，有时需要调整，却会觉得停下来像在承认自己不行。"
  ],
  "wugui": [
    "你反应快，想象力丰富，不喜欢被一种做法限制。你愿意探索新可能，也能发现不合理的地方，但想法变得快，专注和耐心有时跟不上。",
    "你总能想到另一种可能，对更好的选择保持好奇。这样的开放也会带来犹豫，原本已经合适，心里仍觉得或许还有更好的。"
  ],
  "liusha": [
    "你心思细，重视美感、氛围和相处中的感受。你的体贴来自善于察觉变化，但感受丰富也意味着心情容易受到影响，不太能说放下就放下。",
    "你希望自己的感受能被认真对待，模糊的态度会让你不安。心里在意得多，表达却未必同样直接，容易先猜是不是自己哪里不够好。"
  ],
  "huohai": [
    "你愿意表达，也喜欢把道理讲明白，不太习惯含糊带过。反应快、有观点是你的特点，但自尊心较强，被误解时容易急着争辩。",
    "你希望别人听懂自己的本意，对误解尤其难释怀。情绪上来时容易急着证明自己，语气比原意更重，心里却仍觉得委屈。"
  ]
};
const HIDDEN_OUTSIDE: Record<PortraitStar,string> = {
  "shengqi": "你比较顾及别人，自己的需要往往说得少。看起来好商量，心里却有期待，只是不愿显得自己要求太多。",
  "tianyi": "你愿意付出，也比较保护自己的心事。习惯表现得稳妥，真正的期待和顾虑却不一定让人知道。",
  "yannian": "你重实际，也愿意承担，不太爱主动强调自己的功劳。表面上稳得住，心里却有不少标准和压力。",
  "fuwei": "你考虑得多，比较怕说错、选错，没把握时宁可先不表态。看起来安静，心里其实一直在权衡。",
  "jueming": "你习惯先靠自己，也希望维持有能力的样子。即使已经吃力，往往仍先撑着，不太愿意讲出真实困难。",
  "wugui": "你心里常有新的判断，却未必马上表达。你希望先想清楚，也会保留自己的打算，因此外表往往比内心安静。",
  "liusha": "你能察觉气氛，也不太愿意让自己的不高兴影响别人。表面上仍然配合，内心却可能已经有委屈，只是没有说出来。",
  "huohai": "你心里有判断，也有表达的冲动，只是怕争起来会先压住。没说出口不代表认同，有些不满会留在心里。"
};
const HIDDEN_INSIDE: Record<PortraitStar,string> = {
  "shengqi": "你不太习惯直接争取，怕开口或追问给人压力。越在意回应，越容易先忍着，心里的着急却不会因此减少。",
  "tianyi": "你在意的是对方有没有主动想起自己，提醒之后的回应不一定让你同样满足。因为不爱明说，心里的期待也更容易落空。",
  "yannian": "你对好坏有自己的判断，却容易觉得这些标准不必解释。期待和现实不一样时，会先不满意，也更难放心把事情交出去。",
  "fuwei": "你很难仅凭一句建议就安心，重要选择需要反复确认。顾虑越多，越容易失去原本的主意，连已经明确的需要也开始摇摆。",
  "jueming": "你把兑现承诺看得很重，求助会让你不自在。明明只是需要配合，也容易理解成自己能力不够，所以越有压力越难开口。",
  "wugui": "你对不完整的信息比较敏感，习惯自己补出几种解释。又怕直接问显得多疑，容易把还没确认的猜想放在心里反复琢磨。",
  "liusha": "你希望自己的情绪和需要能被主动察觉。越在乎越难直接说明，容易用沉默等待关心，却又担心自己没有被放在心上。",
  "huohai": "你既不愿被误解，又不想正面争执。表面上说算了，心里未必过去，容易反复想自己的意思有没有被认真听见。"
};
const EMPTY_EXAMPLES: Record<PortraitStar,[string,string]> = {
  "shengqi": [
    "你愿意给人余地，不容易一次不顺就否定来往。只是连续落空会消耗信任，让你逐渐从乐观变得有顾虑。",
    "你希望关系和承诺都可靠，反复落空后又会担心白等。期待还在，信心却弱了，心里容易在相信和退缩之间摇摆。"
  ],
  "tianyi": [
    "你一开始愿意用心，也能接受偶尔不对等。长期没有回应时，热情会慢慢减少，变化未必激烈，却很难恢复原来的投入。",
    "你需要付出有回应，长期被忽略会让你怀疑自己是否值得被珍惜。委屈积累以后，往往先收回热情，而不一定把原因说清。"
  ],
  "yannian": [
    "你对结果有要求，不喜欢留下没处理好的部分。责任越多，越容易觉得哪件都不能放，忙了很久仍难满意。",
    "你希望努力有成果，也希望自己的用心得到认可。付出很多却仍达不到标准时，容易失去成就感，连原本愿意承担的事也觉得累。"
  ],
  "fuwei": [
    "你愿意认真准备，却对真正开始缺少信心。熟悉的准备让你安心，未知的尝试又让你顾虑，容易长期停在想改变的状态。",
    "你心里有想法，也有想继续的联系，但总怕时机不合适。拖得越久，越不知从哪里开始，原本的愿望也逐渐变成了放着再说。"
  ],
  "jueming": [
    "你开始时信心足，愿意投入，也容易把目标定得过大。难度真正显现以后，不甘心放弃和精力跟不上会同时出现。",
    "你很看重能不能兑现决定，没做到会影响自我评价。明明需要调整，仍想证明自己能撑住，结果压力更大，也更容易失去耐心。"
  ],
  "wugui": [
    "你能发现不足，也愿意不断尝试，但对结果的满意度不高。新的可能性总在吸引你，让你很难安定地坚持一种选择。",
    "你会反复设想各种可能，担心和猜测也容易累积。越想越觉得不会顺利时，热情便慢慢退去，最后连解释和尝试都不想再做。"
  ],
  "liusha": [
    "你愿意照顾感受，但自己的委屈长期没被理解时，会逐渐收回热情。表面上的冷淡，往往来自之前积累的失望和疲惫。",
    "你既想维持关系，又希望自己的需要被看见。长期只顾别人时，心里容易失衡，最后连原本愿意做的事也觉得勉强。"
  ],
  "huohai": [
    "你原本愿意把观点讲清，得不到理解时又容易觉得再说也没用。态度从积极变得冷淡，不一定是放下了，而是仍不甘心。",
    "你很在意原意有没有被听懂，但也怕再次冲突。心里还想讲明白，外面却减少表达，未解决的不满便容易一直留着。"
  ]
};
export function characterExample(star: PortraitStar,mood: ModifierMood,side:'outside'|'inside') {
  if(mood==='mixed') return '';
  if(mood==='hidden') return (side==='inside'?HIDDEN_INSIDE:HIDDEN_OUTSIDE)[star];
  if(mood==='empty') return EMPTY_EXAMPLES[star][side==='outside'?0:1];
  return CHARACTER_EXAMPLES[star][side==='outside'?0:1];
}
// Invitations describe a future traditional reading, never an already calculated Bazi.
const NEXT_CONVERSATION: Record<PortraitStar, [string,string,string]> = {
  shengqi: ["人缘不错，为什么还是容易在人情上吃亏？","别人答应帮忙，为什么常常没了下文？","等来等去，为什么最后还是靠自己？"],
  tianyi: ["重感情，为什么容易在钱上吃亏？","钱放出去了，轮到自己用却拿不回来？","忙着挣钱，为什么还是留不住钱？"],
  yannian: ["有能力，为什么总是自己最累？","付出不少，为什么总觉得没自己的机会？","什么都想做好，为什么反而顾不过来？"],
  fuwei: ["想改变，为什么总迟迟迈不出那一步？","明明想换个活法，为什么一直定不下来？","计划改了又改，为什么还是老样子？"],
  jueming: ["敢拼敢干，为什么容易冲在前面、吃亏在后面？","不服输，却总觉得自己在硬撑？","开头冲得很快，为什么后面跟不上？"],
  wugui: ["点子不少，到底哪条路更适合自己？","心里想换方向，为什么一直没动？","换了几条路，为什么还是没做成？"],
  liusha: ["重感情，为什么容易委屈自己？","心里明明介意，为什么总是自己忍？","一开始很用心，为什么后来越来越失望？"],
  huohai: ["明明没坏心，为什么容易惹来口舌？","有苦说不出，为什么总觉得憋屈？","解释了很多，为什么还是容易被误会？"],
};
const BAZI_TOPICS: Record<PortraitStar,string> = {
  shengqi:"人缘、贵人和合作",
  tianyi:"财路、守财和人情上的钱",
  yannian:"个人长处、事业方向和付出回报",
  fuwei:"自己的长处、发展方向和变化时机",
  jueming:"做事的冲劲、事业选择和求财方式",
  wugui:"个人长处、发展方向和变化时机",
  liusha:"感情、相处和自己的需要",
  huohai:"表达上的长处、口舌和人际关系",
};
export function consultationFocus(star:PortraitStar,age:number,mood:ModifierMood='plain',group?:NumberGroup) {
  let title = NEXT_CONVERSATION[star][mood==='hidden'?1:mood==='empty'?2:0];
  let topic = BAZI_TOPICS[star];
  if(mood==='mixed') { title="同一个号码，有长处也有吃亏点，该怎么看？"; topic="这几处不同的解读，哪些符合、哪些不符合自己的经历"; }
  else if(group?.raw==='856') { title="有钱挣，却挣得辛苦，适合自己的财路在哪？"; topic="挣钱费时间、付出与回报，以及适合自己的财路"; }
  else if(star==='tianyi' && group?.fiveCount && !group.zeroCount) { title="有人认可，也有机会，自己的财路该怎么选？"; topic="个人长处、财路和机会选择"; }
  else if(group && (['154','145'].includes(group.raw) || group.base==='82' && mood==='plain')) { title="有人愿意帮，自己的贵人和机会该怎么看？"; topic="贵人、合作机会，以及自己适合的发展方向"; }
  else if(group?.base==='99' && !group.zeroCount) { title=group.fiveCount?"嘴上爱开玩笑，心里的感情又是什么样？":"外表不主动，心里的感情又是什么样？"; topic="感情里的需要、外在表现和内心想法"; }
  if(pairFocusConcern(star,group)) {
    title=star==='tianyi'?'钱和精力花在哪里，怎样结合八字再细看？':star==='yannian'?'自己的长处，适合用在哪些事情上？':'想法和选择不少，哪种安排更适合自己？';
    topic=star==='tianyi'?'财路、付出与回报，以及安排钱的习惯':BAZI_TOPICS[star];
  }
  if(age<=24 && star==='tianyi') { title="重感情，也容易心软，自己的长处和吃亏点在哪？"; topic="感情、个人长处和未来方向"; }
  if(age>=65 && ['yannian','jueming','wugui'].includes(star)) topic="自己的长处、人际来往和接下来的生活安排";
  const aim = `先把号码里这处解读讲清楚：看的是哪组数字，前后搭配有什么不同。再结合八字，从传统命理的角度看${topic}，有哪些可参考的调整思路。`;
  return {title,aim};
}

// Character explains priorities and self-expectations; domain cards describe
// decisions. Keep those jobs separate instead of recycling work/social leads.
const INNER_PRIORITIES: Record<PortraitStar,[string,string]> = {
  "shengqi": [
    "重和气，不太擅长拒绝",
    "你希望来往轻松，不愿因为一次拒绝影响关系。心里并非什么都无所谓，只是常先体谅别人，自己的需要反而说得少。"
  ],
  "tianyi": [
    "重情义，也需要被珍惜",
    "你希望自己的认真被同样对待，心里的期待通常比说出来的多。没有得到回应时会失落，又不太愿意把需要说成要求。"
  ],
  "yannian": [
    "责任感强，不容易放心",
    "你习惯对结果负责，也希望自己值得信赖。事情不如预期时，容易先责怪自己没有管好，即使不是自己的责任，也很难彻底放下。"
  ],
  "fuwei": [
    "求稳，怕改变以后后悔",
    "你需要有把握才愿意改变，心里对风险比较敏感。反复权衡能让你慎重，也容易让你怀疑自己的判断，迟迟定不下来。"
  ],
  "jueming": [
    "自尊心强，不愿轻易认输",
    "你希望用结果证明自己，对已经作出的决定比较坚持。投入越多越难收手，有时需要调整，却会觉得停下来像在承认自己不行。"
  ],
  "wugui": [
    "想得多，不容易对一个选择满意",
    "你总能想到另一种可能，对更好的选择保持好奇。这样的开放也会带来犹豫，原本已经合适，心里仍觉得或许还有更好的。"
  ],
  "liusha": [
    "需要被在意，容易多想",
    "你希望自己的感受能被认真对待，模糊的态度会让你不安。心里在意得多，表达却未必同样直接，容易先猜是不是自己哪里不够好。"
  ],
  "huohai": [
    "在意被理解，不喜欢被随便否定",
    "你希望别人听懂自己的本意，对误解尤其难释怀。情绪上来时容易急着证明自己，语气比原意更重，心里却仍觉得委屈。"
  ]
};
const HIDDEN_PRIORITIES: Record<PortraitStar,[string,string,string,string]> = {
  "shengqi": [
    "随和克制，不太愿意麻烦人",
    "你比较顾及别人，自己的需要往往说得少。看起来好商量，心里却有期待，只是不愿显得自己要求太多。",
    "顾情面，自己的需要常往后放",
    "你不太习惯直接争取，怕开口或追问给人压力。越在意回应，越容易先忍着，心里的着急却不会因此减少。"
  ],
  "tianyi": [
    "认真内敛，不轻易说自己的难处",
    "你愿意付出，也比较保护自己的心事。习惯表现得稳妥，真正的期待和顾虑却不一定让人知道。",
    "重感情，希望被主动关心",
    "你在意的是对方有没有主动想起自己，提醒之后的回应不一定让你同样满足。因为不爱明说，心里的期待也更容易落空。"
  ],
  "yannian": [
    "低调负责，对自己有要求",
    "你重实际，也愿意承担，不太爱主动强调自己的功劳。表面上稳得住，心里却有不少标准和压力。",
    "标准高，心里的要求不爱明说",
    "你对好坏有自己的判断，却容易觉得这些标准不必解释。期待和现实不一样时，会先不满意，也更难放心把事情交出去。"
  ],
  "fuwei": [
    "内敛慎重，不轻易表态",
    "你考虑得多，比较怕说错、选错，没把握时宁可先不表态。看起来安静，心里其实一直在权衡。",
    "怕后悔，容易怀疑自己的判断",
    "你很难仅凭一句建议就安心，重要选择需要反复确认。顾虑越多，越容易失去原本的主意，连已经明确的需要也开始摇摆。"
  ],
  "jueming": [
    "独立好强，不愿轻易示弱",
    "你习惯先靠自己，也希望维持有能力的样子。即使已经吃力，往往仍先撑着，不太愿意讲出真实困难。",
    "好强，容易把压力留给自己",
    "你把兑现承诺看得很重，求助会让你不自在。明明只是需要配合，也容易理解成自己能力不够，所以越有压力越难开口。"
  ],
  "wugui": [
    "想法丰富，但比较有保留",
    "你心里常有新的判断，却未必马上表达。你希望先想清楚，也会保留自己的打算，因此外表往往比内心安静。",
    "敏感多思，容易先猜再判断",
    "你对不完整的信息比较敏感，习惯自己补出几种解释。又怕直接问显得多疑，容易把还没确认的猜想放在心里反复琢磨。"
  ],
  "liusha": [
    "温和敏感，习惯收着情绪",
    "你能察觉气氛，也不太愿意让自己的不高兴影响别人。表面上仍然配合，内心却可能已经有委屈，只是没有说出来。",
    "心思细，盼着不说也被理解",
    "你希望自己的情绪和需要能被主动察觉。越在乎越难直接说明，容易用沉默等待关心，却又担心自己没有被放在心上。"
  ],
  "huohai": [
    "有主见，但对冲突比较克制",
    "你心里有判断，也有表达的冲动，只是怕争起来会先压住。没说出口不代表认同，有些不满会留在心里。",
    "自尊敏感，不满容易憋在心里",
    "你既不愿被误解，又不想正面争执。表面上说算了，心里未必过去，容易反复想自己的意思有没有被认真听见。"
  ]
};
const EMPTY_PRIORITIES: Record<PortraitStar,[string,string,string,string]> = {
  "shengqi": [
    "随和念情，失望也不急着翻脸",
    "你愿意给人余地，不容易一次不顺就否定来往。只是连续落空会消耗信任，让你逐渐从乐观变得有顾虑。",
    "想相信，又怕再次失望",
    "你希望关系和承诺都可靠，反复落空后又会担心白等。期待还在，信心却弱了，心里容易在相信和退缩之间摇摆。"
  ],
  "tianyi": [
    "认真重情，失望后容易冷下来",
    "你一开始愿意用心，也能接受偶尔不对等。长期没有回应时，热情会慢慢减少，变化未必激烈，却很难恢复原来的投入。",
    "重回应，失望多了就不再主动",
    "你需要付出有回应，长期被忽略会让你怀疑自己是否值得被珍惜。委屈积累以后，往往先收回热情，而不一定把原因说清。"
  ],
  "yannian": [
    "负责好强，忙起来也难放松",
    "你对结果有要求，不喜欢留下没处理好的部分。责任越多，越容易觉得哪件都不能放，忙了很久仍难满意。",
    "自我要求高，容易疲惫失落",
    "你希望努力有成果，也希望自己的用心得到认可。付出很多却仍达不到标准时，容易失去成就感，连原本愿意承担的事也觉得累。"
  ],
  "fuwei": [
    "谨慎求稳，行动容易犹豫",
    "你愿意认真准备，却对真正开始缺少信心。熟悉的准备让你安心，未知的尝试又让你顾虑，容易长期停在想改变的状态。",
    "顾虑积累，热情容易被拖没",
    "你心里有想法，也有想继续的联系，但总怕时机不合适。拖得越久，越不知从哪里开始，原本的愿望也逐渐变成了放着再说。"
  ],
  "jueming": [
    "有冲劲，但后劲容易不足",
    "你开始时信心足，愿意投入，也容易把目标定得过大。难度真正显现以后，不甘心放弃和精力跟不上会同时出现。",
    "不甘心放弃，也容易感到挫败",
    "你很看重能不能兑现决定，没做到会影响自我评价。明明需要调整，仍想证明自己能撑住，结果压力更大，也更容易失去耐心。"
  ],
  "wugui": [
    "求变心强，不容易满足现状",
    "你能发现不足，也愿意不断尝试，但对结果的满意度不高。新的可能性总在吸引你，让你很难安定地坚持一种选择。",
    "想得多，容易从犹豫变成退缩",
    "你会反复设想各种可能，担心和猜测也容易累积。越想越觉得不会顺利时，热情便慢慢退去，最后连解释和尝试都不想再做。"
  ],
  "liusha": [
    "体贴敏感，失望后容易退缩",
    "你愿意照顾感受，但自己的委屈长期没被理解时，会逐渐收回热情。表面上的冷淡，往往来自之前积累的失望和疲惫。",
    "怕被忽略，也怕一直委屈自己",
    "你既想维持关系，又希望自己的需要被看见。长期只顾别人时，心里容易失衡，最后连原本愿意做的事也觉得勉强。"
  ],
  "huohai": [
    "直率较真，受挫后容易沉默",
    "你原本愿意把观点讲清，得不到理解时又容易觉得再说也没用。态度从积极变得冷淡，不一定是放下了，而是仍不甘心。",
    "放不下误解，又不想重复争执",
    "你很在意原意有没有被听懂，但也怕再次冲突。心里还想讲明白，外面却减少表达，未解决的不满便容易一直留着。"
  ]
};
function modifierCharacterDetail(star:PortraitStar,group?:NumberGroup) {
  if(!group || (!group.zeroCount && !group.fiveCount) || group.base==='99') return;
  const empty=group.modifierRuns.some(run=>run.position==='trailing' && run.digits.includes('0'));
  if(group.zeroCount && group.fiveCount) {
    const priority=(empty?EMPTY_PRIORITIES:HIDDEN_PRIORITIES)[star];
    const [insideTitle,insideScene]=[priority[2],priority[3]];
    const names:Record<PortraitStar,string>={shengqi:'能主动联系，也会怕追问让人不舒服',tianyi:'愿意主动付出，自己的期待却说得少',yannian:'能站出来负责，也有没讲清的要求',fuwei:'熟悉的事会认真做，新选择仍想再等等',jueming:'答应时有冲劲，吃力时却不愿开口',wugui:'能讲出新主意，也有没告诉别人的打算',liusha:'喜欢会表现出来，委屈却常先藏着',huohai:'平时愿意交流，有意见时却怕起争执'};
    return {outside:{title:names[star],scene:characterExample(star,'visible','outside')+(empty?EMPTY_PRIORITIES[star][1]:'但有些为难或不愿意的地方，又没有讲出来。别人只看见你当时的回应，未必知道你还有顾虑。')},inside:{title:insideTitle,scene:insideScene}};
  }
  if(group.zeroCount) {
    const [outsideTitle,outsideScene,insideTitle,insideScene]=(empty?EMPTY_PRIORITIES:HIDDEN_PRIORITIES)[star];
    return {outside:{title:outsideTitle,scene:outsideScene},inside:{title:insideTitle,scene:insideScene}};
  }
  const [title,scene]=INNER_PRIORITIES[star];
  const titles:Record<PortraitStar,string>={shengqi:'会主动了解别人，也愿意分享有用的信息',tianyi:'认真对待约定，也会主动回应别人的需要',yannian:'遇到没人安排的事，愿意站出来负责',fuwei:'喜欢把步骤问明白，再认真重复做好',jueming:'有了想法，愿意先试一次',wugui:'对新方法好奇，也愿意把发现讲给别人',liusha:'会留意小细节，也愿意表达自己的喜好',huohai:'有不同想法，愿意直接说明'};
  return {outside:{title:titles[star],scene:characterExample(star,'visible','outside')},inside:{title,scene}};
}

export function characterDetail(star:PortraitStar,group?:NumberGroup) {
  const modified=modifierCharacterDetail(star,group);if(!modified||!group)return modified;
  const pairs=Array.from({length:Math.max(0,group.base.length-1)},(_,i)=>group.base.slice(i,i+2));
  const pair=pairs.find(p=>p[0]!==p[1])??pairs[0];
  const base=PAIR_CHARACTERS[pair];if(!base)return modified;
  const short=(text:string)=>text.match(/[^。！？]+[。！？]?/g)?.slice(0,2).join('')??text;
  const continuing:Record<PortraitStar,string>={
    shengqi:'熟悉以后，你更习惯主动交流，也更难拒绝新的来往。',
    tianyi:'投入久了，你会更看重原有的情义，也更难收回已经付出的热情。',
    yannian:'负责久了，你更习惯自己拿主意，也更不容易放下责任。',
    fuwei:'熟悉以后，你对原来的节奏更依赖，改变也会更慎重。',
    jueming:'坚持久了，不服输的心态会更明显，也更难接受中途调整。',
    wugui:'尝试多了，你会更习惯寻找新选择，也更难对一个答案满足。',
    liusha:'在意得久了，细小的感受更容易留在心里，也更难轻松放下。',
    huohai:'认定以后，你更习惯反复说明立场，也更难接受不同意见。',
  };
  // Describe the actual pair first, then explain its modifier separately.
  // Avoid appending two full versions of the same personality paragraph.
  return {outside:{title:base.outside.title,scene:base.outside.scene},
    inside:{title:modified.inside.title,scene:base.inside.scene.split('。')[0]+'。'+short(modified.inside.scene)+(modifierMood(group)==='growing'?continuing[star]:'')}};
}
