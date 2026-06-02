# CrowdMind — Screen ↔ Stitch mapping

Frozen product: **20 screens**. Stitch also supplies **one admin drill-down** (FAQ Candidate Review) wired as screen `21` for implementation only.

| # | Screen name | Route | Stitch HTML | Stitch screen ID |
|---|-------------|-------|-------------|------------------|
| 01 | **Landing** (marketing) | `/` | `01-landing.html` | `2c0ef540c7de4ebf9bdae72a5592056f` — *Evolving Community Knowledge* |
| 02 | Knowledge Repository (FAQs) | `/library` | `02-library.html` | `cdcd07ec439a475fa525d179c02a6640` |
| 03 | FAQ Detail | `/faq/:id` | `03-faq-detail.html` | `9b469cc7804e49fa816ecb99c8c8ad88` |
| 04 | Login / Register | `/login`, `/register` | `04-auth.html` | `cf37d747f7884c198c603e43b6926e42` — *Join the Collective Intelligence* |
| 05 | Ask Question | `/ask` | `05-ask.html` | `5e5087ea0bf44b33a185c88c95da0616` |
| 06 | AI Analysis Result | `/analysis/:id` | `06-analysis.html` | `3f5f517f1d484583bc4e1f2ad379e3de` |
| 07 | Discussion Listing | `/discussions` | `07-discussions.html` | `a5b27631ae7540e5a6cb558ac43f453c` |
| 08 | Discussion Thread | `/discussions/:id` | `08-thread.html` | `24361901c3f24e8abdb67cd39a7ded9f` |
| 09 | Create Discussion | `/discussions/new` | `09-create-discussion.html` | `7239f274d70f4d5bbacd6975b77b3a2b` |
| 10 | User Profile | `/home` | `10-profile.html` | `fe43acdc1eaf4681b26088602335e3e7` |
| 11 | Notifications | `/notifications` | `11-notifications.html` | `74c8158676c344af8300013a761c0b0e` |
| 12 | Saved Knowledge | `/saved` | `12-saved.html` | `e1663ba9c8d34fe7b2d051e0f33d34c8` |
| 13 | My Contributions | `/contributions` | `13-contributions.html` | `8d030fad200a4bd29842bf5f0c92e29d` |
| 14 | Knowledge Evolution | `/evolution` | `14-evolution.html` | `4f939a867ac2477cafe6ef93d59b4ec2` — *Dynamic Knowledge Evolution & Stability* |
| 15 | Mission Control | `/admin` | `15-mission-control.html` | `c509056c94e747a6a04b732b62d3d02d` |
| 16 | FAQ Management | `/admin/faq` | `16-faq-mgmt.html` | `fe7acec7d5764c668c1268f83c9333ab` |
| 17 | Moderation Queue | `/admin/moderation` | `17-moderation.html` | `dfdc424d15c0487398c4cdbd04972021` |
| 18 | Platform Intelligence | `/admin/analytics` | `18-analytics.html` | `c4badee6479f4f208c60916caa7f5377` |
| 19 | Report Investigation | `/admin/reports/:id` | `19-report.html` | `b46893f0e8594280a0f57a7e91614b09` |
| 20 | Settings | `/admin/settings` | `20-settings.html` | `b029b74ca9d74aad8c4a65d7f8ae39f9` |
| 21* | FAQ Candidate Review (admin drill-down) | `/admin/faq-review/:id` | `21-faq-candidate-review.html` | `8e5293d5ecc14d3ab868363ae0c5f57f` |

\*Not counted in the frozen “20 screens”; opened from FAQ Management / Mission Control when reviewing a candidate.

Stitch project: `projects/17831667865861893234` — **CrowdMind AI Knowledge Ecosystem**

## Important naming fixes (2026-06-01)

| Wrong assumption | Correct mapping |
|----------------|-----------------|
| `01-landing` = login split screen | **01** = marketing hero (“Transform Questions Into Evolving Knowledge”). **04** = login/register. |
| `14-evolution` = landing duplicate | **14** = “Self-Evolving Knowledge Engine” timeline + diff viewer (`/evolution`). |
| Top nav **Analytics** (user) | Routes to **`/evolution`**, not admin analytics. |
| Top nav **Analytics** (admin) | Routes to **`/admin/analytics`**. |
