"use client";

import React, { useState, useEffect } from "react";
import { 
  UploadCloud, Sparkles, Box, CheckCircle2,
  Clock, Trash2, LayoutGrid, FileText, Download, Loader2, X, RefreshCw
} from "lucide-react";

// ---- Types ----

type AIResult = {
  title: string;
  subtitle: string;
  brandName?: string;
  brandSlogan?: string;
  emotionalCopy?: string;
  qualityTags?: string[];
  heroSection?: {
    tagline: string;
    highlights: string[];
  };
  sellingPoints?: {
    title: string;
    description: string;
  }[];
  materials?: {
    index: number;
    name: string;
    description: string;
  }[];
  details?: {
    detailName: string;
    title: string;
    description: string;
  }[];
  dimensions?: {
    width: string;
    height: string;
    depth: string;
  };
  specs?: {
    color: string;
    frameMaterial: string;
    filling: string;
    mainMaterial: string;
    fabric: string;
  };
  designDirection?: {
    styleName: string;
    colorPalette: {
      background: string;
      accent: string;
      text: string;
      secondary: string;
    };
    typography: string;
    layoutApproach: string;
    moodDescription: string;
  };
};

type ImageItem = {
  id: string;
  sourceBase64: string;
  status: "idle" | "loading" | "success" | "error";
  errorMsg?: string;
};

type ScreenImage = {
  key: string;
  title: string;
  imageBase64: string | null;
  prompt?: string;
  showPrompt?: boolean;
  status: "idle" | "loading" | "success" | "error";
  errorMsg?: string;
};

type HistoryItem = {
  id: string;
  timestamp: number;
  title: string;
  thumbnail: string;
  config: {
    platform: string;
    market: string;
    language: string;
    visualStyle: string;
    modules: string[];
  };
  result: AIResult;
};

const HISTORY_KEY = "furniture-detail-history";
const MAX_HISTORY = 20;

const ALL_SCREENS = [
  { key: "cover",    title: "品牌封面", desc: "全屏封面展示" },
  { key: "showcase", title: "多图展示", desc: "杂志风格图文混排" },
  { key: "display",  title: "产品展示", desc: "居中产品大图" },
  { key: "material", title: "材质介绍", desc: "材质工艺说明" },
  { key: "details",  title: "细节工艺", desc: "细节放大展示" },
  { key: "specs",    title: "尺寸参数", desc: "规格参数表" },
];

export default function App() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [aiText, setAiText] = useState("");
  const [isAiWriting, setIsAiWriting] = useState(false);
  const [finalResult, setFinalResult] = useState<AIResult | null>(null);
  const [exporting, setExporting] = useState(false);

  // 市场配置状态
  const [platform, setPlatform] = useState("淘宝");
  const [market, setMarket] = useState("中国大陆");
  const [language, setLanguage] = useState("中文");
  const [visualStyle, setVisualStyle] = useState("");

  // 模块多选状态（现在是屏的 key）
  const [selectedScreens, setSelectedScreens] = useState(
    ALL_SCREENS.map(s => s.key)
  );

  // AI 生成的屏图片
  const [screenImages, setScreenImages] = useState<ScreenImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // 历史记录
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // 加载历史记录
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load history:", e);
    }
  }, []);

  const saveHistory = (item: HistoryItem) => {
    setHistory(prev => {
      const updated = [item, ...prev].slice(0, MAX_HISTORY);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save history:", e);
      }
      return updated;
    });
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => {
      const updated = prev.filter(h => h.id !== id);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save history:", e);
      }
      return updated;
    });
  };

  const restoreHistory = (item: HistoryItem) => {
    setFinalResult(item.result);
    setPlatform(item.config.platform);
    setMarket(item.config.market);
    setLanguage(item.config.language);
    setVisualStyle(item.config.visualStyle);
    setSelectedScreens(item.config.modules);

    const parts: string[] = [];
    parts.push(`1. 产品名称: ${item.result.title}`);
    parts.push(`2. 核心定位: ${item.result.subtitle}`);
    if (item.result.heroSection) {
      parts.push(`3. 核心口号: ${item.result.heroSection.tagline}`);
    }
    if (item.result.sellingPoints) {
      parts.push(`4. 卖点: ${item.result.sellingPoints.map(s => s.title).join("，")}`);
    }
    setAiText(parts.join("\n"));
    setShowHistory(false);
  };

  const handleToggleScreen = (key: string) => {
    setSelectedScreens(prev => 
      prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key]
    );
  };

  const compressImage = (file: File): Promise<ImageItem> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let { width, height } = img;
            const MAX_SIZE = 800;
            
            if (width > height && width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            } else if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0, width, height);
            
            const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
            resolve({
              id: Math.random().toString(36).substring(7),
              sourceBase64: compressedBase64,
              status: "idle"
            });
          };
          img.src = event.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remaining = 10 - images.length;
    if (remaining <= 0) {
      alert("最多上传10张图片");
      e.target.value = "";
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remaining);
    const compressed = await Promise.all(filesToProcess.map(f => compressImage(f)));
    setImages(prev => [...prev, ...compressed]);
    e.target.value = "";
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    setFinalResult(null);
    setScreenImages([]);
  };

  // AI 文本分析
  const handleAiWrite = async () => {
    if (images.length === 0) {
      alert("请先上传产品图！");
      return;
    }
    
    setIsAiWriting(true);
    setAiText("AI 正在深度分析您的产品...");
    setFinalResult(null);
    setScreenImages([]);

    try {
      const allBase64 = images.map(img => img.sourceBase64);
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: allBase64,
          platform,
          market,
          language,
          visualStyle
        })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "分析失败");
      }

      console.log("[AI Analyze Result]", JSON.stringify(data, null, 2));
      setFinalResult(data);
      
      const parts: string[] = [];
      parts.push(`1. 产品名称: ${data.title}`);
      parts.push(`2. 核心定位: ${data.subtitle}`);
      if (data.brandName) parts.push(`3. 品牌名: ${data.brandName}`);
      if (data.brandSlogan) parts.push(`4. 品牌口号: ${data.brandSlogan}`);
      if (data.heroSection) {
        parts.push(`5. 核心口号: ${data.heroSection.tagline}`);
        parts.push(`   亮点: ${data.heroSection.highlights.join("，")}`);
      }
      if (data.sellingPoints) {
        parts.push(`6. 核心卖点: ${data.sellingPoints.map((s: any) => s.title).join("，")}`);
      }
      if (data.dimensions) {
        parts.push(`7. 估算尺寸: ${data.dimensions.width} × ${data.dimensions.height} × ${data.dimensions.depth}`);
      }
      setAiText(parts.join("\n"));

      // 保存历史记录
      saveHistory({
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
        title: data.title || "未命名分析",
        thumbnail: images[0]?.sourceBase64 || "",
        config: { platform, market, language, visualStyle, modules: selectedScreens },
        result: data
      });

    } catch (err: any) {
      setAiText("");
      alert(err.message);
    } finally {
      setIsAiWriting(false);
    }
  };

  // 生成单屏图片
  const generateScreen = async (screenKey: string): Promise<{ image: string | null; prompt?: string }> => {
    const allBase64 = images.map(img => img.sourceBase64);
    
    const res = await fetch("/api/generate-detail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        images: allBase64,
        analysis: finalResult,
        screenType: screenKey
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "生成失败");
    }

    return { image: data.image || null, prompt: data.prompt };
  };

  // 生成全部选中屏的详情页图片
  const handleGenerate = async () => {
    if (!finalResult) {
      alert("请先点击『AI编写』生成产品分析数据！");
      return;
    }

    if (selectedScreens.length === 0) {
      alert("请至少选择一个模块！");
      return;
    }

    setIsGenerating(true);

    // 初始化所有选中屏为 loading
    const initial: ScreenImage[] = selectedScreens.map(key => ({
      key,
      title: ALL_SCREENS.find(s => s.key === key)?.title || key,
      imageBase64: null,
      status: "loading"
    }));
    setScreenImages(initial);

    // 逐屏生成
    for (let i = 0; i < selectedScreens.length; i++) {
      const screenKey = selectedScreens[i];
      try {
        const { image: imageBase64, prompt } = await generateScreen(screenKey);
        setScreenImages(prev => prev.map(s => 
          s.key === screenKey 
            ? { ...s, imageBase64, prompt, status: "success" }
            : s
        ));
      } catch (err: any) {
        setScreenImages(prev => prev.map(s =>
          s.key === screenKey
            ? { ...s, status: "error", errorMsg: err.message }
            : s
        ));
      }
    }

    setIsGenerating(false);
  };

  // 重新生成单屏
  const handleRegenerateScreen = async (screenKey: string) => {
    setScreenImages(prev => prev.map(s =>
      s.key === screenKey 
        ? { ...s, status: "loading", errorMsg: undefined }
        : s
    ));

    try {
      const { image: imageBase64, prompt } = await generateScreen(screenKey);
      setScreenImages(prev => prev.map(s =>
        s.key === screenKey
          ? { ...s, imageBase64, prompt, status: "success" }
          : s
      ));
    } catch (err: any) {
      setScreenImages(prev => prev.map(s =>
        s.key === screenKey
          ? { ...s, status: "error", errorMsg: err.message }
          : s
      ));
    }
  };

  // 导出：Canvas 拼接所有成功的屏图片为一张长图
  const exportImage = async () => {
    const successScreens = screenImages.filter(s => s.status === "success" && s.imageBase64);
    if (successScreens.length === 0) {
      alert("没有可导出的图片");
      return;
    }

    setExporting(true);

    try {
      // 加载所有图片获取尺寸
      const loadedImages: HTMLImageElement[] = [];
      for (const screen of successScreens) {
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const el = new Image();
          el.onload = () => resolve(el);
          el.onerror = reject;
          el.src = screen.imageBase64!;
        });
        loadedImages.push(img);
      }

      // 统一宽度为 750px，按比例缩放高度
      const TARGET_WIDTH = 750;
      let totalHeight = 0;
      const scaled = loadedImages.map(img => {
        const scale = TARGET_WIDTH / img.naturalWidth;
        const h = Math.round(img.naturalHeight * scale);
        totalHeight += h;
        return { img, w: TARGET_WIDTH, h };
      });

      const canvas = document.createElement("canvas");
      canvas.width = TARGET_WIDTH;
      canvas.height = totalHeight;
      const ctx = canvas.getContext("2d")!;

      let y = 0;
      for (const { img, w, h } of scaled) {
        ctx.drawImage(img, 0, y, w, h);
        y += h;
      }

      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `AI-Detail-${Date.now()}.png`;
      a.click();
    } catch (e) {
      console.error("Export failed", e);
      alert("导出失败，请重试");
    } finally {
      setExporting(false);
    }
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getMonth()+1}/${d.getDate()} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
  };

  const successCount = screenImages.filter(s => s.status === "success").length;

  return (
    <div className="h-screen w-full flex bg-gray-50 text-gray-800 overflow-hidden font-sans">

        {/* 左侧配置面板 */}
        <div className="w-[420px] bg-white border-r border-gray-200 flex flex-col shrink-0 z-20 shadow-[2px_0_10px_rgba(0,0,0,0.02)] relative">
          <div className="flex-1 overflow-y-auto p-5 pb-24 relative custom-scrollbar">
            
            {/* 上传多视角图 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-gray-800"><span className="text-red-500 mr-1">*</span>上传产品图 <span className="text-gray-400 font-normal text-xs">(1~10张，支持多视角)</span></label>
                <button 
                  onClick={() => setShowHistory(!showHistory)}
                  className={`p-1 rounded transition-colors ${showHistory ? 'text-[#8b5cf6] bg-purple-50' : 'text-gray-400 hover:text-gray-600'}`}
                  title="历史记录"
                >
                  <Clock size={16} />
                </button>
              </div>

              {/* 历史记录面板 */}
              {showHistory && (
                <div className="mb-4 border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2 bg-gray-100 border-b border-gray-200">
                    <span className="text-xs font-semibold text-gray-600">历史记录 ({history.length})</span>
                    <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-gray-600">
                      <X size={14} />
                    </button>
                  </div>
                  {history.length === 0 ? (
                    <div className="p-4 text-center text-xs text-gray-400">暂无历史记录</div>
                  ) : (
                    <div className="max-h-[240px] overflow-y-auto">
                      {history.map(item => (
                        <div 
                          key={item.id}
                          className="flex items-center gap-3 px-3 py-2.5 border-b border-gray-100 last:border-b-0 hover:bg-white cursor-pointer transition-colors group"
                          onClick={() => restoreHistory(item)}
                        >
                          {item.thumbnail && (
                            <img src={item.thumbnail} alt="" className="w-10 h-10 object-cover rounded border border-gray-200 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-700 font-medium truncate">{item.title}</div>
                            <div className="text-xs text-gray-400">{formatTime(item.timestamp)} · {item.config.platform}</div>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); deleteHistoryItem(item.id); }}
                            className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                            title="删除"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex gap-2 flex-wrap">
                {images.map(img => (
                  <div key={img.id} className="relative w-24 h-24 border border-gray-200 rounded-lg overflow-hidden group">
                    <img src={img.sourceBase64} alt="product" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                
                {images.length < 10 && (
                  <label className="w-24 h-24 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
                    <UploadCloud className="text-gray-400 mb-1" size={20} />
                    <span className="text-xs text-gray-600">本地上传</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
              <div className="text-xs text-gray-400 mt-1">已上传 {images.length}/10</div>
            </div>

            {/* 提示 */}
            <div className="bg-red-50 text-red-500 border border-red-100 p-3 rounded-md text-xs leading-relaxed mb-6 flex relative">
              <span className="mr-1 mt-0.5">⚠️</span>
              <p>请上传同一款商品的不同角度或细节图，例如正面、侧面、背面和细节图，越完整越有利于 AI 生成高质量详情页。</p>
            </div>

            {/* 核心卖点 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-gray-800"><span className="text-red-500 mr-1">*</span>核心卖点</label>
                <button 
                  onClick={handleAiWrite} 
                  disabled={isAiWriting}
                  className="bg-[#242424] text-white text-xs px-3 py-1.5 rounded flex items-center gap-1 hover:bg-black disabled:opacity-50"
                >
                  <Sparkles size={12} /> AI编写
                </button>
              </div>
              <textarea 
                className="w-full border border-gray-200 rounded-md p-3 text-sm text-gray-700 focus:outline-none focus:border-purple-400 h-[140px] resize-none"
                placeholder={isAiWriting ? "正在分析图片并发掘产品卖点..." : "可以输入产品亮点，或点击右上角『AI编写』由AI自动分析图片提取..."}
                value={aiText}
                onChange={(e) => setAiText(e.target.value)}
              ></textarea>
              <div className="text-right text-gray-400 text-xs mt-1">{aiText.length} / 500</div>
            </div>

            {/* 市场配置 */}
            <div className="mb-6">
              <label className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1">
                <LayoutGrid size={16} /> 市场配置
              </label>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">电商平台</div>
                  <input type="text" value={platform} onChange={e => setPlatform(e.target.value)} className="w-full border border-gray-200 rounded-md p-2 text-sm outline-none focus:border-purple-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">目标市场</div>
                  <input type="text" value={market} onChange={e => setMarket(e.target.value)} className="w-full border border-gray-200 rounded-md p-2 text-sm outline-none focus:border-purple-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">文案语种</div>
                  <input type="text" value={language} onChange={e => setLanguage(e.target.value)} className="w-full border border-gray-200 rounded-md p-2 text-sm outline-none focus:border-purple-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">视觉风格</div>
                  <input type="text" value={visualStyle} onChange={e => setVisualStyle(e.target.value)} placeholder="请选择，或直接输入" className="w-full border border-gray-200 rounded-md p-2 text-sm outline-none focus:border-purple-400 placeholder:text-gray-300" />
                </div>
              </div>
            </div>

            {/* 包含模块 */}
            <div className="mb-6">
               <div className="flex items-center justify-between mb-3">
                 <label className="text-sm font-bold text-gray-800 flex items-center gap-1">
                   <Box size={16} /> 详情页屏数 (多选)
                 </label>
                 <span className="text-xs text-gray-400">已选 {selectedScreens.length}/{ALL_SCREENS.length}</span>
               </div>
               <div className="grid grid-cols-2 gap-2">
                 {ALL_SCREENS.map(m => {
                   const isSelected = selectedScreens.includes(m.key);
                   return (
                     <div 
                       key={m.key}
                       onClick={() => handleToggleScreen(m.key)}
                       className={`border ${isSelected ? 'border-gray-800 bg-white' : 'border-gray-200 bg-gray-50'} rounded-md p-3 relative cursor-pointer hover:border-gray-400 transition-colors`}
                     >
                       <div className="text-sm font-semibold text-gray-800 mb-1">{m.title}</div>
                       <div className="text-xs text-gray-400">{m.desc}</div>
                       {isSelected && <CheckCircle2 className="absolute top-3 right-2 text-gray-800" size={16} />}
                     </div>
                   );
                 })}
               </div>
            </div>
            
          </div>
          
          {/* 底部生成按钮悬浮 */}
          <div className="absolute bottom-0 w-full p-4 bg-white border-t border-gray-100 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
               {isGenerating ? (
                 <><Loader2 size={18} className="animate-spin" /> AI 正在生成详情页图片...</>
               ) : (
                 <><FileText size={18} /> 生成详情页 ({selectedScreens.length}屏)</>
               )}
            </button>
          </div>
        </div>

        {/* 右侧结果预览区 */}
        <div className="flex-1 bg-[#f4f5f7] flex flex-col relative overflow-hidden">
           {/* Top Bar */}
           <div className="h-14 flex items-center justify-between px-6 border-b border-gray-200 bg-white shrink-0">
             <div className="flex gap-6 text-sm font-medium">
               <span className="text-[#8b5cf6] font-bold border-b-2 border-[#8b5cf6] py-4 cursor-pointer flex items-center gap-1">
                 <Sparkles size={16} />AI生成详情页
               </span>
             </div>
             {successCount > 0 && (
               <button 
                 onClick={exportImage}
                 disabled={exporting}
                 className="bg-white border border-gray-200 shadow-sm text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
               >
                  {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                  {exporting ? "拼接导出中..." : `导出长图 (${successCount}屏)`}
               </button>
             )}
           </div>

           {/* Canvas Area */}
           <div className="flex-1 overflow-auto p-8">
             
             {screenImages.length === 0 ? (
                // Empty State
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-48 h-48 mb-4 opacity-50 relative pointer-events-none">
                     <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 40 L160 70 L160 140 L100 170 L40 140 L40 70 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="2" />
                        <path d="M100 40 L100 100 L160 70" fill="none" stroke="#d1d5db" strokeWidth="2" />
                        <path d="M40 70 L100 100 L100 170" fill="none" stroke="#d1d5db" strokeWidth="2" />
                        <path d="M80 60 L120 80" fill="none" stroke="#9ca3af" strokeWidth="4" strokeLinecap="round" />
                        <path d="M80 80 L120 100" fill="none" stroke="#9ca3af" strokeWidth="4" strokeLinecap="round" />
                     </svg>
                  </div>
                  <p className="text-gray-400 text-sm mb-1">请先点击「AI编写」分析产品，再点击「生成详情页」</p>
                  <p className="text-gray-300 text-xs">AI 将为每个选中的屏生成一张详情页设计图</p>
                </div>
             ) : (
                // 生成结果 - 竖向图片列表
                <div className="max-w-[750px] mx-auto space-y-4">
                   {screenImages.map((screen) => (
                     <div key={screen.key} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                       {/* 屏标题栏 */}
                       <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100">
                         <div className="flex items-center gap-2">
                           <span className="text-sm font-medium text-gray-700">{screen.title}</span>
                           {screen.prompt && (
                             <button
                               onClick={() => setScreenImages(prev => prev.map(s =>
                                 s.key === screen.key ? { ...s, showPrompt: !s.showPrompt } : s
                               ))}
                               className="text-xs text-gray-400 hover:text-[#8b5cf6] px-1.5 py-0.5 rounded border border-gray-200 hover:border-purple-300 transition-colors"
                             >
                               {screen.showPrompt ? "隐藏提示词" : "查看提示词"}
                             </button>
                           )}
                         </div>
                         <button
                           onClick={() => handleRegenerateScreen(screen.key)}
                           disabled={screen.status === "loading"}
                           className="text-xs text-gray-500 hover:text-[#8b5cf6] flex items-center gap-1 disabled:opacity-50"
                         >
                           <RefreshCw size={12} className={screen.status === "loading" ? "animate-spin" : ""} />
                           {screen.status === "loading" ? "生成中..." : "重新生成"}
                         </button>
                       </div>

                       {/* 提示词展示 */}
                       {screen.showPrompt && screen.prompt && (
                         <div className="px-4 py-3 bg-gray-900 border-b border-gray-700 max-h-[300px] overflow-y-auto">
                           <pre className="text-xs text-green-400 whitespace-pre-wrap font-mono leading-relaxed">{screen.prompt}</pre>
                         </div>
                       )}
                       
                       {/* 图片内容 */}
                       <div className="relative">
                         {screen.status === "loading" && (
                           <div className="flex flex-col items-center justify-center py-32 text-gray-400">
                             <Loader2 size={32} className="animate-spin mb-3" />
                             <span className="text-sm">AI 正在生成「{screen.title}」...</span>
                             <span className="text-xs text-gray-300 mt-1">通常需要 10-30 秒</span>
                           </div>
                         )}
                         
                         {screen.status === "success" && screen.imageBase64 && (
                           <img 
                             src={screen.imageBase64} 
                             alt={screen.title}
                             className="w-full h-auto block"
                           />
                         )}
                         
                         {screen.status === "error" && (
                           <div className="flex flex-col items-center justify-center py-20 text-red-400">
                             <X size={32} className="mb-2" />
                             <span className="text-sm">生成失败</span>
                             <span className="text-xs text-red-300 mt-1">{screen.errorMsg}</span>
                             <button
                               onClick={() => handleRegenerateScreen(screen.key)}
                               className="mt-3 text-xs bg-red-50 text-red-500 px-3 py-1.5 rounded hover:bg-red-100"
                             >
                               点击重试
                             </button>
                           </div>
                         )}
                       </div>
                     </div>
                   ))}
                </div>
             )}

           </div>
        </div>

    </div>
  );
}
