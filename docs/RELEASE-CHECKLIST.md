# One product, one release evidence chain

1. Pin the approved API contract SHA in `contracts/operation-index.json`.
2. Pin the SDK candidate commit in `release/SDK-SOURCE.json`; do not silently follow a moving source at release time.
3. Validate every cookbook's public method/path and test in an isolated, mocked client without live credentials.
4. Compare JSON operation registry against SDK and the organization registry.
5. Verify accessibility, Persian Unicode, English code direction, license/NOTICE, samples and snippets.
6. Validate on a real, authorized sandbox tenant once provisioning is available; archive run IDs, commit SHAs, request IDs (without secrets) and release approval.
7. Tag/publicize the SDK, cookbooks and API docs **together**; abort on drift. The current state remains PREVIEW and is not General Availability.

Open source documentation is a public product interface; implementation details and vendors are deliberately excluded.
