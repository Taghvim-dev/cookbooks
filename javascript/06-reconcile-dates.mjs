/** Canonical API-backed calendar-day reconciliation, not a local conversion guess. */
import {createTestClient} from "@taghvim/sdk";
const client=createTestClient({
 apiKey:process.env.TAGHVIM_TEST_API_KEY,
 ...(process.env.TAGHVIM_API_BASE_URL?{baseUrl:process.env.TAGHVIM_API_BASE_URL}:{})
});
const {data,requestId}=await client.reconcileDates({
 left:{date:"1405-07-15",calendar_system:"jalali"},
 right:{date:"2026-10-07",calendar_system:"gregorian"}
});
if(data.status!=="equivalent"||data.day_delta!==0||data.evidence.request_ids.length!==1||data.evidence.operation!=="POST /v1/dates/reconcile"||data.evidence.meter_units!==2)
 throw new Error("Calendar reconciliation disagrees with canonical API");
console.log({status:data.status,day_delta:data.day_delta,requestId,
 calendar_data_versions:data.evidence.calendar_data_versions});
