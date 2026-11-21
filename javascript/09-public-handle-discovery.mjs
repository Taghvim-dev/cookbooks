/** Real public Handle search, no token, no fake public events, no mutation. */
import {TaghvimClient} from "@taghvim/sdk";
const origin=process.env.TAGHVIM_API_BASE_URL||"https://api.taghvim.dev";
const endpoint=new URL(origin);
if(endpoint.protocol!=="https:"||endpoint.search||endpoint.hash||endpoint.username||endpoint.password)
 throw Error("HTTPS Taghvim API origin required");
const query=(process.env.TAGHVIM_PUBLIC_HANDLE_QUERY||"music").slice(0,160);
const client=new TaghvimClient({baseUrl:origin,mode:"test"});
const {data,requestId}=await client.discoverHandles({q:query,limit:10});
if(!data||!Array.isArray(data.data)||!Number.isSafeInteger(data.count))throw Error("Invalid published Handle discovery contract");
const handles=data.data.map(x=>({handle:x.handle,calendar_id:x.calendar_id,labels:x.labels,tags:x.tags}));
console.log(JSON.stringify({status:"public_published_only",request_id:requestId,count:data.count,handles}));
