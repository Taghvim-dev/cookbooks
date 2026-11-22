/** Real public Finance SDK cookbook: calculations only, no transfer or bank-grade assertion. */
import {TaghvimClient} from "@taghvim/sdk";
const key=process.env.TAGHVIM_TEST_API_KEY;
if(!key)throw Error("A separately issued test API key is required");
const client=new TaghvimClient({apiKey:key,mode:"test"});
const quote=await client.quoteFinanceBusinessDay({
 markets:["GB-EW"],date:"2026-12-24",offset_business_days:1,convention:"following"
});
if(quote.data.financial_decision_allowed!==false||quote.data.certified_for_financial_settlement!==false)
 throw Error("T0_FINANCE_PREVIEW_NONCERTIFIED_INVARIANT");
console.log(JSON.stringify({status:quote.data.status,business_date:quote.data.business_date,
 financial_decision_allowed:false,source_version:quote.data.pack_version,
 request_id:quote.requestId}));
