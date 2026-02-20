"use client";

import { useState } from "react";
import { InfoBox } from "@/components/content/InfoBox";
import { KatexBlock } from "@/components/content/KatexBlock";
import { QuizSection } from "@/components/quiz/QuizSection";
import { Plot } from "@/components/content/DynamicPlot";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

// ---------------------------------------------------------------------------
// Supply schedule data helpers
// ---------------------------------------------------------------------------

/** Returns block subsidy in BTC for a given halving epoch (0-indexed) */
function subsidyAtEpoch(epoch: number): number {
  return 50 / Math.pow(2, epoch);
}

/** Blocks per epoch (210,000) */
const BLOCKS_PER_EPOCH = 210_000;

/** Total BTC issued up to and including epoch `n` */
function cumulativeSupply(epoch: number): number {
  let total = 0;
  for (let e = 0; e <= epoch; e++) {
    total += subsidyAtEpoch(e) * BLOCKS_PER_EPOCH;
  }
  return Math.min(total, 21_000_000);
}

/** Lookup table of actual halving years */
const HALVING_YEARS: Record<number, number> = {
  0: 2009, 1: 2012, 2: 2016, 3: 2020, 4: 2024,
};

/** Accurate year for start of epoch (genesis 2009) */
function epochYear(epoch: number): number {
  if (epoch in HALVING_YEARS) return HALVING_YEARS[epoch];
  return 2024 + (epoch - 4) * 4;
}

// Annual new supply for BTC at a given epoch (approx)
function btcAnnualIssuance(epoch: number): number {
  // ~144 blocks/day × 365 days
  return subsidyAtEpoch(epoch) * 144 * 365;
}

// Stock to Flow for BTC at epoch
function btcS2F(epoch: number): number {
  const stock = cumulativeSupply(epoch);
  const flow = btcAnnualIssuance(epoch);
  if (flow <= 0) return 10_000; // after all mining done
  return stock / flow;
}

// BTC annual inflation rate at epoch (%)
function btcInflationRate(epoch: number): number {
  const stock = cumulativeSupply(epoch);
  const flow = btcAnnualIssuance(epoch);
  if (stock <= 0) return 0;
  return (flow / stock) * 100;
}

// ---------------------------------------------------------------------------
// Quiz questions
// ---------------------------------------------------------------------------
const quizQuestions = [
  {
    question: "비트코인의 총 발행 한도는 얼마입니까?",
    options: [
      "1,000만 BTC",
      "2,100만 BTC",
      "1억 BTC",
      "무제한",
    ],
    answer: 1,
    explanation:
      "비트코인 프로토콜은 총 2,100만 BTC(21,000,000)만 발행되도록 코드에 하드코딩되어 있습니다. 이는 누구도 변경할 수 없는 절대적 상한선입니다.",
  },
  {
    question: "비트코인의 반감기(halving)는 몇 블록마다 발생합니까?",
    options: [
      "100,000 블록",
      "150,000 블록",
      "210,000 블록",
      "500,000 블록",
    ],
    answer: 2,
    explanation:
      "비트코인은 정확히 210,000 블록마다 블록 보상이 절반으로 줄어듭니다. 평균 10분/블록 기준으로 약 4년마다 발생합니다.",
  },
  {
    question: "Stock-to-Flow(S2F) 모델에서 '재고(stock)'란 무엇입니까?",
    options: [
      "연간 새로 채굴되는 양",
      "현재 시장에 유통 중인 총 공급량",
      "거래소에 예치된 BTC 수량",
      "채굴자들이 보유한 BTC 수량",
    ],
    answer: 1,
    explanation:
      "S2F 모델에서 재고(stock)는 현재까지 채굴되어 존재하는 총 공급량(기존재고)을 의미합니다. S2F = 재고 / 연간 신규 생산량으로 계산됩니다.",
  },
  {
    question: "2024년 4월 4번째 반감기 이후 비트코인의 블록 보상은 얼마입니까?",
    options: [
      "6.25 BTC",
      "3.125 BTC",
      "1.5625 BTC",
      "12.5 BTC",
    ],
    answer: 1,
    explanation:
      "초기 보상 50 BTC에서 4번의 반감기(÷2×4)를 거치면 50/16 = 3.125 BTC가 됩니다. 2024년 4월 이후 현재 블록 보상입니다.",
  },
  {
    question: "비트코인과 금의 근본적인 차이점은 무엇입니까?",
    options: [
      "비트코인은 금보다 더 무겁다",
      "금의 총 공급량은 물리적으로 고정되어 있지만, 비트코인은 무한히 발행될 수 있다",
      "금은 채굴 기술 발전으로 공급이 늘어날 수 있지만, 비트코인의 상한은 코드로 절대 고정되어 있다",
      "비트코인은 분할이 불가능하다",
    ],
    answer: 2,
    explanation:
      "금은 채굴 기술이 발전하거나 새 광맥이 발견되면 공급이 늘어날 수 있습니다. 반면 비트코인의 2,100만 BTC 상한은 프로토콜에 하드코딩되어 있어 누구도 늘릴 수 없습니다.",
  },
  {
    question: "현재(2024년 기준) 비트코인의 약 발행 비율은?",
    options: [
      "약 50% (약 1,050만 BTC)",
      "약 75% (약 1,575만 BTC)",
      "약 93% (약 1,960만 BTC)",
      "100% (모두 발행 완료)",
    ],
    answer: 2,
    explanation:
      "2024년 기준으로 약 19.6~19.7백만 BTC가 발행되어 전체 한도의 약 93%가 유통되고 있습니다. 나머지 ~4%는 2140년까지 서서히 발행됩니다.",
  },
  {
    question: "금(Gold)의 현재 Stock-to-Flow 비율은 대략 얼마입니까?",
    options: [
      "약 5",
      "약 22",
      "약 62",
      "약 120",
    ],
    answer: 2,
    explanation:
      "금의 S2F는 약 62로 추정됩니다. 이는 현재 금 재고(약 197,000톤)를 연간 신규 채굴량(약 3,200톤)으로 나눈 값입니다. 은은 약 5, 비트코인은 2024년 반감기 이후 약 120~240입니다.",
  },
  {
    question: "디지털 세계에서 비트코인 이전에는 왜 진정한 희소성이 불가능했습니까?",
    options: [
      "디지털 파일은 비용이 많이 들어 복제가 어렵다",
      "디지털 데이터는 비용 없이 무한 복제가 가능하므로 진정한 희소성을 구현할 수 없었다",
      "인터넷이 존재하지 않았기 때문이다",
      "디지털 화폐는 이미 1990년대에 존재했다",
    ],
    answer: 1,
    explanation:
      "디지털 데이터는 본질적으로 완벽하게, 그리고 거의 무비용으로 복제가 가능합니다. 비트코인은 작업증명(PoW)과 분산 합의를 통해 디지털 세계 최초로 복제 불가능한 진정한 디지털 희소성을 구현했습니다.",
  },
];

// ---------------------------------------------------------------------------
// Simulation 1: S2F comparison bar chart with halving slider
// ---------------------------------------------------------------------------
function S2FComparisonSim() {
  const [halvingCount, setHalvingCount] = useState(4);

  const btcS2FValue = btcS2F(halvingCount);
  const displayBtcS2F = Math.min(btcS2FValue, 500);

  const goldS2F = 62;
  const silverS2F = 5;

  const data = [
    {
      x: ["은 (Silver)", "금 (Gold)", `BTC (반감기 ${halvingCount}회)`],
      y: [silverS2F, goldS2F, displayBtcS2F],
      type: "bar" as const,
      marker: {
        color: ["#94a3b8", "#f59e0b", "#f97316"],
      },
      text: [
        `S2F: ${silverS2F}`,
        `S2F: ${goldS2F}`,
        btcS2FValue > 999
          ? "S2F: ∞ (채굴 완료)"
          : `S2F: ${btcS2FValue.toFixed(0)}`,
      ],
      textposition: "outside" as const,
    },
  ];

  const layout = {
    title: { text: "자산별 Stock-to-Flow 비교" },
    yaxis: {
      title: { text: "Stock-to-Flow 비율" },
      range: [0, Math.max(displayBtcS2F, goldS2F) * 1.3],
    },
    xaxis: { title: { text: "자산" } },
    plot_bgcolor: "rgba(0,0,0,0)",
    paper_bgcolor: "rgba(0,0,0,0)",
    font: { size: 13 },
    margin: { t: 60, b: 60, l: 60, r: 20 },
  };

  return (
    <Card className="p-4 my-6">
      <h3 className="font-bold text-lg mb-2">시뮬레이션 1: S2F 비교 차트</h3>
      <p className="text-sm text-muted-foreground mb-4">
        슬라이더로 비트코인 반감기 횟수를 조정해 S2F가 어떻게 변하는지 확인하세요.
      </p>
      <div className="mb-4">
        <label className="text-sm font-medium">
          반감기 횟수: <span className="text-primary font-bold">{halvingCount}회</span>
          {" "}(블록 보상: {subsidyAtEpoch(halvingCount).toFixed(4)} BTC,
          {" "}약 {epochYear(halvingCount)}년)
        </label>
        <Slider
          min={0}
          max={10}
          step={1}
          value={[halvingCount]}
          onValueChange={(v) => setHalvingCount(v[0])}
          className="mt-2"
        />
      </div>
      <Plot
        data={data}
        layout={layout}
        config={{ displayModeBar: false, responsive: true }}
      />
      <div className="mt-3 p-3 bg-violet-50 dark:bg-violet-950/30 rounded-lg text-sm">
        <strong>해석:</strong> 반감기가 거듭될수록 BTC의 S2F는 기하급수적으로 증가합니다.
        {btcS2FValue > 200
          ? " 현재 설정에서 BTC는 금보다 훨씬 경화(hard money)에 가깝습니다."
          : btcS2FValue > 62
          ? " 현재 설정에서 BTC는 금(S2F≈62)보다 높은 S2F를 가집니다."
          : " 현재 설정에서 BTC의 S2F는 금에 근접하고 있습니다."}
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Simulation 2: Supply curve
// ---------------------------------------------------------------------------
function SupplyCurveSim() {
  const MAX_EPOCHS = 33; // effectively all BTC mined by epoch ~32

  const years: number[] = [];
  const supply: number[] = [];
  const halvingYears: number[] = [];

  for (let e = 0; e <= MAX_EPOCHS; e++) {
    const yr = epochYear(e);
    // Add points at start and end of epoch
    if (e === 0) {
      years.push(2009);
      supply.push(0);
    }
    years.push(yr);
    supply.push(cumulativeSupply(e));
    if (e > 0 && e <= 10) halvingYears.push(yr);
  }

  // Build halving vertical lines as shapes
  const shapes = halvingYears.map((hy) => ({
    type: "line" as const,
    x0: hy,
    x1: hy,
    y0: 0,
    y1: 21_000_000,
    line: { color: "rgba(249,115,22,0.4)", width: 1.5, dash: "dot" as const },
  }));

  // Asymptote line at 21M
  shapes.push({
    type: "line" as const,
    x0: 2009,
    x1: 2145,
    y0: 21_000_000,
    y1: 21_000_000,
    line: { color: "rgba(124,58,237,0.6)", width: 2, dash: "dot" as const },
  });

  const data = [
    {
      x: years,
      y: supply,
      type: "scatter" as const,
      mode: "lines" as const,
      name: "누적 발행량",
      line: { color: "#f97316", width: 3 },
      fill: "tozeroy" as const,
      fillcolor: "rgba(249,115,22,0.15)",
    },
  ];

  const layout = {
    title: { text: "비트코인 누적 공급 곡선" },
    xaxis: {
      title: { text: "연도" },
      range: [2009, 2145],
    },
    yaxis: {
      title: { text: "누적 발행량 (BTC)" },
      range: [0, 22_000_000],
      tickformat: ",",
    },
    shapes,
    annotations: [
      {
        x: 2100,
        y: 21_000_000,
        text: "21,000,000 BTC 상한",
        showarrow: false,
        yshift: 12,
        font: { color: "#7c3aed", size: 12 },
      },
    ],
    plot_bgcolor: "rgba(0,0,0,0)",
    paper_bgcolor: "rgba(0,0,0,0)",
    font: { size: 12 },
    margin: { t: 60, b: 60, l: 80, r: 20 },
    showlegend: false,
  };

  return (
    <Card className="p-4 my-6">
      <h3 className="font-bold text-lg mb-2">시뮬레이션 2: 공급 곡선</h3>
      <p className="text-sm text-muted-foreground mb-3">
        주황색 수직 점선은 반감기 시점입니다. 보라색 점선은 21M BTC 상한(점근선)입니다.
        공급 곡선은 21M에 점점 가까워지지만 절대 초과하지 않습니다.
      </p>
      <Plot
        data={data}
        layout={layout}
        config={{ displayModeBar: false, responsive: true }}
      />
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Simulation 3: Inflation rate comparison
// ---------------------------------------------------------------------------
function InflationComparisonSim() {
  // Historical BTC inflation by epoch year (approximate)
  const btcYears: number[] = [];
  const btcInflation: number[] = [];

  for (let e = 0; e <= 10; e++) {
    const yr = epochYear(e);
    btcYears.push(yr);
    btcInflation.push(btcInflationRate(e));
  }
  // Extend slightly after last epoch shown
  btcYears.push(2049);
  btcInflation.push(btcInflationRate(10));

  // USD inflation — roughly 2-3% target but actual ~4-8% post-2020
  const usdYears = [2009, 2012, 2016, 2020, 2021, 2022, 2023, 2024, 2028];
  const usdInflation = [2.7, 1.7, 1.3, 1.2, 4.7, 8.0, 3.4, 3.2, 2.5];

  // Gold inflation — ~1.5-2% per year historically
  const goldYears = [2009, 2024, 2049];
  const goldInflation = [1.7, 1.5, 1.6];

  const data = [
    {
      x: btcYears,
      y: btcInflation,
      type: "scatter" as const,
      mode: "lines+markers" as const,
      name: "BTC",
      line: { color: "#f97316", width: 3 },
      marker: { size: 6 },
    },
    {
      x: usdYears,
      y: usdInflation,
      type: "scatter" as const,
      mode: "lines+markers" as const,
      name: "USD (미국 달러)",
      line: { color: "#ef4444", width: 2, dash: "dot" as const },
      marker: { size: 5 },
    },
    {
      x: goldYears,
      y: goldInflation,
      type: "scatter" as const,
      mode: "lines" as const,
      name: "금 (Gold)",
      line: { color: "#eab308", width: 2, dash: "dash" as const },
    },
  ];

  const layout = {
    title: { text: "연간 인플레이션율 비교: BTC vs USD vs 금" },
    xaxis: {
      title: { text: "연도" },
      range: [2009, 2049],
    },
    yaxis: {
      title: { text: "연간 인플레이션율 (%)" },
      range: [0, 30],
    },
    plot_bgcolor: "rgba(0,0,0,0)",
    paper_bgcolor: "rgba(0,0,0,0)",
    font: { size: 12 },
    margin: { t: 60, b: 60, l: 60, r: 20 },
    legend: { x: 0.6, y: 0.9 },
  };

  return (
    <Card className="p-4 my-6">
      <h3 className="font-bold text-lg mb-2">시뮬레이션 3: 인플레이션율 비교</h3>
      <p className="text-sm text-muted-foreground mb-3">
        BTC의 인플레이션율은 반감기마다 계단식으로 절반으로 줄어듭니다.
        USD는 꾸준히 양(+)의 인플레이션을 유지하고, 금은 약 1.5~2%를 유지합니다.
      </p>
      <Plot
        data={data}
        layout={layout}
        config={{ displayModeBar: false, responsive: true }}
      />
      <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg text-sm">
        <strong>핵심:</strong> BTC의 인플레이션율은 프로그래밍된 스케줄에 따라 정확히 예측 가능하며,
        장기적으로 0%에 수렴합니다. 어떤 중앙은행의 결정도 이를 바꿀 수 없습니다.
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function Ch05Scarcity() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      {/* ------------------------------------------------------------------ */}
      {/* Section 1: 절대적 희소성 */}
      {/* ------------------------------------------------------------------ */}
      <h2>1. 절대적 희소성 — 2,100만 개의 의미</h2>

      <p>
        역사상 어떤 화폐도 수학적으로 증명 가능한 절대적 희소성을 가진 적이 없습니다.
        금은 희귀하지만 우주에 무한히 존재하고, 법정화폐는 중앙은행이 마음대로 찍어냅니다.
        비트코인은 인류 최초로 <strong>절대적으로 고정된 공급 한도</strong>를 가진 화폐입니다.
      </p>

      <p>
        총 발행량 2,100만 BTC(21,000,000)는 임의적으로 선택된 숫자가 아닙니다.
        초기 블록 보상 50 BTC에서 시작하여 210,000 블록마다 반감되는 등비수열의 합으로 결정됩니다.
      </p>

      <KatexBlock
        display
        math={"\\text{Total Supply} = \\sum_{n=0}^{\\infty} 210{,}000 \\times \\frac{50}{2^n} = 210{,}000 \\times 50 \\times \\frac{1}{1 - \\frac{1}{2}} = 21{,}000{,}000 \\text{ BTC}"}
      />
      <p className="text-sm text-muted-foreground -mt-2">
        (등비급수 합: 초항 50, 공비 1/2 → 합 = 50 × 2 = 100, 여기에 210,000 블록 곱하면 2,100만)
      </p>

      <InfoBox type="definition" title="절대적 희소성(Absolute Scarcity)">
        금융 역사상 처음으로 수학적으로 증명 가능하고, 어떤 인간의 결정으로도 변경 불가능한
        공급 한도를 가진 화폐. 비트코인의 2,100만 BTC 상한은 코드로 하드코딩되어 있으며
        전 세계 노드 네트워크가 이를 강제 집행합니다.
      </InfoBox>

      <h3>프로그래밍된 통화정책</h3>
      <p>
        비트코인의 통화정책은 사토시 나카모토가 2009년 코드에 작성한 이후
        단 한 번도 변경된 적이 없습니다. 어떤 중앙은행 총재도, 어떤 정부도,
        심지어 사토시 자신도 이를 바꿀 수 없습니다.
        규칙이 사람을 지배하는 것이 아니라, <em>코드가 모든 사람을 동등하게 지배합니다.</em>
      </p>

      <InfoBox type="tip" title="Bitcoiner의 관점">
        중앙은행은 &quot;물가안정&quot;을 위해 통화를 팽창한다고 말합니다. 하지만 실제로는
        정부 부채를 화폐화하고, 저축자에게 인플레이션세를 부과하고, 부를 재분배합니다.
        비트코인에서는 <strong>통화정책이 투명하게 공개되어 있고 사전에 알 수 있으며 불변</strong>입니다.
        이것이 진정한 건전화폐(sound money)의 조건입니다.
      </InfoBox>

      {/* ------------------------------------------------------------------ */}
      {/* Section 2: 발행 스케줄 */}
      {/* ------------------------------------------------------------------ */}
      <h2>2. 발행 스케줄 — 반감기의 경이로움</h2>

      <p>
        비트코인의 신규 발행은 <strong>반감기(Halving)</strong>에 의해 정확히 절반씩 줄어듭니다.
        반감기는 210,000 블록(약 4년)마다 발생하며, 블록 보상을 이전의 절반으로 줄입니다.
      </p>

      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-violet-100 dark:bg-violet-900/40">
              <th className="border border-violet-200 dark:border-violet-700 px-4 py-2 text-left">반감기 #</th>
              <th className="border border-violet-200 dark:border-violet-700 px-4 py-2 text-left">예상 연도</th>
              <th className="border border-violet-200 dark:border-violet-700 px-4 py-2 text-right">블록 보상</th>
              <th className="border border-violet-200 dark:border-violet-700 px-4 py-2 text-right">누적 발행량</th>
              <th className="border border-violet-200 dark:border-violet-700 px-4 py-2 text-right">발행 비율</th>
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((epoch) => (
              <tr
                key={epoch}
                className={epoch % 2 === 0 ? "bg-white dark:bg-neutral-900" : "bg-violet-50 dark:bg-violet-950/20"}
              >
                <td className="border border-violet-200 dark:border-violet-700 px-4 py-2">
                  {epoch === 0 ? "창세기" : `${epoch}차`}
                </td>
                <td className="border border-violet-200 dark:border-violet-700 px-4 py-2">
                  {epochYear(epoch)}
                </td>
                <td className="border border-violet-200 dark:border-violet-700 px-4 py-2 text-right font-mono">
                  {subsidyAtEpoch(epoch).toFixed(4)} BTC
                </td>
                <td className="border border-violet-200 dark:border-violet-700 px-4 py-2 text-right font-mono">
                  {(cumulativeSupply(epoch) / 1_000_000).toFixed(2)}M BTC
                </td>
                <td className="border border-violet-200 dark:border-violet-700 px-4 py-2 text-right">
                  {((cumulativeSupply(epoch) / 21_000_000) * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p>
        현재(2024년 기준) 약 <strong>19.7백만 BTC</strong>가 발행되어
        전체 한도의 <strong>93.8%</strong>가 이미 유통 중입니다.
        나머지 약 6.2%는 2140년까지 서서히, 기하급수적으로 줄어드는 속도로 발행됩니다.
      </p>

      <SupplyCurveSim />

      {/* ------------------------------------------------------------------ */}
      {/* Section 3: Stock-to-Flow 모델 */}
      {/* ------------------------------------------------------------------ */}
      <h2>3. Stock-to-Flow 모델</h2>

      <p>
        Stock-to-Flow(S2F)는 자산의 경화도(hardness)를 측정하는 지표입니다.
        &quot;재고(stock)&quot;를 &quot;연간 신규 생산량(flow)&quot;으로 나눈 값으로,
        높을수록 공급 증가가 어려운 경화 자산입니다.
      </p>

      <KatexBlock
        display
        math={"\\text{S2F} = \\frac{\\text{Stock (existing supply)}}{\\text{Flow (annual new production)}}"}
      />

      <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <Card className="p-4 border-slate-300 dark:border-slate-600">
          <div className="text-center">
            <div className="text-4xl mb-2">🥈</div>
            <div className="font-bold text-lg">은 (Silver)</div>
            <div className="text-3xl font-mono text-slate-600 dark:text-slate-300 my-2">S2F ≈ 5</div>
            <div className="text-sm text-muted-foreground">연간 채굴량이 재고의 약 20%</div>
          </div>
        </Card>
        <Card className="p-4 border-amber-300 dark:border-amber-600">
          <div className="text-center">
            <div className="text-4xl mb-2">🥇</div>
            <div className="font-bold text-lg">금 (Gold)</div>
            <div className="text-3xl font-mono text-amber-600 dark:text-amber-400 my-2">S2F ≈ 62</div>
            <div className="text-sm text-muted-foreground">연간 채굴량이 재고의 약 1.6%</div>
          </div>
        </Card>
        <Card className="p-4 border-orange-300 dark:border-orange-600">
          <div className="text-center">
            <div className="text-4xl mb-2">₿</div>
            <div className="font-bold text-lg">비트코인</div>
            <div className="text-3xl font-mono text-orange-500 my-2">S2F ≈ 120+</div>
            <div className="text-sm text-muted-foreground">2024년 반감기 이후, 지속 상승</div>
          </div>
        </Card>
      </div>

      <S2FComparisonSim />

      <InfoBox type="info" title="S2F 모델의 의미">
        PlanB(@100trillionUSD)가 2019년 발표한 S2F 모델은 비트코인의 시가총액이
        S2F 비율과 통계적 상관관계를 가진다고 주장했습니다.
        모델의 가격 예측 정확도에 대한 논쟁은 있지만, S2F가 자산의 희소성을 측정하는
        강력한 도구라는 점은 널리 인정됩니다.
      </InfoBox>

      {/* ------------------------------------------------------------------ */}
      {/* Section 4: 금·은과의 비교 */}
      {/* ------------------------------------------------------------------ */}
      <h2>4. 금·은과의 비교 — "Digital Gold"를 넘어서</h2>

      <p>
        비트코인은 종종 &quot;디지털 금&quot;이라고 불립니다. 그러나 비트코이너들은
        비트코인이 여러 면에서 금보다 우월한 가치저장 수단이라고 주장합니다.
      </p>

      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-amber-100 dark:bg-amber-900/40">
              <th className="border border-amber-200 dark:border-amber-700 px-4 py-2 text-left">특성</th>
              <th className="border border-amber-200 dark:border-amber-700 px-4 py-2 text-center">금 (Gold)</th>
              <th className="border border-amber-200 dark:border-amber-700 px-4 py-2 text-center">BTC</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["총 공급량", "불명확 (지구/우주 매장량 미지수)", "정확히 21,000,000 BTC"],
              ["공급 증가 가능성", "기술 발전으로 증가 가능", "절대 불가 (코드로 고정)"],
              ["검증 가능성", "XRF 분석, 순도 테스트 필요", "누구나 노드로 즉시 검증"],
              ["휴대성", "물리적 이동 어려움", "인터넷만 있으면 어디든"],
              ["분할성", "물리적 분할 어려움", "1억분의 1 사토시까지 분할"],
              ["몰수 저항성", "압수 가능", "개인키만 있으면 압수 불가"],
              ["거래 가능성", "결제에 직접 사용 불편", "라이트닝으로 즉시 결제"],
              ["S2F (현재)", "~62", "~120+ (반감기 후 계속 증가)"],
            ].map(([prop, gold, btc], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white dark:bg-neutral-900" : "bg-amber-50 dark:bg-amber-950/20"}>
                <td className="border border-amber-200 dark:border-amber-700 px-4 py-2 font-medium">{prop}</td>
                <td className="border border-amber-200 dark:border-amber-700 px-4 py-2 text-center text-amber-700 dark:text-amber-300">{gold}</td>
                <td className="border border-amber-200 dark:border-amber-700 px-4 py-2 text-center text-orange-600 dark:text-orange-400">{btc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InfoBox type="warning" title="금의 한계">
        2012년 소행성 채굴 기업들이 등장했고, 기술이 발전하면 우주에서 금을 대량 채굴해
        지구로 가져올 수 있습니다. 이 경우 금의 희소성은 붕괴합니다.
        비트코인의 희소성은 물리 법칙이 아닌 수학적 합의에 의해 보장되므로,
        이러한 위협이 원천적으로 존재하지 않습니다.
      </InfoBox>

      {/* ------------------------------------------------------------------ */}
      {/* Section 5: 디지털 희소성의 혁명 */}
      {/* ------------------------------------------------------------------ */}
      <h2>5. 디지털 희소성의 혁명</h2>

      <p>
        인터넷 이전 세계에서 희소성은 물리적 제약에서 비롯되었습니다.
        인터넷이 등장하자 디지털 정보는 무한히 복제 가능해졌고,
        음악, 영화, 책 등 콘텐츠 산업 전체가 혼란에 빠졌습니다.
        디지털 세계에서는 &quot;복사&quot;가 공짜이므로 진정한 희소성이 불가능했습니다.
      </p>

      <p>
        사토시 나카모토는 2008년 이 근본 문제를 해결했습니다.
        분산된 합의와 작업증명을 통해 <strong>디지털 세계 최초의 복제 불가능한 자산</strong>을 창조했습니다.
      </p>

      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <Card className="p-4 border-red-200 dark:border-red-800">
          <h4 className="font-bold text-red-700 dark:text-red-300 mb-3">디지털 복제 문제</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">✗</span>
              <span>MP3 파일: 무한 복사 가능</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">✗</span>
              <span>JPG 이미지: 완벽 복사 가능</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">✗</span>
              <span>이메일 화폐: 이중지불 불가피</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">✗</span>
              <span>디지털 서명: 복사해도 유효</span>
            </li>
          </ul>
        </Card>
        <Card className="p-4 border-green-200 dark:border-green-800">
          <h4 className="font-bold text-green-700 dark:text-green-300 mb-3">비트코인의 해결책</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>UTXO: 이중지불 수학적으로 불가</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>작업증명: 복제에 에너지 비용 필요</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>분산 원장: 모든 노드가 검증</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>21M 상한: 코드가 보장하는 희소성</span>
            </li>
          </ul>
        </Card>
      </div>

      <InflationComparisonSim />

      <InfoBox type="tip" title="Bitcoiner의 핵심 인사이트">
        비트코인은 단순한 &quot;디지털 금&quot;이 아닙니다. 금은 물리적 제약에 의해 희소하고,
        언젠가 그 제약이 사라질 수 있습니다. 비트코인의 희소성은 수학과 분산 합의로
        보장되며, 이는 인류 역사상 처음으로 <strong>완전히 예측 가능하고 절대 변하지 않는</strong>
        통화 공급 스케줄을 가진 화폐입니다. 이것이 비트코인 표준(Bitcoin Standard)의 기초입니다.
      </InfoBox>

      {/* ------------------------------------------------------------------ */}
      {/* Quiz */}
      {/* ------------------------------------------------------------------ */}
      <QuizSection questions={quizQuestions} />
    </article>
  );
}
