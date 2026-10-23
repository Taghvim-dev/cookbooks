/** Server-side widget recipe. The browser calls a verified same-origin gateway instead. */
import {createTestClient} from "@taghvim/sdk";
import {invokeWidget} from "@taghvim/sdk/widgets";

const client=createTestClient({
  apiKey:process.env.TAGHVIM_TEST_API_KEY,
  ...(process.env.TAGHVIM_API_BASE_URL?{baseUrl:process.env.TAGHVIM_API_BASE_URL}:{})
});
const {data,requestId,rateLimit}=await invokeWidget(client,"deadline-calculator",{
  date:"1405-07-15",days:3
});
console.log({date:data?.result?.jalali,requestId,rateLimit});
// This cannot create bookings or availability slots until Engine publishes
// and independently verifies the relevant canonical API endpoints.
