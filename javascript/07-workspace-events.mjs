/**
 * Taghvim.dev canonical Workspace/Event SDK integration — test only.
 * No paid customer operation, no raw token in browser or printed response.
 * Create a private calendar and one private event using the same API.
 * Publication/notifications are never enabled without explicit user approval.
 */
import {TaghvimClient} from "@taghvim/sdk";
import {randomUUID} from "node:crypto";
const key=process.env.TAGHVIM_TEST_API_KEY;
if(typeof key!=="string"||!key.startsWith("tgv_test_"))throw Error("Use a 30-day test API key");
const origin=process.env.TAGHVIM_API_BASE_URL||"https://api.taghvim.dev";
if(!origin.startsWith("https://"))throw Error("HTTPS Taghvim API endpoint required");
const client=new TaghvimClient({apiKey:key,baseUrl:origin,mode:"test"});
const current=(await client.getCurrentWorkspace()).data;
const id="cal_demo_"+randomUUID().replace(/-/g,"");
const graph={version:1,tenant_id:current.tenant_id,workspace_id:current.id,
 namespace:current.namespace,calendar_id:id,status:"draft",visibility:"private",
 policy_refs:["urn:taghvim:policy:private-demo"],
 sector_pack:{id:"general",version:"1.0.0",schema_refs:["urn:taghvim:calendar"],policy_refs:["urn:taghvim:policy:private-demo"]},
 entities:[{id,kind:"calendar",namespace:current.namespace,status:"active",visibility:"private",
 labels:{fa:"نمونهٔ خصوصی"}}],relationships:[],occurrences:[]};
await client.createCalendar(graph,{idempotencyKey:"demo-calendar-"+randomUUID()});
const eventId="event_"+randomUUID().replace(/-/g,"");
await client.createCalendarEvent(id,{
 expected_version:1,
 entity:{id:eventId,kind:"event",namespace:current.namespace,status:"active",visibility:"private",
 labels:{fa:"رویداد خصوصی نمونه"}},
 occurrences:[{id:"occ_"+randomUUID().replace(/-/g,""),event_id:eventId,
 starts_at:"2026-12-10T10:00:00.000Z",ends_at:"2026-12-10T11:00:00.000Z",
 timezone:"Asia/Tehran",calendar_system:"jalali",temporal_policy_ref:"urn:taghvim:policy:private-demo"}]
},{idempotencyKey:"demo-event-"+randomUUID()});
const output=(await client.listCalendarEvents(id)).data;
if(output.count!==1)throw Error("Canonical event readback failed");
console.log(JSON.stringify({status:"private_draft_created",event_count:output.count,
 public_publish:false,request_api:"Taghvim v2.1.0"}));
