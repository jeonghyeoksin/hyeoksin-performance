import { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { Settings, Sparkles, TrendingUp, Users, Target, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [isApiKeySaved, setIsApiKeySaved] = useState(false);
  
  const [productName, setProductName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [campaignGoal, setCampaignGoal] = useState('클릭률(CTR) 극대화');
  const [copyA, setCopyA] = useState('');
  const [copyB, setCopyB] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsApiKeySaved(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setIsApiKeySaved(true);
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setIsApiKeySaved(false);
  };

  const handleAnalyze = async () => {
    if (!isApiKeySaved || !apiKey) {
      setError('API KEY를 먼저 입력하고 저장해주세요.');
      return;
    }
    if (!productName || !targetAudience || !copyA || !copyB) {
      setError('모든 입력 항목을 채워주세요.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult('');

    try {
      const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
      
      const prompt = `
당신은 세계 최고 수준의 퍼포먼스 마케팅 전문가입니다.
다음은 A/B 테스트를 진행할 두 가지 광고 카피와 관련 정보입니다.

[제품/서비스]: ${productName}
[타겟 오디언스]: ${targetAudience}
[캠페인 목표]: ${campaignGoal}

[광고 카피 A]:
${copyA}

[광고 카피 B]:
${copyB}

위 정보를 바탕으로 다음 항목들을 분석하고 제안해주세요:
1. **카피 A 분석**: 장점, 단점, 타겟 오디언스 및 목표와의 적합성
2. **카피 B 분석**: 장점, 단점, 타겟 오디언스 및 목표와의 적합성
3. **승자 예측**: A와 B 중 어떤 카피가 더 나은 성과(목표 달성)를 낼 것으로 예상되는지, 그 이유는 무엇인지 설명해주세요.
4. **최적화 제안**: 더 높은 성과를 낼 수 있는 새롭고 강력한 광고 카피 3가지를 제안해주세요. 각 제안의 의도도 함께 설명해주세요.

답변은 마크다운 형식으로 전문가답고 설득력 있게 작성해주세요.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
      });

      if (response.text) {
        setResult(response.text);
      } else {
        setError('결과를 생성하지 못했습니다. 다시 시도해주세요.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || '분석 중 오류가 발생했습니다. API KEY가 유효한지 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Hero Section with 16:9 Image */}
      <div className="relative w-full max-w-5xl mx-auto aspect-video overflow-hidden bg-slate-900 shadow-xl rounded-b-3xl mb-8">
        <img 
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" 
          alt="Marketing Analytics" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/20 rounded-2xl backdrop-blur-sm border border-indigo-400/30 mb-4">
            <TrendingUp className="w-8 h-8 text-indigo-300" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg">
            혁신 퍼포먼스 AI
          </h1>
          <p className="text-lg md:text-xl text-indigo-200 font-medium max-w-2xl drop-shadow-md">
            마케팅 전문가 페르소나 기반 A/B 테스트 카피 분석 및 최적화
          </p>
          <div className="mt-6 inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
            <span className="text-sm font-medium text-slate-200">개발자: 정혁신</span>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        
        {/* API Key Section */}
        <section className="mb-10 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Settings className="w-5 h-5 text-slate-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">API 설정</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Gemini API KEY를 입력하세요"
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50 focus:bg-white"
                disabled={isApiKeySaved}
              />
              {isApiKeySaved && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
              )}
            </div>
            {isApiKeySaved ? (
              <button
                onClick={handleClearApiKey}
                className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-colors whitespace-nowrap"
              >
                변경하기
              </button>
            ) : (
              <button
                onClick={handleSaveApiKey}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm transition-colors whitespace-nowrap"
              >
                저장하기
              </button>
            )}
          </div>
          <p className="mt-3 text-sm text-slate-500">
            * 입력하신 API KEY는 브라우저 로컬 스토리지에만 저장되며 서버로 전송되지 않습니다.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-500" />
                캠페인 정보 입력 (INPUT)
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">제품/서비스명</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="예: 혁신 다이어트 보조제"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">타겟 오디언스</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="예: 2030 직장인 여성"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">캠페인 목표</label>
                  <select
                    value={campaignGoal}
                    onChange={(e) => setCampaignGoal(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                  >
                    <option value="클릭률(CTR) 극대화">클릭률(CTR) 극대화</option>
                    <option value="전환율(CVR) 극대화">전환율(CVR) 극대화</option>
                    <option value="고객 획득 비용(CAC) 최소화">고객 획득 비용(CAC) 최소화</option>
                    <option value="브랜드 인지도 상승">브랜드 인지도 상승</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md mr-2 text-xs">A</span>
                    현재 광고 카피 A
                  </label>
                  <textarea
                    value={copyA}
                    onChange={(e) => setCopyA(e.target.value)}
                    placeholder="테스트할 첫 번째 광고 카피를 입력하세요."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    <span className="inline-block px-2 py-0.5 bg-rose-100 text-rose-700 rounded-md mr-2 text-xs">B</span>
                    현재 광고 카피 B
                  </label>
                  <textarea
                    value={copyB}
                    onChange={(e) => setCopyB(e.target.value)}
                    placeholder="테스트할 두 번째 광고 카피를 입력하세요."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                  />
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>분석 중...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>AI 마케팅 분석 시작</span>
                    </>
                  )}
                </button>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl flex items-start gap-3 border border-red-100">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-full min-h-[600px] flex flex-col">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                전문가 분석 결과 (OUTPUT)
              </h2>
              
              <div className="flex-1 overflow-auto">
                {isLoading ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 py-20">
                    <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="font-medium animate-pulse">마케팅 전문가 AI가 카피를 분석하고 있습니다...</p>
                  </div>
                ) : result ? (
                  <div className="prose prose-slate prose-indigo max-w-none prose-headings:font-bold prose-h3:text-lg prose-p:leading-relaxed prose-li:my-1">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <TrendingUp className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="font-medium text-slate-500">캠페인 정보를 입력하고 분석을 시작해보세요.</p>
                    <p className="text-sm mt-2">AI가 A/B 테스트 결과를 예측하고 최적화된 카피를 제안합니다.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
