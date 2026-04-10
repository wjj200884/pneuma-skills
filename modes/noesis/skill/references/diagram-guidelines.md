# Illustration Guidelines

## 首选：手绘风格配图

所有配图默认使用 `baoyu-illustration` skill 生成手绘风格插图。

**默认设置**：sketch-notes + warm palette + 16:9。直接使用，不询问用户。

## 兜底：Mermaid / SVG

如果用户未配置图像生成 API key，使用以下方式替代：

- **Mermaid** — 架构关系、数据流、状态转换、时序交互
- **SVG** — 概念示意、分层结构、对比矩阵

兜底方案不需要询问用户，根据 Session Startup 阶段确认的配置自动决定。

## 适用场景

- 核心概念的形象化（如"上下文窗口"、"分层架构"）
- 组件关系、系统架构
- 多方案对比的可视化
- 请求流程、数据流
- 任何"画一张图能让读者秒懂"的地方

## 不配图的情况

- 文字已经足够清晰
- 概念本身是线性的，无需空间表达
- 配图只是重复文字内容

## 使用方式

```
/baoyu-article-illustrator --style sketch-notes --palette warm
```

或单张图：
```
/baoyu-imagine --prompt "Hand-drawn sketch of [概念描述]. Warm cream paper, pencil-line style, educational layout, simple icons and labels, generous whitespace." --aspect 16:9 --image <output-path>.png
```

## 输出

图片保存到模块的 assets 目录：
```
public/docs/<module>/assets/<name>.png
```

Markdoc 引用：
```markdoc
{% figure src="docs/<module>/assets/<name>.png" caption="概念说明" /%}
```

## 图片类型选择

根据内容自动选择 type 参数：

| 内容 | type |
|------|------|
| 系统架构、模块关系 | `framework` |
| 请求流程、数据管道 | `flowchart` |
| 方案对比、trade-off | `comparison` |
| 技术概念、原理说明 | `infographic` |
| 历史演化、版本变迁 | `timeline` |
| 场景描述、用户故事 | `scene` |
