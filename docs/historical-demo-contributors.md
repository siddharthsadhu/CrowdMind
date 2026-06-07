# Historical Demo Contributors

> **These are NOT real user accounts.** They are static fixture data in the
> database that exists purely to make the demo data look rich and realistic
> (real names, bios, avatars, varied reputation, diverse roles).
>
> `clerk_user_id` is `NULL` for all of them. They **cannot log in**. Real
> users who sign up via Clerk get their own DB row auto-created on first
> sign-in (`backend/app/core/dependencies.py:get_current_user`).
>
> **When this file changes:** update `backend/scripts/seed.py` to match.

This document lists all 30 historical/demo contributor records. They are referenced in:

- 139 published FAQs (publishers, contributors, voters)
- 12 discussions (askers, repliers, acceptors)
- 8 questions (askers)
- 23 replies (authors)
- 6 reports (reporters)
- 14 notifications (recipients)
- 12 user achievements (holders)
- 9 saved knowledge entries
- 10 evolution events (triggers)

---

## Admins (3)

| # | Full Name | Email | Username | Reputation | Bio |
|---|---|---|---|---|---|
| 1 | Dr. Elena Vasquez | `admin@crowdmind.dev` | `admin` | 8,420 | AI ethics researcher, PhD MIT. Lead moderator and content curator at Vicharanashala, IIT Ropar. |
| 8 | Priya Sharma | `priya.sharma@crowdmind.dev` | `priya_admin` | 6,210 | ML platform lead at Vicharanashala. Curates the Spurti and Yaksha knowledge tracks. |
| 9 | David Okafor | `david.okafor@crowdmind.dev` | `david_admin` | 5,870 | Senior community moderator. Reviews candidates and resolves disputes on the platform. |

## Regular Contributors (27)

| # | Full Name | Email | Username | Reputation | Bio |
|---|---|---|---|---|---|
| 2 | Alex Rivera | `alex.rivera@example.com` | `alex_rivera` | 3,120 | Senior ML engineer, Vicharanashala alumnus. Mentor for the Annam.AI track. |
| 3 | Maya Patel | `maya.patel@example.com` | `maya_p` | 2,480 | Distributed systems and consensus protocols. Bronze and Silver badge holder. |
| 4 | Jordan Lee | `jordan.lee@example.com` | `jordan_l` | 1,820 | PhD student in computational neuroscience. Curious about cognitive architectures. |
| 5 | Ravi Singh | `ravi.singh@example.com` | `ravi_s` | 940 | Software architect focused on production ML systems and MERN stack. |
| 6 | Priya Nair | `priya.n@example.com` | `priya_n` | 760 | Vicharanashala intern, ViBe platform contributor. Loves documenting the learning process. |
| 7 | Amaru Quispe | `amaru.q@example.com` | `amaru_q` | 510 | Computer vision intern, working on Annam.AI's plant disease detection model. |
| 10 | Lina Chen | `lina.chen@example.com` | `lina_chen` | 285 | First-time Vicharanashala intern, excited to learn and contribute. |
| 11 | Sara Mitchell | `sara.mitchell@example.com` | `sara_m` | 2,240 | NLP researcher, PhD Stanford. Contributes to the Yaksha and ViBe knowledge corpora. |
| 12 | Daniel Kim | `daniel.kim@example.com` | `daniel_k` | 1,960 | Backend engineer with a focus on FastAPI and async Python. Active on the Rosetta track. |
| 13 | Ananya Iyer | `ananya.iyer@example.com` | `ananya_i` | 1,810 | ML intern passionate about knowledge graphs and structured reasoning systems. |
| 14 | James Wright | `james.wright@example.com` | `james_w` | 1,640 | Full-stack developer and Vicharanashala alumnus. Builds tooling for the Annam.AI team. |
| 15 | Aisha Rahman | `aisha.rahman@example.com` | `aisha_r` | 1,420 | Data scientist focusing on fairness in AI. Documents best practices in the library. |
| 16 | Mateo Silva | `mateo.silva@example.com` | `mateo_s` | 1,290 | Computer vision engineer working on Annam.AI's plant disease detection pipeline. |
| 17 | Yuki Tanaka | `yuki.tanaka@example.com` | `yuki_t` | 1,180 | Robotics and reinforcement learning. Active contributor to the Spurti knowledge track. |
| 18 | Fatima Ali | `fatima.ali@example.com` | `fatima_a` | 1,080 | Frontend engineer and Vicharanashala intern. Loves clean UI patterns and accessibility. |
| 19 | Noah Collins | `noah.collins@example.com` | `noah_c` | 970 | DevOps engineer with experience in Kubernetes and CI/CD. Helps maintain the platform. |
| 20 | Zara Hassan | `zara.hassan@example.com` | `zara_h` | 880 | Cognitive science researcher, exploring the intersection of AI and human reasoning. |
| 21 | Hiroshi Yamada | `hiroshi.yamada@example.com` | `hiroshi_y` | 820 | ML systems engineer focused on inference optimization and low-latency serving. |
| 22 | Olivia Brown | `olivia.brown@example.com` | `olivia_b` | 740 | Product designer and researcher. Helps shape the CrowdMind user experience. |
| 23 | Kunal Kapoor | `kunal.kapoor@example.com` | `kunal_k` | 690 | IIT Ropar alumnus, now a research engineer. Frequent contributor to the Yaksha track. |
| 24 | Mei Li | `mei.li@example.com` | `mei_li` | 640 | Quantitative researcher with a focus on probabilistic programming and inference. |
| 25 | Tomas Morales | `tomas.morales@example.com` | `tomas_m` | 580 | Software engineer passionate about open source and reproducible research. |
| 26 | Amara Osei | `amara.osei@example.com` | `amara_o` | 520 | ML intern and Vicharanashala contributor. Building tools for the Annam.AI team. |
| 27 | Liam O'Connor | `liam.oconnor@example.com` | `liam_oc` | 480 | Research engineer focused on agentic systems and tool-using language models. |
| 28 | Ines Fernandes | `ines.fernandes@example.com` | `ines_f` | 410 | Data engineer and Vicharanashala intern. Building the ViBe content pipeline. |
| 29 | Rajiv Menon | `rajiv.menon@example.com` | `rajiv_m` | 360 | First-year Vicharanashala intern, exploring knowledge validation and consensus. |
| 30 | Sofia Petrova | `sofia.petrova@example.com` | `sofia_p` | 295 | New Vicharanashala intern, excited to learn and contribute to the community. |

---

## Avatar Strategy

All 30 use **deterministic DiceBear Adventurer SVG avatars**, generated at seed
time from the full name. Same name -> same avatar. No two are duplicates.

Format: `https://api.dicebear.com/7.x/adventurer/svg?seed=<urlencoded name>&backgroundColor=...`

## Why Historical / Why Not Real Clerk Users

| Aspect | Historical (30) | Real Clerk (you + teammates) |
|---|---|---|
| `clerk_user_id` | `NULL` | `user_...` (set by Clerk) |
| Log in via Clerk | ❌ No | ✅ Yes |
| Appear in demo data | ✅ Yes | ✅ Yes (as you create FAQs etc.) |
| Have reputation/bios | ✅ Yes | ✅ Yes (grows over time) |
| Can post new content | ❌ No | ✅ Yes |

## Adding a New Real User

1. They go to `http://localhost:5174/login` and sign up with their real email
2. Clerk creates the account
3. They sign in
4. Backend auto-creates a DB row for them (with `clerk_user_id` populated)
5. By default, they have `role = "user"`
6. To make them admin: go to Clerk dashboard -> Users -> click them -> Metadata -> add `{"role": "admin"}` to public_metadata -> save
7. They sign out, sign back in
8. The new role syncs to the DB on their next authenticated request (see
   `backend/app/core/dependencies.py:get_current_user`)

## Promoting a Real User to Admin (Alternative)

Run from `backend/`:

```bash
uv run python -m scripts.promote_to_admin --email teammate@example.com
```

The user must then sign out and back in for the new role to apply (the
Clerk JWT is cached, so a re-sign-in is required for the new role to be
in the session token, which the backend then syncs to the DB).

## How Role Sync Works

The `get_current_user` dependency re-reads the role from the Clerk JWT
(`publicMetadata.role`) on **every authenticated request**. So:

- Promotion via Clerk dashboard -> user signs out + back in -> role
  updates in DB on next request.
- Promotion via `promote_to_admin.py` -> updates both Clerk metadata
  AND DB role directly -> user signs out + back in -> role confirmed
  in DB on next request.

The DB is always a snapshot of the latest Clerk publicMetadata role for
each signed-in user. Historical (clerk_user_id IS NULL) users keep
their seeded role forever.
