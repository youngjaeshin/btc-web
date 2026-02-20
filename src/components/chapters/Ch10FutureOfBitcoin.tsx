"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { KatexBlock } from "@/components/content/KatexBlock";
import { InfoBox } from "@/components/content/InfoBox";
import { QuizSection } from "@/components/quiz/QuizSection";
import { Slider } from "@/components/ui/slider";
import { PlotLoading } from "@/components/content/DynamicPlot";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, loading: PlotLoading });

// ─────────────────────────────────────────────
// Section 1: 비트코인 스탠다드
// ─────────────────────────────────────────────
function BitcoinStandardSection() {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">1. 비트코인 스탠다드</h2>
      <p className="mb-3">
        사이페딘 아무스(Saifedean Ammous)는 2018년 저서 <em>The Bitcoin Standard</em>에서
        인류 역사상 가장 건전한 화폐가 문명을 번영시켰다는 테제를 제시했습니다.
        금본위제 시대(1870~1914)가 인류 역사상 가장 빠른 기술·경제 발전기였던 것은
        우연이 아닙니다.
      </p>

      <InfoBox type="definition" title="건전화폐 (Sound Money)">
        건전화폐란 공급량이 정치적 의사결정이 아닌 시장 원리(또는 알고리즘)에 의해
        결정되는 화폐입니다. 금, 은, 그리고 비트코인이 그 예입니다. 반대로 법정화폐는
        중앙은행 위원회의 투표로 공급이 결정됩니다.
      </InfoBox>

      <p className="mb-3 mt-4">
        아무스의 핵심 논지는 다음과 같습니다:
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li>
          <strong>건전화폐 → 낮은 시간선호 → 자본 축적</strong>: 저축 가치가 보존될 때
          사람들은 미래를 위해 투자합니다. 자본 축적은 생산성 향상의 기반입니다.
        </li>
        <li>
          <strong>불건전화폐 → 높은 시간선호 → 단기주의</strong>: 인플레이션은 저축을
          처벌하고 부채를 장려합니다. 기업과 정부 모두 단기 실적에 집착하게 됩니다.
        </li>
        <li>
          <strong>비트코인 = 역사상 가장 건전한 화폐</strong>: 2,100만 개 절대 상한,
          알고리즘 발행 스케줄, 검열 저항성. 금보다 우월한 특성을 갖습니다.
        </li>
      </ul>

      <InfoBox type="tip" title="비트코인 스탠다드 세계">
        만약 비트코인이 글로벌 기축통화가 된다면: 각국 정부는 더 이상 화폐를 찍어낼 수
        없어 전쟁 자금을 조달하기 어려워집니다. 개인은 자신의 저축이 시간이 지날수록
        구매력이 증가하는 환경에서 살게 됩니다. 기업은 단기 주가 부양보다 장기 가치
        창출에 집중하게 됩니다.
      </InfoBox>
    </section>
  );
}

// ─────────────────────────────────────────────
// Section 2: 하이퍼비트코이너화
// ─────────────────────────────────────────────
function HyperbitcoinizationSection() {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">2. 하이퍼비트코이너화 (Hyperbitcoinization)</h2>
      <p className="mb-3">
        <strong>하이퍼비트코이너화</strong>는 법정화폐에서 비트코인으로의 급격한 자발적
        전환을 의미합니다. 하이퍼인플레이션이 법정화폐를 무너뜨리는 것과 달리,
        하이퍼비트코이너화는 더 우월한 화폐로의 자발적 이동입니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
          <h3 className="font-bold mb-2">점진적 시나리오</h3>
          <ul className="text-sm space-y-1.5">
            <li>• 기업들이 BTC를 재무 준비금으로 추가</li>
            <li>• 각국 정부가 전략적 비트코인 준비금 구축</li>
            <li>• ETF를 통해 기관 투자자 대규모 유입</li>
            <li>• 라이트닝 네트워크로 일상 결제 확산</li>
            <li>• 수십 년에 걸쳐 법정화폐와 공존</li>
          </ul>
        </div>
        <div className="rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20 p-4">
          <h3 className="font-bold text-orange-800 dark:text-orange-300 mb-2">급진적 시나리오</h3>
          <ul className="text-sm space-y-1.5 text-orange-900 dark:text-orange-200">
            <li>• 주요 법정화폐 신뢰 붕괴</li>
            <li>• 하이퍼인플레이션 확산</li>
            <li>• BTC로의 급격한 자본 도피</li>
            <li>• 법정화폐의 기능 상실</li>
            <li>• 비트코인이 사실상 글로벌 기축통화화</li>
          </ul>
        </div>
      </div>

      <p className="mb-3">
        어느 시나리오가 현실화되든, 비트코이너들의 논리는 동일합니다: <strong>비트코인은
        더 우월한 화폐 기술이므로, 시간이 지날수록 열등한 화폐를 대체하는 것은
        역사적 필연</strong>이라는 것입니다. 인쇄기가 필사를 대체했고, 이메일이 팩스를
        대체했듯이.
      </p>

      <InfoBox type="info" title="달러라이제이션 vs 비트코이너화">
        아르헨티나, 짐바브웨 등 통화가 붕괴한 국가들은 달러라이제이션(dollarization)을
        경험했습니다. 비트코이너화는 달러도 아닌 검열 불가능한 탈중앙화 화폐로의
        전환이라는 점에서 질적으로 다릅니다. 달러는 여전히 미 연준이 발행을
        통제하지만, 비트코인은 누구도 통제하지 않습니다.
      </InfoBox>
    </section>
  );
}

// ─────────────────────────────────────────────
// Section 3: 보안 모델 장기 전망
// ─────────────────────────────────────────────
function SecurityModelSection() {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">3. 보안 모델 장기 전망</h2>
      <p className="mb-3">
        비트코인 채굴자는 블록을 생성할 때마다 <strong>블록 보상(Block Subsidy)</strong>과
        <strong>수수료(Transaction Fees)</strong>를 받습니다. 반감기마다 블록 보상은
        절반으로 줄어들고, 약 2140년이 되면 블록 보상이 0에 수렴합니다.
      </p>

      <div className="my-4">
        <p className="text-sm text-muted-foreground mb-1">채굴자 수입 구성</p>
        <KatexBlock
          math={"\\text{Miner Revenue} = \\underbrace{\\frac{50}{2^n} \\cdot P_{\\text{BTC}}}_{\\text{Block Subsidy}} + \\underbrace{\\sum_i \\text{fee}_i}_{\\text{Tx Fees}}"}
          display={true}
        />
        <p className="text-xs text-muted-foreground mt-1">
          n = 반감기 횟수, P_BTC = BTC 가격. 장기적으로 수수료가 보안 예산의 주요 원천이 됩니다.
        </p>
      </div>

      <p className="mb-3">
        이에 대해 두 가지 시각이 있습니다:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 p-4">
          <h3 className="font-bold text-emerald-700 dark:text-emerald-400 mb-2">낙관적 시각</h3>
          <ul className="text-sm space-y-1.5">
            <li>• BTC 가격 상승이 보조금 감소를 상쇄</li>
            <li>• 라이트닝 정산 등 블록 공간 수요 증가</li>
            <li>• 수수료 시장이 자연스럽게 발전</li>
            <li>• 비트코인이 글로벌 결제 레이어가 되면 수수료 충분</li>
          </ul>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 p-4">
          <h3 className="font-bold text-amber-700 dark:text-amber-400 mb-2">신중한 시각</h3>
          <ul className="text-sm space-y-1.5">
            <li>• 블록 보상 → 0 이후 보안 예산 불확실</li>
            <li>• 블록 크기 제한이 수수료를 제약</li>
            <li>• 채굴자 집중화 위험</li>
            <li>• 장기 보안 모델은 여전히 미검증</li>
          </ul>
        </div>
      </div>

      <InfoBox type="info" title="비트코이너의 관점">
        비트코이너들은 "아직 해결되지 않은 문제가 있다"는 사실을 부정하지 않습니다.
        하지만 비트코인 네트워크가 15년 이상 단 한 번도 해킹당하지 않고 운영된
        사실, 그리고 수수료 시장이 점진적으로 발전하고 있다는 사실을 근거로
        장기 보안 모델에 대해 낙관합니다.
      </InfoBox>
    </section>
  );
}

// ─────────────────────────────────────────────
// Simulation 1: 보안 예산 프로젝션
// ─────────────────────────────────────────────
function SecurityBudgetSimulator() {
  const [halvingsShown, setHalvingsShown] = useState(10);
  const [feeRevenueUSD, setFeeRevenueUSD] = useState(500); // million USD/year
  const [btcPriceGrowth, setBtcPriceGrowth] = useState(15); // % per year

  const initialSubsidy = 50; // BTC per block in block 0
  const blocksPerYear = 52560;
  const startPrice = 60000; // USD per BTC

  const halvingData: { halving: number; subsidyBTC: number; subsidyUSD: number; feesUSD: number; totalUSD: number }[] = [];

  for (let h = 3; h <= halvingsShown + 3; h++) {
    const subsidy = initialSubsidy / Math.pow(2, h);
    const yearsFromNow = (h - 3) * 4; // 4th halving (epoch index 3) ~ April 2024
    const priceAtHalving = startPrice * Math.pow(1 + btcPriceGrowth / 100, yearsFromNow);
    const subsidyUSD = (subsidy * blocksPerYear * priceAtHalving) / 1e6; // million USD
    const feesAtHalving = feeRevenueUSD * Math.pow(1 + btcPriceGrowth / 200, yearsFromNow);
    halvingData.push({
      halving: h,
      subsidyBTC: parseFloat((subsidy * blocksPerYear).toFixed(0)),
      subsidyUSD: parseFloat(subsidyUSD.toFixed(1)),
      feesUSD: parseFloat(feesAtHalving.toFixed(1)),
      totalUSD: parseFloat((subsidyUSD + feesAtHalving).toFixed(1)),
    });
  }

  const halvingLabels = halvingData.map((d) => `#${d.halving} (~${2024 + (d.halving - 3) * 4}년)`);

  return (
    <div className="my-8 not-prose rounded-xl border p-5 bg-card">
      <h3 className="text-lg font-bold mb-4">시뮬레이션 ①: 보안 예산 프로젝션</h3>
      <p className="text-sm text-muted-foreground mb-4">
        반감기별 블록 보조금과 수수료 수입 합산 보안 예산을 시뮬레이션합니다.
        (단위: 백만 USD/년)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div>
          <label className="text-sm font-medium">표시할 반감기 수: {halvingsShown}회</label>
          <Slider min={4} max={15} step={1} value={[halvingsShown]}
            onValueChange={([v]) => setHalvingsShown(v)} className="mt-2" />
        </div>
        <div>
          <label className="text-sm font-medium">현재 수수료 수입: ${feeRevenueUSD}M/년</label>
          <Slider min={50} max={5000} step={50} value={[feeRevenueUSD]}
            onValueChange={([v]) => setFeeRevenueUSD(v)} className="mt-2" />
        </div>
        <div>
          <label className="text-sm font-medium">BTC 연 가격 성장: {btcPriceGrowth}%</label>
          <Slider min={0} max={50} step={1} value={[btcPriceGrowth]}
            onValueChange={([v]) => setBtcPriceGrowth(v)} className="mt-2" />
        </div>
      </div>

      <Plot
        data={[
          {
            x: halvingLabels,
            y: halvingData.map((d) => d.subsidyUSD),
            type: "bar",
            name: "블록 보조금 (USD)",
            marker: { color: "#f97316" },
          },
          {
            x: halvingLabels,
            y: halvingData.map((d) => d.feesUSD),
            type: "bar",
            name: "수수료 수입 (USD)",
            marker: { color: "#3b82f6" },
          },
        ]}
        layout={{
          title: { text: "반감기별 채굴자 보안 예산 (백만 USD/년)" },
          xaxis: { title: { text: "반감기 횟수" } },
          yaxis: { title: { text: "보안 예산 (M USD/년)" }, type: "log" },
          barmode: "stack",
          height: 360,
          margin: { l: 70, r: 20, t: 50, b: 50 },
          legend: { orientation: "h", y: -0.2 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: "100%" }}
      />

      <p className="text-xs text-muted-foreground mt-2 text-center">
        * 수수료 수입은 BTC 가격 성장의 절반 속도로 증가한다고 가정합니다.
        실제 값과 다를 수 있습니다.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Section 4: 흔한 오해와 반론 (FUD)
// ─────────────────────────────────────────────
const fudItems = [
  {
    id: "environment",
    title: "환경 파괴 주장",
    fud: "비트코인 채굴이 엄청난 에너지를 낭비하고 CO₂를 배출해 기후 위기를 악화시킵니다.",
    rebuttal: [
      "비트코인 채굴은 에너지를 '낭비'하는 것이 아니라, 가장 비싼 에너지를 사용하는 경제 활동들 사이에서 경쟁합니다.",
      "채굴은 재생에너지의 최적 고객입니다. 수력·태양광의 잉여 전력(curtailed energy)을 24시간 흡수합니다.",
      "2023년 기준 비트코인 채굴의 약 50~70%가 재생에너지로 이루어진다는 추정이 있습니다.",
      "금 채굴, 군사 산업, 크리스마스 조명보다 에너지 효율이 높다는 비교 연구도 있습니다.",
      "에너지 소비량 자체보다 그 에너지가 무엇을 구매하는지(검열 불가능한 글로벌 결제 시스템)가 중요합니다.",
    ],
  },
  {
    id: "crime",
    title: "범죄 도구 주장",
    fud: "비트코인은 마약 거래, 랜섬웨어, 자금세탁 등 범죄에 주로 사용됩니다.",
    rebuttal: [
      "비트코인 블록체인은 완전히 투명하고 영구적으로 기록됩니다. 현금보다 훨씬 추적하기 쉽습니다.",
      "Chainalysis 보고서에 따르면 비트코인 거래 중 불법 거래 비중은 0.1~0.2% 수준입니다.",
      "달러는 전 세계 마약 거래, 자금세탁의 압도적 주요 매체입니다. 달러를 금지해야 할까요?",
      "범죄자들이 왜 투명한 공개 블록체인을 쓸까요? 실제 범죄자들은 현금, 부동산, 은행 계좌를 더 선호합니다.",
      "추적 가능한 비트코인으로 실제로 많은 랜섬웨어 범죄자가 검거되었습니다(예: Colonial Pipeline 해커).",
    ],
  },
  {
    id: "volatility",
    title: "가격 변동성 주장",
    fud: "비트코인은 너무 가격이 불안정해서 화폐로 쓸 수 없습니다.",
    rebuttal: [
      "비트코인은 아직 가격 발견 단계에 있는 초기 자산입니다. 인터넷 초기 주식도 극도로 변동성이 컸습니다.",
      "4년 이상의 장기 보유 관점에서 비트코인은 모든 다른 자산군 대비 최고 수익률을 기록했습니다.",
      "변동성은 채택이 증가할수록 자연스럽게 줄어듭니다. 금도 금본위제 이전에는 매우 변동성이 컸습니다.",
      "라이트닝 네트워크와 스테이블코인을 통해 일상 결제에서 변동성 문제를 우회할 수 있습니다.",
      "변동성은 위험이자 기회입니다. 장기 보유자(HODLer)에게 변동성은 축적의 기회입니다.",
    ],
  },
  {
    id: "government",
    title: "정부가 금지할 것이다 주장",
    fud: "결국 각국 정부가 비트코인을 금지할 것이고, 그러면 가치가 0이 됩니다.",
    rebuttal: [
      "중국은 2013년부터 여러 차례 비트코인을 금지했습니다. 비트코인은 매번 살아남았고 더 강해졌습니다.",
      "비트코인을 '완전히' 금지하려면 인터넷 자체를 차단해야 합니다. 이는 경제 자살과 같습니다.",
      "미국, EU는 규제 프레임워크를 만들고 있습니다. 현물 ETF 승인은 사실상 합법화의 신호입니다.",
      "각국 정부가 BTC를 전략 준비금으로 축적하기 시작한 시점에 '금지' 시나리오는 점점 비현실적입니다.",
      "오히려 '비트코인을 금지할 수 없는 정부가 채택을 선택'하는 내쉬 균형 방향으로 수렴하고 있습니다.",
    ],
  },
  {
    id: "better-crypto",
    title: "더 좋은 암호화폐가 나온다 주장",
    fud: "비트코인보다 기술적으로 더 뛰어난 코인이 나오면 비트코인은 구식이 됩니다.",
    rebuttal: [
      "비트코인의 핵심 가치는 기술적 우월성이 아니라 탈중앙화·보안·네트워크 효과입니다.",
      "인터넷 이후 더 빠른 프로토콜이 많이 나왔지만 TCP/IP를 대체하지 못했습니다.",
      "비트코인은 가장 탈중앙화되고 가장 오래 검증된 블록체인입니다. 불변성 자체가 특성입니다.",
      "대부분의 '비트코인 킬러'는 탈중앙화를 희생해 속도를 얻었습니다. 이는 다른 트레이드오프입니다.",
      "15년 동안 수천 개의 경쟁자가 나왔고, 비트코인의 시장 지배력은 여전히 압도적입니다.",
    ],
  },
];

function FudRebuttalSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">4. 흔한 오해와 비트코이너의 반론 (FUD)</h2>
      <p className="mb-4 text-muted-foreground">
        각 카드를 클릭하면 비트코이너의 관점에서 작성된 반론이 펼쳐집니다.
      </p>
      <div className="space-y-3 not-prose">
        {fudItems.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <button
                className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                aria-expanded={isOpen}
              >
                <div>
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{item.fud}</div>
                </div>
                <span className="ml-4 text-xl font-light flex-shrink-0">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-slate-200 dark:border-slate-700 px-5 py-4 bg-emerald-50 dark:bg-emerald-950/20">
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
                    비트코이너의 반론:
                  </p>
                  <ul className="space-y-1.5">
                    {item.rebuttal.map((r, i) => (
                      <li key={i} className="text-sm flex gap-2">
                        <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Section 5: 개인의 비트코인 여정
// ─────────────────────────────────────────────
function PersonalJourneySection() {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">5. 개인의 비트코인 여정</h2>
      <p className="mb-3">
        <strong>오렌지 필링(Orange-pilling)</strong>이란 누군가가 비트코인의 진정한
        의미를 이해하고 확신을 갖게 되는 순간을 가리킵니다. 영화 매트릭스에서
        "빨간 약"을 먹고 진실을 보는 것에서 유래했습니다.
      </p>

      <InfoBox type="tip" title="오렌지 필링의 단계">
        대부분의 비트코이너는 비슷한 단계를 거칩니다: ① 회의 또는 무관심 →
        ② 가격 상승으로 관심 → ③ "사기 아닐까?" 의심 → ④ 기술·경제학 공부 →
        ⑤ "이건 진짜다" 확신 → ⑥ 자기주권 실천 (노드, 셀프 커스터디)
      </InfoBox>

      <p className="mb-3 mt-4">비트코이너의 실천 로드맵:</p>

      <div className="space-y-3 mb-5">
        {[
          { step: "1단계", title: "공부하기", desc: "The Bitcoin Standard, 사토시 백서, 유튜브(Andreas Antonopoulos) 등으로 기초 이해. 가격이 아닌 원리를 먼저 이해합니다.", color: "border-blue-300 bg-blue-50 dark:bg-blue-950/20" },
          { step: "2단계", title: "DCA 시작", desc: "Dollar Cost Averaging — 매달 일정 금액을 자동으로 매수합니다. 가격 타이밍을 맞추려 하지 않습니다.", color: "border-amber-300 bg-amber-50 dark:bg-amber-950/20" },
          { step: "3단계", title: "셀프 커스터디", desc: "'Not your keys, not your coins.' 하드웨어 지갑(Coldcard, Ledger 등)으로 자기 키를 직접 관리합니다.", color: "border-orange-300 bg-orange-50 dark:bg-orange-950/20" },
          { step: "4단계", title: "풀노드 운영", desc: "자신의 노드를 운영해 거래를 직접 검증합니다. Raspberry Pi + Bitcoin Core로 저렴하게 시작할 수 있습니다.", color: "border-emerald-300 bg-emerald-50 dark:bg-emerald-950/20" },
          { step: "5단계", title: "커뮤니티 참여", desc: "Bitcoin meetup, 컨퍼런스, 오픈소스 기여 등으로 비트코인 생태계에 기여합니다.", color: "border-purple-300 bg-purple-50 dark:bg-purple-950/20" },
        ].map((item) => (
          <div key={item.step} className={`rounded-lg border p-4 ${item.color}`}>
            <div className="flex items-start gap-3">
              <span className="font-bold text-sm mt-0.5 flex-shrink-0">{item.step}</span>
              <div>
                <div className="font-semibold">{item.title}</div>
                <div className="text-sm mt-0.5">{item.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <InfoBox type="warning" title="DYOR — Do Your Own Research">
        이 교재는 교육 목적으로 작성되었습니다. 비트코인에 관한 어떤 결정도 스스로
        충분히 공부한 후 내리세요. 재정적 조언이 아닙니다. 자신이 이해하지 못하는
        것에 투자하지 마세요.
      </InfoBox>
    </section>
  );
}

// ─────────────────────────────────────────────
// Simulation 2: DCA 시뮬레이터
// ─────────────────────────────────────────────
function DCASimulator() {
  const [monthlyUSD, setMonthlyUSD] = useState(100);
  const [startYear, setStartYear] = useState(2020);
  const [annualGrowth, setAnnualGrowth] = useState(40); // % per year

  // BTC price history anchors (approximate)
  const historicalPrices: Record<number, number> = {
    2020: 29000, 2021: 47000, 2022: 16500, 2023: 42000, 2024: 94000,
  };

  const currentYear = 2024;
  const endYear = 2030;

  type DcaRow = { label: string; totalInvested: number; totalBTC: number; currentValue: number; avgCost: number };
  const rows: DcaRow[] = [];
  let totalBTC = 0;
  let totalInvested = 0;

  for (let y = startYear; y <= endYear; y++) {
    for (let m = 0; m < 12; m++) {
      const t = y + m / 12;
      let btcPrice: number;
      if (t <= currentYear) {
        // Use interpolated historical prices
        const prevYear = Math.floor(t);
        const nextYear = prevYear + 1;
        const frac = t - prevYear;
        const p0 = historicalPrices[prevYear] ?? historicalPrices[2024];
        const p1 = historicalPrices[nextYear] ?? historicalPrices[2024];
        btcPrice = p0 + (p1 - p0) * frac;
      } else {
        const yearsFromNow = t - currentYear;
        btcPrice = historicalPrices[2024] * Math.pow(1 + annualGrowth / 100, yearsFromNow);
      }
      totalBTC += monthlyUSD / btcPrice;
      totalInvested += monthlyUSD;
    }
    const endPrice =
      y <= currentYear
        ? (historicalPrices[y] ?? historicalPrices[2024])
        : historicalPrices[2024] * Math.pow(1 + annualGrowth / 100, y - currentYear);

    rows.push({
      label: `${y}`,
      totalInvested: parseFloat(totalInvested.toFixed(0)),
      totalBTC: parseFloat(totalBTC.toFixed(6)),
      currentValue: parseFloat((totalBTC * endPrice).toFixed(0)),
      avgCost: parseFloat((totalInvested / totalBTC).toFixed(0)),
    });
  }

  return (
    <div className="my-8 not-prose rounded-xl border p-5 bg-card">
      <h3 className="text-lg font-bold mb-4">시뮬레이션 ②: DCA(적립식 매수) 시뮬레이터</h3>
      <p className="text-sm text-muted-foreground mb-4">
        매달 일정 금액을 BTC에 적립했을 때의 누적 BTC와 자산 가치를 계산합니다.
        2024년 이후는 연 성장률 가정에 따른 시뮬레이션입니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div>
          <label className="text-sm font-medium">월 적립 금액: ${monthlyUSD}</label>
          <Slider min={10} max={2000} step={10} value={[monthlyUSD]}
            onValueChange={([v]) => setMonthlyUSD(v)} className="mt-2" />
        </div>
        <div>
          <label className="text-sm font-medium">시작 연도: {startYear}년</label>
          <Slider min={2020} max={2024} step={1} value={[startYear]}
            onValueChange={([v]) => setStartYear(v)} className="mt-2" />
        </div>
        <div>
          <label className="text-sm font-medium">연 BTC 가격 성장(2025~): {annualGrowth}%</label>
          <Slider min={0} max={100} step={5} value={[annualGrowth]}
            onValueChange={([v]) => setAnnualGrowth(v)} className="mt-2" />
        </div>
      </div>

      <Plot
        data={[
          {
            x: rows.map((r) => r.label),
            y: rows.map((r) => r.totalInvested),
            type: "bar",
            name: "총 투자금 (USD)",
            marker: { color: "#94a3b8" },
          },
          {
            x: rows.map((r) => r.label),
            y: rows.map((r) => r.currentValue),
            type: "scatter",
            mode: "lines+markers" as const,
            name: "자산 가치 (USD)",
            line: { color: "#f97316", width: 2.5 },
            yaxis: "y",
          },
        ]}
        layout={{
          title: { text: "DCA 누적 자산 가치 (USD)" },
          xaxis: { title: { text: "연도" } },
          yaxis: { title: { text: "USD" } },
          barmode: "overlay",
          height: 360,
          margin: { l: 70, r: 20, t: 50, b: 50 },
          legend: { orientation: "h", y: -0.2 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: "100%" }}
      />

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {rows.slice(-1).map((r) => (
          <React.Fragment key={r.label}>
            <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-3 text-center">
              <div className="text-xs text-muted-foreground">총 투자금</div>
              <div className="text-lg font-bold">${r.totalInvested.toLocaleString()}</div>
            </div>
            <div className="rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 p-3 text-center">
              <div className="text-xs text-muted-foreground">누적 BTC</div>
              <div className="text-lg font-bold text-orange-600">{r.totalBTC} BTC</div>
            </div>
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 p-3 text-center">
              <div className="text-xs text-muted-foreground">예상 자산 가치</div>
              <div className="text-lg font-bold text-emerald-600">${r.currentValue.toLocaleString()}</div>
            </div>
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 p-3 text-center">
              <div className="text-xs text-muted-foreground">평균 매입가</div>
              <div className="text-lg font-bold text-blue-600">${r.avgCost.toLocaleString()}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        * 2024년 이후 가격은 연 성장률 가정에 기반한 시뮬레이션이며, 투자 조언이 아닙니다.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Quiz
// ─────────────────────────────────────────────
const quizQuestions = [
  {
    question: "사이페딘 아무스가 'The Bitcoin Standard'에서 주장한 핵심 테제는 무엇인가요?",
    options: [
      "비트코인은 단기 투자 수단으로 최적이다",
      "건전화폐가 문명을 번영시키며, 비트코인이 역사상 가장 건전한 화폐다",
      "비트코인은 중앙은행을 없애는 것이 목적이다",
      "디지털 화폐는 모두 동등한 가치를 가진다",
    ],
    answer: 1,
    explanation:
      "아무스는 역사적으로 건전한 화폐를 사용한 시대에 문명이 가장 크게 번영했음을 보여주고, 비트코인이 2,100만 개 고정 공급량 등으로 역사상 가장 건전한 화폐라고 주장합니다.",
  },
  {
    question: "하이퍼비트코이너화(Hyperbitcoinization)와 하이퍼인플레이션의 차이점은?",
    options: [
      "하이퍼비트코이너화는 정부가 주도하는 전환이다",
      "하이퍼인플레이션은 자발적 전환이고, 하이퍼비트코이너화는 강제적 전환이다",
      "하이퍼비트코이너화는 더 우월한 화폐로의 자발적 전환이고, 하이퍼인플레이션은 화폐 자체의 붕괴다",
      "둘 다 동일한 현상을 다른 이름으로 부르는 것이다",
    ],
    answer: 2,
    explanation:
      "하이퍼인플레이션은 법정화폐 가치가 급격히 붕괴하는 현상이고, 하이퍼비트코이너화는 더 우월한 화폐인 비트코인으로 자발적으로 전환하는 현상입니다. 후자는 강제가 아닌 선택입니다.",
  },
  {
    question: "비트코인 채굴자의 장기 수입은 무엇에서 올 것으로 전망되나요?",
    options: [
      "블록 보조금만으로 충분하다",
      "트랜잭션 수수료가 주요 보안 예산 원천이 될 것이다",
      "정부 보조금을 통해 보완될 것이다",
      "채굴자 수가 줄어들면 문제가 해결된다",
    ],
    answer: 1,
    explanation:
      "반감기마다 블록 보조금은 절반으로 줄어 약 2140년에 0이 됩니다. 낙관론자들은 라이트닝 정산 등 블록 공간 수요 증가로 트랜잭션 수수료가 보안 예산의 주요 원천이 될 것이라고 봅니다.",
  },
  {
    question: "비트코인이 환경에 미치는 영향에 대한 비트코이너의 반론으로 가장 적절한 것은?",
    options: [
      "비트코인 채굴은 아무런 에너지도 사용하지 않는다",
      "채굴은 재생에너지의 잉여 전력을 흡수하는 최적의 고객이며, 재생에너지 비중이 높다",
      "에너지 소비는 경제 발전에 무조건 나쁘지 않다",
      "다른 산업도 에너지를 쓰므로 비트코인만 비판할 수 없다",
    ],
    answer: 1,
    explanation:
      "비트코이너들은 채굴이 재생에너지의 잉여(curtailed) 전력을 흡수하는 이상적인 고객이며, 채굴 에너지 중 재생에너지 비중이 상당히 높다는 점을 주요 반론으로 제시합니다.",
  },
  {
    question: "비트코인이 주로 범죄에 사용된다는 주장에 대한 반론으로 옳지 않은 것은?",
    options: [
      "비트코인 블록체인은 완전히 투명해서 현금보다 추적이 쉽다",
      "전체 비트코인 거래 중 불법 거래 비중은 0.1~0.2% 수준이다",
      "범죄자들은 추적 불가능한 현금을 선호한다",
      "비트코인은 익명성이 완벽해 추적이 불가능하다",
    ],
    answer: 3,
    explanation:
      "비트코인은 익명성이 완벽하지 않습니다. 퍼블릭 블록체인에 모든 거래가 영구 기록되어 현금보다 훨씬 추적하기 쉽습니다. 실제로 많은 비트코인 관련 범죄자가 블록체인 분석을 통해 검거되었습니다.",
  },
  {
    question: "오렌지 필링(Orange-pilling)이란?",
    options: [
      "비트코인 가격이 급등하는 현상",
      "누군가가 비트코인의 진정한 의미를 이해하고 확신을 갖게 되는 과정",
      "비트코인을 오렌지색으로 홍보하는 마케팅 캠페인",
      "비트코인 채굴에 사용되는 특정 알고리즘",
    ],
    answer: 1,
    explanation:
      "오렌지 필링은 영화 매트릭스의 '빨간 약' 개념에서 유래한 용어로, 비트코인의 화폐적·철학적 의미를 진정으로 이해하게 되는 순간이나 과정을 가리킵니다.",
  },
  {
    question: "DCA(Dollar Cost Averaging)가 비트코인 축적 전략으로 권장되는 이유는?",
    options: [
      "항상 최저가에 매수할 수 있기 때문에",
      "가격 타이밍을 맞추려는 스트레스 없이 장기적으로 평균 단가를 낮출 수 있기 때문에",
      "한 번에 대량 매수보다 수수료가 낮기 때문에",
      "정부 규제를 피할 수 있기 때문에",
    ],
    answer: 1,
    explanation:
      "DCA는 가격 타이밍을 맞추려는 심리적 스트레스를 없애고, 가격이 높을 때는 적게 사고 낮을 때는 많이 사는 자연스러운 평균 단가 낮추기 효과를 제공합니다. 장기 보유자에게 권장되는 전략입니다.",
  },
  {
    question: "'더 좋은 암호화폐가 비트코인을 대체할 것'이라는 주장에 대한 비트코이너의 반론으로 가장 핵심적인 것은?",
    options: [
      "비트코인이 기술적으로 가장 우월하기 때문에 대체 불가능하다",
      "비트코인의 핵심 가치는 기술이 아닌 탈중앙화·보안·네트워크 효과이며, 이는 쉽게 복사할 수 없다",
      "다른 코인들은 모두 사기이므로 경쟁이 될 수 없다",
      "법적으로 다른 코인의 사용이 금지되어 있다",
    ],
    answer: 1,
    explanation:
      "비트코이너들은 비트코인의 핵심 경쟁력이 기술적 우월성이 아니라, 15년 이상 검증된 탈중앙화·보안·네트워크 효과라고 주장합니다. TCP/IP처럼, 더 빠른 프로토콜이 나와도 기반 레이어는 바뀌지 않습니다.",
  },
];

// ─────────────────────────────────────────────
// Main Export
// ─────────────────────────────────────────────
export default function Ch10FutureOfBitcoin() {
  return (
    <div>
      <BitcoinStandardSection />
      <HyperbitcoinizationSection />
      <SecurityModelSection />
      <SecurityBudgetSimulator />
      <FudRebuttalSection />
      <PersonalJourneySection />
      <DCASimulator />
      <QuizSection questions={quizQuestions} />
    </div>
  );
}
