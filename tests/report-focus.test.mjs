import assert from 'node:assert/strict';
import test from 'node:test';
import {analysePhone,reportReading,reportSupplement,consultationDomain,render,modules,copyRegressionPhones,buildTypeRadar,makeTypeShareData,classifyNumberGroup,compositionReading,PAIR_LOOKUP} from './report-harness.mjs';

const {selectReportFocus,TYPE_IDENTITIES,focusHook,freshDetails}=modules['./report-focus'];
const samples=['18520283007','17637056891','18945092756','13145924272','14704851410','18466196666','15207558336','15342204620','18318002959','18318002957'];
const ages=[20,30,42,57,72];
const block=(html,id)=>html.split(`id="report-${id}"`)[1].split('</section>')[0];

test('extra detail is drawn from a different real group, remains deterministic and never duplicates its main example',()=>{
  let count=0;
  for(const phone of copyRegressionPhones){
    const a=analysePhone(phone),before=JSON.stringify(a),focus=selectReportFocus(a);
    for(const domain of ['work','money','relationship']){
      const extra=reportSupplement(a,domain,30);
      if(!extra)continue;
      count++;
      assert.ok(a[domain].ordered.some(e=>e.group.raw===extra.pattern && e.group.index===extra.index && e.group.endIndex===extra.endIndex));
      assert.ok(extra.index!==focus.anchor.group.index || extra.endIndex!==focus.anchor.group.endIndex);
      assert.equal(a.phone.slice(extra.index,extra.endIndex+1),extra.pattern);
      assert.notEqual(extra.example,reportReading(a,domain,30).example);
      assert.equal(JSON.stringify(extra),JSON.stringify(reportSupplement(a,domain,30)));
    }
    assert.equal(JSON.stringify(a),before);
  }
  assert.ok(count>20);
  assert.equal(reportSupplement(analysePhone('18518181818'),'work',30),undefined);
});

test('character cards have real explanations and the type gallery is removed',()=>{
  for(const phone of samples){
    const html=render(phone),character=block(html,'character');
    assert.doesNotMatch(html,/看看还有哪些类型|class="type-gallery"/);
    const articles=[...character.matchAll(/<article[^>]*>([\s\S]*?)<\/article>/g)].map(m=>m[1]);
    assert.equal(articles.length,2);
    assert.ok(articles.every(article=>article.includes('<p>')),phone);
    assert.notEqual(articles[0],articles[1]);
    assert.match(html,/一句话看懂这份画像/);
  }
});

test('specific examples do not replace helpful or quiet cases with generic lending or failure stories',()=>{
  const {specificEverydayScene}=modules['./report-conversation'];
  const group=raw=>({raw,index:3,endIndex:raw.length+2,...classifyNumberGroup(raw,PAIR_LOOKUP)});
  assert.match(specificEverydayScene(group('856'),'money',30),/多花时间/);
  assert.doesNotMatch(specificEverydayScene(group('856'),'money',30),/借|还款/);
  assert.match(specificEverydayScene(group('145'),'work',30),/有事没事也会来往/);
  assert.match(specificEverydayScene(group('82'),'work',30),/省了不少事/);
  assert.match(specificEverydayScene(group('959'),'relationship',30),/玩笑试探/);
  assert.equal(specificEverydayScene(group('8002'),'work',30),undefined);
  const {modifierAgeScene}=modules['./report-scenes'];
  assert.match(modifierAgeScene('liusha','empty','work',72),/配合|改/);
  assert.doesNotMatch(modifierAgeScene('liusha','empty','work',72),/学新功能|开头很认真/);
  assert.match(modifierAgeScene('huohai','empty','work',30),/谁负责/);
  assert.match(modifierAgeScene('tianyi','empty','work',30),/报酬/);
});

test('consultation continues the actual focus reading instead of a service catalogue',()=>{
  for(const phone of samples)for(const age of [20,30,72]){
    const html=render(phone,age),cta=block(html,'decision');
    const a=analysePhone(phone),reading=reportReading(a,consultationDomain(a),age);
    assert.ok(cta.includes(reading.lead),phone);
    assert.match(cta,/结合你的八字，这一点怎么看/);
    assert.match(cta,/八字/);assert.match(cta,/从传统命理的角度/);
    assert.match(cta,/本页还没有排盘/);assert.match(cta,/候选号码/);
    assert.doesNotMatch(cta,/怎么开口|不让彼此一直猜|心理咨询|已经排盘|换号就能/);
    assert.doesNotMatch(cta,/一对一，可以继续看什么|consultation-offer|<ul>/);
    assert.doesNotMatch(cta,/孩子|子女|仅剩|限时|原价|保准|马上转运|一定能|解锁|付款/);
    assert.equal((html.match(/href="#wechat"/g)||[]).length,1);
    assert.equal(cta,block(render(phone,age),'decision'));
  }
  const young=modules['./report-conversation'].consultationFocus('tianyi',20);
  assert.doesNotMatch(young.title,/挣钱|收入/);
});

test('consultation follows modifier differences and helpful special cases without manufacturing a loss',()=>{
  const {consultationFocus}=modules['./report-conversation'];
  const group=raw=>({raw,index:3,endIndex:raw.length+2,...classifyNumberGroup(raw,PAIR_LOOKUP)});
  for(const star of Object.keys(TYPE_IDENTITIES)){
    const turns=['plain','hidden','empty'].map(mood=>consultationFocus(star,30,mood).title);
    assert.equal(new Set(turns).size,3,star);
  }
  const get=raw=>{const g=group(raw);return consultationFocus(g.stars[0],30,modules['./report-focus'].modifierMood(g),g)};
  assert.match(get('856').aim,/费时间/);assert.doesNotMatch(get('856').aim,/借|催|拿不回来/);
  assert.match(get('82').title,/愿意帮/);assert.doesNotMatch(get('8002').title,/愿意帮/);
  assert.match(get('145').aim,/机会/);assert.match(get('959').title,/玩笑/);
  assert.notEqual(get('99').title,get('959').title);
  assert.match(get('1053').aim,/哪些符合、哪些不符合/);
  assert.notEqual(block(render('18318002959'),'decision'),block(render('18318002957'),'decision'));
});

test('radar takeaway is one source-specific sentence, not five mid-range templates',()=>{
  const sentence=phone=>render(phone).split('一句话看懂这份画像</span><p>')[1].split('</p>')[0];
  for(const phone of samples){
    const text=sentence(phone);
    assert.ok(text.length>25 && text.length<150, text);
    assert.equal((text.match(/。/g)||[]).length,1);
    assert.doesNotMatch(text,/长期使用|继续用.*号码|换号.*改善|(?<!不)一定|疾病|破财|\d{8}/);
    assert.equal(text,sentence(phone));
  }
  assert.notEqual(sentence('18318002959'),sentence('18318002957'));
  assert.match(sentence('18520283007'),/怕选错/);
  const a=render('18318002959'),b=render('18318002957');
  assert.match(a,/图中更突出：变通、感受/);
  assert.match(b,/图中更突出：变通、行动/);
});

test('chart summary retains specific combinations and does not infer outcomes for mixed effects',()=>{
  const {radarTakeaway}=modules['./report-explanations'];
  const group=raw=>({raw,index:3,endIndex:raw.length+2,...classifyNumberGroup(raw,PAIR_LOOKUP)});
  assert.match(radarTakeaway('tianyi','visible',group('856')),/休息却少了/);
  assert.doesNotMatch(radarTakeaway('tianyi','visible',group('856')),/还款|借钱/);
  assert.match(radarTakeaway('shengqi','growing',group('145')),/互相帮忙/);
  const mixed=radarTakeaway('tianyi','mixed',group('1053'),'有钱被套，也有解套的机会。');
  assert.match(mixed,/有解套的机会/);
  assert.doesNotMatch(mixed,/如果一直这样/);
});

test('the eight shareable roles are distinct editorial identities, not historical matches or psychometric claims',()=>{
  assert.equal(Object.keys(TYPE_IDENTITIES).length,8);
  assert.equal(new Set(Object.values(TYPE_IDENTITIES).map(v=>v.role)).size,8);
  assert.doesNotMatch(JSON.stringify(TYPE_IDENTITIES),/天生|准确率|疾病|保证|历史人物|前世|百分位/);
  assert.equal(TYPE_IDENTITIES.yannian.role,'能干，也爱操心');
});

test('all focus selections are deterministic, traceable and belong to the existing primary type',()=>{
  for(const phone of copyRegressionPhones){
    const a=analysePhone(phone),before=JSON.stringify(a),f=selectReportFocus(a);
    if(!a.matches.length)continue;
    assert.ok(f.anchor,phone);
    assert.ok(a.work.ordered.includes(f.anchor));
    assert.ok(f.anchor.group.stars.includes(a.primary.key));
    assert.equal(f.star,a.primary.key);
    assert.equal(f.domain,consultationDomain(a));
    for(const d of ['work','money','relationship']){
      const r=reportReading(a,d,30);
      assert.ok(a.phone.slice(3).includes(r.pattern),phone+' '+r.pattern);
      assert.ok(r.lead && r.question && r.example);
      assert.ok(r.paragraphs.every(p=>!r.lead.includes(p)));
    }
    assert.equal(JSON.stringify(a),before);
    assert.equal(JSON.stringify(f),JSON.stringify(selectReportFocus(analysePhone(phone))));
  }
});

test('the 6666 regression no longer describes a daring type as delaying every new opportunity',()=>{
  const a=analysePhone('18466196666');
  assert.equal(a.primary.key,'jueming');
  assert.equal(selectReportFocus(a).anchor.group.raw,'96666');
  const work=reportReading(a,'work',30);
  assert.match(work.lead,/先答应/);
  assert.doesNotMatch(block(render(a.phone),'growth'),/新的机会却总想再等等|想加薪、想换工作，已经想了很久/);
});

test('2959 and 2957 differ in visible character cards, not merely their labels',()=>{
  const a=analysePhone('18318002959'),b=analysePhone('18318002957');
  assert.equal(selectReportFocus(a).anchor.group.raw,'2959');
  assert.equal(selectReportFocus(b).anchor.group.raw,'957');
  assert.notEqual(block(render(a.phone),'character'),block(render(b.phone),'character'));
  assert.notEqual(reportReading(a,'work',30).lead,reportReading(b,'work',30).lead);
  // Shared early groups remain genuinely identical in the source analysis.
  assert.equal(a.work.ordered[0].text,b.work.ordered[0].text);
  assert.equal(a.work.ordered[1].text,b.work.ordered[1].text);
});

test('fifty rendered reports use five actual scenarios without restating the lead as an age prefix',()=>{
  for(const phone of samples){
    const a=analysePhone(phone);
    for(const d of ['work','money','relationship']){
      const readings=ages.map(age=>reportReading(a,d,age));
      assert.equal(new Set(readings.map(r=>r.example)).size,5,phone+' '+d);
      for(const r of readings){
        assert.ok(!r.example.includes(r.lead),phone+' '+d);
        assert.doesNotMatch(r.example,/你已经退休|你已经结婚|你的孩子|一定会|保证|手术|疾病风险/);
      }
    }
  }
});

test('the visible report does not repeat the former 8336 sentence four times',()=>{
  const html=render('15207558336');
  const repeated='有能力，也肯站出来负责；只是容易把别人的活一起接过来。';
  assert.ok(html.split(repeated).length-1<=1);
  const plain=html.replace(/<dialog\b[^>]*>[\s\S]*?<\/dialog>/g,'').replace(/<details\b[^>]*>[\s\S]*?<\/details>/g,'').replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/g,'').replace(/<[^>]+>/g,'');
  // Added one visible explanation per domain plus a conditional progression;
  // keep that extra substance bounded, rather than hiding everything again.
  assert.ok(plain.length<2200,plain.length);
});

test('cover concern, consultation and share use the same primary focus without personal data',()=>{
  for(const phone of samples){
    const a=analysePhone(phone),f=selectReportFocus(a),r=reportReading(a,f.domain,30);
    const concern=focusHook({...f,mood:r.mood},r.lead),html=render(phone);
    assert.ok(html.includes(concern));
    assert.ok(block(html,'decision').includes(r.lead));
    const data=makeTypeShareData(f.star,a.secondary?.key,buildTypeRadar(a.matches,a.composition.groups),concern,f.role,f.motto);
    assert.equal(data.role,f.role); assert.equal(data.watchout,concern);
    assert.ok(!JSON.stringify(data).includes(phone));
    assert.ok(!('age' in data) && !('gender' in data) && !('contributions' in data));
    assert.equal((html.match(/href="#wechat"/g)??[]).length,1);
  }
});

test('detail deduplication keeps only genuinely additional sentences',()=>{
  assert.deepEqual([...freshDetails('一句重点。另一句解释。一句重点。',['一句重点。'])],['另一句解释。']);
});

test('new everyday names replace card metaphors throughout the rendered report',()=>{
  const types=modules['./eight-types'].EIGHT_TYPES;
  assert.deepEqual(Object.values(types).map(t=>t.name),['热心肠','实在人','主心骨','稳当派','行动派','点子王','细心派','直性子']);
  for(const phone of copyRegressionPhones){
    const html=render(phone);
    assert.doesNotMatch(html,/拿手牌|还有一张牌|心里想了很多，真要开始时却又往后放/);
  }
});

test('expanded explanations remain mode-specific and retain mixed and repeated-zero source details',()=>{
  const {readingExplanation}=modules['./report-explanations'];
  for(const star of Object.keys(TYPE_IDENTITIES))for(const domain of ['work','money','relationship']){
    const variants=['plain','hidden','empty'].map(mood=>readingExplanation(star,mood,domain));
    assert.equal(new Set(variants).size,3);
    assert.ok(variants.every(v=>v.length>30 && v.length<130));
    assert.equal(readingExplanation(star,'mixed',domain),'');
  }
  for(const phone of samples){
    const a=analysePhone(phone);
    for(const domain of ['work','money','relationship']){
      const r=reportReading(a,domain,30);
      const original=freshDetails(r.text,[r.lead,r.example]);
      if(r.mood==='mixed' || r.pattern.includes('00') && r.pattern.includes('82')) {
        if(original.length) assert.deepEqual([...r.paragraphs],[...original]);
      } else assert.ok(r.paragraphs.length,phone+' '+domain);
    }
  }
});

test('fuwei hidden copy says what is being delayed and the age example says why',()=>{
  const raw='202';
  const r=compositionReading({raw,index:3,endIndex:5,...classifyNumberGroup(raw,PAIR_LOOKUP)});
  assert.equal(r.domains.work.lead,'想做，又怕做不好。准备了很久，还是没动手。');
  assert.match(r.domains.work.question,/没开始.*怕哪一步出错/);
  assert.doesNotMatch(r.domains.work.question,/没跟对方说清楚/);
  const example=modules['./report-scenes'].modifierAgeScene('fuwei','hidden','work',30);
  assert.match(example,/简历改了几遍却没投/);
  assert.match(example,/怕下一份还不如现在/);
});

test('conditional progression preserves mixed and specific-case boundaries',()=>{
  const {conditionalProgression}=modules['./report-explanations'];
  for(const star of Object.keys(TYPE_IDENTITIES)){
    assert.equal(conditionalProgression(star,'mixed'),undefined);
    const variants=['plain','hidden','empty'].map(mood=>conditionalProgression(star,mood));
    assert.equal(new Set(variants.map(JSON.stringify)).size,3);
    assert.ok(variants.every(v=>v.length===3));
  }
  const group=raw=>({raw,index:3,endIndex:raw.length+2,...classifyNumberGroup(raw,PAIR_LOOKUP)});
  assert.match(conditionalProgression('tianyi','visible',group('856')).join(''),/休息却少了/);
  assert.doesNotMatch(conditionalProgression('tianyi','visible',group('856')).join(''),/借钱|还款/);
  assert.match(conditionalProgression('shengqi','plain',group('82')).join(''),/一起商量/);
  assert.doesNotMatch(conditionalProgression('fuwei','plain',group('99')).join(''),/投简历|工作/);
  assert.doesNotMatch(render('18318002957'),/id="progression-title"/);
  for(const section of ['growth','wealth','relationship']) {
    assert.match(block(render('18318002957'),section),/再看一个细节/);
    assert.doesNotMatch(block(render('18318002957'),section),/如果一直这样/);
  }
  assert.doesNotMatch(render('18318002957'),/明年财运|一定会破财|保证转运/);
});


test('concrete pair details distinguish decisions and shared expenses without assuming a business',()=>{
  const {pairDetail,expandedReading}=modules['./report-detail'];
  const group=raw=>({raw,index:3,endIndex:raw.length+2,...classifyNumberGroup(raw,PAIR_LOOKUP)});
  const cautious=reportReading(analysePhone('18543434343'),'work',30);
  assert.match(cautious.example,/选择|要求/);
  assert.doesNotMatch(cautious.example,/那份也接过来|加班|替他/);
  const clients=reportReading(analysePhone('18513131313'),'money',30);
  assert.match(clients.example,/各付各的|配送|打包/);
  assert.doesNotMatch(clients.example,/回头客|订单|服务/);
  assert.doesNotMatch(clients.example,/借|催|还款/);
  assert.notEqual(pairDetail(group('13'),'money',30).example,pairDetail(group('31'),'money',30).example);
  assert.equal(pairDetail(group('104'),'work',30),undefined);
  assert.equal(pairDetail(group('154'),'work',30),undefined);
  assert.equal(expandedReading('tianyi',group('1053'),'money',30),undefined);
  for(const age of ages){
    const repeated=expandedReading('shengqi',group('8002'),'money',age);
    assert.match(repeated.example,/前一笔.*又付了一次/);
    assert.doesNotMatch(repeated.example,/省了不少事/);
  }
});

test('whole reports use clear expressions without acquaintance placeholders across ages',()=>{
  for(const phone of copyRegressionPhones)for(const age of ages){
    const html=render(phone,age);
    assert.doesNotMatch(html,/熟人|会来事|路子广|遇到事知道找谁帮忙|一看这个月的工资|交付/,phone+' '+age);
    for(const section of ['growth','wealth','relationship']){
      const a=analysePhone(phone);if(!a.matches.length)continue;
      const content=block(html,section);
      assert.ok(content.includes('reading-explanation') || modules['./report-focus'].modifierMood(modules['./report-focus'].selectReportFocus(a).anchor?.group)==='mixed',phone+' '+section);
    }
  }
});

test('modified character explains priorities instead of recycling the work and social headline',()=>{
  for(const phone of ['18318002957','18318002959','18520283007','18514014014']){
    const html=render(phone),character=block(html,'character'),a=analysePhone(phone);
    for(const domain of ['work','relationship'])assert.ok(!character.includes(reportReading(a,domain,30).lead));
    const texts=[...character.matchAll(/<p>([^<]+)<\/p>/g)].map(m=>m[1]);
    assert.equal(texts.length,2);assert.notEqual(texts[0],texts[1]);
  }
});


test('shared 13 money copy works across phones and ages without turning every reader into a business owner',()=>{
  const phones=['18527939132','18513131313','18313131313'];
  for(const phone of phones)for(const age of ages){
    const a=analysePhone(phone),r=reportReading(a,'money',age);
    assert.match(r.pattern,/13/);
    assert.match(r.lead,/一起付账/);
    assert.match(r.example,/付|费用|转|钱/);
    assert.doesNotMatch(r.lead+r.paragraphs.join('')+r.example,/熟客|客户|生意|订单|回头客|工资|房贷/);
    const html=render(phone,age);
    assert.match(block(html,'wealth'),/放到生活里看/);
    assert.doesNotMatch(html,/用钱的习惯|比如这样的用钱习惯/);
  }
  const a=analysePhone(phones[0]);
  const extra=reportSupplement(a,'relationship',30);
  assert.equal(extra.pattern,'79');
  assert.match(extra.lead,/说重|责怪/);
  assert.match(extra.example,/提醒过|训了一顿/);
  assert.doesNotMatch(extra.example,/自己猜|是不是不满意/);
});

test('modifier examples distinguish expectation, instruction, withheld questions and continuing expenses',()=>{
  const {modifierAgeScene}=modules['./report-scenes'];
  const checks=[
    ['tianyi','hidden','relationship',/问起|失落/],
    ['yannian','hidden','relationship',/要求|在意的地方/],
    ['jueming','hidden','relationship',/前面几次|不满/],
    ['wugui','hidden','relationship',/没有问|避开/],
    ['huohai','hidden','work',/早点说|一步还没说清/],
    ['jueming','empty','money',/加钱|补一次/],
    ['yannian','empty','money',/工具|材料/],
    ['huohai','empty','money',/答应|补的钱/],
    ['wugui','empty','money',/旧会员|同时花钱/],
  ];
  for(const [star,mood,domain,topic] of checks)for(const age of ages){
    const text=modifierAgeScene(star,mood,domain,age);
    assert.match(text,topic,`${star} ${mood} ${domain}`);
    assert.ok(text.length>45);
  }
});

test('all rendered cohorts have substantive examples and avoid the discarded business template',()=>{
  for(const phone of [...copyRegressionPhones,'18527939132']){
    const a=analysePhone(phone),before=JSON.stringify(a);
    if(!a.matches.length) continue;
    for(const domain of ['work','money','relationship']){
      const readings=ages.map(age=>reportReading(a,domain,age));
      assert.equal(new Set(readings.map(r=>r.example)).size,5,phone+' '+domain);
      for(const r of readings)assert.doesNotMatch(r.lead+r.paragraphs.join('')+r.example,/熟客|希望生意能一直|会事情做完|路子广|会来事/);
    }
    assert.equal(JSON.stringify(a),before);
  }
});
