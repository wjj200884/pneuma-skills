---
name: baoyu-illustration
description: >
  Hand-drawn style illustration generation for documentation.
  Invoke when a page needs a concept diagram, architecture overview, or visual explanation.
  Requires baoyu-skills plugin installed (npx skills add JimLiu/baoyu-skills).
---

# Hand-Drawn Illustration for Noesis

Uses `baoyu-article-illustrator` and `baoyu-imagine` skills from [baoyu-skills](https://github.com/JimLiu/baoyu-skills) to generate hand-drawn style illustrations for documentation pages.

## Prerequisites

1. **baoyu-skills installed**: `npx skills add JimLiu/baoyu-skills`
2. **Image generation API key**: At least one of:
   - `OPENAI_API_KEY` (OpenAI DALL-E)
   - `GOOGLE_API_KEY` (Google Gemini)
   - `DASHSCOPE_API_KEY` (DashScope/Alibaba)
   - Other supported providers: Azure, OpenRouter, MiniMax, Replicate, Jimeng, Seedream

## When to Use

- Core module pages that explain architecture or system design
- Concept pages where a visual metaphor aids understanding
- Comparison pages showing trade-offs between approaches
- **NOT** for every page — only when visual adds value over text

## Default Settings (硬性默认，不需要询问用户)

| Setting | Value | Reason |
|---------|-------|--------|
| Style | `sketch-notes` | 手绘风格，温暖、教育感 |
| Palette | `warm` | 柔和配色，不喧宾夺主 |
| Aspect | `16:9` | 适配内容区宽度 |
| Type | 根据内容选择：`framework` 架构、`flowchart` 流程、`comparison` 对比 | |

**除非用户主动要求其他风格，否则始终使用以上默认值。**

## How to Invoke

Use the `baoyu-article-illustrator` skill:

```
/baoyu-article-illustrator --style sketch-notes --palette warm
```

Or for a single illustration via `baoyu-imagine`:

```
/baoyu-imagine --prompt "Hand-drawn sketch of [concept description]. Warm cream paper background, pencil-line style, educational infographic layout, simple icons and labels, generous whitespace." --aspect 16:9 --image <project-dir>/public/docs/<module>/assets/<name>.png
```

## Output

Generated images are saved as PNG files. Place them in the module's assets directory:

```
public/docs/<module>/assets/concept-name.png
```

Then reference in the Markdoc content:

```markdoc
{% figure src="docs/<module>/assets/concept-name.png" caption="概念说明" /%}
```

## Fallback Prompt Template

If baoyu-skills is not installed, use this prompt with any image generation API:

```
Create a hand-drawn style educational illustration on warm cream paper (#F5F0E8).

Style: Pencil sketch with slight wobble on all lines, color fills that don't completely fill outlines.
Palette: Soft pastels — Macaron Blue (#A8D8EA), Lavender (#D5C6E0), Mint (#B5E5CF), Coral (#E8655A) for emphasis.
Elements: Rounded cards with dashed borders, wavy hand-drawn arrows, simple icons, handwritten-style labels.
Layout: Clean composition with generous whitespace. Main elements centered.
Text: Hand-drawn lettering style, large and readable. Use [CONTENT LANGUAGE] for all text.
Aspect: 16:9, landscape orientation.

Content to illustrate:
[DESCRIPTION]
```
