"""Convert a date using the Apache-2.0 Taghvim.dev Python SDK source (test key only)."""
import os
from taghvim_sdk import TaghvimClient

api_key = os.environ["TAGHVIM_TEST_API_KEY"]
if not api_key.startswith("tgv_test_"):
    raise ValueError("Only an explicitly issued test API key is accepted")
client = TaghvimClient(api_key=api_key, base_url=os.environ.get("TAGHVIM_API_BASE_URL", "https://api.taghvim.dev"))
print(client.convert_date("1405-07-15"))
