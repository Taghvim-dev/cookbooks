"""Server-side widget recipe; never embed a Taghvim test key in HTML."""
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
result = invoke_widget(client, "deadline-calculator", {"date": "1405-07-15", "days": 3})
print(result.get("result", {}).get("jalali"))
