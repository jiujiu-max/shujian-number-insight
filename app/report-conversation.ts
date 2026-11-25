import type { PortraitStar } from "./star-portraits";
import type { ModifierMood } from "./report-focus";
import type { ReadingDomain } from "./combination-readings";
import type { NumberGroup } from "./number-composition";

// Explicit source exceptions precede a broad star example. These are examples
// for reflection, not claims that the event happened or promises of earnings.
export function specificEverydayScene(group:NumberGroup|undefined,domain:ReadingDomain,age:number) {
  if(!group) return;
  const i=age<=24?0:age<=34?1:age<=49?2:age<=64?3:4;
  const contact=['同学','同事','合作伙伴','老朋友','邻里朋友'][i];
  if(domain==='money' && group.stars[0]==='tianyi' && group.fiveCount && !group.zeroCount) {
    if(group.raw==='856') return `一件事做完又接一件，${contact}再来找你也不太想推。收入比原来多了，可一算忙了多少天，才发现多挣的钱主要靠多花时间换来。`;
    return `给${contact}帮着做成一件事，对方下次还愿意找你，也会介绍认识的人来。你愿意把事情做好，盼的是能有回头客，而不只是做完这一次。`;
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
  const task=['小组作业','一起赶的工作','合作的事情','答应帮人办的事','一起安排的活动'][i];
  const learning=['学一门技能','做一个副业','试一种新做法','学个新爱好','学手机上的新功能'][i];
  const spending=['生活费','这个月的工资','留作备用的钱','原本想存下的钱','日常开销的钱'][i];
  const person=['同学','同事','合作的人','老朋友','邻里朋友'][i];
  const examples:Record<PortraitStar,Record<ReadingDomain,string>>={
    shengqi:{work:`${person}问你认不认识人，你帮着问了好几圈。等消息、转消息花了半天，自己原本要办的事还没动。`,money:`一起吃饭你先买单，帮忙买东西也先垫着。想着都是小钱没再提，算${spending}时才发现，这个月替人付了好几笔。`,relationship:`两个${person}闹别扭，都找你说理。你这边劝两句、那边解释几句，最后两边都问你到底帮谁，反而把自己夹在中间。`},
    tianyi:{work:`${task}本来说只帮着看一眼，后来又让你改一下、再跟一下。你怕拒绝显得不够意思，一来二去成了从头到尾都由你管。`,money:`熟人说先借一笔，过几天就还。你没问具体哪天，轮到自己安排${spending}，才发现钱还没回来；想催，又怕对方觉得你不信任他。`,relationship:`你记得${person}提过的烦心事，还主动去问。自己有事想说，对方却总是聊两句就忙去了；你嘴上说理解，心里还是觉得只有自己在用心。`},
    yannian:{work:`${task}已经分好了，你看别人做得慢，就把他的那份也接过来。后来大家不再自己想办法，一有问题就等你处理。`,money:`为了把事情办好，工具、材料你都愿意先出钱。每笔都有用处，可全加起来，已经动用了${spending}，自己反而要省着花。`,relationship:`${person}只是想说说烦恼，你马上列了几条办法。对方没照做，你觉得白操心；对方却觉得，还没说完就被你安排好了。`},
    fuwei:{work:`想${learning}，资料已经收藏了不少。今天觉得工具没准备好，明天又想先问个明白，过了一阵，最简单的第一步还没试。`,money:`买大件会反复比价，每个月APP那些会员、套餐自动续费的钱却没仔细算。有的只用过一两次，整理${spending}时才发现还在扣。`,relationship:`${person}临时改了约好的时间，你说没关系。第二次、第三次还是这样，你越来越不想赴约，对方却以为你一直都方便。`},
    jueming:{work:`${task}还没问清要花多久，你先答应没问题。做起来才发现还要联系几个人、补几份东西，自己的安排只能挤到晚上。`,money:`起初只想拿一小笔试试，后来又买设备、补材料。每次都觉得再加一点就行，回头算总账，已经超过${spending}里原先留的额度。`,relationship:`${person}说好一起办事，临时却改了主意。你急着问他为什么不早说，越说越重，最后两人只顾争谁对，原来那件事反而没处理。`},
    wugui:{work:`想${learning}，第一个方法刚试了几天，又看到一个更省事的。旧的停下来，新的重新学，忙了一周，最初想完成的东西还没做出来。`,money:`课程买了、工具开了会员，又想换一套新的。每次付款都想着以后用得上，可旧的还没打开几次，${spending}已经花出去不少。`,relationship:`${person}说一句“这事以后再说”，你开始想是不是不满意、是不是不想合作。心里想了好几个原因，却一直没问他那句话到底是什么意思。`},
    liusha:{work:`${task}本来已经完成，对方说再加一点会更好，你就又改一遍。后来又提一条，你还是接了，自己原本要做的事情一拖再拖。`,money:`本来没打算买东西，心情不好就想买点喜欢的；朋友再约一顿饭，又不想扫兴。单笔都不大，一看${spending}，留下的比计划少了很多。`,relationship:`${person}在群里回了别人，却没回你，你会往前翻自己的消息。见面时还笑着打招呼，心里却想知道是不是自己哪里让人不高兴了。`},
    huohai:{work:`讨论${task}时，你急着讲清怎么做，别人还没说完就接了话。后来才知道他有个条件没讲出来，前面做的又得改。`,money:`聊天时说“这个我来”，当时没问总共要花多少。结账时还有运费、材料和额外费用，你不好意思收回承诺，只好从${spending}里补上。`,relationship:`${person}误会了你的意思，你马上解释“我不是早就说了吗”。你想证明自己没错，他听着却像被责怪，话还没说清，两个人先急了。`},
  };
  return examples[star][domain];
}

// Everyday illustrations of the existing character voices. These are not
// extra matching rules, factual life events, or a reason to change the scores.
const CHARACTER_EXAMPLES: Record<PortraitStar, [string,string]> = {
  shengqi:["第一次跟人见面，也能找到话题。朋友想找人修东西、问个消息，你会顺手想想谁认识、谁能帮。","别人约你，不太想去也怕扫兴；轮到自己想找人陪着办件事，又怕人家麻烦，消息写好了还没发。"],
  tianyi:["别人随口提过喜欢什么、最近在忙什么，你会记着。过几天再见，还会主动问一句办得怎么样了。","你不一定要别人送什么，但希望自己的话被放在心上。说过的事对方完全忘了，你会失落，却又觉得主动提醒没意思。"],
  yannian:["一起出门，时间、路线、带什么，你会提前想好。大家还在说随便，你已经把能安排的先安排了。","别人办事慢一点，你就忍不住问进度。明明想歇一会儿，又觉得自己不盯着不放心，最后还是起身去看。"],
  fuwei:["常去的店、用顺手的东西，你会一直选。别人推荐新的，你会先问好不好用，不会听一句好就马上换。","买件东西能比较好几家，决定前还想听听别人怎么说。意见一多，反而不知道听谁的，最后又放回收藏夹。"],
  jueming:["遇到麻烦，你先想能怎么办。别人还在讨论，你已经打电话、找人、动手试了，不太愿意一直等。","答应过的事很在意能不能做到。别人问你累不累，你说还好，心里却在盘算剩下的事情今晚怎么赶完。"],
  wugui:["一个东西不好用，你会自己找别的办法。朋友还没弄明白新功能，你已经试过几种，还能讲出哪里方便、哪里麻烦。","作了决定以后，又看到别人的新方法，就想是不是还有更好的。哪怕原来用得还行，也会忍不住继续比较。"],
  liusha:["一起吃饭会留意谁没说话、谁吃不了什么。别人换了发型、语气有点低落，你往往比旁人先注意到。","一条消息只回了个‘嗯’，你会回头看自己上一句有没有说错。对方也许正在忙，你却已经在想是不是哪里惹他不高兴了。"],
  huohai:["东西没讲明白，你会直接问；安排不合理，也想把话说清楚。别人还在客气，你可能已经把问题提出来了。","觉得被误会时，很想马上解释。对方越打断，你越急，本来只有一件事，后来连以前的不满也一起说了。"],
};
const HIDDEN_OUTSIDE: Record<PortraitStar,string> = {
  shengqi:"有个人明明可以问，你却先想他忙不忙、会不会嫌麻烦。等了几天没开口，自己的事也没往下办。",
  tianyi:"别人问近况，你先说挺好的。真正担心的事只讲一半，盼着对方多问一句，又怕讲多了给人添负担。",
  yannian:"别人夸事情办得好，你说大家一起做的。自己多跑了几趟、多处理了多少麻烦，很少主动讲。",
  fuwei:"大家问你怎么选，你说再看看。其实已经想过好几种可能，只是每一种都怕后悔，迟迟没定。",
  jueming:"有件事一个人做起来很费劲，别人说可以帮，你还是先说不用。等真的忙不过来，又不好意思再开口。",
  wugui:"心里已经有另一个办法，别人问起时只说还没定。你想等想清楚再说，可别人以为还是照原来的安排。",
  liusha:"明明介意一句话，当面却笑着说没事。回去越想越不舒服，对方却不知道你为什么突然不太想聊天了。",
  huohai:"有人说的话让你不舒服，当时怕吵起来就没回。回去想好了怎么说，再见面又觉得算了，于是一直憋着。",
};
const HIDDEN_INSIDE: Record<PortraitStar,string> = {
  shengqi:"对方说帮你问问，你就觉得有希望。过了几天没消息，又替他想可能太忙了，一直没问到底办得怎么样。",
  tianyi:"你希望对方记得自己说过的事，又不想每次都提醒。对方没问起，你会失落，却只说没什么。",
  yannian:"请别人帮忙时，只说帮我弄一下，心里其实有自己的标准。对方做好后你不满意，却发现最开始没有讲清怎么做。",
  fuwei:"一起商量去哪里，你明明不想选那个地方，还是说都行。大家真定下来后，你又不太想去了，对方却不知道你原来就不愿意。",
  jueming:"一件小事当时忍了，第二次也没提。后来又碰到类似的事，一开口就把之前几次都说了出来，对方还以为你只是在为眼前这件事生气。",
  wugui:"对方少说了一句细节，你会想是不是故意没告诉自己。想问又怕显得多疑，最后问题没问清，心里倒记了很久。",
  liusha:"明明介意一句话，当面却笑着说没事。回去越想越不舒服，对方却不知道你为什么突然不太想聊天了。",
  huohai:"有人说的话让你不舒服，当时怕吵起来就没回。回去想好了怎么说，再见面又觉得算了，于是一直憋着。",
};
const EMPTY_EXAMPLES: Record<PortraitStar,[string,string]> = {
  shengqi:["说好一起准备，到了约定那天，对方说自己还没弄好。你不想事情办不成，就连他的那份一起补了。","平时消息回得热情，真请对方办件事，却一直没有准话。你不好意思追问，再见面时也只是聊别的。"],
  tianyi:["原本只答应做一件小事，后来要求不断加。你不想做到一半不管，最后忙了比原来多得多的时间。","几次都是自己主动约，对方总说有空再说。后来你不再提了，聊天列表里也就越来越少出现这个人。"],
  yannian:["今天帮这个人确认，明天替那个人处理，自己的事情反而没时间做。别人还觉得交给你最放心，你却已经顾不过来。","替对方操心了半天，他又不照说好的做。你觉得自己白忙，后来再听见他的难处，也不太想接话。"],
  fuwei:["整理好的清单一直在，今天说先忙别的，明天又觉得还没准备好。过一阵再打开，第一项仍然没动。","想到一个老朋友，打算有空问候一下。隔天忙忘了，下次想起来又觉得很久没聊，不知道怎么开头。"],
  jueming:["一开始几件事都说能做，时间一到才发现撞在一起。想先顾好其中一件，另外几件又有人一直催。","答应陪人办事，后来发现自己赶不过来。怕他失望没及时说，直到临近约定时间，才不得不解释。"],
  wugui:["东西装了一半，发现另一种装法更省事，又拆开重来。换过几次之后，人已经烦了，东西却还没装好。","本来想问清一句话，自己想了好几种解释，最后觉得问了也没用。对方再发消息，你也没有以前那么想回。"],
  liusha:["大家提什么要求你都想顾到，时间一改再改。轮到自己想办的事，已经没有空档，只能再往后放。","每次不高兴都先藏着，后来连说原因都觉得累。对方约你，你总说没空，其实是已经不想再像以前那么主动。"],
  huohai:["几个人讨论得很热闹，最后谁去联系、哪天完成都没定。第二天一问，都以为别人会去办，事情还在原地。","你想解释，对方却觉得你在争。说了几轮谁也没听进去，最后都说算了，但再见面已经没那么自在。"],
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
  if(age<=24 && star==='tianyi') { title="重感情，也容易心软，自己的长处和吃亏点在哪？"; topic="感情、个人长处和未来方向"; }
  if(age>=65 && ['yannian','jueming','wugui'].includes(star)) topic="自己的长处、人际来往和接下来的生活安排";
  const aim = `先把号码里这处解读讲清楚：看的是哪组数字，前后搭配有什么不同。再结合八字，从传统命理的角度看${topic}，有哪些可参考的调整思路。`;
  return {title,aim};
}
