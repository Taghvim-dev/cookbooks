import {createTestClient} from "@taghvim/sdk";
const client=createTestClient({apiKey:process.env.TAGHVIM_TEST_API_KEY});
const {data,requestId}=await client.addBusinessDays({date:"1405-07-15",days:3});
console.log({data,requestId});
