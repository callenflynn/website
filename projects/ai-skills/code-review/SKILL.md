---
name: reviewing-code
description: Use when the user asks to review code, check code quality, debug, or optimize software. Analyze an entire codebase, score files, prioritize problems, suggest improvements, and optionally apply fixes.
author: Callen Flynn
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
metadata:
  version: 1.0.0
  tags:
    - code-review
    - debugging
    - optimization
    - software-quality
  trigger:
    - "user asks to review code"
    - "user asks to check code quality"
    - "task involves debugging, optimization, or code improvement"
  priority: high
---

# Code Reviewer

## Purpose

Analyze a complete codebase and provide a detailed quality assessment.

The AI should:
- Review every relevant file
- Identify bugs, errors, warnings, inefficiencies, bad practices, and improvement opportunities
- Rate each file from 1/10 based on overall quality
- Prioritize fixing files with a score of 4/10 or lower
- Suggest improvements and optionally apply fixes after user approval

---

# Review Process

## Step 1: Analyze Project Structure

Before reviewing:
- Inspect the project structure
- Identify programming languages, frameworks, dependencies, and architecture
- Understand the purpose of the project
- Identify important files and entry points

Do not judge files without understanding their role in the project.

---

# Step 2: Review Every File

For each relevant file:

Evaluate:

### Errors
- Bugs
- Runtime issues
- Incorrect logic
- Security vulnerabilities
- Potential crashes

### Warnings
- Bad practices
- Maintainability problems
- Missing validation
- Poor error handling

### Efficiency
- Performance problems
- Unnecessary computation
- Memory usage issues
- Poor algorithms

### Code Quality
- Readability
- Organization
- Naming
- Documentation
- Maintainability
- Scalability

---

# Step 3: File Rating

Rate every reviewed file:

10/10:
Excellent code. No meaningful issues.

8-9/10:
Well-structured, mostly optimized code with minor stylistic or formatting improvements possible.

5-7/10:
Functional but has noticeable issues.

3-4/10:
Major problems that should be addressed.

1-2/10:
Severely broken, unsafe, or requires major rewriting.



The rating should consider:
- Severity of issues
- Number of issues
- Impact on the project
- Importance of the file
- Difficulty of fixing problems

---

# Step 4: Prioritize Issues

Prioritize:

1. Files rated 1-4/10
2. Security problems
3. Bugs affecting functionality
4. Performance problems
5. Maintainability problems
6. Minor improvements

Do not spend most of the response on minor issues while major issues exist.

---

# Step 5: Report Format

Use this format:

# Project Overview

Summary of:
- Project purpose
- Architecture
- Overall quality
- Biggest concerns

---

# File Ratings

For every file:


File:
Rating: X/10

Reason:
Explain why this file received this rating.

Issues:

Issue 1
Issue 2
Issue 3

Impact:
Explain how these issues affect the project.


---

# Improvement Suggestions

For every important issue:

Provide exactly 3 possible solutions.

Example:


Issue:
Database queries are inefficient.

Possible Improvements:

Add query indexing
Pros:
Cons:
Cache frequent queries
Pros:
Cons:
Rewrite query structure
Pros:
Cons:


---

# Recommended Solution

After listing options:

Choose the best solution based on:
- Project architecture
- Complexity
- Maintainability
- Performance
- Long-term effects

Explain why this option is preferred.

---

# User Approval

Before modifying code:

Ask:

"Would you like me to apply these recommended changes?"

Do not edit files until the user explicitly approves.

---

# Fixing Mode

If the user approves:

- Apply the selected fixes
- Modify only necessary files
- Explain every change made
- Mention any remaining issues
- Provide updated ratings after fixes

---

# Rules

- Never rewrite code without understanding its purpose
- Never make changes without user approval
- Prefer simple maintainable solutions over unnecessary complexity
- Explain reasoning behind ratings
- Consider the whole project, not isolated files
- Preserve existing functionality unless a change is required
- Point out uncertainty when project context is missing
