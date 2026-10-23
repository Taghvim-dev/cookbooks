<h1 dir="rtl" lang="fa">Cookbookهای تقویم.dev — مثال‌های قابل‌آزمایش</h1>

<p dir="rtl" lang="fa">سناریوهای برنامه‌نویسی برای تقویم، روزهای کاری، زمان‌بندی و مشاهدهٔ مصرف API. تمام مثال‌ها از قرارداد واحد تقویم.dev پیروی می‌کنند و برای کلیدهای آزمایشی طراحی شده‌اند. <strong>دسترسی زودهنگام به‌معنای دریافت فوری حساب یا کلید API نیست.</strong></p>

## Developer examples

| Scenario | Endpoint | Example |
| --- | --- | --- |
| Convert a date | `POST /v1/dates/convert` | [JavaScript](javascript/01-convert-date.mjs) |
| Add business days | `POST /v1/business-days/add` | [JavaScript](javascript/02-business-days.mjs) |
| Preview schedules | `POST /v1/schedules/preview` | [JavaScript](javascript/03-schedule-preview.mjs) |
| Usage and quota errors | `GET /v1/usage` | [JavaScript](javascript/04-usage.mjs) |
| Convert a date | `POST /v1/dates/convert` | [Python](python/convert_date.py) |

## Running locally

Clone the [Taghvim.dev SDK](https://github.com/Taghvim-dev/SDK) and these cookbooks into adjacent folders:

```bash
git clone https://github.com/Taghvim-dev/SDK.git
git clone https://github.com/Taghvim-dev/cookbooks.git
cd cookbooks
npm install --no-save ../SDK/javascript
export TAGHVIM_TEST_API_KEY="your-issued-test-key"
node javascript/01-convert-date.mjs
```

Only run external calls after obtaining a test key from [Taghvim.dev](https://taghvim.dev/). No examples request operator credentials. Copyable examples do not prove live service provisioning.

## Cohesive release rule

Every change must match the [canonical operation index](contracts/operation-index.json), the corresponding [SDK version](https://github.com/Taghvim-dev/SDK) and the API release. CI tests **real example modules with mocked network responses**, checks the sibling SDK's operation manifest and blocks drift. [Release and evidence policy](docs/RELEASE-CHECKLIST.md).

Apache-2.0: [LICENSE](LICENSE). [NOTICE](NOTICE) and [Security](SECURITY.md). Names and logos remain separate trademarks.

## Verified Sandbox target (no production side effects)

The examples default to `https://api.taghvim.dev` for an **issued** test key. For the isolated owner-attested Cloudflare Sandbox, set `TAGHVIM_API_BASE_URL=https://taghvim-api-sandbox.<account-subdomain>.workers.dev` alongside the separately issued Sandbox test key. The clients validate HTTPS; never use a live key, operator token, or production D1. A copied example alone is not proof of successful authenticated developer onboarding.
