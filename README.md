<h1 dir="rtl" lang="fa">Cookbookهای تقویم.dev — مثال‌های قابل‌آزمایش</h1>

## 🧪 درخواست API Key و آزمایش رایگان ۳۰روزه | 30-day developer trial

**[ثبت‌نام برای دریافت API Key آزمایشی](https://taghvim.dev/#access)** · **[Request an API test key](https://taghvim.dev/#access)**

با ثبت درخواست دسترسی زودهنگام، ایمیل تأیید دریافت می‌کنید. پس از **۷ روز**، در صورت آماده‌بودن سرویس و برقرار بودن شرایط دسترسی، دعوت‌نامهٔ یک‌بارمصرف به همان ایمیل فرستاده می‌شود. پیوند دعوت تا **۷۲ ساعت** اعتبار دارد. پس از فعال‌سازی دعوت‌نامه، Tenant آزمایشی و کلید `tgv_test_...` صادر می‌شود که **۳۰ روز از زمان فعال‌سازی** معتبر است (نه از زمان ثبت‌نام). کلید فقط یک‌بار در صفحه فعال‌سازی نمایش داده می‌شود؛ هرگز در GitHub، کد کلاینت یا Issue عمومی قرار ندهید. تمدید یا دسترسی Production نیازمند تأیید جداگانه است.

**English:** Register on the official early-access form and receive an acknowledgement email. The seven-day invitation schedule is activated only after the protected Cloudflare release and email-delivery checks. An emailed one-time invitation (72-hour validity) provisions a test tenant and a **30-day test API key starting on activation**. An invitation is not itself an API key. Product-update emails use a separate, optional consent choice. [Privacy](https://taghvim.dev/#privacy) · [Terms](https://taghvim.dev/#terms) · [Contact](https://taghvim.dev/#contact).


<p dir="rtl" lang="fa">سناریوهای برنامه‌نویسی برای تقویم، روزهای کاری، زمان‌بندی و مشاهدهٔ مصرف API. تمام مثال‌ها از قرارداد واحد تقویم.dev پیروی می‌کنند و برای کلیدهای آزمایشی طراحی شده‌اند. <strong>دسترسی زودهنگام به‌معنای دریافت فوری حساب یا کلید API نیست.</strong></p>

## 🧪 دریافت API Key و دورهٔ آزمایشی ۳۰روزه | 30-day API trial

**[ثبت‌نام برای دریافت API Key آزمایشی](https://taghvim.dev/#access)** · **[Request API access](https://taghvim.dev/#access)**

<p dir="rtl" lang="fa">در فرم رسمی دسترسی زودهنگام ثبت‌نام کنید تا تأییدیهٔ ثبت درخواست را با ایمیل دریافت کنید. از <strong>۷ روز پس از ثبت‌نام</strong> و پس از احراز آمادگی سرویس، دعوت‌نامهٔ اختصاصی به همان نشانی فرستاده می‌شود. پیوند دعوت‌نامه <strong>۷۲ ساعت و یک‌بارمصرف</strong> است. پس از فعال‌سازی آن، یک Tenant مستقل و کلید <code>tgv_test_…</code> دریافت می‌کنید. <strong>دورهٔ آزمایشی دقیقاً ۳۰ روز از زمان فعال‌سازی شروع می‌شود</strong>؛ تعویض کلید باعث تمدید آن نمی‌شود. کلید در صفحهٔ فعال‌سازی فقط یک بار نمایش داده می‌شود. پس از پایان دوره، دسترسی نیازمند تأیید جدید است؛ حساب یا کلید Production به‌طور خودکار صادر نمی‌شود.</p>

**English:** [Join the early-access waitlist](https://taghvim.dev/#access) → registration confirmation email → eligibility for a one-time emailed invitation **after seven days**, once the protected email and API services are ready → activate the invitation **within 72 hours** → receive a test-only API key and a **30-day trial counted from activation, not registration**. Rotating keys does not reset this deadline. Do not commit API keys, publish them in GitHub issues, or place shared secrets in public browser code. Product announcements require a separate optional opt-in.

[Developer activation portal](https://api.taghvim.dev/developer) · [Test-key console](https://api.taghvim.dev/developer/console) · [API contract](https://api.taghvim.dev/openapi.json) · [Privacy](https://taghvim.dev/#privacy) · [Terms](https://taghvim.dev/#terms) · [Contact](https://taghvim.dev/#contact)

> **Current availability:** The public form collects early-access requests. Timed invitation delivery is not guaranteed until the Landing D1 migration, protected Engine Cron deployment and real email-delivery checks have passed. A signup acknowledgement is not an API key.

## Developer examples

| Scenario | Endpoint | Example |
| --- | --- | --- |
| Convert a date | `POST /v1/dates/convert` | [JavaScript](javascript/01-convert-date.mjs) |
| Reconcile calendar dates (one authenticated, metered native request) | `POST /v1/dates/reconcile` | [JavaScript](javascript/06-reconcile-dates.mjs) · [Python](python/reconcile_dates.py) |
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
