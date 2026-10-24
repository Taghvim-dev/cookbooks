"""Calendar-day reconciliation; API keys never enter browser code or files."""
import os
from taghvim_sdk import TaghvimClient
from taghvim_sdk.widgets import invoke_widget

api_key = os.environ["TAGHVIM_TEST_API_KEY"]
if not api_key.startswith("tgv_test_"):
    raise ValueError("Only an explicitly issued test API key is accepted")

client = TaghvimClient(
    api_key=api_key,
    base_url=os.environ.get("TAGHVIM_API_BASE_URL", "https://api.taghvim.dev"),
)
result = invoke_widget(client, "date-reconciliation", {
    "left": {"date": "1405-07-15", "calendar_system": "jalali"},
    "right": {"date": "2026-10-07", "calendar_system": "gregorian"},
})
if (result["data"]["status"] != "equivalent" or
    result["data"]["evidence"]["operation"] != "POST /v1/dates/reconcile" or
    len(result["data"]["evidence"]["request_ids"]) != 1 or
    result["data"]["evidence"]["meter_units"] != 2):
    raise RuntimeError("Native calendar reconciliation contract mismatch")
print(result["data"]["status"], result["data"]["evidence"]["request_ids"])
