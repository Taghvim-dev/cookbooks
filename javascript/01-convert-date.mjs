import {createTestClient} from "@taghvim/sdk";
const client=createTestClient({apiKey:process.env.TAGHVIM_TEST_API_KEY});
const {data,requestId}=await client.convertDate({date:"1405-07-15"});
console.log({data,requestId});
