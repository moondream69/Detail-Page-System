# 🎓 AI 学习路线图 — 基于你的作品评估

## 你的作品分析

### 你建了什么

一个**AI 驱动的家具电商详情页生成器**，技术栈：Next.js 16 + React 19 + Gemini 视觉模型。

### 你已经掌握的能力

| 能力维度 | 具体体现 | 评估 |
|---------|---------|------|
| **全栈开发** | Next.js App Router、API Routes、React 状态管理 | ✅ 能独立搭建前后端 |
| **AI API 调用** | OpenAI SDK、多模态输入（图片+文字）、结构化 JSON 输出 | ✅ 能正确对接 LLM API |
| **Prompt Engineering 基础** | 带 schema 的 system prompt、动态 prompt 拼接、分屏独立 prompt | ✅ 有清晰的 prompt 设计意识 |
| **图像处理** | 客户端 Canvas 压缩、服务端 Sharp 压缩、base64 编解码 | ✅ 掌握图像管线 |
| **工程实践** | IPv4 强制解析、retry 机制、JSON 解析容错、localStorage 持久化 | ✅ 有实际踩坑和解决问题的经验 |
| **视觉设计 prompt** | 设计系统块（色板/字体/排版流派）、排版约束规则 | ✅ 对 AI 出图有精细化控制的探索 |

### 你当前水平的诚实定位

你已经**不是入门级**了。你已经走过了"调通 API、让 AI 返回东西"的阶段，进入了"如何让 AI 返回**好的**东西"的阶段——从你的对话历史可以看出，你花了大量时间在 prompt 工程上，从固定模板 → 动态 AI 驱动 → 高级排版流派指令，这是真正在深入的表现。

但以下几个方面，你目前的项目还没有触及：

| 未覆盖的领域 | 说明 |
|-------------|------|
| **组件化/架构** | 780 行的单文件 page.tsx，所有逻辑、类型、UI 都在一起 |
| **状态管理** | 纯 useState，没有 Context/Zustand/状态机 |
| **错误边界** | 没有 ErrorBoundary，没有请求重试 UI 模式 |
| **测试** | 零测试代码 |
| **认证/多用户** | 无用户系统，纯本地数据 |
| **流式响应** | 所有 AI 调用都是等待完整响应，没有 streaming |
| **AI Agent/多步推理** | 单次 API 调用，没有多步 agent 编排 |
| **向量数据库/RAG** | 没有检索增强生成 |
| **Fine-tuning** | 没有模型微调 |

---

## 推荐学习路线

> [!IMPORTANT]
> 以下路线是**递进式**的。每个阶段都建立在前一个之上。不要跳级，每一步都实际写代码验证。

---

## 学习方法论总纲：怎么学才不白学

在进入具体阶段之前，先建立一套学习习惯。很多人看了无数教程但还是写不出东西，不是因为不够聪明，而是**学习方法不对**。

### 三条核心原则

**1. 项目驱动，不要教程驱动**
看教程是被动输入，大脑很容易产生"我会了"的错觉。正确做法：每个阶段选一个**你自己的项目**作为实验田（就用你现在的家具详情页生成器），学一个概念立刻在项目里用上。看完 10 分钟教程 → 立刻写 30 分钟代码。

**2. 输出倒逼输入**
每学完一个模块，写一篇笔记（哪怕是给自己看的）。笔记不是抄文档，而是回答三个问题：
- 这个东西解决什么问题？（为什么存在）
- 它怎么工作的？（核心机制，一两句话讲清楚）
- 我在项目里怎么用的？（贴真实代码片段）

**3. 刻意练习，不是重复练习**
重复做已经会的事情不叫学习。刻意练习的意思是：每次都做**刚好超出你当前能力一点点**的事情。如果你写一个组件很轻松，说明难度不够——试试给它加错误处理、加 loading 状态、加测试。

### 每日学习节奏建议

| 时间段 | 做什么 | 时长 |
|--------|--------|------|
| **早上/精力最好时** | 学新概念（看文档、看课程） | 45-60 分钟 |
| **下午/晚上** | 动手写代码（把刚学的用到项目里） | 60-90 分钟 |
| **周末** | 复盘本周学的、写笔记、重构本周写的烂代码 | 2-3 小时 |

> 每天 2 小时 > 周末一天 10 小时。频率比强度重要。

### 如何判断自己真的学会了

不要用"我看完了教程"来判断。用这些标准：

- ✅ 能不查文档写出核心 API 的用法
- ✅ 能向一个新手解释清楚这个概念（用口语，不用术语）
- ✅ 能在自己的项目里用上，并且跑通
- ✅ 能说出这个东西的**局限性**——什么场景下不该用它

---

### 阶段一：工程基本功补全（1-2 周）

**为什么先做这个**：你现在的代码能跑，但不够健壮。780 行单文件在功能继续增长时会变得不可维护。这不是 AI 的问题，是软件工程的问题。

#### 学什么

1. **React 组件拆分 & 自定义 Hook**
   - 把 page.tsx 拆成 `ImageUploader`、`ConfigPanel`、`ScreenPreview`、`HistoryPanel` 等组件
   - 把 AI 调用逻辑抽成 `useAnalyze()` 和 `useGenerateDetail()` 自定义 Hook
   - 目标：每个文件不超过 200 行

2. **TypeScript 类型系统的进阶用法**
   - 把你的 `AIResult`、`ScreenImage` 等类型提取到 `types/` 目录
   - 学习 discriminated union（你的 status 字段就是天然的 discriminated union）
   - 用 Zod 做运行时类型校验（验证 AI 返回的 JSON 真的符合 schema）

3. **Error Boundary + 统一错误处理**
   - 给 AI 调用加上 React Error Boundary
   - 统一的 toast/notification 组件替代 `alert()`

---

#### 在哪学

| 资源 | 类型 | 费用 | 适合学什么 | 备注 |
|------|------|------|-----------|------|
| [React 官方文档 - Thinking in React](https://react.dev/learn/thinking-in-react) | 官方文档 | 免费 | 组件拆分思维 | **必读**，30 分钟看完，立刻动手拆 |
| [React 官方文档 - Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks) | 官方文档 | 免费 | 自定义 Hook | 20 分钟，看完把你的 AI 调用逻辑抽成 Hook |
| [TypeScript 官方 Handbook](https://www.typescriptlang.org/docs/handbook/) | 官方文档 | 免费 | TS 类型系统 | 不用全看，重点看 Objects、Unions、Type Narrowing 三章 |
| [Zod 官方文档](https://zod.dev) | 官方文档 | 免费 | 运行时校验 | 看 Quick Start + Objects 两节就够了 |
| [Josh Comeau - Joy of React](https://www.joyofreact.com/) | 视频课程 | 付费（$199） | 组件设计思维 | 贵但值，React 教学天花板。如果预算有限可以先跳过，用官方文档替代 |
| [Dan Abramov - A Complete Guide to useEffect](https://overreacted.io/a-complete-guide-to-useeffect/) | 博客 | 免费 | 理解 useEffect 心智模型 | React 核心团队成员写的，比任何教程都透彻 |
| [Epic React](https://epicreact.dev/) | 视频课程 | 付费 | React 进阶模式 | Kent C. Dodds 的课，偏实战。有预算时考虑 |

> **免费路线**：React 官方文档 + TypeScript Handbook + Zod 文档 + Dan 的博客 = 零成本学完阶段一。

---

#### 怎么学

**第 1-3 天：组件拆分**

1. 打开你的 page.tsx，用纸笔画出组件树（不要写代码，先画图）
2. 按"一个组件只做一件事"原则，列出：`ImageUploader`、`ConfigPanel`、`ScreenPreview`、`HistoryPanel`、`Header`
3. 创建 `src/components/` 目录，逐个迁移
4. 每迁移一个组件，确认 `npm run dev` 不报错再继续
5. 拆分完成后，page.tsx 应该只剩布局骨架（不超过 80 行）

**第 4-5 天：自定义 Hook**

1. 找出 page.tsx 中所有以 `use` 开头的逻辑块（useState、useEffect、useCallback）
2. 把 AI 分析相关的状态和逻辑抽成 `useAnalyze()` Hook
3. 把详情页生成相关的抽成 `useGenerateDetail()` Hook
4. 把图片压缩逻辑抽成 `useImageCompress()` Hook
5. 验证：Hook 之间不应该互相依赖，每个 Hook 可以独立测试

**第 6-7 天：类型系统 + Zod 校验**

1. 创建 `src/types/index.ts`，把所有 interface/type 移进去
2. 把 `status` 字段改成 discriminated union：
   ```ts
   type AppState =
     | { status: 'idle' }
     | { status: 'analyzing' }
     | { status: 'analyzed'; result: AIResult }
     | { status: 'error'; error: string }
   ```
3. 用 Zod 定义 AI 返回值的 schema，在 API route 里校验
4. 校验失败时打印 warning 而不是崩溃——AI 偶尔不按 schema 返回是正常的

**第 8-10 天：Error Boundary + Toast**

1. 写一个 `<ErrorBoundary>` 组件包裹 AI 分析区域
2. 用 [react-hot-toast](https://react-hot-toast.com/) 或 [sonner](https://sonner.emilkowal.ski/) 替代 `alert()`
3. 给所有 AI 调用加上 try-catch，错误信息通过 toast 展示
4. 加一个"重试"按钮在 ErrorBoundary 的 fallback UI 里

**自检清单**

- [ ] page.tsx 不超过 80 行
- [ ] 每个组件文件不超过 200 行
- [ ] 所有类型定义在 `types/` 目录
- [ ] AI 返回值经过 Zod 校验
- [ ] 有 ErrorBoundary 且 fallback UI 包含重试按钮
- [ ] 不再使用 `alert()`，全部用 toast

---

### 阶段二：Prompt Engineering 深化（2-3 周）

**为什么做这个**：你已经有 prompt engineering 的直觉了（从你的排版流派指令可以看出），但可以更系统化。

#### 学什么

1. **流式响应（Streaming）**
   - 把 `/api/analyze` 改成 Server-Sent Events 流式返回
   - 前端用 `ReadableStream` 实时显示 AI 思考过程
   - 用户体验会从"等 10 秒看结果"变成"实时看 AI 在写"

2. **Few-shot Prompting**
   - 在 prompt 中加入 1-2 个高质量输出的 example
   - 对比加 example 前后的输出质量差异
   - 建立你自己的"原则"：什么时候 few-shot 帮助最大

3. **Prompt 版本管理**
   - 把 prompt 模板从代码中提取出来，存到独立文件里
   - 建立 A/B 测试机制：相同图片，不同 prompt，对比输出
   - 记录哪些 prompt 改动带来了实际的质量提升

4. **结构化输出的高级控制**
   - 学习 function calling / tool use 模式
   - 对比 `response_format: json_object` vs function calling 的可靠性
   - 处理 AI "幻觉"：检测生成的颜色 hex 是否合法、尺寸是否合理等

---

#### 在哪学

| 资源 | 类型 | 费用 | 适合学什么 | 备注 |
|------|------|------|-----------|------|
| [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering) | 官方文档 | 免费 | Prompt 六大策略 | **必读**，OpenAI 官方总结的最佳实践，2 小时看完 |
| [Anthropic Prompt Engineering](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering) | 官方文档 | 免费 | Claude 的 prompt 方法论 | Anthropic 的 prompt 指南比 OpenAI 更细致，互补着看 |
| [Google AI - Prompt Design](https://ai.google.dev/gemini-api/docs/prompting-strategies) | 官方文档 | 免费 | Gemini 的 prompt 策略 | 你用的是 Gemini，这个必看 |
| [Lilian Weng - Prompt Engineering](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/) | 博客 | 免费 | Prompt 工程学术综述 | OpenAI 研究员的深度文章，偏理论但讲得很清楚 |
| [Vercel AI SDK - Streaming](https://sdk.vercel.ai/docs/ai-sdk-core/generating-text) | 官方文档 | 免费 | 流式响应实现 | 和你的 Next.js 技术栈完美匹配，直接抄代码 |
| [OpenAI - Function Calling](https://platform.openai.com/docs/guides/function-calling) | 官方文档 | 免费 | Tool Use 模式 | 结构化输出的终极方案 |
| [Prompt Engineering Guide (DAIR.AI)](https://www.promptingguide.ai/zh) | 社区教程 | 免费 | 全面入门 | **有中文版**，覆盖所有主流 prompt 技术 |
| [Anthropic - Prompt Evaluator](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-evaluator) | 工具 | 免费 | 自动评估 prompt 质量 | 上传 prompt 自动打分和改进建议 |

> **免费路线**：OpenAI 指南 + Anthropic 指南 + Vercel AI SDK 文档 + PromptingGuide.ai = 零成本学完阶段二。

---

#### 怎么学

**第 1-3 天：流式响应改造**

1. 先不改你自己的项目，用 Vercel AI SDK 的 `streamText` 写一个 demo 页面感受一下
2. 把 `/api/analyze` 从 `return Response.json(...)` 改成流式返回
3. 前端用 `useChat` hook（Vercel AI SDK 提供的）替代 `fetch`
4. 在 UI 上显示"AI 正在分析..."的逐字输出效果
5. 对比改造前后的体感差异——你会发现等待感消失了

**第 4-7 天：Few-shot Prompting 实验**

1. 从你的历史生成结果中，挑 2 个你最满意的输出
2. 把它们作为 example 嵌入 prompt（注意：example 要精简，只保留关键字段）
3. 用同一张图片，分别跑"无 example"和"有 example"两个版本
4. 对比输出质量，记录差异（格式规范性、描述准确性、设计建议质量）
5. 总结规律：你的场景下，few-shot 对哪些维度提升最大？

**第 8-11 天：Prompt 版本管理**

1. 创建 `src/prompts/` 目录，把 prompt 模板从代码中抽出来
2. 每个 prompt 存为一个 `.ts` 文件，导出一个函数（接收参数，返回 prompt 字符串）
3. 建立 A/B 测试：写一个简单的脚本，同一张图片跑两个 prompt 版本，输出对比
4. 建一个 `PROMPT_CHANGELOG.md`，记录每次 prompt 改动和效果变化
5. 目标：改 prompt 不需要改业务代码，只改 prompt 文件

**第 12-14 天：结构化输出 + 幻觉检测**

1. 学习 function calling：在 API 调用时定义 `tools` 参数，让 AI 按你的 schema 返回
2. 对比 function calling 和 `response_format: json_object` 的可靠性（function calling 通常更稳定）
3. 写一个"幻觉检测器"：校验 AI 返回的颜色 hex 是否合法（正则 `/^#[0-9A-F]{6}$/i`）、尺寸数值是否在合理范围
4. 幻觉检测不通过时，自动重试（最多 2 次）

**自检清单**

- [ ] API 返回是流式的，前端能看到逐字输出
- [ ] prompt 模板全部在 `src/prompts/` 目录，不在业务代码里
- [ ] 至少做过 3 次 A/B 对比实验，有记录
- [ ] 使用了 function calling 做结构化输出
- [ ] 有幻觉检测逻辑，能自动发现并重试异常输出

---

### 阶段三：AI Agent & 多步工作流（3-4 周）

**为什么做这个**：你当前的系统是"单次调用"模式——分析一次，生成一次。真实的 AI 应用需要多步骤编排。

#### 学什么

1. **Multi-step Agent 设计**
   - 把你现在的"分析 → 生成"两步流程扩展为：
     ```
     分析图片 → 生成设计方案 → 评审设计质量 → 如果不达标则自动调整 → 输出
     ```
   - 引入"自我评审"（self-critique）：让一个 AI 检查另一个 AI 的输出质量
   - 实现一个简单的 agent loop（循环直到满意）

2. **工具调用（Tool Use / Function Calling）**
   - 让 AI 不只是返回文本，而是**调用工具**
   - 例如：AI 分析图片后，自动调用"背景去除 API"、"调色板提取 API"
   - 实现一个 mini Agent 框架：接收任务 → 决定用什么工具 → 执行 → 返回结果

3. **RAG（检索增强生成）入门**
   - 建立一个"优秀详情页案例库"
   - 用向量数据库（推荐 ChromaDB 或 Pinecone）存储案例的 embedding
   - 生成时检索相似案例作为参考，提升输出质量

---

#### 在哪学

| 资源 | 类型 | 费用 | 适合学什么 | 备注 |
|------|------|------|-----------|------|
| [Vercel AI SDK - Agents](https://sdk.vercel.ai/docs/ai-sdk-core/agents) | 官方文档 | 免费 | Agent 编排 | **首选**，和你的 Next.js 技术栈原生集成，代码量最少 |
| [LangChain.js 文档](https://js.langchain.com/docs/) | 官方文档 | 免费 | Agent + RAG + 工具调用 | 生态最全的 AI 框架，JS 版本和你的技术栈匹配 |
| [Andrew Ng - AI Agentic Design Patterns (含 AutoGen)](https://www.deeplearning.ai/short-courses/ai-agentic-design-patterns-with-autogen/) | 视频课程 | 免费 | Agent 设计模式 | 1.5 小时，Andrew Ng 讲 Agent 的四种核心模式 |
| [Andrew Ng - Building Agentic RAG with LlamaIndex](https://www.deeplearning.ai/short-courses/building-agentic-rag-with-llamaindex/) | 视频课程 | 免费 | Agentic RAG | 1 小时，把 RAG 和 Agent 结合起来 |
| [Anthropic - Building Effective Agents](https://docs.anthropic.com/en/docs/build-with-claude/agent-patterns) | 官方文档 | 免费 | Agent 设计原则 | Anthropic 的 Agent 最佳实践，强调"简单优于复杂" |
| [OpenAI - Agents SDK](https://platform.openai.com/docs/guides/agents) | 官方文档 | 免费 | OpenAI 原生 Agent | 如果你主要用 OpenAI，这个比 LangChain 更轻量 |
| [ChromaDB 文档](https://docs.trychroma.com/) | 官方文档 | 免费 | 向量数据库 | 最简单的向量数据库，本地跑，适合学习 |
| [Pinecone 文档](https://docs.pinecone.io/) | 官方文档 | 免费层 | 托管向量数据库 | 有免费层，不需要自己运维，适合生产环境 |
| [LangGraph.js](https://langchain-ai.github.io/langgraphjs/) | 官方文档 | 免费 | 状态机式 Agent | 比 LangChain 更灵活，用图来编排 Agent 流程 |

> **免费路线**：Vercel AI SDK 文档 + Andrew Ng 两门短课 + ChromaDB 文档 = 零成本学完阶段三。

---

#### 怎么学

**第 1-5 天：理解 Agent 概念 + 跑通第一个 Demo**

1. 先看 Andrew Ng 的 Agentic Design Patterns 短课（1.5 小时），理解四种 Agent 模式：
   - Reflection（反思）：AI 检查自己的输出
   - Tool Use（工具调用）：AI 调用外部工具
   - Planning（规划）：AI 分解任务
   - Multi-agent（多智能体）：多个 AI 协作
2. 用 Vercel AI SDK 的 `generateText` + `maxSteps` 参数，写一个带 self-reflection 的 demo
3. 流程：AI 生成 → AI 自己评审 → 如果不满意自动重写 → 输出最终版
4. 把这个 demo 跑通，感受 Agent 和单次调用的本质区别

**第 6-10 天：在你的项目中实现 Agent 流程**

1. 把你现有的"分析 → 生成"流程改成 Agent 模式：
   ```
   分析图片 → 生成设计方案 → 评审（检查颜色搭配、排版建议、文案质量）
   → 如果评分 < 7/10 → 根据评审意见重新生成 → 再次评审 → 输出
   ```
2. 设置最大循环次数（比如 3 次），防止无限循环烧 token
3. 在 UI 上展示 Agent 的思考过程（"正在分析..." → "正在评审..." → "正在优化..."）
4. 对比 Agent 模式和单次调用的输出质量差异

**第 11-16 天：工具调用实战**

1. 定义 2-3 个工具函数，比如：
   - `extract_color_palette(imageUrl)` → 调用调色板 API 提取主色调
   - `search_design_references(style)` → 搜索设计参考案例
2. 在 Agent 流程中让 AI 决定何时调用这些工具
3. 实现工具调用的错误处理：工具调用失败时，Agent 应该能优雅降级

**第 17-21 天：RAG 入门**

1. 收集 10-20 个你认为优秀的电商详情页截图或描述
2. 用 ChromaDB 本地搭建向量数据库
3. 把案例转成 embedding 存入 ChromaDB（用 OpenAI 或 Gemini 的 embedding API）
4. 在生成详情页时，先检索 3 个最相似的优秀案例
5. 把检索到的案例作为参考注入 prompt
6. 对比有 RAG 和无 RAG 的输出质量

**自检清单**

- [ ] 项目中有 Agent 流程（至少包含 self-reflection 环节）
- [ ] Agent 有最大循环次数限制，不会无限重试
- [ ] UI 上能看到 Agent 的多步思考过程
- [ ] 至少实现了 2 个工具函数供 Agent 调用
- [ ] RAG 案例库至少 10 个案例，能检索并注入 prompt
- [ ] 能说出 Agent 模式和单次调用的三个核心区别

---

### 阶段四：部署与产品化（2-3 周）

**为什么做这个**：你的项目目前只能本地跑。要让别人能用，需要部署、认证、数据库。

#### 学什么

1. **部署到 Vercel**
   - 学习 Vercel 的 serverless function 限制（超时、内存）
   - 理解你的 `maxDuration = 240` 在 Vercel 免费版上不可用（最大 60s）
   - 学习如何用队列（BullMQ / Inngest）处理长时间的 AI 任务

2. **数据库 + 认证**
   - 用 Supabase 或 Neon（Postgres）替代 localStorage
   - 加入用户认证（NextAuth.js 或 Clerk）
   - 每个用户有自己的生成历史

3. **API 成本优化**
   - 实现缓存层：相同图片 + 相同配置不重复调用 AI
   - Token 用量追踪和预算控制
   - 用户配额管理

---

#### 在哪学

| 资源 | 类型 | 费用 | 适合学什么 | 备注 |
|------|------|------|-----------|------|
| [Vercel 部署文档](https://vercel.com/docs/deployments/overview) | 官方文档 | 免费 | 部署基础 | 30 分钟看完，然后直接部署你的项目 |
| [Vercel - Serverless Function Limits](https://vercel.com/docs/functions/limitations) | 官方文档 | 免费 | 理解限制 | **必读**，知道免费版能做什么不能做什么 |
| [Supabase 官方教程](https://supabase.com/docs/guides/getting-started) | 官方文档 | 免费 | 数据库 + 认证 | 一站式后端，Postgres + Auth + Storage |
| [Supabase + Next.js 集成指南](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs) | 官方文档 | 免费 | Next.js 集成 | 15 分钟快速上手，直接跟着做 |
| [NextAuth.js (Auth.js) 文档](https://authjs.dev/) | 官方文档 | 免费 | 认证系统 | 如果你不想用 Supabase Auth，这是最流行的选择 |
| [Clerk 文档](https://clerk.com/docs) | 官方文档 | 免费层 | 认证（更简单） | 比 NextAuth 更傻瓜式，免费层够个人项目用 |
| [Inngest 文档](https://www.inngest.com/docs) | 官方文档 | 免费层 | 后台任务队列 | 处理超时的 AI 任务，和 Vercel 配合很好 |
| [Upstash Redis](https://upstash.com/docs/redis) | 官方文档 | 免费层 | 缓存层 | 实现 AI 响应缓存，减少重复调用 |
| [Vercel - ISR & Caching](https://vercel.com/docs/incremental-static-regeneration) | 官方文档 | 免费 | 缓存策略 | 理解 Vercel 的缓存机制，避免不必要的 API 调用 |

> **免费路线**：Vercel 文档 + Supabase 教程 + Inngest 文档 = 零成本学完阶段四。所有服务都有免费层。

---

#### 怎么学

**第 1-3 天：首次部署**

1. 把项目推到 GitHub（如果还没推的话）
2. 在 Vercel 上 import 你的 GitHub 仓库，一键部署
3. 设置环境变量（API keys 等）
4. 测试部署后的功能——大概率 AI 调用会超时（因为免费版 60s 限制）
5. 这就是你要解决的问题：长任务怎么处理？

**第 4-7 天：处理长任务**

1. 学习 Inngest：把 AI 调用从 API route 中拆出来，变成后台任务
2. 流程变成：前端请求 → API route 创建任务 → 返回任务 ID → 前端轮询任务状态 → 任务完成后获取结果
3. 或者用 Vercel AI SDK 的 streaming 来规避超时（流式响应不会超时）
4. 部署后确认 AI 功能正常工作

**第 8-11 天：数据库 + 认证**

1. 注册 Supabase，创建项目
2. 用 Supabase 的 `nextjs` quickstart 集成到你的项目
3. 设计数据库表：`users`、`generations`（每次 AI 生成的结果）
4. 把 localStorage 的逻辑全部替换为 Supabase 读写
5. 接入认证（Supabase Auth 或 Clerk），让用户能登录

**第 12-14 天：成本优化**

1. 实现缓存：用 Upstash Redis 或简单的内存缓存，相同输入不重复调 AI
2. 记录每次 AI 调用的 token 消耗
3. 在 UI 上显示"本月已用 X tokens"
4. 设置硬限制：超过配额后拒绝请求，提示用户下月再来

**自检清单**

- [ ] 项目成功部署到 Vercel，可以通过 URL 访问
- [ ] AI 功能在线上正常运行（不超时）
- [ ] 用户数据存储在 Supabase，不再用 localStorage
- [ ] 有用户登录/注册功能
- [ ] 有 AI 调用缓存，相同输入不重复调用
- [ ] 有 token 用量追踪和配额限制

---

### 阶段五：前沿 AI 能力（持续）

**这个阶段没有终点，跟着领域一起前进。**

#### 学什么

1. **Fine-tuning**
   - 收集你项目中"好的"分析结果作为训练数据
   - 用 OpenAI 或开源模型（Llama）做 fine-tune
   - 对比微调前后在你的家具分析场景下的质量差异

2. **多模态 AI 的深度应用**
   - 图像分割（SAM）：自动抠出产品
   - 图像生成的 ControlNet：精确控制生成图片的构图
   - 视频生成：把静态详情页变成短视频

3. **AI 评估（Evaluation）**
   - 建立你自己的评估体系：什么是"好的"详情页？
   - 用 LLM-as-Judge 自动评分
   - 追踪指标：生成成功率、用户满意度、导出次数

---

#### 在哪学

| 资源 | 类型 | 费用 | 适合学什么 | 备注 |
|------|------|------|-----------|------|
| [Andrew Ng - Machine Learning Specialization](https://www.coursera.org/specializations/machine-learning-introduction) | 视频课程 | 免费旁听 | ML 底层原理 | 三周课，理解神经网络怎么工作的，不是必须但强烈推荐 |
| [DeepLearning.AI - Finetuning Large Language Models](https://www.deeplearning.ai/short-courses/finetuning-large-language-models/) | 视频课程 | 免费 | Fine-tuning 入门 | 1.5 小时，教你什么时候该微调、什么时候不该微调 |
| [OpenAI - Fine-tuning Guide](https://platform.openai.com/docs/guides/fine-tuning) | 官方文档 | 免费 | OpenAI 微调 | 实操指南，直接上传数据开始微调 |
| [Hugging Face 课程](https://huggingface.co/learn/nlp-course) | 互动课程 | 免费 | 开源模型生态 | 从零到能用 Transformers，开源 AI 的入口 |
| [Unsloth](https://docs.unsloth.ai/) | 工具文档 | 免费 | 高效微调开源模型 | 让消费级显卡也能微调 Llama 等大模型 |
| [Meta - SAM 2](https://github.com/facebookresearch/sam2) | 开源项目 | 免费 | 图像分割 | 自动抠图神器，可以集成到你的图片处理管线 |
| [Hugging Face Diffusers](https://huggingface.co/docs/diffusers/) | 开源库 | 免费 | 图像生成 | Stable Diffusion 的 Python 库，ControlNet 也在这里 |
| [DeepLearning.AI - Evaluating and Debugging Generative AI](https://www.deeplearning.ai/short-courses/evaluating-debugging-generative-ai/) | 视频课程 | 免费 | AI 评估 | 1.5 小时，系统学习如何评估 AI 输出质量 |
| [Arize AI - LLM Evaluation](https://arize.com/blog-course/llm-evaluation/) | 博客 + 工具 | 免费 | LLM 评估体系 | 工业级评估方案，偏进阶 |

> **免费路线**：DeepLearning.AI 短课 + Hugging Face 课程 + OpenAI 微调文档 = 零成本入门阶段五。

---

#### 怎么学

**Fine-tuning（第 1-3 周）**

1. 先看 DeepLearning.AI 的微调短课，理解"什么时候该微调"——大多数情况下 prompt engineering 就够了
2. 从你的项目中收集 50+ 条"好的分析结果"（人工筛选）
3. 格式化为 OpenAI 的微调数据格式（JSONL）
4. 用 OpenAI 的 fine-tuning API 提交训练任务（成本约 $10-50）
5. 对比微调前后的输出质量——在你的家具分析场景下，微调可能让输出更稳定、更符合你的审美
6. 如果效果好，考虑用 Unsloth 微调开源模型（Llama 3），成本更低

**多模态 AI（第 4-6 周）**

1. 跑通 SAM 2 的 demo：上传一张家具图，自动抠出产品主体
2. 把 SAM 2 集成到你的图片处理管线：用户上传图片 → SAM 自动去背景 → 干净的素材给 AI 分析
3. 了解 ControlNet 的概念：用一张参考图控制 AI 生成图片的构图和风格
4. 思考：ControlNet 能不能用来生成"统一风格"的详情页配图？

**AI 评估（持续）**

1. 定义你的评估维度：文案质量、设计建议实用性、颜色搭配合理性、格式规范性
2. 用 LLM-as-Judge：写一个 prompt，让 AI 给另一个 AI 的输出打分（1-10）
3. 人工抽查 20 条 AI 评分，看 AI 评分和你的主观判断是否一致
4. 建立 dashboard：生成成功率、平均评分、token 消耗趋势
5. 每周花 30 分钟看数据，找出最需要优化的环节

**自检清单**

- [ ] 完成至少一次 fine-tuning 实验，有前后对比数据
- [ ] 理解 fine-tuning vs prompt engineering 的适用场景
- [ ] 跑通过 SAM 2 或类似图像分割工具
- [ ] 有自己的 AI 输出评估体系（至少 3 个评估维度）
- [ ] 有追踪关键指标的习惯（成功率、token 消耗等）

---

## 我的具体建议：立刻做什么

> [!TIP]
> 不要同时开始所有东西。下一步最高优先级的事情是：

### 本周就做

1. **把 page.tsx 拆成组件** — 这是代码可持续发展的基础，不拆下去越写越痛苦
2. **接入 Vercel AI SDK 的 streaming** — 改动量小（主要改 API route），但用户体验提升巨大

### 这两个做完之后

3. **学 LangChain 或 Vercel AI SDK 的 Agent 模式** — 给你的生成流程加上"自我评审"，让 AI 自动判断生成质量并迭代

这三步做完，你的项目会从一个"能用的 demo"变成一个"有竞争力的产品原型"。

---

## 总结

你目前在 AI 应用开发领域的位置：

```
入门           你在这里                          前沿
 |-------|---------|--------|---------|---------|
 调通API   prompt   agent    产品化    fine-tune
          engineering 多步编排          + 评估
```

你不是初学者，但也不是高级。你处在一个**关键拐点**——从"会调 API"到"会构建 AI 系统"的过渡期。阶段一的工程基本功和阶段三的 Agent 编排，是拉开差距的关键。

---

## 附录一：学习社区与信息源

光看教程不够，你需要泡在信息流里。以下按推荐程度排序：

### 必关注

| 信息源 | 平台 | 为什么关注 |
|--------|------|-----------|
| [Simon Willison 的博客](https://simonwillison.net/) | 博客 | AI 工程实践第一人，每篇都值得读。他的 `llm` 工具和 blog 是宝藏 |
| [Vercel AI SDK Changelog](https://sdk.vercel.ai/docs/ai-sdk-core/changelog) | 文档 | 前端 AI 开发的风向标，更新极快 |
| [LangChain Blog](https://blog.langchain.dev/) | 博客 | Agent/RAG 的最新模式和最佳实践 |
| [Hacker News](https://news.ycombinator.com/) | 社区 | 每天刷 10 分钟，看行业在讨论什么 |
| [DeepLearning.AI - The Batch](https://www.deeplearning.ai/the-batch/) | 邮件通讯 | 每周一封，AI 领域最重要的新闻汇总 |

### 中文资源

| 信息源 | 平台 | 为什么关注 |
|--------|------|-----------|
| [Prompt Engineering Guide 中文版](https://www.promptingguide.ai/zh) | 网站 | 最全的中文 prompt 工程教程 |
| [机器之心](https://www.jiqizhixin.com/) | 媒体 | 国内 AI 新闻和技术解读 |
| [宝玉的 Twitter/X](https://x.com/dotey) | 社交媒体 | 中文 AI 圈最活跃的技术分享者 |
| [WaytoAGI 知识库](https://waytoagi.feishu.cn/wiki/QPe5w5g7UisVm0kQ5LgcV0nEnRc) | 飞书文档 | 中文 AI 学习资源大合集 |

### 什么时候看什么

- **每天早上 10 分钟**：刷 Hacker News 首页 + Vercel AI SDK Changelog
- **每周六上午 30 分钟**：读一篇 Simon Willison 的博客 + The Batch 邮件
- **遇到具体问题时**：直接搜 LangChain Blog 或官方文档，不要从零开始看

---

## 附录二：工具链速查

这些是你学习过程中会反复用到的工具，提前装好：

| 工具 | 用途 | 安装方式 |
|------|------|---------|
| [Node.js 20+](https://nodejs.org/) | 运行时 | 你已经有 |
| [VS Code](https://code.visualstudio.com/) | 编辑器 | 你已经有 |
| [GitHub Copilot](https://github.com/features/copilot) | AI 编程助手 | VS Code 插件，免费层够用 |
| [ChromaDB](https://docs.trychroma.com/) | 向量数据库 | `pip install chromadb`（阶段三用） |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | 容器 | ChromaDB 推荐用 Docker 跑 |
| [Postman / Bruno](https://www.usebruno.com/) | API 测试 | 调试 AI API 时比 curl 好用 |
| [Vercel CLI](https://vercel.com/cli) | 部署工具 | `npm i -g vercel` |
| [Supabase CLI](https://supabase.com/docs/guides/cli) | 数据库本地开发 | `npm i -g supabase` |

---

## 附录三：五个阶段的时间线总览

```
第 1-2 周    ████████░░░░░░░░░░░░  阶段一：工程基本功
第 3-5 周    ░░░░░░░░████████░░░░  阶段二：Prompt Engineering 深化
第 6-9 周    ░░░░░░░░░░░░░░██████  阶段三：AI Agent & 多步工作流
第 10-12 周  ░░░░░░░░░░░░░░░░░░██  阶段四：部署与产品化
第 13 周+    ░░░░░░░░░░░░░░░░░░░░  阶段五：前沿能力（持续）
```

**总计约 3 个月**可以从"会调 API"进化到"能构建 AI 产品"。之后进入阶段五的持续学习。

---

## 附录四：常见坑与避坑指南

| 坑 | 表现 | 怎么避免 |
|----|------|---------|
| **教程地狱** | 看了一个月教程还没写一行代码 | 每个教程最多看 30 分钟，然后必须动手 |
| **过早优化** | 还没跑通就想着架构、性能、扩展性 | 先让代码能跑，再让它跑得好。阶段一之前不要想架构 |
| **追逐新工具** | 每周换一个框架，什么都没深入 | 选 Vercel AI SDK + LangChain 就够了，不要碰其他框架直到这两个用熟 |
| **忽视成本** | AI 调用没限制，月底账单吓人 | 从第一天就加 token 计数和配额限制 |
| **完美主义** | 总觉得不够好，不敢部署 | 阶段四第一天就部署，哪怕功能不完整。线上有 bug 比本地完美强 100 倍 |
| **孤军奋战** | 遇到问题自己憋着，浪费大量时间 | 去 LangChain Discord、Vercel Discord、或者 Twitter/X 上问 |

---

## 附录五：如果你只有碎片时间

不是每个人都能每天投入 2 小时。如果你时间很碎，按这个优先级来：

1. **最高优先级**：阶段一的组件拆分（让代码可持续）
2. **次高优先级**：阶段二的流式响应（用户体验质变）
3. **有时间再做**：阶段三的 Agent 编排（能力质变）
4. **想给别人用时做**：阶段四的部署 + 认证
5. **有余力时探索**：阶段五的各项前沿技术

> 哪怕只做完 1 和 2，你的项目就已经脱胎换骨了。
