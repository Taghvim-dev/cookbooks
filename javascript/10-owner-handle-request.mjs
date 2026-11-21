/** Mutating owner request, never runs without deliberate opt-in. No automatic activation. */
import {TaghvimClient} from "@taghvim/sdk";
import {randomUUID} from "node:crypto";
if(process.env.TAGHVIM_SUBMIT_HANDLE_REQUEST!=="YES_I_AM_WORKSPACE_OWNER")
 throw Error("No mutation without explicit owner opt-in: TAGHVIM_SUBMIT_HANDLE_REQUEST=YES_I_AM_WORKSPACE_OWNER");
const key=process.env.TAGHVIM_TEST_API_KEY;
if(typeof key!=="string"||!key.startsWith("tgv_test_"))throw Error("Issued test API key required");
const origin=process.env.TAGHVIM_API_BASE_URL||"https://api.taghvim.dev";
if(new URL(origin).protocol!=="https:")throw Error("HTTPS Taghvim API origin required");
const handle=process.env.TAGHVIM_HANDLE;
const calendar_id=process.env.TAGHVIM_CALENDAR_ID;
const purpose=process.env.TAGHVIM_HANDLE_PURPOSE;
if(typeof handle!=="string"||!/^@[a-z][a-z0-9_]{2,31}$/.test(handle)||typeof calendar_id!=="string"||
 !/^cal_[A-Za-z0-9_:-]{4,150}$/.test(calendar_id)||typeof purpose!=="string"||purpose.trim().length<12)
 throw Error("Valid Handle, owned published Calendar ID and purpose required");
const client=new TaghvimClient({apiKey:key,baseUrl:origin,mode:"test"});
const options={idempotencyKey:"handle-request-"+randomUUID()};
if(process.env.TAGHVIM_WORKSPACE_ID)options.workspaceId=process.env.TAGHVIM_WORKSPACE_ID;
const {data,requestId}=await client.requestHandle({handle,kind:"calendar",calendar_id,purpose},options);
if(data.status!=="pending"||data.approval!=="platform_superadmin_required")
 throw Error("Handle request must remain approval gated");
console.log(JSON.stringify({status:data.status,request_id:data.request_id,requestId,
 approval:data.approval,activated:false}));
