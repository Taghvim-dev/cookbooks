import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const contract=JSON.parse(readFileSync(new URL("../contracts/operation-index.json",import.meta.url),"utf8"));
const sdk=JSON.parse(readFileSync(new URL("../SDK/contracts/operation-index.json",import.meta.url),"utf8"));
const release=JSON.parse(readFileSync(new URL("../release/SDK-SOURCE.json",import.meta.url),"utf8"));
function pythonSdkVersion(text){
 const project=text.split(/^\[project\][ \t]*$/m)[1]?.split(/^\[[^\]]+\][ \t]*$/m)[0]||"";
 return project.match(/^[ \t]*version[ \t]*=[ \t]*"([^"]+)"[ \t]*$/m)?.[1]||null;
}
test("SDK and cookbooks use one immutable public operation registry",()=>{
  assert.deepEqual(contract,sdk);
  assert.equal(contract.contractVersion,"2.1.0","Cookbook/API contract drift");
  const self=JSON.parse(readFileSync(new URL("../package.json",import.meta.url),"utf8"));
  const sdkRoot=JSON.parse(readFileSync(new URL("../SDK/package.json",import.meta.url),"utf8"));
  const sdkJs=JSON.parse(readFileSync(new URL("../SDK/javascript/package.json",import.meta.url),"utf8"));
  const sdkPython=pythonSdkVersion(readFileSync(new URL("../SDK/python/pyproject.toml",import.meta.url),"utf8"));
  for(const [name,v] of [["cookbooks",self.version],["SDK root",sdkRoot.version],["SDK JavaScript",sdkJs.version],["SDK Python",sdkPython],["SDK manifest",release.contract_version],["SDK manifest package",release.sdk_package_version]])
    assert.equal(v,contract.contractVersion,name+" must equal Taghvim 2.1.0");
  assert.equal(release.approved_for_production,false,"Source parity cannot certify production");
  assert.match(release.commit,/^[a-f0-9]{40}$/);
  const operations=new Set(contract.operations.map(o=>o.method+" "+o.path));
  for(const route of ["POST /v1/dates/convert","POST /v1/business-days/add","POST /v1/schedules/preview","GET /v1/usage"])
    assert.ok(operations.has(route));
  assert.equal(contract.operations.filter(o=>o.auth.includes("OperatorToken")).length,0);
});
test("all cookbook entrypoints use the public SDK and test keys only",()=>{
 for(const file of ["01-convert-date.mjs","02-business-days.mjs","03-schedule-preview.mjs","04-usage.mjs"]){
   const s=readFileSync(new URL("../javascript/"+file,import.meta.url),"utf8");
   assert.ok(s.includes('from "@taghvim/sdk"'),file);
   assert.ok(s.includes("TAGHVIM_TEST_API_KEY"),file);
   assert.ok(!s.includes("tgv_live_"),file);
 }
});
test("all four cookbook flows execute against mock transport (no remote calls)",async()=>{
 const previous=globalThis.fetch,oldKey=process.env.TAGHVIM_TEST_API_KEY,oldBase=process.env.TAGHVIM_API_BASE_URL;
 const sandbox="https://taghvim-api-sandbox.example.workers.dev";
 process.env.TAGHVIM_API_BASE_URL=sandbox;
 process.env.TAGHVIM_TEST_API_KEY="tgv_test_CookbookFake01234";
 const calls=[];
 globalThis.fetch=async (url,opts)=>{
   calls.push({url,opts});
   return new Response(JSON.stringify({ok:true,source:"mock-only"}),{status:200,headers:{"content-type":"application/json","Taghvim-Request-Id":"req_mock_1"}});
 };
 try {
   const names=["01-convert-date","02-business-days","03-schedule-preview","04-usage"];
   for(const name of names)await import("../javascript/"+name+".mjs");
   assert.deepEqual(calls.map(c=>new URL(c.url).pathname),[
     "/v1/dates/convert","/v1/business-days/add","/v1/schedules/preview","/v1/usage"]);
   assert.ok(calls.every(x=>x.opts.headers.authorization==="Bearer tgv_test_CookbookFake01234"));
   assert.ok(calls.every(x=>new URL(x.url).origin===sandbox), "Sandbox examples must never call production");
 } finally {globalThis.fetch=previous;if(oldKey===undefined)delete process.env.TAGHVIM_TEST_API_KEY;else process.env.TAGHVIM_TEST_API_KEY=oldKey; if(oldBase===undefined)delete process.env.TAGHVIM_API_BASE_URL;else process.env.TAGHVIM_API_BASE_URL=oldBase;}
});

test("T0 Python SDK version scanner denies deviations and ignores build tool version",()=>{
 const good="[build-system]\nrequires = [\"setuptools>=68\"]\n[project]\nname = \"taghvim-sdk\"\nversion = \"2.1.0\"\n[tool.test]\nversion = \"9.9.9\"\n";
 assert.equal(pythonSdkVersion(good),"2.1.0");
 assert.notEqual(pythonSdkVersion(good.replace('version = "2.1.0"','version = "0.1.0.dev0"')),"2.1.0");
 assert.equal(pythonSdkVersion("[build-system]\nversion = \"2.1.0\"\n"),null);
});
