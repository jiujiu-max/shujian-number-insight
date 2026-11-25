import type { PortraitStar } from "./star-portraits";

export type CharacterVoice = { title: string; scene: string };
const voice = (title: string, scene: string): CharacterVoice => ({ title, scene });

// Editorial refinements of existing pair / course-note interpretations, not new
// predictions. Numbers are matched in the analyser, never randomly assigned.
// These distinctions supplement the eight-star portraits; they do not change
// pair classification, strength, or the meaning of any unrecognised pattern.
export const PAIR_CHARACTERS: Record<string, { outside: CharacterVoice; inside: CharacterVoice }> = {
  "11": { outside: voice("慢热，熟悉以后能一直处下去", "刚认识时话不一定多，先看看对方怎么做事。相处久了，答应过的事会记着，也不喜欢来回变。"), inside: voice("事情没想清楚，就想再确认一次", "别人觉得已经说定了，你还会想有没有漏掉什么。同一个问题，有时问过了还想再问一遍。") },
  "22": { outside: voice("不急着表态，先看看靠不靠谱", "别人说得再热闹，你也想先弄清楚。没把握的事，不太愿意当场答应。"), inside: voice("怕选错，所以总想再等等", "不是没想法，是担心做了以后后悔。多问了几个人，又多了几种意见，反而更难决定。") },
  "33": { outside: voice("有耐心，愿意把没做完的事接着做", "同一件事别人已经烦了，你还愿意继续处理。熟悉的步骤不想随便改，也常帮人把剩下的事做完。"), inside: voice("明明做完了，还是有点放不下", "事情交出去了，还会想是不是漏了哪里。别人说可以了，你有时还想再看一遍。") },
  "44": { outside: voice("做事细，交出去前会再检查", "不喜欢差不多就算了。别人催你快一点，你还是想把容易出错的地方看清楚。"), inside: voice("怕一个小疏漏，让前面白忙", "有时不是不会做，是总担心哪里没顾到。检查了一遍，又觉得再看一遍才放心。") },
  "66": { outside: voice("先观察，不急着把想法全说出来", "跟人来往时会先听，摸清对方的脾气以后，才慢慢多说。不同意的事，也不一定马上反驳。"), inside: voice("当时没说的话，回去还会想", "表面上事情过去了，心里的顾虑却没消。真要再谈，又觉得不好开口。") },
  "77": { outside: voice("认准了，就愿意一直做下去", "别人觉得没意思了，你还愿意坚持。定好的事，不太喜欢因为几句劝说就改掉。"), inside: voice("不是听不见劝，是自己还没想通", "你也会考虑别人的话，但最后还是得自己认可。越催你改，有时越不想改。") },
  "88": { outside: voice("花时间没关系，做事要踏实", "比起一时热闹，你更喜欢看得见的进展。没弄清楚之前，不想一下投入太多。"), inside: voice("想先有个保障，再放心去做", "看到新机会也会心动，但总想知道不顺利时怎么办。没有把握，就宁愿先保持原样。") },
  "99": { outside: voice("答应负责，就不想半路放下", "交到你手里的事，你会一直惦记。别人已经不问了，你还想把最后一点处理好。"), inside: voice("人歇下来了，心里还惦记着事", "还有事情没处理完，就不太能放心休息。你不一定说自己累，但总觉得还有事要管。") },
  "13": { outside: voice("认准的人，愿意真心帮", "对方有难处，你会认真听，也愿意搭把手。比起嘴上客气，你更在意能不能帮上忙。"), inside: voice("也盼着自己有事时，对方能帮一把", "平时不一定计较回报，可轮到自己需要人，对方总是没空，心里还是会失望。") },
  "31": { outside: voice("话不一定多，有事会帮着做", "关心一个人，不一定挂在嘴上。能帮忙处理的，你会默默去做，不喜欢到处说。"), inside: voice("自己的安排，不想全部告诉别人", "有些钱和计划，你想先留在自己心里。不是每个人问起，都愿意讲得很细。") },
  "27": { outside: voice("会给人留面子，不喜欢当场闹僵", "有不同意见，也会看看场合再说。别人觉得你好说话，但你心里不一定全都认同。"), inside: voice("愿意帮人，也想给自己留点余地", "当面说得客气，不代表什么都愿意接。你也会掂量这件事会不会让自己太为难。") },
  "28": { outside: voice("平时好说话，碰到原则也有主见", "跟人相处不爱起冲突，可真碰到自己在意的事，也不会一直退让。"), inside: voice("人和事情没看清，不愿一下全信", "熟归熟，真要作重要决定，你还是想多了解一点。不想因为一时热闹就把自己押进去。") },
  "82": { outside: voice("待人实在，不爱先把人往坏处想", "对方愿意解释，你通常愿意听，也愿意再给一次机会。"), inside: voice("相信了以后，发现不对又很失望", "你不是没在意，只是希望对方说的是真的。等到几次都没做到，才开始不再相信。") },
  "19": { outside: voice("平时低调，遇到难题有办法", "不一定总抢着说，但该找谁、话该怎么讲，你心里有数。别人有难处，也会想到来问你。"), inside: voice("可以商量，但不喜欢当众被否定", "事情有不同意见可以谈，可当着别人不给你面子，你就容易急着说清楚。") },
  "91": { outside: voice("愿意出面，也能带着大家做事", "碰到没人拿主意的时候，你会站出来安排。人多事杂，也愿意主动协调。"), inside: voice("有了自己的办法，就想照着做", "你是想把事情做好，但别人临时改主意，你就容易着急。") },
};

// 0/5 apply only when the actual matched segment contains the digit between
// its endpoints. A 0/5 elsewhere in the number cannot change this card.
export const HIDDEN_CHARACTER: Record<PortraitStar, CharacterVoice> = {
  jueming: voice("想做的事不少，还没定下来就不爱说", "心里会盘算怎么做，嘴上却不一定讲。真遇到为难的地方，也容易先自己扛着。"),
  wugui: voice("办法想了不少，真正的打算不轻易说", "别人问起来，你未必把每个想法都说出来。还没想好怎么做，就想先自己琢磨。"),
  liusha: voice("很在意对方的态度，却不好意思直接问", "不高兴时先收着，别人问起又说没事。你希望对方自己明白，可对方未必注意到了。"),
  huohai: voice("心里有话，到了嘴边又咽回去", "有意见，也有委屈，可一想到说了可能吵起来，又觉得先算了。"),
  yannian: voice("做了不少，却不太主动说自己的功劳", "遇到问题会去处理，做完了又不爱多讲。别人未必知道，你在后面花了多少力气。"),
  tianyi: voice("在乎的人会记着，自己的事却不爱多说", "别人有难处，你愿意帮。轮到自己的打算和顾虑，又常想着先自己处理。"),
  shengqi: voice("想找人帮忙，又怕给别人添麻烦", "知道可以问谁，可真要开口，又会想对方是不是忙。能自己先做的，就先做了。"),
  fuwei: voice("心里反复想，嘴上却没说多少", "有顾虑时不急着讲，先自己想来想去。别人觉得你没意见，其实你还没拿定主意。"),
};

export const VISIBLE_CHARACTER: Record<PortraitStar, CharacterVoice> = {
  jueming: voice("有了想法，就愿意先试起来", "别人还在商量，你已经想动手。认准的事，会主动去问、去做。"),
  wugui: voice("想到新办法，就想拿出来试试", "碰到新工具、新做法容易感兴趣。自己研究了，也愿意跟别人讲怎么用。"),
  liusha: voice("喜欢和在意，会主动表现出来", "会注意别人的感受，也愿意花心思准备。喜欢什么，不太愿意一直只放在心里。"),
  huohai: voice("有话愿意说，也敢在人前表达", "遇到不明白的事会问，有不同看法也想讲清楚。不喜欢一直让人猜。"),
  yannian: voice("有事愿意站出来，主动把责任接下", "事情没人安排时，你会先理一理。看见问题，也愿意直接去处理。"),
  tianyi: voice("越在乎，越愿意主动联系和帮忙", "熟起来以后，愿意分享日常，也会记着对方的事。有时没等人开口，就先安排好了。"),
  shengqi: voice("愿意主动找人，也会把人介绍到一起", "遇到难题会开口请教，知道合适的人也愿意牵线。事情做成了，还愿意继续来往。"),
  fuwei: voice("想做稳的事，会反复问清楚", "不懂就问，担心哪里没说清也会再确认。你宁愿多问一次，也不想含糊着开始。"),
};

// Source: the existing sequence interpretations in page.tsx. These summaries
// do not introduce a new match or infer a diagnosis/real-world event.
export const SEQUENCE_CHARACTERS: Record<string, { outside: CharacterVoice; inside?: CharacterVoice }> = {
  "20283007": { outside: voice("当面先答应，不想扫别人的兴", "朋友开口或气氛正好时，容易顺着说可以。回头发现自己为难，又不好意思把话收回来。"), inside: voice("答应了才觉得吃亏，又不想闹得难看", "你不是心里没数，只是当时不想让人失望。真想反悔时，又怕别人觉得你说话不算数。") },
  "27939132": { outside: voice("会顾场面，当面不爱跟人争", "有不同意见，也会先听对方说完。不想现场闹僵，别人却容易以为你已经答应。"), inside: voice("心里有自己的主意，不是别人说什么都信", "话说得客气，心里还会判断合不合理。只是不一定当场把不同意见说出来。") },
  "933": { outside: voice("热心，别人有事很容易想到你", "朋友请你帮一下，你愿意去做。原本只是搭把手，后来对方一有事，又习惯来找你。"), inside: voice("不一定要回报，但希望别人记得你的付出", "你介意的不是少一句谢谢，而是自己帮了那么多，别人却觉得理所当然。") },
  "119": { outside: voice("平时不张扬，办事知道找谁、怎么说", "有难题时不会只干着急，知道怎样找人把事情办好。"), inside: voice("特别在意别人有没有给你留面子", "平时能好好说话，可当众被否定就容易急。事情过去了，气有时也消得快。") },
  "334": { outside: voice("会安排，做事一步一步有条理", "事情多了，会先分清先做什么、谁做什么，不喜欢大家乱忙。"), inside: voice("交给别人做了，还是想再检查一次", "怕人家漏掉细节，就忍不住回头看看。有时对方做完了，你又自己改了一遍。") },
  "344": { outside: voice("有责任心，答应的事会一直管下去", "事情交给你，不太会做到一半就放着。别人有遗漏，你还会接着处理。"), inside: voice("总觉得还得自己盯着，才能放心", "已经交代过了，又想问问做得怎样。不是不想歇，是担心自己不管就出问题。") },
};
