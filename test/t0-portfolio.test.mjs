import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>JSON.parse(readFileSync(new URL(path,import.meta.url),"utf8"));
test("T0 portfolio cookbook is tied to the exact reviewed SDK 67-op cohort, never approved GA",()=>{
 const pinned=read("../release/SDK-SOURCE.json");
 const index=read("../contracts/operation-index.json");
 assert.match(pinned.commit,/^[a-f0-9]{40}$/,"SDK provenance must be a full immutable SHA");
 assert.equal(pinned.repository,"Taghvim-dev/SDK");
 assert.equal(pinned.contract_version,index.contractVersion,"SDK pin must track canonical contract");
 assert.equal(pinned.approved_for_production,false);
 assert.equal(index.openApiGitBlobSHA,"c7d29e88cba281b34c2dbf171c5edda5120fa57b");
 assert.equal(index.operations.length,69);
 for(const [id,method,path,auth] of [
  ["listFinanceCountries","GET","/v1/finance/countries",[]],
  ["getFinanceBusinessDayQuote","POST","/v1/finance/business-days/quote",["ApiKey"]]
 ])assert.deepEqual(index.operations.filter(o=>o.operationId===id),[{method,path,operationId:id,auth}]);
 assert.equal(index.operations.filter(x=>x.operationId==="listCalendarPortfolio"&&x.auth.join()==="ApiKey").length,1);
 const source=readFileSync(new URL("../javascript/11-institutional-portfolio.mjs",import.meta.url),"utf8");
 assert.ok(source.includes('from "@taghvim/sdk"'));
 assert.ok(source.includes("client.listCalendarPortfolio("));
 assert.ok(source.includes("TAGHVIM_TEST_API_KEY"));
 assert.ok(source.includes("TAGHVIM_WORKSPACE_ID"));
 assert.doesNotMatch(source,/\btgv_live_/);
 assert.doesNotMatch(source,/\bcreateWorkspace\(|\bcreateCalendar\(|\bpublishCalendar\(/);
});
