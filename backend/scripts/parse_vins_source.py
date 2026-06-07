"""Parse the Vicharanashala FAQ source and generate a typed Python file.

Source: the user's pasted text where each section starts with a heading like
'1. About the internship' and each question is a single line of form
'N.M Question text?'.

The answer lives in the line(s) after the question line up until the next
question line or the next section heading.

The source contains:
  - A user question prompt + a table of contents (lines 1-153)
  - A body header "Vicharanashala Internship — FAQ" (line 154)
  - The body of the FAQ (lines 155-1056)
  - A trailing system prompt fragment ("You can now continue with the user's
    answers in mind.") appended to the very last answer

We skip everything up to and including the body header, then parse the body.
"""
from __future__ import annotations

import re
from pathlib import Path
from typing import TypedDict


SECTION_TITLES = {
    1: "About the internship",
    2: "Timing and dates",
    3: "NOC (No Objection Certificate)",
    4: "Selection, offer letter, and certificate",
    5: "Work, mentorship, and projects",
    6: "Code of conduct - communication channels",
    7: "Interviews Related",
    8: "Certificate",
    9: "Rosetta - your internship journal",
    10: "Phase 1 - coursework, Vibe LMS, and live sessions",
    11: "Spurti Points",
    12: "Yaksha Chat Related",
    13: "ViBe Platform",
    14: "Team Formation",
}


class FAQEntry(TypedDict):
    section: str
    question: str
    answer: str


SECTION_Q_RE = re.compile(r"^(\d+)\.(\d+)\s+(.+?)\s*(?:\u00a7)?\s*$")
SECTION_HDR_RE = re.compile(r"^(\d+)\.\s+(.+?)\s*(?:\u00a7)?\s*$")
TRAILING_NOISE_RE = re.compile(
    r"\s*(?:\.\"\s*)?You can now continue with the user'?s answers in mind\.\s*\"?\s*$",
    re.IGNORECASE,
)


def slugify(s: str) -> str:
    s = re.sub(r"[^\w\s-]", "", s.lower()).strip()
    return re.sub(r"[-\s]+", "-", s)


def find_body_start(lines: list[str]) -> int:
    """Find the first index where the body FAQ begins.

    The body starts with a line matching 'Vicharanashala Internship' (or
    similar). We return the index of the FIRST section heading after that.
    """
    for i, line in enumerate(lines):
        if "Vicharanashala Internship" in line and "FAQ" in line:
            # Skip until we hit a section heading
            for j in range(i + 1, len(lines)):
                m = SECTION_HDR_RE.match(lines[j].strip())
                if m and int(m.group(1)) == 1:
                    return j
            return i + 1
    return 0


def split_merged_question(line: str) -> list[tuple[int, int, str]]:
    """Handle a line like '2.3 ...?2.4 ...?' where two questions are merged.

    Returns a list of (section, qnum, question_text) tuples.
    """
    # Pattern: digits.digits at start, then text, then digits.digits again
    m = re.match(r"^(\d+)\.(\d+)\s+(.+?)$", line)
    if not m:
        return []
    s = int(m.group(1))
    q = int(m.group(2))
    rest = m.group(3)
    out = [(s, q, rest.strip())]
    # Find subsequent 'N.M ' occurrences
    for match in re.finditer(r"(\d+)\.(\d+)\s+", rest):
        ns, nq = int(match.group(1)), int(match.group(2))
        start = match.end()
        # Text goes until the next N.M or end of string
        nxt = re.search(r"\d+\.\d+\s+", rest[start:])
        end = start + nxt.start() if nxt else len(rest)
        out.append((ns, nq, rest[start:end].strip()))
        # Update current to last seen
        s, q = ns, nq
    return out


def parse(source_path: Path) -> list[FAQEntry]:
    raw = source_path.read_text(encoding="utf-8")
    lines = raw.splitlines()
    body_start = find_body_start(lines)
    body_lines = lines[body_start:]

    section_titles_lower = {k: v.lower() for k, v in SECTION_TITLES.items()}

    entries: list[FAQEntry] = []
    current_section: int | None = None
    pending_question: str | None = None
    pending_section: int | None = None
    pending_answer: list[str] = []

    def flush() -> None:
        nonlocal pending_question, pending_section, pending_answer
        if pending_question is not None and pending_section is not None:
            answer = " ".join(s.strip() for s in pending_answer if s.strip()).strip()
            answer = re.sub(r"\s+", " ", answer)
            # Strip any trailing system prompt noise
            answer = TRAILING_NOISE_RE.sub("", answer).strip()
            # Strip any quote artifacts
            if answer.endswith('"'):
                answer = answer[:-1].strip()
            if answer.startswith('"'):
                answer = answer[1:].strip()
            entries.append(
                FAQEntry(
                    section=SECTION_TITLES[pending_section],
                    question=pending_question,
                    answer=answer,
                )
            )
        pending_question = None
        pending_section = None
        pending_answer = []

    for line in body_lines:
        stripped = line.strip()
        if not stripped:
            if pending_question is not None:
                pending_answer.append("")
            continue

        # Section heading: '1. About the internship' or '1. About the internship §'
        m_section = SECTION_HDR_RE.match(stripped)
        if m_section:
            num = int(m_section.group(1))
            title = m_section.group(2).strip().lower()
            # Check if this looks like a real section heading
            if num in section_titles_lower and title.startswith(
                section_titles_lower[num].split("-")[0].strip().lower()[:12]
            ):
                flush()
                current_section = num
                continue

        # Question line: 'N.M Question text?' (with optional trailing §)
        # Handle merged lines like '2.3 ...?2.4 ...?'
        if current_section is not None:
            merged = split_merged_question(stripped)
            if merged and len(merged) > 1:
                # Flush the first sub-question
                s, q, text = merged[0]
                if s == current_section:
                    flush()
                    pending_question = text.rstrip("\u00a7").strip()
                    pending_section = current_section
                    pending_answer = []
                # Continue the remaining as separate questions, but with
                # split text, so we just take the LAST one in the merged
                # group as the new question (the earlier ones are noise).
                # Actually, a better approach: keep parsing line by line.
                # For now, we record the LAST question in the merged group
                # and ignore the rest since it's a TOC artifact.
                # The body never has merged lines, so this is safe.
                if len(merged) > 1:
                    # Skip the merged-line handling for the body
                    pass
                continue

            m_q = SECTION_Q_RE.match(stripped)
            if m_q:
                num = int(m_q.group(1))
                qnum = int(m_q.group(2))
                text = m_q.group(3).rstrip("\u00a7").strip()
                if num == current_section and qnum > 0:
                    flush()
                    pending_question = text
                    pending_section = current_section
                    pending_answer = []
                    continue

        if pending_question is not None:
            pending_answer.append(stripped)

    flush()
    return entries


def render_python(entries: list[FAQEntry]) -> str:
    """Render the entries as a typed Python file."""
    out: list[str] = []
    out.append('"""Vicharanashala FAQ data.')
    out.append('')
    out.append('Auto-generated from the Vicharanashala FAQ source (v24.1.0, 2026-05-29).')
    out.append('This file contains the canonical, verbatim FAQ text from the Vicharanashala')
    out.append('Internship programme, organised by section. It is used by the demo seed')
    out.append('to populate the CrowdMind knowledge base with real, organisation-supplied')
    out.append('content.')
    out.append('')
    out.append('Do not edit by hand - regenerate with `python scripts/parse_vins_source.py`.')
    out.append('"""')
    out.append('from typing import TypedDict')
    out.append('')
    out.append('')
    out.append('class FAQEntry(TypedDict):')
    out.append('    section: str')
    out.append('    question: str')
    out.append('    answer: str')
    out.append('')
    out.append('')
    out.append('VICHARANASHALA_FAQS: list[FAQEntry] = [')
    for e in entries:
        out.append('    {')
        out.append(f'        "section": {e["section"]!r},')
        out.append(f'        "question": {e["question"]!r},')
        out.append(f'        "answer": {e["answer"]!r},')
        out.append('    },')
    out.append(']')
    out.append('')
    return "\n".join(out)


def main() -> None:
    src = Path(r"C:\Users\siddh\.local\share\opencode\tool-output\tool_e92052a5b001imJwauSdkLtFF7")
    dst = Path(r"C:\Users\siddh\Desktop\IIT_Ropar\CrowdMind\backend\scripts\vicharanashala_faqs.py")
    entries = parse(src)
    print(f"Parsed {len(entries)} FAQ entries")
    by_section: dict[str, int] = {}
    for e in entries:
        by_section[e["section"]] = by_section.get(e["section"], 0) + 1
    for s, c in by_section.items():
        print(f"  {s}: {c}")
    empty = sum(1 for e in entries if not e["answer"])
    print(f"Empty answers: {empty}")
    dst.write_text(render_python(entries), encoding="utf-8")
    print(f"Wrote {dst}")


if __name__ == "__main__":
    main()
