---
name: review
description: Validate implementation against request, analyzer intent, and actual code changes.
---

## Output Structure
1. Status
- approved | rejected

2. Validation
- Request match
- Analyzer intent match
- Scope correctness
- Behavioral correctness
- Validation evidence (diff, test result, or explicit limitation)

3. Issues for rework (if rejected)
- What is incorrect
- What is missing
- What exceeded scope
- What remains uncertain

4. Explanation (only if approved)
- What changed
- Why it changed
- Before vs After behavior
- Remaining limitation or risk (only if relevant)

## Guidelines
- Do not modify code
- Do not redesign
- Do not review style unless it affects correctness or risk
- Reject when correctness cannot be established from available evidence
- If validation evidence is missing, state the limitation explicitly