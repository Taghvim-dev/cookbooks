import {createTestClient} from "@taghvim/sdk";
const client=createTestClient({apiKey:process.env.TAGHVIM_TEST_API_KEY, ...(process.env.TAGHVIM_API_BASE_URL?{baseUrl:process.env.TAGHVIM_API_BASE_URL}:{})});
const {data,requestId}=await client.schedulePreview({rule:"last-business",from:"1405-07-01",count:6});
console.log({data,requestId});
