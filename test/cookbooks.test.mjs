import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
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
  assert.equal(release.commit,"d5bda0b72687fc1c5feb2f34e27ba852d27aeaab","Cookbook SDK SHA must match latest protected source");
  const operations=new Set(contract.operations.map(o=>o.method+" "+o.path));
  for(const route of ["POST /v1/dates/convert","POST /v1/business-days/add","POST /v1/schedules/preview","GET /v1/usage"])
    assert.ok(operations.has(route));
  assert.equal(contract.operations.filter(o=>o.auth.includes("OperatorToken")).length,0);
});
test("all cookbook entrypoints use the public SDK and test keys only",()=>{
 for(const file of ["01-convert-date.mjs","02-business-days.mjs","03-schedule-preview.mjs","04-usage.mjs","05-api-backed-widget.mjs","06-reconcile-dates.mjs"]){
   const s=readFileSync(new URL("../javascript/"+file,import.meta.url),"utf8");
   assert.ok(s.includes('from "@taghvim/sdk"'),file);
   assert.ok(s.includes("TAGHVIM_TEST_API_KEY"),file);
   assert.ok(!s.includes("tgv_live_"),file);
 }
});
test("all six cookbook flows execute against mocked transport (not proof of live API)",async()=>{
 const previous=globalThis.fetch,oldKey=process.env.TAGHVIM_TEST_API_KEY,oldBase=process.env.TAGHVIM_API_BASE_URL;
 const sandbox="https://taghvim-api-sandbox.example.workers.dev";
 process.env.TAGHVIM_API_BASE_URL=sandbox;
 process.env.TAGHVIM_TEST_API_KEY="tgv_test_CookbookFake01234";
 const calls=[];
 globalThis.fetch=async (url,opts)=>{
   calls.push({url,opts});
   return new Response(JSON.stringify({ok:true,source:"mock-only",date:{iso:"2026-10-07",weekday:3,business_day:true,predicted_holiday:false,holidays:[]},calendar_data_version:"fixture-v1"}),{status:200,headers:{"content-type":"application/json","Taghvim-Request-Id":"req_mock_1"}});
 };
 try {
   const names=["01-convert-date","02-business-days","03-schedule-preview","04-usage","05-api-backed-widget","06-reconcile-dates"];
   for(const name of names)await import("../javascript/"+name+".mjs");
   assert.deepEqual(calls.map(c=>new URL(c.url).pathname),[
     "/v1/dates/convert","/v1/business-days/add","/v1/schedules/preview","/v1/usage","/v1/business-days/add","/v1/dates/convert","/v1/dates/convert"]);
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

test("widget cookbook uses canonical SDK subpath and never embeds a real key",()=>{
 const s=readFileSync(new URL("../javascript/05-api-backed-widget.mjs",import.meta.url),"utf8");
 assert.ok(s.includes('from "@taghvim/sdk/widgets"'));
 assert.ok(s.includes('invokeWidget(client,"deadline-calculator"'));
 assert.doesNotMatch(s,/tgv_(test|live)_[A-Za-z0-9_-]+/);
 const py=readFileSync(new URL("../python/widget_deadline.py",import.meta.url),"utf8");
 assert.match(py,/from taghvim_sdk.widgets import invoke_widget/);
 assert.match(py,/TAGHVIM_TEST_API_KEY/);
});

// Regression for merged PR #12 P2: an environment variable's name is not
// proof of a scoped test key. Execute the real recipe with a fake SDK so
// validation is proven to happen before any client/network construction.
test("Python widget cookbook rejects live keys before client construction",()=>{
 const probe=`import os, runpy, sys, types
class ForbiddenClient:
 def __init__(self, *args, **kwargs):
  raise AssertionError("SDK client was constructed before rejecting live key")
sdk = types.ModuleType("taghvim_sdk")
sdk.TaghvimClient = ForbiddenClient
widgets = types.ModuleType("taghvim_sdk.widgets")
widgets.invoke_widget = lambda *args, **kwargs: None
sys.modules["taghvim_sdk"] = sdk
sys.modules["taghvim_sdk.widgets"] = widgets
try:
 runpy.run_path("python/widget_deadline.py", run_name="__main__")
except ValueError as error:
 assert "test API key" in str(error), str(error)
else:
 raise AssertionError("Widget recipe accepted a non-test API key")`;
 const run=spawnSync("python",["-c",probe],{
   cwd:new URL("..",import.meta.url),encoding:"utf8",
   env:{...process.env,TAGHVIM_TEST_API_KEY:"tgv_live_FORBIDDEN",TAGHVIM_API_BASE_URL:"https://api.taghvim.dev"}
 });
 assert.equal(run.status,0,run.stderr||run.stdout);
 const source=readFileSync(new URL("../python/widget_deadline.py",import.meta.url),"utf8");
 assert.ok(source.indexOf('startswith("tgv_test_")')<source.indexOf("client = TaghvimClient("),
   "Python widget key guard must run before client creation");
});

test("Python Reconciliation cookbook uses real SDK, two canonical API operations and test key only",()=>{
 const s=readFileSync(new URL("../python/reconcile_dates.py",import.meta.url),"utf8");
 assert.match(s,/from taghvim_sdk\.widgets import invoke_widget/);
 assert.match(s,/invoke_widget\(client, "date-reconciliation"/);
 assert.match(s,/TAGHVIM_TEST_API_KEY/);
 assert.ok(s.indexOf('startswith("tgv_test_")') < s.indexOf("client = TaghvimClient("),
  "Reject a live key before any API client is built");
 assert.doesNotMatch(s,/tgv_live_[A-Za-z0-9_-]+/);
});
