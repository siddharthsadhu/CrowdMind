"""Phase 7 landing-page E2E verification (guest view). One-shot, not part of pytest."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path("scripts/_phase7_shots")
OUT.mkdir(exist_ok=True)


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
        ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        page = ctx.new_page()
        errors = []
        page.on("pageerror", lambda exc: errors.append(f"PAGEERR: {exc}"))
        page.on("console", lambda msg: errors.append(f"CONSOLE {msg.type}: {msg.text}") if msg.type == "error" else None)

        page.goto("http://localhost:5176/", wait_until="networkidle", timeout=20000)
        page.wait_for_timeout(1500)

        stats = {
            "faqs": page.locator("[data-stat='faqs']").inner_text(),
            "discussions": page.locator("[data-stat='discussions']").inner_text(),
            "resolution": page.locator("[data-stat='resolution']").inner_text(),
            "contributors": page.locator("[data-stat='contributors']").inner_text(),
        }
        print("STATS:", stats)

        footer_text = page.locator("footer").nth(1).inner_text()
        print("FOOTER (excerpt):", footer_text[:300])

        page.screenshot(path=str(OUT / "landing_guest.png"), full_page=True)

        methodology_link = page.locator("button", has_text="Learn Our Methodology").first
        if methodology_link.count() > 0:
            print("BUTTON text:", methodology_link.inner_text())
            methodology_link.click()
            page.wait_for_load_state("networkidle", timeout=10000)
            page.wait_for_timeout(1000)
            print("URL after click:", page.url)
            page.screenshot(path=str(OUT / "methodology.png"), full_page=True)
        else:
            print("WARN: 'Learn Our Methodology' button not found")

        if errors:
            print("\nERRORS:")
            for e in errors[:20]:
                print(" ", e)
        else:
            print("\nNo page errors")

        browser.close()
        return 0 if stats["faqs"].strip() not in ("", "—", "12.4k+") else 1


if __name__ == "__main__":
    sys.exit(main())
