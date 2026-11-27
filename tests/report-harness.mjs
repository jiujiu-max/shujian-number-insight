import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Exercise the actual page's analyser and renderer without exposing debug APIs
// or transmitting any of these synthetic/example inputs to a server.
const source = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source + '\nexport { analysePhone, ResultSectionV3, SEQUENCE_RULES, PAIR_VOICES, PAIR_LOOKUP, AGE_STAGE_CONTEXTS, getAgeStageContext, buildCharacterProfile, reportReading, reportSupplement, reportSupplements, consultationDomain };', {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
}).outputText;
const combinationSource = readFileSync(new URL('../app/combination-readings.ts', import.meta.url), 'utf8');
const combinationSandbox = { exports: {} };
vm.runInNewContext(ts.transpileModule(combinationSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, combinationSandbox);
const { COMBINATION_READINGS } = combinationSandbox.exports;
const nodeRequire = createRequire(import.meta.url);
const modules = { './combination-readings': combinationSandbox.exports };
for (const name of ['star-portraits', 'triple-readings', 'age-contexts', 'pair-character-extra', 'character-readings', 'number-composition', 'course-modifiers', 'composition-readings', 'report-focus', 'report-scenes', 'report-explanations', 'report-conversation', 'pair-detail-extra', 'pair-money-modifiers', 'report-personal', 'report-transition-detail', 'report-relationship', 'report-detail', 'eight-types', 'type-share', 'type-report']) {
  const module = { exports: {}, require: id => modules[id] ?? nodeRequire(id) };
  const text = readFileSync(new URL('../app/' + name + (name === 'type-report' ? '.tsx' : '.ts'), import.meta.url), 'utf8');
  vm.runInNewContext(ts.transpileModule(text, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, module);
  modules['./' + name] = module.exports;
}
const sandbox = { exports: {}, require: (id) => modules[id] ?? nodeRequire(id) };
vm.runInNewContext(compiled, sandbox);
const { analysePhone, ResultSectionV3, SEQUENCE_RULES, PAIR_VOICES, PAIR_LOOKUP, AGE_STAGE_CONTEXTS, getAgeStageContext, buildCharacterProfile, reportReading, reportSupplement, reportSupplements, consultationDomain, default: Home } = sandbox.exports;
const { parseNumberComposition, classifyNumberGroup } = modules['./number-composition'];
const { compositionReading } = modules['./composition-readings'];
const { EIGHT_TYPES, buildTypeRadar, makeTypeShareData, radarPoints, SITE_URL } = modules['./eight-types'];
const render = (phone, age = 30) => renderToStaticMarkup(React.createElement(ResultSectionV3, {
  analysis: analysePhone(phone), age, gender: 'undisclosed',
}));

const copyRegressionPhones = [...new Set([
  ...SEQUENCE_RULES.map(rule => '185' + rule.pattern.padStart(8,'6')),
  ...Object.keys(PAIR_VOICES).map(pair => '185' + pair.repeat(4)),
  '15700101008','18014119334','18520283007','18500000000',
])].sort();


export { analysePhone, ResultSectionV3, SEQUENCE_RULES, PAIR_VOICES, PAIR_LOOKUP, AGE_STAGE_CONTEXTS, getAgeStageContext, buildCharacterProfile, reportReading, reportSupplement, reportSupplements, consultationDomain, Home, parseNumberComposition, classifyNumberGroup, compositionReading, EIGHT_TYPES, buildTypeRadar, makeTypeShareData, radarPoints, SITE_URL, render, copyRegressionPhones, modules, COMBINATION_READINGS, source };

