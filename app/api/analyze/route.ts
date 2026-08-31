import { NextResponse } from "next/server";
import OpenAI from "openai";
import dns from "dns";

// 强制 IPv4 解析，避免代理节点 IPv6 黑洞
dns.setDefaultResultOrder("ipv4first");

export const maxDuration = 240;

const CONFIG = {
  baseURL: process.env.API_BASE_URL!,
  apiKey: process.env.API_KEY!,
  model: process.env.ANALYZE_API_MODEL || "deepseek-v4-flash-vision-exp"
};

// 完整 JSON schema — 始终请求全部字段供出图使用
const FULL_SCHEMA = `{
  "title": "极具吸引力的商品主标题（8-15字）",
  "subtitle": "副标题/促销卖点（10-20字）",
  "brandName": "品牌名称（2-4个中文字，简洁有力）",
  "brandSlogan": "品牌口号（8-15字，体现品质生活理念）",
  "emotionalCopy": "情感文案段落（2-3句话，用于详情页氛围渲染，描述产品带来的生活方式）",
  "qualityTags": ["品质标签1", "品质标签2", "品质标签3", "品质标签4"]（4个简短标签词，如品质、专业、耐用、100%真材实料）,
  "heroSection": { "tagline": "一句打动用户的核心口号", "highlights": ["亮点1", "亮点2", "亮点3"] },
  "sellingPoints": [{ "title": "卖点标题", "description": "详细描述" }]（生成3-5个卖点）,
  "materials": [{ "index": 1, "name": "材质名称（如优良摔纹皮）", "description": "材质特点描述" }]（生成2个材质）,
  "details": [{ "detailName": "细节名称（如面料/防滑/填充/技艺）", "title": "简短标题", "description": "细节描述（8-12字）" }]（生成4个细节）,
  "dimensions": { "width": "宽度cm", "height": "高度cm", "depth": "深度cm" }（根据图片合理估算产品三维尺寸）,
  "specs": {
    "color": "可选颜色（用/分隔）",
    "frameMaterial": "框架材质",
    "filling": "填充物",
    "mainMaterial": "主要材质",
    "fabric": "面料材质"
  },
  "designDirection": {
    "styleName": "视觉风格名称（如意式轻奢、北欧极简、新中式雅致、工业复古、法式浪漫等，要有创意）",
    "colorPalette": {
      "background": "主背景色 hex",
      "accent": "强调色 hex",
      "text": "主文字色 hex",
      "secondary": "辅助色 hex"
    },
    "typography": "推荐字体搭配描述（如衬线标题+无衬线正文、书法体标题+细体正文）",
    "layoutApproach": "从以下高级排版流派中任选其一指导作图：1.Swiss Style(非中心严格网格); 2.Negative Space Dominance(极简图文与大面积空旷留白); 3.Typographic Framing(文字沿图片边缘排布形成画框); 4.Staircase Alignment(阶梯状错落排布段落); 5.Overlap & Bleed(大字体叠底切出画幅)。",
    "moodDescription": "一句话概括整体视觉氛围"
  }
}`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { images, platform, market, language, visualStyle } = body;

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: "缺少必要参数 (图片)" },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      baseURL: CONFIG.baseURL,
      apiKey: CONFIG.apiKey,
      timeout: 120 * 1000,
      maxRetries: 3,
      defaultHeaders: {
        "Connection": "close"
      }
    });

    const usedPlatform = platform || "淘宝";
    const usedMarket = market || "中国大陆";
    const usedLanguage = language || "中文";
    const usedStyle = visualStyle || "现代简约";

    const systemPrompt = `你是一个专业的${usedPlatform}详情页文案大师和内容结构规划师。
目标市场：${usedMarket}
文案语种：${usedLanguage}
视觉风格：${usedStyle}

请仔细观察提供的所有家具实拍图片（共${images.length}张），综合分析后提取信息，并以严格的 JSON 格式返回：
${FULL_SCHEMA}

要求：
1. 文案风格要匹配${usedPlatform}平台的调性
2. 使用${usedLanguage}撰写所有内容
3. 面向${usedMarket}市场的消费者
4. 视觉风格描述要贴合"${usedStyle}"
5. 综合分析所有图片，不要只关注单张图
6. dimensions 字段请根据图片中家具的类型和比例合理估算尺寸
7. specs 字段请根据图片中能观察到的材质、颜色等信息填写
8. designDirection 字段：请根据产品的外观、材质、气质，推荐一套与之匹配的详情页视觉设计方向。
   每次分析都要给出独特的、有创意的设计方案，不要总是用白色简约风。
   要考虑：什么风格能最大化这个产品的视觉吸引力和高级感？
   colorPalette 中所有颜色必须是有效的 hex 色值（如 #1a1a2e）。
9. 排布随机性与突破性：每次生成必须从 layoutApproach 候选池中挑选一种特定的高级排版手段。通过结构变化（留白、阶梯排布、大字出血叠底等）来制造视觉冲击力，坚决避免简单粗暴地把所有文字和图片做全局倾斜。在保持构图创意性的同时，提供克制的高水平排版。
请直接返回 JSON 数据，不要包含 markdown 标记或任何其他说明文字。`;

    // 构建多图内容数组
    const imageContents = images.map((imgBase64: string) => ({
      type: "image_url" as const,
      image_url: { url: imgBase64 }
    }));

    const response = await openai.chat.completions.create({
      model: CONFIG.model,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: `请综合分析这${images.length}张家具图片并为其生成详情页文案。` },
            ...imageContents
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    let parsedContent;
    try {
      parsedContent = JSON.parse(content || "{}");
    } catch (e) {
      const cleanedContent = (content || "{}").replace(/```json/g, "").replace(/```/g, "").trim();
      parsedContent = JSON.parse(cleanedContent);
    }

    return NextResponse.json(parsedContent);

  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json(
      { error: error.message || "分析失败，请检查网络或配置" },
      { status: 500 }
    );
  }
}
