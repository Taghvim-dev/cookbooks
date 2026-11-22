/** Governed read-only institutional portfolio: only explicit grants, no inherited authority. */
import {TaghvimClient} from "@taghvim/sdk";
const key=process.env.TAGHVIM_TEST_API_KEY;
if(typeof key!=="string"||!key.startsWith("tgv_test_"))throw Error("Issued test key required");
const origin=process.env.TAGHVIM_API_BASE_URL||"https://api.taghvim.dev";
if(new URL(origin).protocol!=="https:")throw Error("HTTPS Taghvim API required");
const scope=process.env.TAGHVIM_PORTFOLIO_SCOPE||"granted";
if(!["granted","selected"].includes(scope))throw Error("Invalid portfolio scope");
const sector_pack=process.env.TAGHVIM_SECTOR_PACK||undefined;
if(sector_pack&&!/^[a-z][a-z0-9_.-]{2,128}$/.test(sector_pack))throw Error("Invalid sector pack");
const q=process.env.TAGHVIM_SEARCH_Q||"";
if(q.length>120)throw Error("Search query too long");
const workspaceId=process.env.TAGHVIM_WORKSPACE_ID||undefined;
const client=new TaghvimClient({apiKey:key,baseUrl:origin,mode:"test"});
const {data,requestId}=await client.listCalendarPortfolio({scope,sector_pack,q,limit:20},{workspaceId});
console.log(JSON.stringify({requestId,scope:data.scope,count:data.count,
 calendars:(data.data||[]).map(x=>({calendar_id:x.calendar_id,workspace_id:x.workspace_id,
 title:x.title,status:x.status,sector_pack:x.sector_pack,tags:x.tags}))}));
