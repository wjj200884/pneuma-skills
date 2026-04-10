---
name: github-author-research
description: >
  Use when you need to understand a GitHub project author's background,
  motivations, or design philosophy. Triggered by Noesis overview section
  writing or any task requiring author context from a GitHub repo.
---

# GitHub Author Research Skill

Given a GitHub repository or username, research the author by **tracing links from their GitHub profile** outward. Do not guess or search blindly — follow the trail the author left.

## Research Flow

### Step 1: GitHub Profile

Fetch the author's GitHub profile page using `WebFetch`:

```
https://github.com/<username>
```

Extract:
- **Name & bio** — who they are in their own words
- **Location & company** — professional context
- **Website link** — personal site, blog, or portfolio (if provided)
- **Social links** — Twitter/X, LinkedIn, etc. (shown on profile sidebar)
- **Pinned repos** — what they consider their most important work
- **README profile** — some authors have a profile README with detailed intro

Record all outbound links for the next step.

### Step 2: Follow Outbound Links

Visit each link found on the GitHub profile, in priority order:

1. **Personal website / blog** — read their about page, recent posts, project-related articles. Usually the richest source.
2. **LinkedIn** — career history and self-description (may be partially accessible)
3. **Twitter/X** — currently not fetchable (returns 402). Note the handle but skip fetching.
4. **HuggingFace / Dev.to / Medium** — tech platform profiles, authored articles
5. **Conference / speaker pages** — talk titles and abstracts

For each accessible link, extract:
- Self-description and background
- Published articles or talks related to the project
- Stated opinions on design, architecture, or technology
- Collaborators or influences mentioned

### Step 3: Project-Specific Context

Within the GitHub repo itself, look for author voice:

- **README** — project motivation, "Why" sections
- **CHANGELOG / NEWS** — personal notes on releases
- **GitHub Discussions** — author's replies explaining design decisions
- **Issue comments** — especially on design/architecture issues (labels: `design`, `RFC`, `proposal`)
- **Commit messages** — early commits often contain the author's original vision

### Step 4: Linked References

If the author's blog or README references specific influences, papers, or philosophies:

- Fetch those references with `WebFetch` to understand the intellectual context
- Note which ideas the author explicitly cites vs. which you infer

### Handling Dead Ends

If most outbound links are inaccessible (e.g. author only has a Twitter link):

1. Fall back to **Step 3** — the repo itself is always accessible and often contains the most authentic author voice in issues, discussions, and commit messages
2. Check if the author has **other public repos** with READMEs that reveal background or philosophy
3. Check if the author has **contributed to other projects** — their PRs and issue comments elsewhere can reveal expertise and opinions
4. If very little is found, be honest about it — a short, factual author section is better than padded speculation

## Output Format

After research, produce a structured summary. **Include only sections where you found substantive content** — omit empty sections rather than padding them.

```markdown
## Author Profile

**Name**: ...
**Role**: ...
**Based in**: ...
**Known for**: ...

## Background
<!-- Career path, expertise areas, how they got here -->

## Design Philosophy (if discoverable)
<!-- What they believe about software/architecture, in their own words where possible -->

## Project Motivation (if stated)
<!-- Why they built this specific project, what problem they saw -->

## Key Influences (if explicitly referenced)
<!-- People, books, frameworks, or ideas they cite -->

## Sources
<!-- Every URL visited with a one-line summary -->
- GitHub profile: ...
- Blog post: ...
- Discussion: ...
```

## Principles

- **Trace, don't search**: Follow links from the GitHub profile. Don't do broad web searches for the author.
- **Quote, don't paraphrase**: When the author states something clearly, quote them directly.
- **Distinguish stated vs. inferred**: Mark clearly what the author said vs. what you interpreted.
- **Note dead ends**: If a link is inaccessible, record the handle/URL so the user knows it exists.
- **Honest gaps over padded content**: If you can't find design philosophy, say so. Don't invent one from thin air.
- **Respect scope**: This skill produces research notes. The calling skill decides how to use them in final documentation.
