#!/usr/bin/env node
"use strict";
// Offline submission preflight for IBE160. This is NOT part of app startup.
// The default audit checks real repository documents and reports blockers.
// --strict additionally requires explicit human/Canvas/target confirmations.
// Never store student IDs or Canvas credentials in this repository.
const fs=require("node:fs");
const path=require("node:path");
const {execFileSync}=require("node:child_process");
const root=path.resolve(__dirname,"..");
const strict=process.argv.includes("--strict");
const required=[
  "README.md","package.json","docs/bmad/PRD.md",
  "docs/ai/SENSOR-KJERNEFLYT-E2E-2026-11-20.md",
  "docs/ai/TESTBEVIS-OG-DEKNING-2026-11-18.md",
  "docs/REFLEKSJONSRAPPORT-MAL-TILPASSET-SOLO.md",
  "docs/ai/MOBIL-PRINT-REFLEKSJON-2026-11-20.md",
  "docs/ai/SUPABASE-LOCAL-AUTH-E2E-2026-11-20.md",
  "tests/test-sensor-journey-browser.cjs",
  "tests/test-mobile-print-browser.cjs",
  "tests/test-supabase-local-auth-e2e.cjs",
  ".github/workflows/quality-gate.yml"
];
const read=file=>fs.readFileSync(path.join(root,file),"utf8");
const checks=[],blockers=[];
function check(condition,label){checks.push({ok:!!condition,label});if(!condition)blockers.push(label);}
// Human approvals are expected to be absent on a draft, not broken artifacts.
function approval(condition,label){checks.push({ok:!!condition,label});}
function git(...args){
  try{return execFileSync("git",args,{cwd:root,encoding:"utf8",stdio:["ignore","pipe","ignore"]}).trim();}
  catch{return "not-a-git-checkout";}
}
for(const file of required)check(fs.existsSync(path.join(root,file)),"Required artifact: "+file);
if(blockers.length){console.error("Structural files missing: "+blockers.join("; "));process.exitCode=1;}
else{
  const prd=read("docs/bmad/PRD.md");
  const matrix=read("docs/ai/SENSOR-KJERNEFLYT-E2E-2026-11-20.md");
  const readme=read("README.md");
  const pkg=JSON.parse(read("package.json"));
  const report=read("docs/REFLEKSJONSRAPPORT-MAL-TILPASSET-SOLO.md");
  const ids=[...prd.matchAll(/^## ((?:FR|AI|NFR)-[A-Z0-9-]+)\s*[–-]/gm)].map(x=>x[1]);
  const matrixIds=[...matrix.matchAll(/^\| ((?:FR|AI|NFR)-[A-Z0-9-]+)\s*[–-]/gm)].map(x=>x[1]);
  check(ids.length===36&&new Set(ids).size===36,"PRD has exactly 36 unique requirement headings");
  check(matrixIds.length===36&&new Set(matrixIds).size===36,
    "Sensor matrix has 36 unique requirement rows");
  check(ids.length===matrixIds.length&&ids.every(x=>matrixIds.includes(x)),
    "Every canonical PRD requirement appears in the sensor matrix");
  check(/"demo":\s*"node scripts\/sensor-demo\.js"/.test(JSON.stringify(pkg.scripts)),
    "The documented offline demo exists in package scripts");
  check(readme.includes("npm run demo")&&readme.includes("npm test"),
    "README documents both offline demo and automated tests");
  check(readme.includes("DOKUMENTASJON-SJEKKLISTE.md"),
    "README links to current documentation checklist");
  check(readme.includes("REFLEKSJONSRAPPORT-MAL-TILPASSET-SOLO.md"),
    "README links to the school-template reflection report");
  check(readme.includes("SUPABASE-LOCAL-AUTH-E2E-2026-11-20.md"),
    "README cites actual LOCAL Supabase evidence");
  check(readme.includes("MOBIL-PRINT-REFLEKSJON-2026-11-20.md"),
    "README cites mobile/print evidence");
  check(report.includes("**Student:** [Fyll inn navn/studentnummer for endelig levering]"),
    "Public repository retains private student number as a placeholder");
  check(/arbeidsutkast/i.test(report)&&/(ikke innlevert|ingen påstand om innlevering)/i.test(report),
    "Reflection draft is not falsely labeled submitted");
  const words=report.trim().split(/\s+/).length;
  const gitSha=git("rev-parse","HEAD");
  const branch=process.env.GITHUB_HEAD_REF||git("branch","--show-current")||"(detached HEAD)";
  console.log("IBE160 SUBMISSION PREFLIGHT");
  console.log("Repository: IBE160-2026/G46-nilsen");
  console.log("Checked out branch: "+branch+"; HEAD: "+gitSha);
  console.log("Requirements: "+ids.length+" PRD headings, "+matrixIds.length+" matrix rows.");
  console.log("Reflection working draft: approximately "+words+" whitespace-separated words (not a Canvas word-limit claim).");
  checks.forEach(x=>console.log((x.ok?"PASS  ":"FAIL  ")+x.label));
  if(strict){
    const target=(process.env.SUBMISSION_TARGET_COMMIT||"").trim();
    const canvas=process.env.SUBMISSION_CANVAS_CONFIRMED==="1";
    const reflection=process.env.SUBMISSION_REFLECTION_APPROVED==="1";
    const submissionBranch=(process.env.SUBMISSION_BRANCH_APPROVED||"").trim();
    approval(canvas,"Human confirmed official Canvas deadline, word limit, format and rubric");
    approval(reflection,"Student reviewed and approved reflection text for submission");
    approval(/^[0-9a-f]{40}$/i.test(target)&&target===gitSha,
      "Human-chosen submission commit matches checked-out Git HEAD");
    approval(Boolean(submissionBranch)&&submissionBranch===branch,
      "Human-approved branch equals the checked-out branch");
    if(!checks.at(-4).ok||!checks.at(-3).ok||!checks.at(-2).ok||!checks.at(-1).ok){
      console.error("Strict submission sign-off blocked; official Canvas criteria and human decisions remain mandatory.");
    }
  }else{
    console.log("STATUS: TECHNICAL PREFLIGHT ONLY. Canvas rules, student approval and delivery branch are NOT signed off.");
    console.log("Run npm run audit:submission -- --strict only AFTER explicit human sign-off.");
  }
}
if(blockers.length){console.error("Preflight FAILED: "+blockers.join("; "));process.exitCode=1;}
else if(checks.some(x=>!x.ok)){
  console.error("Preflight NOT READY: "+checks.filter(x=>!x.ok).map(x=>x.label).join("; "));
  process.exitCode=2;
}
else if(strict)console.log("STRICT SUBMISSION CHECKS PASSED. This is not an automatic merge or Canvas submission.");
