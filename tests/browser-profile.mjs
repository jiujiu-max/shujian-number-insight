// Local-only browser QA. Run while the development server is on localhost:3000.
// These test inputs are never sent to the hosted site.
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const runtimeRequire = createRequire(process.env.PLAYWRIGHT_RUNTIME ?? '/Users/nc/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const { chromium } = runtimeRequire('playwright');
const browser = await chromium.launch({headless:true,channel:'chrome'});
try {
  const page = await browser.newPage({viewport:{width:390,height:844}});
  const errors=[], leaks=[];
  const phones=['18520283007','18027933122','18318002959','18318002957'];
  page.on('pageerror', e=>errors.push(e.message));
  page.on('request', r=>{ if(phones.some(p=>(r.url()+(r.postData()??'')).includes(p))) leaks.push(r.url()); });
  const response=await page.goto('http://localhost:3000/',{waitUntil:'networkidle'});
  assert.equal(response.status(),200);
  await page.locator('#age').fill('30');
  await page.locator('[name="gender"][value="undisclosed"]').check();
  await page.locator('.consent-row input').check();
  const submit=page.locator('button[type="submit"]');
  const report=page.locator('.report-v3');
  const generate=async(phone,age=30)=>{
    await page.locator('#phone').fill(phone);
    await page.locator('#age').fill(String(age));
    await submit.click();
    await report.waitFor();
    await page.waitForTimeout(100);
  };
  const reports=[];
  for(const [index,phone] of phones.entries()) {
    await generate(phone);
    reports.push(await page.locator('.character-split').innerText());
    assert.equal(await report.locator('a[href="#wechat"]').count(),1);
    await page.locator('#report-character').screenshot({path:'/private/tmp/number-profile-'+index+'.png'});
  }
  assert.notEqual(reports[0],reports[1]);
  assert.ok(reports[0].includes('当面先答应'));
  assert.ok(reports[1].includes('热心，别人有事'));
  assert.notEqual(reports[2],reports[3]);
  assert.ok(reports[2].includes('很在意别人怎么看你'));
  assert.ok(reports[3].includes('改主意也快'));
  const domainSnapshots=[];
  for(const phone of phones.slice(2)) {
    await generate(phone);
    const blocks=[];
    for(const id of ['growth','wealth','relationship']) {
      await page.locator(`#report-${id} summary`).click();
      blocks.push(await page.locator(`#report-${id}`).innerText());
    }
    domainSnapshots.push(blocks);
    await page.locator('#report-growth').screenshot({path:'/private/tmp/number-composition-'+phone.slice(-2)+'.png'});
  }
  for(let i=0;i<3;i++) assert.notEqual(domainSnapshots[0][i],domainSnapshots[1][i]);

  // Incomplete new input must clear the previous result immediately.
  await page.locator('#phone').fill('1802793122');
  assert.equal(await report.count(),0);
  await submit.click();
  assert.ok((await page.locator('#phone-error').innerText()).includes('11 位'));
  await page.waitForTimeout(800);
  assert.equal(await report.count(),0);

  // Editing a submitted input during the artificial loading delay must not
  // allow its old callback to repopulate a stale report or scroll the page.
  await page.locator('#phone').fill(phones[0]);
  await submit.click();
  await page.locator('#phone').fill(phones[1]);
  await page.waitForTimeout(850);
  assert.equal(await report.count(),0);
  await submit.click();
  await report.waitFor();
  assert.ok((await page.locator('.report-topline').innerText()).includes('3122'));
  await page.locator('#age').fill('42');
  assert.equal(await report.count(),0);
  await submit.click(); await report.waitFor();
  await page.locator('[name="gender"][value="female"]').check();
  assert.equal(await report.count(),0);
  await submit.click(); await report.waitFor();
  await page.locator('.consent-row input').uncheck();
  assert.equal(await report.count(),0);
  await submit.click();
  assert.ok((await page.locator('#phone-error').innerText()).includes('确认号码属于本人'));
  await page.locator('.consent-row input').check();

  // Same input is stable, age changes settings, not the number's matching.
  for(const phone of phones) {
    const ages=[];
    for(const age of [20,30,42,57,72]) {
      await generate(phone,age);
      ages.push(await page.locator('#report-growth').innerText());
    }
    assert.equal(new Set(ages).size,5);
  }
  await generate(phones[0]);
  const stable=await page.locator('.character-split').innerText();
  await submit.click(); await report.waitFor();
  assert.equal(await page.locator('.character-split').innerText(),stable);
  for(const width of [320,390,768,1280]) {
    await page.setViewportSize({width,height:844});
    const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,view:innerWidth}));
    assert.ok(sizes.scroll<=sizes.view,'overflow at '+width);
    if(width===1280) await page.locator('#report-character').screenshot({path:'/private/tmp/number-profile-desktop.png'});
  }
  await page.locator('#report-growth summary').click();
  assert.equal(await page.locator('#report-growth details').getAttribute('open'),'');
  await report.locator('a[href="#wechat"]').click();
  assert.equal(new URL(page.url()).hash,'#wechat');
  assert.ok(await page.locator('.consultation-qr img').evaluate(img=>img.complete&&img.naturalWidth===1080));
  assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);
  await page.reload({waitUntil:'networkidle'});
  assert.equal(await report.count(),0);
  assert.equal(await page.locator('#phone').inputValue(),'');
  assert.deepEqual(errors,[]);
  assert.deepEqual(leaks,[]);
  console.log('PASS: distinct profiles, invalid input clears report, cancelled pending generation, age/gender/consent invalidation, 5 ages, responsive layout, QR, no phone requests/storage.');
} finally { await browser.close(); }
