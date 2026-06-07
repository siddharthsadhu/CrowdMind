"""Live API QA: test all 7 evolution endpoints for auth, validation, and happy-path."""
import asyncio
import json
import sys
from uuid import uuid4

import httpx

BACKEND = "http://localhost:8001"
FAQ_ID = "cf1ad9e6-54dd-418d-b137-ac10d082e7ab"  # ViBe flagship
FAKE_UUID = "00000000-0000-0000-0000-000000000000"


async def test(label, method, path, *, headers=None, json_body=None, expect_status=None):
    async with httpx.AsyncClient(timeout=10) as c:
        try:
            r = await c.request(method, f"{BACKEND}{path}", headers=headers, json=json_body)
            ok = expect_status is None or r.status_code == expect_status
            print(f"  {'OK ' if ok else 'XX'} {label}: {method} {path} -> {r.status_code} (expected {expect_status})")
            return r
        except Exception as e:
            print(f"  XX {label}: {method} {path} -> EXCEPTION: {e}")
            return None


async def main():
    print("=== 4.6 Per-endpoint API QA ===\n")
    results = []
    # 1. GET /api/v1/evolution/timeline/{faq_id} - public
    r = await test("Timeline public", "GET", f"/api/v1/evolution/timeline/{FAQ_ID}", expect_status=200)
    if r: results.append(("timeline_public", r.status_code == 200))

    # 2. GET /api/v1/evolution/events - public
    r = await test("Events public", "GET", "/api/v1/evolution/events", expect_status=200)
    if r: results.append(("events_public", r.status_code == 200))

    # 3. GET /api/v1/evolution/diff/{faq_id}/{from_v}/{to_v} - public
    r = await test("Diff public", "GET", f"/api/v1/evolution/diff/{FAQ_ID}/1/4", expect_status=200)
    if r:
        body = r.json()
        ok = "diff" in body
        print(f"     body has {len(body.get('diff', []))} diff hunks")
        results.append(("diff_public", ok))

    # 4. Diff with same version - intentionally 400 (defensive)
    r = await test("Diff same version (1=1) - 400 defensive", "GET", f"/api/v1/evolution/diff/{FAQ_ID}/1/1", expect_status=400)
    if r: results.append(("diff_same_version", r.status_code == 400))

    # 5. Diff with invalid FAQ
    r = await test("Diff invalid FAQ", "GET", f"/api/v1/evolution/diff/{FAKE_UUID}/1/2", expect_status=404)
    if r: results.append(("diff_invalid_faq", r.status_code == 404))

    # 6. POST /api/v1/faqs/{id}/rollback - admin only, no auth = 401
    r = await test("Rollback no auth", "POST", f"/api/v1/faqs/{FAQ_ID}/rollback", json_body={"target_version": 1, "reason": "test"}, expect_status=401)
    if r: results.append(("rollback_no_auth", r.status_code == 401))

    # 7. POST /api/v1/faqs/{id}/rollback - admin only, fake token = 401
    r = await test("Rollback fake token", "POST", f"/api/v1/faqs/{FAQ_ID}/rollback", headers={"Authorization": "Bearer fake"}, json_body={"target_version": 1, "reason": "test"}, expect_status=401)
    if r: results.append(("rollback_fake_token", r.status_code == 401))

    # 8. POST /api/v1/faqs/{id}/rollback - invalid target version
    # Admin token tests require TEST_JWT_PRIVATE_KEY env var to match between
    # test and backend. Skipped in external QA — covered by test_evolution.py.
    print("  -- Rollback admin invalid version: SKIP (covered by unit test_evolution.py)")

    # 9. POST /api/v1/discussions/{id}/synthesize - admin only
    r = await test("Synthesize no auth", "POST", f"/api/v1/discussions/{FAKE_UUID}/synthesize", expect_status=401)
    if r: results.append(("synthesize_no_auth", r.status_code == 401))

    # 10. POST /api/v1/questions/admin/analysis/cache/flush-all - admin only
    r = await test("Flush all no auth", "POST", "/api/v1/questions/admin/analysis/cache/flush-all", expect_status=401)
    if r: results.append(("flush_all_no_auth", r.status_code == 401))

    # 11. DELETE /api/v1/questions/{qid}/analysis/cache - admin only
    r = await test("Delete cache no auth", "DELETE", f"/api/v1/questions/{FAKE_UUID}/analysis/cache", expect_status=401)
    if r: results.append(("delete_cache_no_auth", r.status_code == 401))

    # 12. GET /api/v1/questions/{qid}/analysis?force=true
    r = await test("Analyze with force=true", "GET", f"/api/v1/questions/{FAKE_UUID}/analysis?force=true", expect_status=404)
    if r: results.append(("analyze_force", r.status_code == 404))

    # 13. Rollback to v1 (the oldest) - admin token, valid version
    # SKIP - requires backend-internal test (see test_evolution.py)
    print("  -- Rollback admin to v1: SKIP (covered by unit test_evolution.py)")

    # Summary
    print(f"\n=== 4.6 Summary ===")
    total = len(results)
    passed = sum(1 for _, ok in results if ok)
    print(f"Total: {total} | PASS: {passed} | FAIL: {total - passed}")
    if passed != total:
        print("\nFailed:")
        for label, ok in results:
            if not ok:
                print(f"  XX {label}")
    return passed == total


if __name__ == "__main__":
    ok = asyncio.run(main())
    sys.exit(0 if ok else 1)
