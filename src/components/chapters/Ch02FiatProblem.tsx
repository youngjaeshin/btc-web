"use client";

import { useState } from "react";
import { InfoBox } from "@/components/content/InfoBox";
import { KatexBlock } from "@/components/content/KatexBlock";
import { QuizSection } from "@/components/quiz/QuizSection";
import { Plot } from "@/components/content/DynamicPlot";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

// ---------------------------------------------------------------------------
// M2 통화량 vs 자산가격 차트
// ---------------------------------------------------------------------------

// Real historical data indexed to 100 at 1971
// Sources:
//   M2: FRED M2SL (annual avg, billions USD) — fred.stlouisfed.org/series/M2SL
//   Gold: LBMA London Fix (annual avg, USD/oz) — inflationdata.com
//   S&P 500: Jan 1 price each year — multpl.com (Robert Shiller)
//   Home: FRED CSUSHPINSA + Shiller pre-1987 — fred.stlouisfed.org/series/CSUSHPINSA
// Base values at 1971: M2=$674.4B, Gold=$40.95/oz, S&P500=93.49, Home=21.65
const YEARS = [
  1971, 1975, 1980, 1985, 1990, 1995, 2000, 2005,
  2008, 2010, 2012, 2015, 2018, 2020, 2021, 2022, 2023, 2024, 2025,
];
const M2_INDEX =    [100, 143, 228, 358, 478, 527, 711, 970, 1157, 1282, 1492, 1788, 2093, 2620, 3042, 3199, 3088, 3128, 3257];
const GOLD_INDEX =  [100, 412, 1642, 813, 1005, 987, 709, 1162, 2129, 2990, 4076, 2833, 3098, 4331, 4393, 4400, 4745, 5829, 8140];
const SP500_INDEX = [100, 78, 119, 184, 364, 498, 1525, 1264, 1475, 1202, 1391, 2169, 2984, 3506, 4058, 4892, 4236, 5139, 6396];
const HOME_INDEX =  [100, 126, 211, 261, 355, 374, 484, 794, 758, 668, 651, 795, 935, 1026, 1201, 1378, 1412, 1485, 1518];

const DATA_SOURCES = "M2: FRED M2SL | Gold: LBMA London Fix | S&P 500: multpl.com | Home: FRED CSUSHPINSA (2025년 기준)";

function M2AssetChart() {
  const [visible, setVisible] = useState({
    m2: true,
    gold: true,
    sp500: true,
    home: true,
  });

  type VisibleKey = keyof typeof visible;
  const toggle = (key: VisibleKey) =>
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }));

  const traces = [
    { key: "m2" as VisibleKey, name: "M2 통화량", data: M2_INDEX, color: "#ef4444" },
    { key: "gold" as VisibleKey, name: "금 가격", data: GOLD_INDEX, color: "#f59e0b" },
    { key: "sp500" as VisibleKey, name: "S&P 500", data: SP500_INDEX, color: "#3b82f6" },
    { key: "home" as VisibleKey, name: "주택가격지수", data: HOME_INDEX, color: "#10b981" },
  ]
    .filter(({ key }) => visible[key])
    .map(({ name, data, color }) => ({
      x: YEARS,
      y: data,
      type: "scatter" as const,
      mode: "lines+markers" as const,
      name,
      line: { color, width: 2 },
      marker: { size: 4 },
    }));

  return (
    <div className="my-8">
      <h3 className="text-lg font-semibold mb-3">M2 통화량 vs 자산가격 (1971년 = 100 기준)</h3>
      <p className="text-sm text-muted-foreground mb-4">
        닉슨 쇼크 이후 M2 통화량과 주요 자산가격의 동반 상승을 확인하세요.
        항목을 토글해 비교할 수 있습니다.
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { key: "m2" as VisibleKey, label: "M2 통화량", color: "#ef4444" },
          { key: "gold" as VisibleKey, label: "금 가격", color: "#f59e0b" },
          { key: "sp500" as VisibleKey, label: "S&P 500", color: "#3b82f6" },
          { key: "home" as VisibleKey, label: "주택가격지수", color: "#10b981" },
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => toggle(key)}
            className="px-3 py-1 rounded-full border text-sm font-medium transition-opacity"
            style={{
              borderColor: color,
              color: visible[key] ? "#fff" : color,
              backgroundColor: visible[key] ? color : "transparent",
              opacity: visible[key] ? 1 : 0.5,
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <Plot
        data={traces}
        layout={{
          title: { text: "1971년 이후 통화팽창과 자산가격 (지수, 1971=100)" },
          xaxis: { title: { text: "연도" } },
          yaxis: {
            title: { text: "지수 (1971=100, log scale)" },
            type: "log",
          },
          height: 400,
          margin: { t: 50, b: 50, l: 80, r: 30 },
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          font: { color: "#666" },
          legend: { orientation: "h", y: -0.2 },
          shapes: [
            {
              type: "line",
              x0: 1971,
              x1: 1971,
              y0: 0,
              y1: 1,
              yref: "paper",
              line: { color: "#f97316", width: 2, dash: "dot" },
            },
          ],
          annotations: [
            {
              x: 1971,
              y: 1,
              yref: "paper",
              text: "닉슨 쇼크",
              showarrow: true,
              arrowhead: 2,
              ax: 40,
              ay: -20,
              font: { color: "#f97316", size: 11 },
            },
          ],
        }}
        config={{ displayModeBar: false }}
      />
      <p className="text-[11px] text-muted-foreground text-center mt-1 mb-4">
        출처: {DATA_SOURCES}
      </p>
      <InfoBox type="warning" title="통화팽창과 자산가격">
        M2 통화량과 자산가격의 상관관계는 우연이 아닙니다. 새로 발행된 화폐는
        먼저 금융 시스템에 유입되어 자산 가격을 올리고, 그 혜택은 자산 보유자에게 돌아갑니다.
        이것이 칸티용 효과(Cantillon Effect)입니다.
      </InfoBox>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 복리 인플레이션 계산기
// ---------------------------------------------------------------------------
function InflationCalculator() {
  const [inflationRate, setInflationRate] = useState(4);
  const [years, setYears] = useState(20);
  const initialAmount = 1000000;

  const finalValue = initialAmount * Math.pow(1 - inflationRate / 100, years);
  const neededToMaintain = initialAmount * Math.pow(1 + inflationRate / 100, years);
  const lossPercent = ((initialAmount - finalValue) / initialAmount) * 100;

  const yearRange = Array.from({ length: years + 1 }, (_, i) => i);
  const realValues = yearRange.map(
    (y) => initialAmount * Math.pow(1 - inflationRate / 100, y)
  );
  const nominalNeeded = yearRange.map(
    (y) => initialAmount * Math.pow(1 + inflationRate / 100, y)
  );

  return (
    <div className="my-8">
      <h3 className="text-lg font-semibold mb-3">복리 인플레이션 계산기</h3>
      <p className="text-sm text-muted-foreground mb-4">
        100만 원의 실질 가치 변화와, 실질 가치를 유지하려면 명목 금액이 얼마여야 하는지 확인합니다.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div>
          <label className="text-sm font-medium block mb-2">
            연간 인플레이션율: {inflationRate}%
          </label>
          <Slider
            min={2}
            max={15}
            step={0.5}
            value={[inflationRate]}
            onValueChange={([v]) => setInflationRate(v)}
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-2">
            기간: {years}년
          </label>
          <Slider
            min={1}
            max={50}
            step={1}
            value={[years]}
            onValueChange={([v]) => setYears(v)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <Card className="p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">현재 100만 원의 {years}년 후 실질 가치</p>
          <p className="text-xl font-bold text-red-500">
            {Math.round(finalValue).toLocaleString()}원
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {lossPercent.toFixed(1)}% 구매력 손실
          </p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">{years}년 후 실질 가치 유지에 필요한 금액</p>
          <p className="text-xl font-bold text-orange-500">
            {Math.round(neededToMaintain).toLocaleString()}원
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {((neededToMaintain / initialAmount - 1) * 100).toFixed(0)}% 명목 수익 필요
          </p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">구매력 반감 기간</p>
          <p className="text-xl font-bold text-amber-500">
            {(72 / inflationRate).toFixed(1)}년
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            72법칙: 72 ÷ {inflationRate}%
          </p>
        </Card>
      </div>
      <Plot
        data={[
          {
            x: yearRange,
            y: realValues,
            type: "scatter",
            mode: "lines",
            name: "100만 원의 실질 가치",
            line: { color: "#ef4444", width: 2 },
            fill: "tozeroy",
            fillcolor: "rgba(239,68,68,0.1)",
          },
          {
            x: yearRange,
            y: nominalNeeded,
            type: "scatter",
            mode: "lines",
            name: "실질 가치 유지 필요 명목액",
            line: { color: "#f97316", width: 2, dash: "dash" },
          },
          {
            x: [0],
            y: [initialAmount],
            type: "scatter",
            mode: "markers",
            name: "초기 금액",
            marker: { color: "#64748b", size: 8 },
            showlegend: false,
          },
        ]}
        layout={{
          title: { text: `100만 원의 실질 구매력 변화 (인플레이션 ${inflationRate}%/년)` },
          xaxis: { title: { text: "경과 연수 (년)" } },
          yaxis: { title: { text: "금액 (원)" } },
          height: 360,
          margin: { t: 50, b: 50, l: 80, r: 30 },
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          font: { color: "#666" },
          legend: { orientation: "h", y: -0.2 },
        }}
        config={{ displayModeBar: false }}
      />
    </div>
  );
}


// ---------------------------------------------------------------------------
// 퀴즈 데이터
// ---------------------------------------------------------------------------
const QUIZ_QUESTIONS = [
  {
    question: "1971년 닉슨 쇼크의 핵심 내용은 무엇인가?",
    options: [
      "미국이 달러와 금의 태환(교환) 보장을 일방적으로 중단했다",
      "미국이 달러를 주요 6개국 통화 바스켓과의 고정 환율 체제에 편입시켰다",
      "미국이 연방준비제도(Fed)를 해체하고 새로운 독립 통화 감독 기관을 설립했다",
      "미국이 달러 연간 발행량 상한을 GDP 성장률로 제한하는 법안을 통과시켰다",
    ],
    answer: 0,
    explanation:
      "1971년 8월 15일, 닉슨 대통령은 베트남 전쟁 비용과 복지 지출 확대로 인한 달러 과잉 발행으로 금 보유량이 고갈될 위기에 처하자, 달러를 금 1온스 = 35달러 비율로 교환해주던 약속을 일방적으로 파기했습니다. 이로써 인류 역사의 화폐는 처음으로 어떤 실물 자산과도 연동되지 않은 순수 법정화폐 시대로 진입했습니다.",
  },
  {
    question: "중앙은행의 양적완화(QE, Quantitative Easing)를 가장 정확하게 설명한 것은?",
    options: [
      "중앙은행이 저소득층 가구에 직접 현금을 지급해 소비를 진작하는 정책",
      "정부가 법인세와 소득세를 인하해 민간 투자와 소비를 활성화하는 재정 정책",
      "중앙은행이 국채 등 자산을 매입해 시중에 통화를 공급하는 정책",
      "시중은행들이 상호 대출 한도를 협약으로 늘려 통화량을 확대하는 민간 정책",
    ],
    answer: 2,
    explanation:
      "양적완화는 중앙은행이 국채, 모기지담보증권(MBS) 등을 시중 은행으로부터 매입하면서 그 대금으로 새 화폐를 공급하는 정책입니다. 2008년 금융위기 이후 미 연준은 수조 달러 규모의 QE를 실행했습니다. 이는 사실상 무에서 화폐를 창조하는 행위입니다.",
  },
  {
    question: "칸티용 효과(Cantillon Effect)가 의미하는 것은?",
    options: [
      "통화 공급 증가는 모든 경제 주체에게 동시에 균등하게 구매력으로 전달된다",
      "인플레이션은 자산 규모와 무관하게 모든 계층에 동일한 실질 부담을 지운다",
      "통화 공급이 늘어날수록 GDP 성장률도 같은 비율로 정비례하여 증가한다",
      "새로 발행된 화폐가 금융 시스템에 가까운 순서대로 먼저 혜택을 주고, 일반 시민은 물가 상승만 부담한다",
    ],
    answer: 3,
    explanation:
      "18세기 경제학자 리처드 칸티용이 발견한 이 효과는, 새 화폐는 경제 전체에 즉시 퍼지지 않고 중앙은행 → 시중은행 → 대기업 → 일반 시민 순서로 도달한다는 것입니다. 먼저 받은 사람은 물가 오르기 전 구매할 수 있어 이득을 보고, 마지막에 받는 일반 시민은 이미 오른 물가만 부담합니다.",
  },
  {
    question: "부분지급준비제도(Fractional Reserve Banking)의 핵심 메커니즘은?",
    options: [
      "은행이 예금액의 100%를 항상 금고에 보유해 지급 불능 위험을 완전히 차단한다",
      "은행이 예금액의 일부만 준비금으로 보유하고 나머지를 대출해 통화를 창조한다",
      "은행이 중앙은행으로부터만 자금을 빌려 일반 고객에게 재대출하는 방식으로 운영된다",
      "예금자가 플랫폼을 통해 대출자에게 직접 자금을 공급하는 P2P 직접 대출 시스템",
    ],
    answer: 1,
    explanation:
      "부분지급준비제도에서 은행은 예금의 10% (또는 그 이하)만 준비금으로 보유하고 나머지 90%를 대출합니다. 이 대출금이 다시 예금되어 또다시 대출되는 과정이 반복되면서 초기 예금의 수배에 달하는 화폐가 창조됩니다. 이를 신용 창조(Credit Creation) 또는 화폐 승수 효과라 합니다.",
  },
  {
    question: "1971년 금태환 중단 이후 50년간 미국 달러의 구매력 변화는 대략 어떻게 되었는가?",
    options: [
      "구매력이 약 95% 이상 감소했다",
      "구매력이 거의 변화 없이 유지되었다",
      "구매력이 약 50% 증가했다",
      "구매력이 약 30% 감소했다",
    ],
    answer: 0,
    explanation:
      "미국 노동통계국(BLS) 데이터에 따르면 1971년의 1달러는 2025년 기준으로 약 0.05달러의 구매력만 갖습니다. 즉 약 95% 이상의 구매력이 사라졌습니다. 연평균 약 4%의 인플레이션이 50년간 복리로 누적된 결과입니다.",
  },
  {
    question: "비트코인이 칸티용 효과를 근본적으로 해결하는 방식은?",
    options: [
      "비트코인은 국제 중앙은행 협의체를 통해 각국에 균등하게 배분되도록 설계되어 있다",
      "비트코인은 네트워크 참여자 수에 비례해 모든 지갑 주소에 자동으로 균등 배분된다",
      "비트코인은 각국 정부가 공동으로 관리해 특정 금융 기관의 우선 접근을 제도적으로 차단한다",
      "비트코인은 발행량 자체가 수학적으로 고정되어 있어 어떤 주체도 임의로 새 화폐를 발행할 수 없다",
    ],
    answer: 3,
    explanation:
      "비트코인의 새 BTC는 작업증명(PoW) 채굴을 통해서만 발행됩니다. 채굴자는 전기와 장비라는 실물 비용을 지불해야 합니다. 어떤 중앙 권위도 비용 없이 BTC를 발행할 수 없기 때문에 칸티용 효과가 구조적으로 불가능합니다.",
  },
  {
    question: "인플레이션을 '은폐세(Hidden Tax)'라고 부르는 이유는?",
    options: [
      "정부 예산법에 인플레이션 조정분이 공식 조세 항목으로 명시되어 있기 때문",
      "세금 납부액이 클수록 인플레이션 면제 혜택이 커져 두 효과가 서로 상쇄되기 때문",
      "인플레이션이 입법 절차 없이 화폐 보유자의 구매력을 조용히 이전하기 때문",
      "인플레이션은 고소득층 자산에만 선택적으로 적용되는 숨겨진 누진 과세이기 때문",
    ],
    answer: 2,
    explanation:
      "일반 세금은 의회 승인이 필요하지만, 인플레이션(화폐 발행)은 중앙은행이 독자적으로 결정할 수 있습니다. 화폐 공급 증가는 기존 화폐 보유자의 구매력을 희석시켜 실질적으로 부를 이전합니다. 이 과정은 명세서 없이 발생하므로 '은폐세' 또는 '인플레이션세'라 불립니다.",
  },
  {
    question: "M2 통화량과 자산가격(주식, 부동산, 금)의 관계를 가장 정확하게 설명한 것은?",
    options: [
      "M2 증가로 발행된 화폐가 자산 시장에 유입되어 자산가격을 상승시키며, 이 혜택은 자산 보유자에게 집중된다",
      "M2가 늘어나면 화폐 가치 상승으로 인해 자산가격은 오히려 하락하는 경향이 있다",
      "M2와 자산가격은 각자 독립적인 요인에 의해 결정되며 체계적 상관관계가 없다",
      "M2와 자산가격은 경기 사이클의 단기 구간에서만 동조하고 10년 이상 장기에서는 무관하다",
    ],
    answer: 0,
    explanation:
      "1971년 이후 미국 M2는 약 33배, S&P500은 약 64배, 금은 약 81배, 주택가격은 약 15배 상승했습니다. 통화팽창으로 발행된 화폐는 먼저 금융 시스템에 진입하여 주식·채권·부동산 같은 자산을 매입하는 데 사용됩니다. 자산이 없는 사람은 상승하는 물가만 경험하며 상대적 빈곤이 심화됩니다.",
  },
];

// ---------------------------------------------------------------------------
// 메인 컴포넌트
// ---------------------------------------------------------------------------
export default function Ch02FiatProblem() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      {/* ── 도입 ── */}
      <p className="lead">
        1971년 8월 15일은 현대 금융 역사의 분기점입니다. 그날 이후 인류는 역사상 처음으로
        어떤 실물 자산과도 연동되지 않은 순수 신용 화폐 시대에 살고 있습니다.
        50년이 지난 지금, 그 결과는 숫자로 명확하게 드러납니다.
      </p>

      {/* ── 1. 닉슨 쇼크 ── */}
      <h2>1. 닉슨 쇼크 (1971): 금본위제의 종말</h2>
      <p>
        브레턴우즈 체제(1944)는 전후 국제 통화 질서를 세웠습니다.
        달러는 금 1온스 = 35달러 비율로 교환을 보장받았고,
        각국 통화는 달러에 고정되었습니다.
        미국은 이 시스템의 중심에 서며 기축통화국이 되었습니다.
      </p>
      <p>
        그러나 베트남 전쟁 비용과 존슨의 '위대한 사회' 복지 프로그램으로
        미국의 재정 적자는 눈덩이처럼 불어났습니다.
        달러를 과도하게 발행하자 각국이 달러를 금으로 교환하기 시작했고,
        미국의 금 보유량은 급감했습니다.
      </p>

      <InfoBox type="warning" title="닉슨 쇼크: 1971년 8월 15일">
        닉슨 대통령은 TV 연설에서 일방적으로 금태환 중단을 선언했습니다.
        "일시적 조치"라고 했지만, 이는 영구적이었습니다.
        이날 이후 달러는 미국 정부의 '신뢰'만으로 가치가 유지되는 순수 법정화폐(Fiat Money)가 되었습니다.
      </InfoBox>

      <p>
        닉슨 쇼크의 직접적 결과는 명확합니다.
        1971년 이후 미국의 M2 통화량은 약 33배 증가했고,
        달러의 구매력은 95% 이상 하락했습니다.
        금 가격은 온스당 35달러에서 2,000달러를 넘어섰습니다.
      </p>

      <M2AssetChart />

      {/* ── 2. 중앙은행과 통화팽창 ── */}
      <h2>2. 중앙은행과 통화팽창의 메커니즘</h2>
      <p>
        현대 통화 시스템에서 화폐는 두 가지 경로로 창조됩니다.
        첫째, 중앙은행의 <strong>공개시장조작</strong>—국채 등을 매입하며 준비금을 공급.
        둘째, 시중은행의 <strong>신용 창조</strong>—부분지급준비제도를 통해 예금의 수배를 대출.
      </p>

      <InfoBox type="definition" title="부분지급준비제도 (Fractional Reserve Banking)">
        은행은 예금의 일부(준비율, 예: 10%)만 금고에 보유하고 나머지를 대출합니다.
        이 대출금이 다시 예금되고 또 대출되는 과정이 반복되며, 최초 예금의 수배에 달하는
        화폐가 창조됩니다. 미국은 2020년 코로나19 위기 때 법정 지급준비율을 아예 0%로 낮췄습니다.
      </InfoBox>

      <p>
        화폐 승수 공식으로 이를 표현하면:
      </p>
      <KatexBlock
        math={"M = \\frac{1}{r} \\times B"}
        display={true}
      />
      <p className="text-sm text-muted-foreground text-center -mt-2">
        M = 총 통화량, r = 지급준비율, B = 본원통화(Central Bank Money)
      </p>
      <p>
        지급준비율이 10%라면 본원통화 1조 원은 최대 10조 원의 통화를 창조합니다.
        지급준비율이 0%에 가까워질수록 이론상 무한대의 통화 창조가 가능하지만, 실제로는 대출 수요, 신용 위험 평가, 자기자본 규제(BIS 바젤 기준) 등이 제약 역할을 합니다.
      </p>

      <InfoBox type="info" title="양적완화(QE)의 규모">
        2008년 금융위기 이후 미 연준은 4조 달러 이상의 QE를 실행했습니다.
        2020년 코로나19 대응으로 추가 4조 달러를 공급해 연준 자산이 9조 달러를 넘어섰습니다.
        2020년 한 해에만 M2가 25% 이상 증가했는데, 이는 미국 역사상 전례 없는 증가율이었습니다.
      </InfoBox>

      {/* ── 3. 인플레이션 은폐세 ── */}
      <h2>3. 인플레이션: 가장 조용한 세금</h2>
      <p>
        인플레이션은 단순한 물가 상승이 아닙니다.
        화폐 공급이 늘어나면 같은 양의 재화와 서비스를 더 많은 화폐가 쫓게 되어 가격이 오릅니다.
        이는 기존 화폐 보유자의 구매력을 실질적으로 빼앗는 행위입니다.
      </p>
      <p>
        일반 세금은 의회 승인, 공청회, 언론 보도가 따릅니다.
        그러나 인플레이션은 중앙은행 회의실에서 조용히 결정되어
        모든 화폐 보유자에게 고지 없이 부과됩니다.
        밀턴 프리드먼은 이를 <strong>"세금 없는 세금"</strong>이라 불렀습니다.
      </p>

      <InfoBox type="warning" title="72의 법칙: 구매력 반감기">
        연 인플레이션율로 72를 나누면 구매력이 반감되는 기간이 나옵니다.
        연 4% 인플레이션: 18년 후 구매력 50% 손실.
        연 8% 인플레이션: 9년 후 구매력 50% 손실.
        한국의 1990년대~2020년대 평균 인플레이션은 약 3~5% 수준이었습니다.
      </InfoBox>

      <InflationCalculator />

      {/* ── 4. 칸티용 효과 ── */}
      <h2>4. 칸티용 효과: 화폐 발행은 누구에게 유리한가?</h2>
      <p>
        18세기 아일랜드-프랑스 경제학자 리처드 칸티용(Richard Cantillon)은
        화폐 공급 증가의 혜택이 모든 사람에게 동등하게 돌아가지 않는다는 사실을 발견했습니다.
        새 화폐는 경제 전체에 즉시 균등 분배되는 것이 아니라,
        금융 시스템에 가장 가까운 곳에서부터 순차적으로 퍼져나갑니다.
      </p>
      <p>
        새 화폐를 먼저 받는 주체(중앙은행, 시중은행, 대형 금융기관)는
        물가가 아직 오르지 않은 상태에서 자산을 구매할 수 있습니다.
        반면 화폐 공급이 증가했다는 사실을 뒤늦게 알게 되는 일반 시민은
        이미 오른 물가를 마주합니다.
        결과적으로 <strong>화폐 발행은 일반 시민에서 금융 엘리트로 부를 이전</strong>합니다.
      </p>

      <InfoBox type="definition" title="칸티용 효과 (Cantillon Effect)">
        새로 발행된 화폐가 경제 주체들에게 균등하게 분배되지 않고,
        금융 시스템에 가까운 순서대로 도달하면서 발생하는 소득 재분배 효과.
        화폐 발행의 실질적 수혜자는 중앙은행과 시중은행이며,
        일반 시민은 물가 상승이라는 비용만 부담한다.
      </InfoBox>


      {/* ── 5. M2 공급량과 자산가격 ── */}
      <h2>5. M2 공급량과 자산가격: 숫자가 말하는 진실</h2>
      <p>
        1971년 이후의 데이터는 칸티용 효과를 생생하게 보여줍니다.
        통화량이 33배 늘어나는 동안, 그 혜택은 자산 보유자에게 집중되었습니다.
        주식과 부동산을 가진 사람은 수십 배의 명목 자산 증가를 경험했고,
        임금 소득자는 같은 기간 실질 임금 정체 속에서 오르는 집값을 바라봐야 했습니다.
      </p>
      <p>
        이것이 현대 자산 불평등의 구조적 원인입니다.
        통화팽창은 자산을 가진 자와 그렇지 못한 자 사이의 격차를 체계적으로 확대합니다.
        '부자가 더 부자가 되는' 현상은 개인의 능력 차이만이 아니라,
        법정화폐 시스템의 구조적 결함에 기인합니다.
      </p>

      <InfoBox type="tip" title="비트코인은 어떻게 다른가?">
        비트코인의 새 BTC는 작업증명(PoW) 채굴자에게만 발행됩니다.
        채굴자는 전기와 장비라는 실물 비용을 지불해야 하며, 어떤 중앙 권위도
        비용 없이 BTC를 발행할 수 없습니다. 발행 일정은 코드에 하드코딩되어 있어
        정치적 결정으로 변경할 수 없습니다.
        비트코인은 칸티용 효과가 구조적으로 불가능한 최초의 화폐입니다.
      </InfoBox>

      <p>
        비트코인 맥시멀리스트들이 비트코인을 단순한 투자 자산이 아닌 <strong>정치적 도구</strong>로
        보는 이유가 여기 있습니다. 법정화폐 시스템에서 탈출하는 것은
        단순한 재정적 선택이 아니라, 구조적 착취에서 자신을 지키는 행위입니다.
        비트코인의 공급량은 수학적으로 2,100만 BTC로 고정되어 있으며, 어떤 주체도 이를 변경할 수 없습니다.
        이 공급 스케줄의 수학적 구조는 5장(희소성)에서 상세히 다룹니다.
      </p>

      <InfoBox type="info" title="'Fix the money, fix the world'">
        비트코인 커뮤니티의 슬로건은 과장이 아닙니다. 법정화폐 시스템의 구조적 결함—
        칸티용 효과, 인플레이션세, 통화팽창을 통한 부의 불평등—은
        1장에서 다룬 건전화폐(Sound Money)를 채택함으로써만 근본적으로 해결될 수 있습니다.
        비트코인은 그 건전화폐의 디지털 구현입니다.
      </InfoBox>

      {/* ── 퀴즈 ── */}
      <QuizSection questions={QUIZ_QUESTIONS} />
    </article>
  );
}
