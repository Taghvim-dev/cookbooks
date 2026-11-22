import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>JSON.parse(readFileSync(new URL(path,import.meta.url),"utf8"));
test("T0 portfolio cookbook is tied to the exact reviewed SDK 67-op cohort, never approved GA",()=>{
 const pinned=read("../release/SDK-SOURCE.json");
 const index=read("../contracts/operation-index.json");
 assert.equal(pinned.commit,"6e2a8fd68ff57b33156e1336328ac7b36df8b1ab");
 assert.equal(pinned.approved_for_production,false);
 assert.equal(index.openApiGitBlobSHA,"46146dbcec18eadad579dcac50afbf86d15d3276");
 assert.equal(index.operations.filter(x=>x.operationId==="listCalendarPortfolio"&&x.auth.join()==="ApiKey").length,1);
 const source=readFileSync(new URL("../javascript/11-institutional-portfolio.mjs",import.meta.url),"utf8");
 assert.ok(source.includes('from "@taghvim/sdk"'));
 assert.ok(source.includes("client.listCalendarPortfolio("));
 assert.ok(source.includes("TAGHVIM_TEST_API_KEY"));
 assert.ok(source.includes("TAGHVIM_WORKSPACE_ID"));
 assert.doesNotMatch(source,/\btgv_live_/);
 assert.doesNotMatch(source,/\bcreateWorkspace\(|\bcreateCalendar\(|\bpublishCalendar\(/);
});
