# JavaScript examples

Source-only copyable exercises use the `@taghvim/sdk` preview source. You must locally install the sibling SDK source as shown in the [repository guide](../README.md). No npm release is asserted. The examples require a separately issued test key and do not log it.

- [Date conversion](01-convert-date.mjs)
- [Business-day arithmetic](02-business-days.mjs)
- [Scheduling preview](03-schedule-preview.mjs)
- [Usage and errors](04-usage.mjs)
- [API-backed widget operation, server-side](05-api-backed-widget.mjs) — requires issued test key and same-origin gateway for browser embedding

API-backed embed: import `registerTaghvimWidgets` from `@taghvim/sdk/embed` and render `<taghvim-api-widget kind="date-picker"></taghvim-api-widget>` in a tenant-authenticated app. The host must implement `/__taghvim/widgets` using `createWidgetGateway`; never expose API keys in browser code. Booking, availability, workflow execution and agent execution remain unavailable until backend-certified.

- [Public searchable Handles (no API key)](09-public-handle-discovery.mjs) — only approved and currently published calendars, no synthetic events
- [Workspace Owner handle application](10-owner-handle-request.mjs) — explicitly opted-in test-only write, remains pending until first-party Platform Superadmin approval

- [Institutional calendars across explicitly granted Workspaces](11-institutional-portfolio.mjs) — authenticated read-only; never grants implicit access; requires a source/production release with `listCalendarPortfolio` deployed
