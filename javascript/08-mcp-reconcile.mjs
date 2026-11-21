/**
 * MCP 2026-07-28: actual SDK -> same tenant-scoped Cloudflare API Gateway.
 * Read-only semantic reconciliation is a POST with no business mutation.
 * The API key is supplied by the runtime, never logged or placed in a prompt.
 */
import {createTestClient} from "@taghvim/sdk";
import {createTaghvimMcpBridge,MCP_VERSION} from "@taghvim/sdk/mcp";
if(!/^tgv_test_[A-Za-z0-9_-]+$/.test(process.env.TAGHVIM_TEST_API_KEY||""))
 throw Error("An issued test API key is required");
const client=createTestClient({
 apiKey:process.env.TAGHVIM_TEST_API_KEY,
 ...(process.env.TAGHVIM_API_BASE_URL?{baseUrl:process.env.TAGHVIM_API_BASE_URL}:{})
});
const bridge=createTaghvimMcpBridge({client});
const response=await bridge.handle({
 jsonrpc:"2.0",id:1,method:"tools/call",params:{
  _meta:{
   "io.modelcontextprotocol/protocolVersion":MCP_VERSION,
   "io.modelcontextprotocol/clientInfo":{name:"cookbook-mcp",version:"2.1.0"},
   "io.modelcontextprotocol/clientCapabilities":{}
  },
  name:"taghvim_reconcileDates",
  arguments:{body:{
   left:{date:"1405-07-15",calendar_system:"jalali"},
   right:{date:"2026-10-07",calendar_system:"gregorian"}
  }}
 }
});
if(response?.result?.isError!==false)
 throw Error("Governed MCP operation was rejected");
const payload=JSON.parse(response.result.content?.[0]?.text||"null");
if(payload?.status!==200||payload.data?.status!=="equivalent"||
 payload.data?.day_delta!==0||payload.data?.evidence?.operation!=="POST /v1/dates/reconcile"||
 payload.data?.evidence?.request_ids?.length!==1)
 throw Error("MCP reconciliation was not verified by the real Taghvim Gateway");
console.log({operation:"reconcileDates",status:payload.data.status,
 day_delta:payload.data.day_delta,request_id:payload.request_id});
