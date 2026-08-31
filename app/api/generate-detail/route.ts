import { NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";
import sharp from "sharp";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

export const maxDuration = 120;

const CONFIG = {
  baseURL: process.env.API_BASE_URL!,
  apiKey: process.env.API_KEY!,
  model: process.env.GENERATE_API_MODEL || "gemini-3-pro-image-preview"
};

// 服务端压缩图片：把 base64 data URL 缩到指定尺寸和质量
async function compressBase64Image(
  dataUrl: string,
  maxSize = 600,
  quality = 60
): Promise<string> {
  // 提取 base64 数据
  const match = dataUrl.match(/^data:image\/\w+;base64,(.+)$/);
  if (!match) return dataUrl; // 不是 data URL 则原样返回

  const buffer = Buffer.from(match[1], "base64");

  const compressed = await sharp(buffer)
    .resize(maxSize, maxSize, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality })
    .toBuffer();

  return `data:image/jpeg;base64,${compressed.toString("base64")}`;
}

// 构建视觉设计系统指令块（从 AI 分析结果中读取）
function buildDesignSystemBlock(analysis: Record<string, any>): string {
  const dd = analysis.designDirection;
  if (!dd) {
    // fallback：如果旧数据没有 designDirection，给一个基本指令让 AI 自由发挥
    return `
=== VISUAL DESIGN SYSTEM ===
Create a unique, premium avant-garde editorial aesthetic.
Choose a distinctive color palette and typography pairing.
Use strong visual contrast: Titles can be wildly expressive, but body details must be legible.
Apply varying graphic design techniques like Negative Space Dominance, Swiss Style Off-Center alignment, or Typographic Framing to achieve creativity, rather than lazily slanting everything.
`;
  }

  return `
=== VISUAL DESIGN SYSTEM (follow strictly for all screens) ===
Style: ${dd.styleName}
Background color: ${dd.colorPalette?.background || "#ffffff"}
Accent color: ${dd.colorPalette?.accent || "#333333"}
Text color: ${dd.colorPalette?.text || "#222222"}
Secondary color: ${dd.colorPalette?.secondary || "#999999"}
Typography: ${dd.typography || "elegant serif titles + clean sans-serif body"}
Layout approach: ${dd.layoutApproach || "modern editorial layout"}
Mood: ${dd.moodDescription || "premium and refined"}
`;
}

// 每屏的 prompt 生成函数
function buildScreenPrompt(
  screenType: string,
  analysis: Record<string, any>,
  imageCount: number
): string {
  const title = analysis.title || "优质家具";
  const subtitle = analysis.subtitle || "";
  const brandName = analysis.brandName || title;
  const brandSlogan = analysis.brandSlogan || "予你家的温馨";
  const emotionalCopy = analysis.emotionalCopy || "在快节奏的都市生活中，家是唯一能让我们彻底放松的港湾。";
  const qualityTags = (analysis.qualityTags || ["品质", "专业", "耐用", "100%真材实料"]).join(" | ");

  const designSystem = buildDesignSystemBlock(analysis);

  const constraints = `
=== CONSTRAINTS ===
- Portrait orientation, 1024×1536 pixels
- High-end editorial e-commerce product detail page
- Keep the product EXACTLY as-is, do NOT redraw or modify the product appearance
- DESIGN RULE: Text Function Segregation. Large decorative titles/tags can be vertical, massive, overlapping, or cropped to create visual tension. HOWEVER, informational body copy/paragraphs MUST maintain grounded horizontal legibility.
- DESIGN RULE: Avoid lazy slanting for paragraphs. Achieve creative asymmetry through extreme scale contrast and unexpected placement. HOWEVER, the enormous Hero Title on the cover is fully exempt—tilt it bravely diagonally across the background.
- CRITICAL: NEVER use standard top-to-bottom e-commerce templates. Disobey conventional grids but maintain high-end editorial order.
`;

  const prompts: Record<string, string> = {
    cover: `You are a world-class e-commerce visual designer.
Create a product detail page COVER / HERO screen.

${designSystem}

=== REQUIRED CONTENT (Focus on Dynamic Angle Composition. Severely tilt/slant the massive Brand name diagonally to slice through the background, acting as a graphic watermark. Keep sub-text strictly horizontal to create contrast) ===
- Brand name: "${brandName}"
- Brand slogan: "${brandSlogan}"
- Subtitle: "${subtitle}"
- Quality tags: ${qualityTags}
- The product from the reference photo as the visual hero

${constraints}`,

    showcase: `You are a world-class e-commerce visual designer.
Create a product detail page MULTI-IMAGE SHOWCASE screen.

${designSystem}

=== REQUIRED CONTENT (Focus on Scale Contrast and Typographic Framing. Place large emotional copy against very small descriptive text, breaking rigid grid boxes) ===
- Emotional copy: "${emotionalCopy}"
- Arrange the provided ${imageCount} product photos in a creative editorial layout
- Include brief descriptive text or captions that complement the images
- The overall composition should tell a visual story about the product

${constraints}`,

    display: `You are a world-class e-commerce visual designer.
Create a product detail page PRODUCT DISPLAY screen.

${designSystem}

=== REQUIRED CONTENT (Focus on Negative Space Dominance. Let the scene breathe. Use off-center placement with extreme margins) ===
- Section title (e.g. "产品展示" / "Product Display" or similar)
- Subtitle: "${subtitle}"
- A prominent hero shot of the product
- A lifestyle/scene photo showing the product in a real interior setting

${constraints}`,

    material: `You are a world-class e-commerce visual designer.
Create a product detail page MATERIAL & CRAFT screen.

${designSystem}

=== REQUIRED CONTENT (Focus on Staircase Alignment or scattered floating blocks. Do not stack items linearly. Break out of the standard reading path cleanly) ===
- Material 1: "${analysis.materials?.[0]?.name || "优良摔纹皮"}" — ${analysis.materials?.[0]?.description || "触感细腻，经久耐用"}
- Material 2: "${analysis.materials?.[1]?.name || "全实木框架"}" — ${analysis.materials?.[1]?.description || "坚固稳定，承重出色"}
- Emotional copy: "${emotionalCopy}"
- Product detail/close-up photos showing material textures

${constraints}`,

    details: `You are a world-class e-commerce visual designer.
Create a product detail page DETAIL & CRAFT screen.

${designSystem}

=== REQUIRED CONTENT (Apply Swiss Style asymmetry. Use a rigid but entirely off-center, unexpected placement for these close-ups and labels) ===
- Section title (e.g. "产品细节" / "Product Details" or similar)
- A full product photo
- 4 detail close-ups with labels:
  1. ${analysis.details?.[0]?.detailName || "面料"}: ${analysis.details?.[0]?.description || "纹理自然触感柔软"}
  2. ${analysis.details?.[1]?.detailName || "防滑"}: ${analysis.details?.[1]?.description || "有效防止移动跑位"}
  3. ${analysis.details?.[2]?.detailName || "填充"}: ${analysis.details?.[2]?.description || "均衡承重平衡压力"}
  4. ${analysis.details?.[3]?.detailName || "技艺"}: ${analysis.details?.[3]?.description || "缝边精密针脚平稳"}

${constraints}`,

    specs: `You are a world-class e-commerce visual designer.
Create a product detail page DIMENSIONS & SPECS screen.

${designSystem}

=== REQUIRED CONTENT (Do NOT use a boring list. Use a clean, horizontal data visualization approach like an architectural blueprint with pointer lines, avoiding unnecessary slant) ===
- Section title (e.g. "产品详情" / "Specifications" or similar)
- Product photo with dimension annotations:
  Width: ${analysis.dimensions?.width || "220cm"}
  Height: ${analysis.dimensions?.height || "75cm"}
  Depth: ${analysis.dimensions?.depth || "80cm"}
- Specification list:
  颜色：${analysis.specs?.color || "褐色/灰色/黑色/棕色"}
  框架材质：${analysis.specs?.frameMaterial || "原木+刚钛+其他"}
  板材填充：${analysis.specs?.filling || "海绵+其他"}
  主要材质：${analysis.specs?.mainMaterial || "棉"}
  面料：${analysis.specs?.fabric || "接触面牛皮+羊绒"}

${constraints}`
  };

  return prompts[screenType] || prompts.cover;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { images, analysis, screenType } = body;

    if (!images || images.length === 0) {
      return NextResponse.json(
        { error: "缺少产品图片" },
        { status: 400 }
      );
    }

    if (!screenType) {
      return NextResponse.json(
        { error: "缺少 screenType 参数" },
        { status: 400 }
      );
    }

    // 服务端压缩所有图片
    const compressedImages = await Promise.all(
      images.map((img: string) => compressBase64Image(img))
    );

    const prompt = buildScreenPrompt(screenType, analysis || {}, compressedImages.length);

    // 根据屏类型选择附上哪些图片
    const imageIndices: Record<string, number[]> = {
      cover: [0],
      showcase: [0, 1, 2, 3],
      display: [0, 1],
      material: [1, 2, 3],
      details: [0, 1, 2, 3, 4],
      specs: [0]
    };

    const indices = imageIndices[screenType] || [0];
    // 只保留实际存在的参考图；若映射的索引全越界（图片不足），回退到第一张避免空 image 参数
    const pickedIndices = indices.filter((idx) => !!compressedImages[idx]);
    const useIndices = pickedIndices.length > 0 ? pickedIndices : [0];
    // base64 data URL → File，作为参考图传给 gpt-image-2
    const imageFiles = await Promise.all(
      useIndices.map(async (idx) => {
        const img = compressedImages[idx];
        const match = img.match(/^data:image\/\w+;base64,(.+)$/);
        return toFile(Buffer.from(match ? match[1] : img, "base64"), null, {
          type: "image/jpeg"
        });
      })
    );

    const openai = new OpenAI({
      baseURL: CONFIG.baseURL,
      apiKey: CONFIG.apiKey,
      maxRetries: 3,
      defaultHeaders: {
        "Connection": "close"
      }
    });

    const response = await openai.images.edit({
      model: CONFIG.model,
      image: imageFiles,
      prompt,
      size: "1024x1536"
    });

    const imageBase64 = response.data?.[0]?.b64_json;
    if (!imageBase64) {
      return NextResponse.json(
        { error: "AI 响应中未找到图片数据" },
        { status: 500 }
      );
    }

    const dataUrl = `data:image/png;base64,${imageBase64}`;

    return NextResponse.json({ image: dataUrl, prompt });

  } catch (error: any) {
    console.error("Generate detail error:", error);
    return NextResponse.json(
      { error: error.message || "图片生成失败" },
      { status: 500 }
    );
  }
}
