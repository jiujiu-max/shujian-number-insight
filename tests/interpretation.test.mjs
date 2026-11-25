import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { analysePhone, ResultSectionV3, SEQUENCE_RULES, PAIR_VOICES, PAIR_LOOKUP, AGE_STAGE_CONTEXTS, getAgeStageContext, buildCharacterProfile, reportReading, consultationDomain, Home, parseNumberComposition, classifyNumberGroup, compositionReading, EIGHT_TYPES, buildTypeRadar, makeTypeShareData, radarPoints, SITE_URL, render, copyRegressionPhones, modules, COMBINATION_READINGS, source } from './report-harness.mjs';

test('five-dimension explanations describe this chart instead of showing implementation notes', () => {
  const {describeTypeRadar}=modules['./eight-types'];
  const profiles=Object.keys(EIGHT_TYPES).map(key=>buildTypeRadar([{key,index:3,endIndex:4,strength:4,tail:false}],[]));
  const readings=profiles.map(describeTypeRadar);
  assert.equal(new Set(readings.map(r=>JSON.stringify(r))).size,8);
  for(const [i,r] of readings.entries()){
    assert.equal(r.dimensions.length,5);
    assert.deepEqual([...r.dimensions.map(d=>d.name)],['行动','表达','感受','坚持','变通']);
    for(const d of r.dimensions){assert.ok(d.meaning && d.title && d.text);if(d.prominent)assert.ok(profiles[i].prominent.includes(d.name));}
    assert.doesNotMatch(JSON.stringify(r),/百分位|准确率|\d+%|疾病|肯定会/);
  }
  const high=describeTypeRadar({...profiles[0],values:[1,1,1,1,1]});
  const low=describeTypeRadar({...profiles[0],values:[.25,.25,.25,.25,.25]});
  for(let i=0;i<5;i++)assert.notEqual(high.dimensions[i].text,low.dimensions[i].text);
  assert.match(high.summary,/比较接近/);
  for(const phone of ['18945092756','18520283007']){
    const html=render(phone),a=analysePhone(phone),reading=describeTypeRadar(buildTypeRadar(a.matches,a.composition.groups));
    assert.ok(html.includes('一句话看懂这份画像'));
    assert.ok(reading.featured.length<=2);
    for(const dimension of reading.dimensions) {
      assert.ok(!html.includes(dimension.meaning));
    }
    assert.doesNotMatch(html,/class="radar-readings"|class="radar-explainer"/);
    assert.doesNotMatch(html,/按本次命中的八星组合|0、5保留在组合解读中/);
    assert.match(html,/规则示意，不是能力分数/);
  }
});

test('eight types have distinct Chinese names, meaningful dimensions and no invented population scores', () => {
  assert.equal(Object.keys(EIGHT_TYPES).length, 8);
  assert.equal(new Set(Object.values(EIGHT_TYPES).map(t => t.name)).size, 8);
  for (const type of Object.values(EIGHT_TYPES)) {
    assert.equal(type.dimensions.length, 5);
    assert.ok(type.dimensions.every(v => Number.isInteger(v) && v >= 1 && v <= 4));
    assert.ok(type.strength && type.consultation && type.tagline);
  }
  assert.doesNotMatch(JSON.stringify(EIGHT_TYPES), /准确率|超过.*人|疾病|保证|\d+%/);
});

test('radar uses real matched spans, all stars and the existing continuation rule, without random values', () => {
  for (const phone of copyRegressionPhones) {
    const a = analysePhone(phone), radar = buildTypeRadar(a.matches, a.composition.groups);
    assert.equal(JSON.stringify(radar), JSON.stringify(buildTypeRadar(a.matches, a.composition.groups)));
    assert.ok(radar.values.every(v => Number.isFinite(v) && v >= 0 && v <= 1));
    assert.equal(radar.contributions.length, new Set(a.matches.map(m => m.index+':'+m.endIndex)).size);
    for (const trace of radar.contributions) assert.ok(a.matches.some(m => m.index === trace.index && m.endIndex === trace.endIndex));
    assert.equal(radarPoints(radar.values).length, 5);
  }
  const a = analysePhone('18318002959'), b = analysePhone('18318002957');
  const ra = buildTypeRadar(a.matches, a.composition.groups), rb = buildTypeRadar(b.matches, b.composition.groups);
  assert.notEqual(JSON.stringify(ra.values), JSON.stringify(rb.values));
  assert.equal(ra.contributions.at(-1).star, 'liusha');
  assert.deepEqual([...buildTypeRadar([], []).values], [0,0,0,0,0]);
});

test('pure-star mapping is transparent and 0/5 do not become arbitrary bonus or penalty points', () => {
  for (const key of Object.keys(EIGHT_TYPES)) {
    const match = { key, index:3, endIndex:4, strength:4, tail:true };
    const result = buildTypeRadar([match], []);
    assert.deepEqual([...result.values], [...EIGHT_TYPES[key].dimensions].map(v => v / 4));
    const modified = buildTypeRadar([{ ...match, endIndex:6, bridge:'05', modifier:'空与加强并存' }], []);
    assert.deepEqual([...result.values], [...modified.values]);
  }
});

test('share payload contains only public type copy and chart, never personal fields or a result URL', () => {
  for (const phone of ['18318002959','18318002957','18027933122']) {
    const a = analysePhone(phone), radar = buildTypeRadar(a.matches, a.composition.groups);
    const data = makeTypeShareData(a.primary.key, a.secondary?.key, radar, a.work.lead);
    assert.deepEqual(Object.keys(data).sort(), ['name','word','tagline','strength','watchout','secondary','values','url','role'].sort());
    assert.equal(data.url, SITE_URL);
    assert.doesNotMatch(data.url, /\?|#/);
    assert.ok(!JSON.stringify(data).includes(phone));
    assert.ok(!JSON.stringify(data).includes(phone.slice(3)));
    assert.ok(!('contributions' in data));
  }
  const shareSource = readFileSync(new URL('../app/type-share.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(shareSource, /fetch\(|sendBeacon|localStorage|sessionStorage/);
  assert.ok(shareSource.includes('qr.src = "/type-entry-qr.png"'));
});

test('new type cover preserves distinct types, chart and one voluntary consultation', () => {

  const reports=['18318002959','18318002957'].map(renderPhone=>render(renderPhone));
  assert.match(reports[0], /id="report-title">细心派/);
  assert.match(reports[1], /id="report-title">点子王/);
  assert.notEqual(reports[0],reports[1]);
  for (const html of reports) {
    assert.match(html, /<svg[^>]+role="img"[^>]+aria-labelledby=/);
    assert.match(html, /规则示意，不是能力分数/);
    assert.match(html, /<dialog[^>]+aria-labelledby="share-title"/);
    assert.match(html, /保存我的性格卡/);
    assert.match(html, /不带手机号、年龄或性别/);
    assert.doesNotMatch(html, /<dialog[^>]*\sopen(?:[\s=>])/);
    assert.equal((html.match(/href="#wechat"/g)??[]).length,1);
  }
});

test('all eight latest owner decompositions are produced by a generic left-to-right parser', () => {

  const fixtures=[
    ['18520283007',['2028','8300','3007']],
    ['17637056891',['370','7056','68','89','91']],
    ['18945092756',['4509','092','27','756']],
    ['13145924272',['459','92','242','272']],
    ['14704851410',['048','851','1410']],
    ['18466196666',['661','19','96666']],
    ['15207558336',['07558','833','36']],
    ['15342204620',['4220','046','620']],
  ];
  for(const [phone,expected] of fixtures) {
    const a=analysePhone(phone);
    assert.equal(a.composition.prefix,phone.slice(0,3));
    assert.deepEqual([...a.composition.groups.map(g=>g.raw)],expected,phone);
    assert.ok(a.matches.every(m=>m.index>=3));
    for(const prefix of ['133','153','173','193']) {
      const b=analysePhone(prefix+phone.slice(3));
      assert.deepEqual([...b.composition.groups.map(g=>g.raw)],expected);
      assert.equal(JSON.stringify(b.work),JSON.stringify(a.work));
      assert.equal(b.primary.key,a.primary.key);
    }
  }
  const a=analysePhone('18945092756');
  assert.equal(a.composition.groups[1].baseReference,'92');
  assert.equal(a.matches.filter(m=>m.basePair==='92').length,1);
  assert.equal(a.work.ordered.filter(item=>item.group.raw==='092').length,1);
  assert.ok(!analysePhone('15342204620').matches.some(m=>m.pair==='204'));
  assert.equal(classifyNumberGroup('242',PAIR_LOOKUP).stars[0],'wugui');
  assert.equal(classifyNumberGroup('272',PAIR_LOOKUP).stars[0],'tianyi');
});

test('0/5 are attached modifiers; owner examples preserve base stars and actual positions', () => {
  for(const [raw,base,key,position] of [
    ['1700','17','huohai','trailing'],['3002','32','huohai','middle'],
    ['3599','39','shengqi','middle'],['2959','29','liusha','middle'],
    ['2999','29','liusha','none'],['295','29','liusha','trailing'],
    ['82','82','shengqi','none'],['802','82','shengqi','middle'],['8002','82','shengqi','middle'],
    ['99','99','fuwei','none'],['959','99','fuwei','middle'],
    ['97','97','wugui','none'],['957','97','wugui','middle'],
  ]) {
    const c=classifyNumberGroup(raw,PAIR_LOOKUP);
    assert.equal(c.base,base,raw); assert.deepEqual([...c.stars],[key],raw); assert.equal(c.modifierPosition,position,raw);
  }
  assert.deepEqual([...classifyNumberGroup('331',PAIR_LOOKUP).stars],['fuwei','tianyi']);
  assert.equal(classifyNumberGroup('8002',PAIR_LOOKUP).zeroCount,2);
  assert.equal(classifyNumberGroup('802',PAIR_LOOKUP).zeroCount,1);
});

test('same-star continuation keeps its parent identity instead of an isolated fuwei title', () => {

  const a=analysePhone('18318002959'),b=analysePhone('18318002957');
  assert.equal(a.primary.key,'liusha'); assert.equal(b.primary.key,'wugui');
  assert.equal(a.composition.groups.at(-1).base,'29');
  assert.ok(!a.compositionReadings.some(r=>r.group.raw==='959'));
  for(const analysis of [a,b]) {
    const character=buildCharacterProfile(analysis);
    assert.equal(character.outside.pattern,analysis.composition.groups[0].raw);
    assert.deepEqual([...character.details.map(d=>d.pattern)],[...analysis.composition.groups.map(g=>g.raw)]);
  }
  assert.notEqual(buildCharacterProfile(a).details.at(-1).text,buildCharacterProfile(b).details.at(-1).text);
});

test('shared combinations stay shared while changed endings alter actual detailed content', () => {

  const analyses=['18318002959','18318002957'].map(analysePhone);
  for(const age of [20,30,42,57,72]) for(const domain of ['work','money','relationship']) {
    const readings=analyses.map(a=>reportReading(a,domain,age));
    assert.notEqual(readings[0].text,readings[1].text,domain);
    assert.notEqual(readings[0].lead,readings[1].lead,domain);
    assert.equal(analyses[0][domain].ordered.find(r=>r.group.raw==='8002').text,
      analyses[1][domain].ordered.find(r=>r.group.raw==='8002').text);
  }
});

test('82, 802 and 8002 retain distinct plain, hidden and repeated-zero descriptions', () => {

  const readings=['82','802','8002'].map(raw=>compositionReading({raw,index:3,endIndex:raw.length+2,...classifyNumberGroup(raw,PAIR_LOOKUP)}));
  for(const domain of ['work','money','relationship']) assert.equal(new Set(readings.map(r=>r.domains[domain].text)).size,3);
  assert.match(readings[0].domains.work.text,/帮助/);
  assert.match(readings[2].domains.work.text,/几次/);
  assert.doesNotMatch(JSON.stringify(readings),/你身边有小人|有人要害你|必定|疾病|手术/);
});

test('99 and 959 differ, but the 99 personality is not copied to all fuwei bases', () => {
  const make=raw=>compositionReading({raw,index:3,endIndex:3+raw.length-1,...classifyNumberGroup(raw,PAIR_LOOKUP)});
  assert.notEqual(make('99').outside.title,make('959').outside.title);
  assert.match(make('959').outside.title,/主动逗人/);
  assert.doesNotMatch(make('252').outside.title,/主动逗人/);
  assert.notEqual(make('957').domains.work.lead,modules['./star-portraits'].STAR_PORTRAITS.wugui.work.lead);
});

test('course middle-5 visibility and trailing-5 continuation differ for all eight stars', () => {

  for(const pair of ['12','18','16','17','19','13','14','11']) {
    const make=raw=>compositionReading({raw,index:3,endIndex:raw.length+2,...classifyNumberGroup(raw,PAIR_LOOKUP)});
    const middle=make(pair[0]+'5'+pair[1]),trailing=make(pair+'5');
    assert.ok(middle && trailing);
    assert.match(middle.id,/middle-visible/); assert.match(trailing.id,/trailing-growing/);
    for(const domain of ['work','money','relationship']) assert.notEqual(middle.domains[domain].text,trailing.domains[domain].text);
    assert.doesNotMatch(JSON.stringify([middle,trailing]),/保证|财运更旺|一定赚钱|疾病|手术|必定|一定会/);
  }
});

test('0 and 5 retain actual positions and mixed effects rather than cancelling each other', () => {

  const make=raw=>compositionReading({raw,index:3,endIndex:raw.length+2,...classifyNumberGroup(raw,PAIR_LOOKUP)});
  for(const raw of ['1800','295','970','975','8052','80002','092']) assert.ok(make(raw),raw);
  assert.match(make('970').id,/trailing-empty/);
  assert.match(make('907').id,/middle-hidden/);
  assert.match(make('975').id,/trailing-growing/);
  const mixed=make('4509');
  assert.match(mixed.id,/visible.*hidden/);
  assert.match(mixed.domains.money.text,/主动挣钱/);
  assert.match(mixed.domains.money.text,/拿不出来/);
  assert.match(make('07558').id,/leading-hidden.*middle-visible/);
  assert.equal(classifyNumberGroup('07558',PAIR_LOOKUP).fiveCount,2);
  const normal=analysePhone('18949272756').work.ordered.find(r=>r.group.raw==='92');
  assert.ok(normal); assert.notEqual(normal.text,analysePhone('18945092756').work.ordered[1].text);
});

test('generated inputs preserve original spans, ordering and modifier runs deterministically', () => {

  let seed=41;
  for(let n=0;n<500;n++){
    let body='';for(let i=0;i<8;i++){seed=(seed*1664525+1013904223)>>>0;body+=seed%10;}
    const phone='183'+body,c=parseNumberComposition(phone,PAIR_LOOKUP);
    assert.equal(JSON.stringify(c),JSON.stringify(parseNumberComposition(phone,PAIR_LOOKUP)));
    for(const [i,g] of c.groups.entries()){
      assert.equal(phone.slice(g.index,g.endIndex+1),g.raw);
      assert.ok(g.index>=3);assert.ok(g.stars.length>0);
      if(i)assert.ok(g.index>=c.groups[i-1].index);
      for(const run of g.modifierRuns)assert.equal(g.raw.slice(run.index,run.index+run.digits.length),run.digits);
    }
  }
});

test('all 293 regressions classify actual adjacent endpoints without carrier digits or duplicate spans', () => {

  assert.equal(copyRegressionPhones.length,293);
  for(const phone of copyRegressionPhones) {
    const a=analysePhone(phone), spans=new Set();
    for(const m of a.matches) {
      assert.ok(m.index>=3);
      assert.equal(phone.slice(m.index,m.endIndex+1),m.pair);
      assert.equal(m.basePair,phone[m.index]+phone[m.endIndex]);
      assert.equal(m.key,PAIR_LOOKUP.get(m.basePair).key);
      assert.ok(a.composition.groups.some(g=>g.index<=m.index && g.endIndex>=m.endIndex));
      assert.ok(!spans.has(m.index+':'+m.endIndex));spans.add(m.index+':'+m.endIndex);
    }
  }
});

test('reported 185 and 180 numbers retain distinct ordered cards and domain reports at all ages', () => {

  const phones=['18520283007','18027933122'],analyses=phones.map(analysePhone);
  assert.equal(analyses[0].primary.key,'fuwei');assert.equal(analyses[1].primary.key,'jueming');
  for(const age of [20,30,42,57,72])for(const section of ['character','growth','wealth','relationship']){
    const blocks=phones.map(p=>render(p,age).split('id="report-'+section+'"')[1].split('</section>')[0]);
    assert.notEqual(blocks[0],blocks[1]);
  }
  assert.equal(analyses[0].work.ordered[0].group.raw,'2028');
  assert.equal(analyses[1].work.ordered[0].group.raw,'27');
  for(const a of analyses)assert.equal(buildCharacterProfile(a).outside.pattern,a.composition.groups[0].raw);
});

test('every parsed group contributes domain-specific content with traceable matches', () => {

  for(const phone of copyRegressionPhones){
    const a=analysePhone(phone);
    if(!a.matches.length)continue;
    for(const domain of ['work','money','relationship']){
      assert.deepEqual([...a[domain].ordered.map(r=>r.group.raw)],[...a.composition.groups.map(g=>g.raw)]);
      for(const item of a[domain].ordered){
        assert.ok(item.text && item.lead && item.question);
        assert.ok(item.matches.every(m=>m.index>=item.group.index && m.endIndex<=item.group.endIndex));
      }
    }
  }
});

test('character details follow original group order instead of longest or latest pattern priority', () => {

  for(const phone of ['18027939132','18566666819','18566666918','17637056891']){
    const a=analysePhone(phone),c=buildCharacterProfile(a);
    assert.equal(c.outside.pattern,a.composition.groups[0].raw);
    assert.deepEqual([...c.details.map(d=>d.pattern)],[...a.composition.groups.map(g=>g.raw)]);
  }
  assert.notEqual(JSON.stringify(buildCharacterProfile(analysePhone('18566666819'))),
    JSON.stringify(buildCharacterProfile(analysePhone('18566666918'))));
});

test('same-star repetition, pair direction and secondary stars contribute to character selection', () => {
  const cards=[];
  for (const pair of ['11','22','33','44','66','77','88','99']) {
    const a=analysePhone('185'+pair.repeat(4));
    assert.equal(a.primary.key,'fuwei');
    const c=buildCharacterProfile(a);
    assert.equal(classifyNumberGroup(c.outside.pattern,PAIR_LOOKUP).base,pair);
    assert.equal(classifyNumberGroup(c.inside.pattern,PAIR_LOOKUP).base,pair);
    cards.push(c.outside.title+'|'+c.inside.title);
  }
  assert.equal(new Set(cards).size,8);
  const first=analysePhone('18513131313'), reverse=analysePhone('18531313131');
  assert.equal(first.primary.key,reverse.primary.key);
  assert.notEqual(buildCharacterProfile(first).inside.title,buildCharacterProfile(reverse).inside.title);
  for (const phone of ['18522228122','18522223122']) {
    const a=analysePhone(phone), c=buildCharacterProfile(a);
    assert.equal(a.primary.key,'fuwei');
    assert.ok(a.composition.groups.some(g=>g.raw===c.inside.pattern));
  }
});

test('prefix modifiers do not leak and the same pair retains different hidden and visible scenes', () => {

  const phones=['18022222222','18522222222','15022222222'];
  const profiles=phones.map(p=>JSON.stringify(buildCharacterProfile(analysePhone(p))));
  assert.equal(new Set(profiles).size,1);
  const hidden=buildCharacterProfile(analysePhone('18522220222'));
  const visible=buildCharacterProfile(analysePhone('18522225222'));
  assert.notEqual(hidden.inside.scene,visible.inside.scene);
  assert.notEqual(hidden.inside.scene,buildCharacterProfile(analysePhone(phones[0])).inside.scene);
});

test('every character card is deterministic and traceable to a real matched segment', () => {
  const fingerprints=new Set();
  for(const phone of copyRegressionPhones) {
    const a=analysePhone(phone), before=JSON.stringify(a);
    const c=buildCharacterProfile(a);
    assert.equal(JSON.stringify(c),JSON.stringify(buildCharacterProfile(analysePhone(phone))));
    assert.equal(JSON.stringify(a),before);
    if(!a.matches.length) continue;
    for(const side of ['outside','inside']) {
      const card=c[side];
      assert.ok(card.title.length>0);
      assert.ok(card.matches.length>0,phone+' '+side);
      assert.ok(phone.slice(/^[05]/.test(a.body)?2:3).includes(card.pattern));
      for(const m of card.matches) assert.ok(a.matches.some(other=>JSON.stringify(other)===JSON.stringify(m)));
      assert.doesNotMatch(card.title+card.scene,/疾病|手术|妇科|一定会|保证|见鬼|自杀|资源整合|交付/);
    }
    fingerprints.add(c.outside.title+'|'+c.inside.title);
  }
  assert.ok(fingerprints.size>40,`only ${fingerprints.size} distinct supported profiles`);
});

test('all supported report branches avoid the removed abstract wording at every age', () => {
  const jargon = /资源配置|资源整合|短周期反馈|稳定进阶|可持续收入|管道收益|比较会替代行动|规则边界|主要漏口|交付|出力后却容易被误解|承诺和投入也容易走在细节前面|为情绪买单|被熟悉的生活留住了/;
  for (const phone of copyRegressionPhones) for (const age of [20,30,42,57,72]) {
    const html = render(phone,age);
    assert.doesNotMatch(html,jargon,`${phone} age ${age}`);
  }
});

test('bridged endpoints keep 0 in their spans and never borrow the carrier final digit', () => {

  const a=analysePhone('18520283007');
  assert.ok(a.matches.some(m=>m.pair==='202'&&m.basePair==='22'&&m.key==='fuwei'));
  assert.ok(a.matches.some(m=>m.pair==='3007'&&m.basePair==='37'&&m.key==='jueming'));
  const b=analysePhone('15700101008');
  assert.ok(!b.matches.some(m=>m.pair==='7001'));
  assert.ok(b.matches.every(m=>m.index>=3));
  assert.equal(JSON.stringify(b.work),JSON.stringify(analysePhone('18900101008').work));
});

test('focused paragraphs reach the report once while ordered analysis remains intact', () => {

  for(const phone of ['15700101008','18014119334','18520283007','13145924272'])
    for(const [domain,section] of [['work','growth'],['money','wealth'],['relationship','relationship']]){
      const a=analysePhone(phone),block=render(phone).split('id="report-'+section+'"')[1].split('</section>')[0];
      const reading=reportReading(a,domain,30);
      assert.ok(block.includes(reading.lead));
      for(const text of reading.paragraphs){
        const encoded=renderToStaticMarkup(React.createElement('p',null,text));
        assert.ok(block.replace(/<p\b[^>]*>/g,'<p>').includes(encoded),phone+' '+domain);
        assert.ok(!reading.lead.includes(text));
      }
      assert.ok(a[domain].ordered.length>=1);
      assert.ok(!block.includes('对应资料'));
    }
});

test('different numbers at the same age do not share identical opening cards', () => {
  const cards = phone => render(phone).split('class="type-key-points"')[1].split('class="type-share-controls"')[0];
  assert.notEqual(cards('15700101008'), cards('18014119334'));
});

test('age stages and a single consultation CTA remain available', () => {
  for (const [age, label] of [[18,'学业与起步期'],[24,'学业与起步期'],[25,'事业积累期'],[34,'事业积累期'],[35,'经验发展期'],[49,'经验发展期'],[50,'生活安排期'],[64,'生活安排期'],[65,'日常生活期'],[90,'日常生活期']]) {
    const html = render('18014119334', age);
    assert.ok(html.includes(label));
    assert.equal((html.match(/href="#wechat"/g) ?? []).length, 1);
    assert.ok(html.includes('加微信，结合八字细看'));
    const social = html.split('id="report-relationship"')[1].split('</section>')[0];
    assert.ok(social.includes('为人处事'));
    assert.doesNotMatch(social, /夫妻|结婚|恋爱|伴侣|子女/);
  }
});

test('all age boundaries resolve to complete, distinct star-specific scenes', () => {
  const keys = ['jueming','wugui','liusha','huohai','yannian','tianyi','shengqi','fuwei'];
  for (const [age, index] of [[18,0],[24,0],[25,1],[34,1],[35,2],[49,2],[50,3],[64,3],[65,4],[90,4]]) {
    assert.equal(getAgeStageContext(age), AGE_STAGE_CONTEXTS[index]);
  }
  for (const stage of AGE_STAGE_CONTEXTS) {
    assert.deepEqual(Object.keys(stage.scenes).sort(), [...keys].sort());
    for (let domain = 0; domain < 3; domain++) {
      const texts = keys.map(key => stage.scenes[key][domain]);
      assert.equal(new Set(texts).size, 8);
      assert.ok(texts.every(text => typeof text === 'string' && text.length > 10));
      assert.doesNotMatch(texts.join(''), /夫妻|子女|已婚|孩子|妇科|心血管|你已经退休/);
    }
  }
  for (const key of keys) {
    for (let domain = 0; domain < 3; domain++) {
      assert.equal(new Set(AGE_STAGE_CONTEXTS.map(stage => stage.scenes[key][domain])).size, 5);
    }
  }
});

test('the same number gets age-specific visible readings, retaining original rules and evidence', () => {
  const section = (html, name) => html.split(`id="report-${name}"`)[1].split('</section>')[0];
  for (const phone of ['18014119334','15700101008','18520283007','18592929292']) {
    const analysis = analysePhone(phone);
    const before = JSON.stringify(analysis);
    const reports = [18,28,42,57,72].map(age => render(phone, age));
    // The new identity/radar is stable across ages; detailed settings still vary.
    const cards = reports.map(html => html.split('class="type-cover"')[1].split('</section>')[0]);
    assert.equal(new Set(cards).size, 1);
    for (const [domain, name] of [['work','growth'],['money','wealth'],['relationship','relationship']]) {
      const blocks = reports.map(html => section(html, name));
      assert.equal(new Set(blocks).size, 5);
      for (const block of blocks) {
        assert.ok(block.includes(reportReading(analysis,domain,30).lead));
        assert.ok(!block.includes('对应资料'));
      }
    }
    // Age contexts do not alter personality, health, or the analyser. The
    // consultation invitation now avoids employment assumptions by age.
    for (const name of ['character','health']) {
      assert.equal(new Set(reports.map(html => section(html, name))).size, 1);
    }
    assert.equal(JSON.stringify(analysis), before);
  }
});

test('age scene copy uses concrete everyday actions instead of abstract explanations', () => {
  const copy = AGE_STAGE_CONTEXTS.map(stage => Object.values(stage.scenes).flat().join('')).join('');
  assert.doesNotMatch(copy, /习惯按旧办法用钱|生活安排变了|旧安排维持|重新盘点|少问清边界|不对等的来往|共同开销|自己的用钱安排却往后退/);
  assert.equal(AGE_STAGE_CONTEXTS.flatMap(stage => Object.values(stage.scenes).flat()).length, 120);
  assert.ok(getAgeStageContext(57).scenes.fuwei[1].includes('APP 会员、套餐自动续费的钱，没仔细算过'));
  assert.ok(getAgeStageContext(57).scenes.tianyi[0].includes('说好只帮着看看'));
  assert.ok(render('18511111111', 57).includes('有的只用过一两次'));
  assert.ok(render('18511111111', 57).includes('才发现还在扣'));
});

test('work example uses plain words and does not mix job changes with partnership terms', () => {
  const block = render('18512121212',30).split('id="report-growth"')[1].split('</section>')[0];
  assert.ok(block.includes('看看你有没有这样的时候'));
  assert.ok(block.includes('还没问清要花多久，你先答应没问题'));
  assert.ok(render('18512121212',30).includes('做事的冲劲、事业选择和求财方式'));
  assert.doesNotMatch(block, /放到日常里看|钱怎么算、谁负责|答应时想过要花多少时间吗/);
  assert.ok(getAgeStageContext(20).scenes.jueming[0].includes('实习'));
});

test('the revised work scene stays in its matched branch instead of becoming a universal template', () => {
  const revised = '一起赶的工作还没问清要花多久，你先答应没问题';
  const revisedQuestion = '答应时觉得没问题，真做起来才发现，自己根本忙不过来';
  const workBlock = (phone,age) => render(phone,age).split('id="report-growth"')[1].split('</section>')[0];
  assert.ok(workBlock('18512121212',30).includes(revised));
  for (const age of [20,42,57,72]) assert.ok(!workBlock('18512121212',age).includes(revised));
  for (const pair of ['18','16','17','19','13','14','11']) {
    const block = workBlock('185'+pair.repeat(4),30);
    assert.ok(!block.includes(revised),pair);
    assert.ok(!block.includes(revisedQuestion),pair);
  }
  for (const pattern of ['109','7081','140','154','145','6024']) {
    const phone = '185'+pattern.padStart(8,'6');
    const domain = analysePhone(phone).work;
    const block = workBlock(phone,30);
    assert.ok(domain.ordered.some(item=>item.group.raw.includes(pattern) || item.group.raw.endsWith(pattern.slice(0,2))));
    assert.ok(block.includes(reportReading(analysePhone(phone),'work',30).lead));
    assert.ok(!block.includes(revised));
  }
});

test('course 86 and 14 examples have four distinct position-aware readings and age settings', () => {

  const {compositionAgeExample}=modules['./composition-readings'];
  const make=raw=>compositionReading({raw,index:3,endIndex:raw.length+2,...classifyNumberGroup(raw,PAIR_LOOKUP)});
  assert.equal(COMBINATION_READINGS.length,21);
  for(const [patterns,domain] of [[['856','806','865','860'],'money'],[['154','104','145','140'],'work']]){
    const readings=patterns.map(make);
    assert.equal(new Set(readings.map(r=>r.domains[domain].lead)).size,4);
    for(const r of readings){
      const ages=[20,30,42,57,72].map(age=>compositionAgeExample(r,domain,age));
      assert.equal(new Set(ages).size,5);
      assert.ok(ages.every(text=>text.includes(r.domains[domain].lead)));
    }
  }
  assert.match(make('856').domains.money.lead,/辛苦/);
  assert.match(make('806').domains.money.text,/货款没结.*拿不出来/);
  assert.match(make('865').domains.money.text,/老客户|回头/);
  assert.match(make('860').domains.money.text,/花钱.*没攒下/);
});

test('0/5 sub-combinations remain effective inside a group that starts with repeated digits', () => {

  const readings=['856','806','865','860'].map(pattern=>analysePhone('185'+pattern.padStart(8,'6')).money);
  assert.equal(new Set(readings.map(r=>r.text)).size,4);
  assert.match(readings[0].text,/辛苦|时间和精力/);
  assert.match(readings[1].text,/货款没结.*拿不出来/);
  assert.match(readings[2].text,/老客户|回头/);
  assert.match(readings[3].text,/花钱.*没攒下/);
  assert.ok(!analysePhone('15366666666').relationship.ordered.some(r=>r.group.raw==='153'));
});

test('specific 0/5 meanings receive five aligned age settings, not a generic unrelated question', () => {
  const { exactAgeContext } = modules['./age-contexts'];
  for (const reading of COMBINATION_READINGS) {
    const contexts = [20,30,42,57,72].map(age => exactAgeContext(reading.pattern,age));
    assert.ok(contexts.every(context => typeof context === 'string' && context.length > 10));
    assert.equal(new Set(contexts).size,5);
  }
  assert.match(exactAgeContext('109',20), /小组作业|实习/);
  assert.match(exactAgeContext('109',42), /功劳却算在了别人头上/);
  assert.match(exactAgeContext('806',30), /等客户付款|等朋友还/);
  assert.match(exactAgeContext('860',30), /信用卡|分期/);
});

test('course notes do not add diagnoses, supernatural predictions or gender restrictions', () => {
  const copy = JSON.stringify(COMBINATION_READINGS);
  assert.doesNotMatch(copy, /自杀|通灵|见鬼|手术|生殖|呼吸|肺部|婚外情|小三|色情|女人不能|一定会|保证/);
  for (const pattern of ['107','109','103','10027']) {
    const analysis = analysePhone('185' + pattern.padStart(8, '6'));
    const reports = ['female','male','undisclosed'].map(gender => renderToStaticMarkup(React.createElement(ResultSectionV3, {analysis,age:42,gender})));
    const healthBlocks = reports.map(html => html.split('id="report-health"')[1].split('</section>')[0]);
    assert.equal(new Set(healthBlocks).size, 1);
    for (const html of reports) assert.doesNotMatch(html, /自杀|通灵|见鬼|婚外情|小三|生殖系统/);
  }
});

test('no identifiable pair produces no fabricated profile or consultation pitch', () => {
  const html = render('18500000000');
  assert.ok(html.includes('暂时没有可解读的组合'));
  assert.ok(!html.includes('href="#wechat"'));
});

test('report removes generation explanations and evidence UI without removing reading details', () => {
  for (const age of [20,30,42,57,72]) {
    const html = render('18014119334', age);
    assert.doesNotMatch(html, /按数字组合选取|年龄不代表|对应组合|对应资料|优先采用|怎么得出来的|结合你现在的年龄|report-method/);
    assert.ok(html.includes('哪些组合变了，为什么这样选'));
    for(const section of ['growth','wealth','relationship']) {
      const block=html.split(`id="report-${section}"`)[1].split('</section>')[0];
      assert.ok(block.includes('class="reading-explanation"'));
    }
    assert.ok(html.includes('不是号码测出的健康问题'));
  }
});

test('consultation uses the supplied local QR and does not pretend to submit a booking', () => {
  const html = renderToStaticMarkup(React.createElement(Home));
  assert.ok(!html.includes('案例'));
  assert.ok(html.includes('src="/wechat-jmgy27.png"'));
  assert.ok(html.includes('jmgy27</strong>'));
  assert.ok(html.includes('href="/wechat-jmgy27.png"'));
  assert.ok(html.includes('保存二维码原图'));
  assert.ok(!html.includes('暂未开放预约'));
  assert.ok(!html.includes('即将开放'));
  assert.doesNotMatch(html.split('id="wechat"')[1], /付款|费用|价格|收费/);
  assert.ok(html.includes('带着一件具体的事来聊'));
  assert.ok(!html.includes('appointment-steps'));
  assert.ok(!html.includes('notice-section'));
  assert.ok(html.includes('不上传服务器，不保存号码'));
  assert.ok(html.includes('号码只在当前浏览器分析'));
  assert.ok(!html.includes('年龄与性别只用于调整报告侧重点'));
  assert.ok(!html.includes('预约成功'));
  const qr = readFileSync(new URL('../public/wechat-jmgy27.png', import.meta.url));
  assert.equal(createHash('sha256').update(qr).digest('hex'), 'bc8c78a61fbf5ad2cba76273565c06c404b7231d56df11e86dd553f2923a5f7a');
});

test('entry keeps age and gender without a new focus step; eight-type cover retains detailed report sections', () => {
  const html = renderToStaticMarkup(React.createElement(Home));
  assert.doesNotMatch(html, /name="focus"|这次，你最想聊清楚哪件事/);
  assert.ok(html.includes('name="age"'));
  assert.ok(html.includes('name="gender"'));
  const report = render('18014119334');
  assert.ok(report.includes('class="report report-v3"'));
  for (const name of ['character','growth','wealth','relationship','health','decision']) {
    assert.equal((report.match(new RegExp('id="report-' + name + '"', 'g')) ?? []).length, 1);
  }
  assert.doesNotMatch(report, /focused-report|focus-cover|展开其他号码解读|先试的一件事|具体的小动作/);
  assert.equal((report.match(/href="#wechat"/g) ?? []).length, 1);
  assert.doesNotMatch(source, /localStorage|sessionStorage|sendBeacon\(|fetch\(/);
});

test('three-number families preserve their source order and map to the claimed two stars', () => {
  const families = modules['./triple-readings'].TRIPLE_FAMILIES;
  assert.equal(families.length, 18);
  for (const family of families) for (const pattern of family.patterns) {
    const analysis = analysePhone('185' + pattern.padStart(8, '6'));
    const matches = analysis.matches.filter(match => match.index >= 8).sort((a,b) => a.index-b.index);
    assert.equal(matches.map(match => match.key).join('>'), family.flow, pattern);
    assert.ok(SEQUENCE_RULES.some(rule => rule.pattern === pattern));
  }
  const before = analysePhone('18566666819').work;
  const after = analysePhone('18566666918').work;
  assert.ok(before.ordered.some(item=>item.supplements?.some(s=>s.pattern==='819')));
  assert.ok(after.ordered.some(item=>item.supplements?.some(s=>s.pattern==='918')));
  assert.notEqual(before.text, after.text);
});

test('whole-phone templates cannot replace the ordered groups or duplicate a modified base', () => {

  const a=analysePhone('18510027413');
  assert.equal(a.money.sequencePattern,a.composition.groups[0].raw);
  assert.notEqual(a.money.sequencePattern,'100274');
  assert.deepEqual([...a.money.ordered.map(r=>r.group.raw)],[...a.composition.groups.map(g=>g.raw)]);
  const portraits=Object.values(modules['./star-portraits'].STAR_PORTRAITS);
  assert.equal(portraits.length,8);
  for(const domain of ['work','money','relationship'])assert.equal(new Set(portraits.map(p=>p[domain].lead)).size,8);
  assert.doesNotMatch(JSON.stringify(portraits),/手术|通灵|见鬼|女人不能|必定|保证赚钱/);
});

test('ordinary social readings are not limited to romantic partners', () => {
  for (const phone of ['18529292929','18592929292','18516161616','18512121212','18511111111','18593939393']) {
    const section = render(phone).split('id="report-relationship"')[1].split('</section>')[0];
    assert.doesNotMatch(section, /夫妻|恋爱|异性缘|结婚|感情里/);
    assert.ok(!section.includes('不符合也很正常'));
  }
});

test('health questions are ordinary self-observation, independent of number and profile', () => {
  for (const gender of ['female','male','undisclosed']) {
    const html = renderToStaticMarkup(React.createElement(ResultSectionV3, { analysis: analysePhone('18014119334'), age: 40, gender }));
    const health = html.split('id="report-health"')[1].split('</section>')[0];
    assert.ok(health.includes('给自己的日常提醒'));
    assert.ok(health.includes('通用自查，不是号码测出的健康问题'));
    assert.ok(health.includes('<details'));
    assert.ok(!health.includes('想想最近的日常'));
    assert.ok(health.includes('睡得浅'));
    assert.ok(health.includes('拉肚子'));
    assert.ok(health.includes('请咨询医生'));
    assert.doesNotMatch(health, /1978|83351|资料|出处：|经常盯着手机|最近总是晚睡|nei.nih.gov|nhs.uk/);
    assert.doesNotMatch(health, /心血管|血液|妇科|肝胆|容易得病|疾病风险评分/);
    const other = render('18529292929', 65).split('id="report-health"')[1].split('</section>')[0];
    assert.equal(health, other);
  }
});

test('consultation and cover use the same selected topic without overriding ordered details', () => {

  const selected=new Set();
  for(const phone of copyRegressionPhones){
    const a=analysePhone(phone);if(!a.matches.length)continue;
    const domain=consultationDomain(a);selected.add(domain);
    const expected=renderToStaticMarkup(React.createElement('p',{className:'type-consultation-question'},React.createElement('span',{className:'consultation-recap-label'},'报告里提到的这一点'),reportReading(a,domain,30).lead));
    const block=render(phone).split('id="report-decision"')[1].split('</section>')[0];
    assert.ok(block.includes(expected),phone+' '+domain);
  }
  assert.deepEqual([...selected].sort(),['money','relationship','work']);
});

test('optional details add focused information without a payment or fear gate', () => {
  const a = analysePhone('18014119334');
  const html = render('18014119334');
  for (const [domain, section, label] of [['work','growth','展开工作解读'],['money','wealth','展开财路解读'],['relationship','relationship','展开相处细节']]) {
    const block = html.split(`id="report-${section}"`)[1].split('</section>')[0];
    const reading=reportReading(a,domain,30);
    assert.ok(block.includes(reading.lead));
    for(const paragraph of reading.paragraphs) assert.ok(block.includes(paragraph));
    if(reading.paragraphs.length) assert.ok(block.includes('class="reading-explanation"'));
    if(reading.paragraphs.length>1) assert.ok(block.includes('<summary>再说具体一点</summary>'));
    assert.doesNotMatch(block, /<details[^>]*\sopen(?:[\s=>])/);
  }
  const consultation = html.split('id="report-decision"')[1].split('</section>')[0];
  assert.ok(consultation.includes(reportReading(a,consultationDomain(a),30).lead));
  assert.ok(consultation.includes('号码看组合，细看还要结合八字'));
  assert.ok(consultation.includes('结合你的八字，这一点怎么看'));
  assert.ok(consultation.includes('加微信，结合八字细看'));
  assert.doesNotMatch(consultation, /仅剩|限时|原价|已有\d+|名额|倒计时/);
  assert.ok(!consultation.includes('<details'));
  assert.ok(!consultation.includes('先了解，再决定'));
  assert.doesNotMatch(consultation, /付款|费用|价格|收费/);
  assert.ok(html.includes('换号不保证改变现实结果'));
  assert.ok(!html.includes('下面按生活习惯给提醒'));
  assert.ok(!html.includes('你的真实经历，比这段文字更重要'));
  assert.doesNotMatch(html, /付费解锁|立即化解|隐藏疾病|马上转运/);
});
