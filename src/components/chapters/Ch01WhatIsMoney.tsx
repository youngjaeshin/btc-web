"use client";

import { useState } from "react";
import { InfoBox } from "@/components/content/InfoBox";
import { KatexBlock } from "@/components/content/KatexBlock";
import { QuizSection } from "@/components/quiz/QuizSection";
import { Plot } from "@/components/content/DynamicPlot";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

// ---------------------------------------------------------------------------
// 화폐 속성 레이더 차트
// ---------------------------------------------------------------------------
const MONEY_ATTRIBUTES = ["내구성", "휴대성", "분할성", "희소성", "검증가능성"];

const RADAR_DATA: Record<string, { scores: number[]; color: string }> = {
  조개껍데기: { scores: [4, 5, 3, 3, 4], color: "#a78bfa" },
  금: { scores: [9, 5, 6, 8, 7], color: "#f59e0b" },
  달러: { scores: [6, 8, 9, 2, 5], color: "#64748b" },
  비트코인: { scores: [10, 10, 10, 10, 10], color: "#f97316" },
};

function MoneyRadarChart() {
  const traces = Object.entries(RADAR_DATA).map(([name, { scores, color }]) => ({
    type: "scatterpolar" as const,
    r: [...scores, scores[0]],
    theta: [...MONEY_ATTRIBUTES, MONEY_ATTRIBUTES[0]],
    fill: "toself" as const,
    name,
    line: { color },
    fillcolor: color + "33",
  }));

  return (
    <div className="my-8">
      <h3 className="text-lg font-semibold mb-3">화폐 속성 비교 레이더 차트</h3>
      <p className="text-sm text-muted-foreground mb-4">
        각 화폐 형태를 5가지 속성 기준(1–10점)으로 비교합니다.
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(RADAR_DATA).map(([name, { color }]) => (
          <span
            key={name}
            className="px-3 py-1 rounded-full text-sm font-medium text-white"
            style={{ backgroundColor: color }}
          >
            {name}
          </span>
        ))}
      </div>
      <Plot
        data={traces}
        layout={{
          title: { text: "화폐 형태별 5가지 속성 비교" },
          polar: {
            radialaxis: { visible: true, range: [0, 10], tickfont: { size: 10 } },
          },
          showlegend: true,
          height: 420,
          margin: { t: 50, b: 30, l: 40, r: 40 },
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          font: { color: "#888" },
        }}
        config={{ displayModeBar: false }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 인플레이션 구매력 시뮬레이터
// ---------------------------------------------------------------------------
function InflationSimulator() {
  const [initialAmount, setInitialAmount] = useState(1000000);
  const [inflationRate, setInflationRate] = useState(3);

  const years = Array.from({ length: 51 }, (_, i) => i);
  const purchasing = years.map(
    (y) => initialAmount * Math.pow(1 - inflationRate / 100, y)
  );

  const milestones = [10, 20, 50].map((y) => ({
    year: y,
    value: initialAmount * Math.pow(1 - inflationRate / 100, y),
  }));

  return (
    <div className="my-8">
      <h3 className="text-lg font-semibold mb-3">인플레이션 구매력 감소 시뮬레이터</h3>
      <p className="text-sm text-muted-foreground mb-4">
        슬라이더를 조절해 연간 인플레이션율에 따른 실질 구매력 감소를 확인하세요.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div>
          <label className="text-sm font-medium block mb-2">
            초기 금액: {initialAmount.toLocaleString()}원
          </label>
          <Slider
            min={100000}
            max={10000000}
            step={100000}
            value={[initialAmount]}
            onValueChange={([v]) => setInitialAmount(v)}
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-2">
            연간 인플레이션율: {inflationRate}%
          </label>
          <Slider
            min={1}
            max={20}
            step={0.5}
            value={[inflationRate]}
            onValueChange={([v]) => setInflationRate(v)}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mb-4">
        {milestones.map(({ year, value }) => (
          <Card key={year} className="px-4 py-3 flex-1 min-w-32 text-center">
            <p className="text-xs text-muted-foreground">{year}년 후</p>
            <p className="text-lg font-bold text-orange-500">
              {Math.round(value).toLocaleString()}원
            </p>
            <p className="text-xs text-muted-foreground">
              ({((value / initialAmount) * 100).toFixed(1)}% 남음)
            </p>
          </Card>
        ))}
      </div>
      <Plot
        data={[
          {
            x: years,
            y: purchasing,
            type: "scatter",
            mode: "lines",
            name: "실질 구매력",
            line: { color: "#f97316", width: 2 },
            fill: "tozeroy",
            fillcolor: "rgba(249,115,22,0.15)",
          },
          {
            x: years,
            y: years.map(() => initialAmount),
            type: "scatter",
            mode: "lines",
            name: "명목 금액",
            line: { color: "#64748b", width: 1.5, dash: "dash" },
          },
        ]}
        layout={{
          title: { text: "연도별 실질 구매력 (원)" },
          xaxis: { title: { text: "경과 연수 (년)" } },
          yaxis: { title: { text: "실질 구매력 (원)" } },
          height: 360,
          margin: { t: 50, b: 50, l: 70, r: 30 },
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          font: { color: "#888" },
          legend: { orientation: "h", y: -0.15 },
        }}
        config={{ displayModeBar: false }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 물물교환 시뮬레이션
// ---------------------------------------------------------------------------
function BarterSimulation() {
  const [numPeople, setNumPeople] = useState(10);

  const nRange = Array.from({ length: 49 }, (_, i) => i + 2);
  const singleProb = numPeople > 1 ? (1 / Math.pow(numPeople - 1, 2)) * 100 : 100;

  return (
    <div className="my-8">
      <h3 className="text-lg font-semibold mb-3">물물교환 이중 일치 시뮬레이션</h3>
      <p className="text-sm text-muted-foreground mb-4">
        N명의 참여자가 각각 다른 물건을 갖고 서로 다른 물건을 원할 때,
        특정 두 사람이 서로의 물건을 원하는 이중 일치가 성사될 확률을 계산합니다.
      </p>
      <div className="mb-4">
        <label className="text-sm font-medium block mb-2">
          시장 참여자 수: {numPeople}명
        </label>
        <Slider
          min={2}
          max={50}
          step={1}
          value={[numPeople]}
          onValueChange={([v]) => setNumPeople(v)}
        />
      </div>
      <Card className="p-4 text-center mb-4">
        <p className="text-xs text-muted-foreground mb-1">특정 두 사람이 서로 원할 확률</p>
        <p className="text-2xl font-bold text-red-500">{singleProb.toFixed(2)}%</p>
        <p className="text-xs text-muted-foreground mt-1">
          = 1/(N−1)² — 참여자가 늘수록 원하는 상대를 찾기가 급격히 어려워짐
        </p>
      </Card>
      <Plot
        data={[
          {
            x: nRange,
            y: nRange.map((n) => (n > 1 ? (1 / Math.pow(n - 1, 2)) * 100 : 100)),
            type: "scatter",
            mode: "lines",
            name: "이중 일치 확률 1/(N−1)²",
            line: { color: "#f43f5e", width: 2.5 },
            fill: "tozeroy",
            fillcolor: "rgba(244,63,94,0.1)",
          },
          {
            x: [numPeople],
            y: [singleProb],
            type: "scatter",
            mode: "markers",
            name: `현재: ${numPeople}명 (${singleProb.toFixed(2)}%)`,
            marker: { color: "#f97316", size: 12, line: { color: "#fff", width: 2 } },
          },
        ]}
        layout={{
          title: { text: "참여자 수에 따른 이중 일치 확률" },
          xaxis: { title: { text: "시장 참여자 수 (명)" } },
          yaxis: { title: { text: "이중 일치 확률 (%)" }, range: [0, 105] },
          height: 360,
          margin: { t: 50, b: 50, l: 60, r: 30 },
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          font: { color: "#888" },
          legend: { orientation: "h", y: -0.2 },
        }}
        config={{ displayModeBar: false }}
      />
      <InfoBox type="tip" title="화폐가 해결하는 것">
        물물교환의 이중 일치 문제(Double Coincidence of Wants)를 화폐가 해결합니다.
        화폐는 교환의 매개체, 가치의 척도, 가치의 저장 수단으로 기능하며
        거래 비용을 극적으로 낮춥니다.
      </InfoBox>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 퀴즈 데이터
// ---------------------------------------------------------------------------
const QUIZ_QUESTIONS = [
  {
    question: "물물교환 경제의 근본적인 문제인 '이중 일치 문제(Double Coincidence of Wants)'란 무엇인가?",
    options: [
      "거래 당사자 모두가 상대방의 물건을 원해야 교환이 성사되는 문제",
      "두 사람이 동시에 같은 물건을 원하는 현상",
      "두 개의 상품을 동시에 구매해야 하는 제약",
      "화폐가 두 가지 기능을 동시에 수행해야 하는 문제",
    ],
    answer: 0,
    explanation:
      "이중 일치 문제는 A가 B의 물건을 원하고, B도 A의 물건을 원해야만 교환이 성사되는 조건입니다. 참여자가 많아질수록 이 조건이 맞는 상대를 찾기가 극도로 어려워집니다.",
  },
  {
    question: "건전화폐(Sound Money)의 가장 핵심적인 속성은 무엇인가?",
    options: [
      "정부의 법적 보증(법정통화 지위)",
      "발행 주체의 신뢰도",
      "물리적 내구성",
      "임의적 조작이 불가능한 희소성",
    ],
    answer: 3,
    explanation:
      "건전화폐의 핵심은 누구도 임의로 공급을 늘릴 수 없는 희소성입니다. 금이 수천 년간 화폐로 기능한 이유도 채굴 비용 때문에 공급 증가가 제한적이었기 때문입니다. 비트코인은 이를 수학적으로 보장합니다.",
  },
  {
    question: "화폐의 5가지 속성 중 비트코인이 금보다 명확히 우위에 있는 속성은?",
    options: [
      "내구성(Durability)",
      "휴대성(Portability)과 분할성(Divisibility)",
      "희소성(Scarcity)",
      "검증가능성(Verifiability)",
    ],
    answer: 1,
    explanation:
      "비트코인은 인터넷만 있으면 즉시 전 세계로 전송 가능(휴대성)하고, 1사토시(0.00000001 BTC)까지 분할(분할성)됩니다. 금은 물리적 이동과 분할에 큰 비용이 따릅니다.",
  },
  {
    question: "금이 수천 년간 화폐로 사용된 핵심 이유를 화폐 속성 관점에서 가장 잘 설명한 것은?",
    options: [
      "왕과 귀족이 금을 법적으로 화폐로 지정하고 유통을 강제했기 때문이다",
      "금은 산업적 용도가 많아 실질적인 사용 가치가 다른 금속보다 높았기 때문이다",
      "금은 내구성·희소성·분할성·검증가능성을 동시에 갖춘 자연 원소이기 때문이다",
      "금이 가장 먼저 발견된 금속이라 화폐 역할을 자연스럽게 선점했기 때문이다",
    ],
    answer: 2,
    explanation:
      "금은 부식되지 않는 내구성, 지각 내 제한된 매장량에서 오는 희소성, 정밀 분할이 가능한 물리적 특성, 비중과 색택으로 진위를 확인할 수 있는 검증가능성을 동시에 갖추고 있어 시장에서 자연스럽게 화폐로 선택되었습니다.",
  },
  {
    question: "화폐 역사에서 금속 화폐가 조개껍데기나 기타 원시 화폐를 대체한 가장 큰 이유는?",
    options: [
      "금속은 내구성·희소성·분할성·검증가능성이 뛰어났기 때문",
      "조개껍데기보다 금속의 외관이 더 권위 있어 보였기 때문",
      "고대 제국들이 조약을 통해 금속 화폐만 공식 인정했기 때문",
      "금속이 다른 소재보다 먼저 발견되어 화폐 역할을 선점했기 때문",
    ],
    answer: 0,
    explanation:
      "금속(특히 금과 은)은 부식되지 않는 내구성, 안정적 희소성, 정밀 분할 가능성, 비중·색으로 진위 확인 가능한 검증가능성을 갖추어 시장에서 자연스럽게 선택되었습니다.",
  },
  {
    question: "비트코인의 '검증가능성(Verifiability)'이 금이나 법정화폐와 다른 점은?",
    options: [
      "공인된 정부기관이 비트코인의 진위와 수량을 공식적으로 보증한다",
      "독립적인 국제 감사기관이 블록체인 외부에서 정기적으로 감사한다",
      "등록된 거래소들이 공동으로 잔액과 거래 내역을 보증하고 공시한다",
      "누구나 풀노드를 실행해 전체 공급량과 거래를 직접 검증할 수 있다",
    ],
    answer: 3,
    explanation:
      "비트코인의 풀노드는 누구나 실행 가능하며, 전체 2,100만 개 공급 상한과 모든 거래 내역을 제3자 신뢰 없이 직접 검증할 수 있습니다. 금은 정밀 기기가 필요하고, 달러는 중앙은행의 신뢰에 의존합니다.",
  },
  {
    question: "법정화폐와 비교해 비트코인의 '희소성(Scarcity)' 속성이 근본적으로 다른 이유는?",
    options: [
      "비트코인은 채굴 비용이 높아 대량 생산이 경제적으로 불가능하기 때문이다",
      "비트코인은 프로토콜 코드에 의해 총 발행량 상한이 수학적으로 고정되어 있기 때문이다",
      "각국 중앙은행이 비트코인 발행량을 규제할 수 없어 통제가 불가능하기 때문이다",
      "비트코인 네트워크 참여자들이 투표로 발행량을 매년 결정하기 때문이다",
    ],
    answer: 1,
    explanation:
      "법정화폐는 중앙은행이 필요에 따라 무한히 발행할 수 있지만, 비트코인은 프로토콜 코드에 2,100만 개 상한이 내장되어 있어 누구도 이를 변경할 수 없습니다. 이것이 프로그래밍된 희소성이며, 역사상 처음으로 발행 규칙이 수학적으로 보장된 화폐입니다.",
  },
  {
    question: "비트코인이 역사상 처음으로 해결한 '디지털 희소성'의 핵심 문제는?",
    options: [
      "암호화가 불완전해 디지털 자산이 해킹에 취약하다는 문제",
      "인터넷 대역폭 한계로 전송 속도가 물리적 화폐보다 느리다는 문제",
      "디지털 데이터는 무한 복사가 가능해 희소성을 만들 수 없다는 문제",
      "각국 정부의 규제 승인 없이는 디지털 화폐가 법적 효력을 가질 수 없다는 문제",
    ],
    answer: 2,
    explanation:
      "디지털 정보는 완벽하게 복사할 수 있어 희소성을 구현하기 불가능했습니다. 비트코인은 작업증명(PoW)과 분산 합의 메커니즘으로 중앙 권위 없이도 디지털 희소성을 수학적으로 보장한 최초의 발명입니다.",
  },
];

// ---------------------------------------------------------------------------
// 메인 컴포넌트
// ---------------------------------------------------------------------------
export default function Ch01WhatIsMoney() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      {/* ── 도입 ── */}
      <p className="lead">
        인류는 왜 화폐를 발명했을까요? 단순해 보이는 질문이지만, 그 답은 경제학의 가장 근본적인
        통찰을 담고 있습니다. 화폐를 이해하면 비트코인이 왜 혁명적인지가 자연스럽게 드러납니다.
      </p>

      {/* ── 1. 물물교환의 한계 ── */}
      <h2>1. 물물교환의 한계</h2>
      <p>
        상상해 보세요. 당신은 쌀 농부이고, 신발이 필요합니다. 신발 장인을 찾아갔더니
        그는 쌀이 아닌 닭을 원합니다. 닭 농부를 찾아갔더니 그는 옷을 원합니다.
        이것이 물물교환 경제의 치명적 결함, <strong>이중 일치 문제(Double Coincidence of Wants)</strong>입니다.
      </p>
      <p>
        N명이 참여하는 시장에서 특정 두 사람이 서로의 물건을 원하는 확률은 다음과 같습니다.
      </p>
      <KatexBlock math={"\\frac{1}{(N-1)^2}"} display={true} />
      <p>
        참여자가 10명이면 약 1.2%, 100명이면 0.01%로 급락합니다.
      </p>
      <InfoBox type="definition" title="이중 일치 문제 (Double Coincidence of Wants)">
        교환이 성립하려면 A가 B의 물건을 원하고, 동시에 B도 A의 물건을 원해야 한다는 조건.
        시장이 커질수록 이 조건 충족이 기하급수적으로 어려워진다.
      </InfoBox>

      <BarterSimulation />

      {/* ── 2. 화폐의 5가지 속성 ── */}
      <h2>2. 화폐의 5가지 속성</h2>
      <p>
        물물교환의 한계를 극복하기 위해 인류가 선택한 화폐는 시장에서 자연스럽게 진화했습니다.
        가장 많은 사람이 기꺼이 받으려는 상품이 화폐가 되었고, 역사는 다음 5가지 속성을
        갖춘 것이 최종 승자가 됨을 보여줍니다.
      </p>

      <div className="not-prose grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
        {[
          {
            title: "내구성 (Durability)",
            desc: "시간이 지나도 물리적으로 손상되지 않아야 합니다. 부패하거나 녹슬면 화폐 기능을 잃습니다.",
            example: "금은 수천 년 후에도 그대로, 생선은 하루 만에 부패",
            color: "border-yellow-400",
          },
          {
            title: "휴대성 (Portability)",
            desc: "가치 대비 크기와 무게가 작아야 합니다. 운반이 어려우면 교환 비용이 증가합니다.",
            example: "금화 한 닢 vs 소 한 마리",
            color: "border-blue-400",
          },
          {
            title: "분할성 (Divisibility)",
            desc: "작은 단위로 나눌 수 있어야 합니다. 큰 가치의 거래와 소액 거래를 모두 처리할 수 있어야 합니다.",
            example: "비트코인은 1사토시(0.00000001 BTC)까지 분할 가능",
            color: "border-green-400",
          },
          {
            title: "희소성 (Scarcity)",
            desc: "공급이 임의로 늘어날 수 없어야 합니다. 누구나 만들 수 있다면 가치를 저장할 수 없습니다.",
            example: "금은 채굴 비용이 존재, 비트코인은 수학적으로 2,100만 개 상한",
            color: "border-orange-400",
          },
          {
            title: "검증가능성 (Verifiability)",
            desc: "진위를 쉽게 확인할 수 있어야 합니다. 위조 불가능성이 신뢰의 기반입니다.",
            example: "금은 비중·색으로 확인, 비트코인은 누구나 풀노드로 검증",
            color: "border-purple-400",
          },
        ].map(({ title, desc, example, color }) => (
          <Card key={title} className={`p-4 border-l-4 ${color}`}>
            <h4 className="font-bold mb-2">{title}</h4>
            <p className="text-sm text-muted-foreground mb-2">{desc}</p>
            <p className="text-xs italic text-muted-foreground">예: {example}</p>
          </Card>
        ))}
      </div>

      <MoneyRadarChart />

      {/* ── 3. 화폐의 역사 ── */}
      <h2>3. 화폐의 역사: 조개껍데기에서 비트코인까지</h2>
      <p>
        화폐의 역사는 더 좋은 화폐 속성을 찾아가는 끊임없는 여정입니다.
        각 단계에서 새로운 화폐는 이전보다 우수한 속성을 보유했기에 시장에서 채택되었습니다.
      </p>

      <div className="not-prose space-y-3 my-6">
        {[
          {
            era: "기원전 ~3000년",
            name: "조개껍데기·돌",
            desc: "자연 희소성이 있었으나, 특정 지역에서만 발견되고 인위적으로 공급이 늘어날 수 있었습니다. 유럽인이 아프리카에 조개껍데기를 가져와 경제를 파괴한 역사가 이를 증명합니다.",
            tag: "내구성·분할성 취약",
            tagColor: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
          },
          {
            era: "기원전 ~700년",
            name: "금속 화폐 (금·은·동)",
            desc: "부식 없는 내구성, 정밀 분할 가능, 비중으로 검증 가능한 특성으로 시장에서 선택되었습니다. 특히 금은 화학적으로 가장 안정적인 금속 중 하나입니다.",
            tag: "내구성·희소성 우수",
            tagColor: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
          },
          {
            era: "1944년",
            name: "금본위제 (브레턴우즈 체제)",
            desc: "금의 직접 운반 없이 금으로 태환 가능한 지폐를 사용. 금 1온스 = 35달러로 태환 보장. 정부의 과도한 지출로 결국 붕괴했습니다. (자세한 내용은 2장 닉슨 쇼크 참고)",
            tag: "금태환 보증, 1971년 붕괴",
            tagColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
          },
          {
            era: "1971년~현재",
            name: "법정화폐 (Fiat Money)",
            desc: "금태환 없이 정부의 권위만으로 가치가 부여되는 화폐. 중앙은행이 무제한으로 발행 가능하여 희소성 속성이 완전히 사라졌습니다. 법정화폐의 구조적 문제점은 2장에서 상세히 분석합니다.",
            tag: "희소성 속성 파괴",
            tagColor: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
          },
          {
            era: "2009년~",
            name: "비트코인",
            desc: "수학적으로 보장된 2,100만 개 상한, 1사토시까지 분할 가능, 인터넷으로 즉시 전송, 누구나 풀노드로 검증 가능. 인류 역사상 최초로 5가지 화폐 속성을 모두 극대화한 화폐.",
            tag: "5가지 속성 모두 우수",
            tagColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
          },
        ].map(({ era, name, desc, tag, tagColor }) => (
          <div key={name} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-orange-500 mt-1.5 shrink-0" />
              <div className="w-0.5 bg-orange-200 dark:bg-orange-800 flex-1 mt-1" />
            </div>
            <div className="pb-4">
              <p className="text-xs text-muted-foreground">{era}</p>
              <p className="font-semibold">{name}</p>
              <p className="text-sm text-muted-foreground mt-1">{desc}</p>
              <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${tagColor}`}>
                {tag}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── 4. 금 vs 법정화폐 vs 비트코인 ── */}
      <h2>4. 금 vs 법정화폐 vs 비트코인 비교</h2>
      <p>
        5가지 속성 기준으로 세 가지 화폐를 객관적으로 비교하면, 비트코인이 왜 디지털 시대의
        건전화폐로 주목받는지 이해할 수 있습니다.
      </p>

      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border p-3 text-left">속성</th>
              <th className="border border-border p-3 text-center">금</th>
              <th className="border border-border p-3 text-center">달러(법정화폐)</th>
              <th className="border border-border p-3 text-center">비트코인</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["내구성", "매우 우수 (화학적 안정)", "보통 (지폐 마모)", "완벽 (디지털, 영구)"],
              ["휴대성", "낮음 (무겁고 부피 큼)", "우수 (카드/디지털)", "완벽 (인터넷 즉시 전송)"],
              ["분할성", "보통 (가공 비용 발생)", "우수 (센트 단위)", "완벽 (0.00000001 BTC)"],
              ["희소성", "우수 (채굴 비용 한계)", "매우 낮음 (무제한 발행)", "완벽 (수학적 2,100만 개)"],
              ["검증가능성", "보통 (전문 장비 필요)", "어려움 (중앙 신뢰 의존)", "완벽 (누구나 풀노드)"],
            ].map(([attr, gold, fiat, btc], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                <td className="border border-border p-3 font-medium">{attr}</td>
                <td className="border border-border p-3 text-center text-yellow-700 dark:text-yellow-400">{gold}</td>
                <td className="border border-border p-3 text-center text-slate-600 dark:text-slate-400">{fiat}</td>
                <td className="border border-border p-3 text-center text-orange-600 dark:text-orange-400 font-medium">{btc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── 5. 건전화폐란? ── */}
      <h2>5. 건전화폐(Sound Money)란 무엇인가?</h2>
      <p>
        <strong>건전화폐(Sound Money)</strong>란 발행 주체의 의지나 정치적 결정으로
        공급량을 임의로 늘릴 수 없는 화폐입니다.
        오스트리안 경제학자 루트비히 폰 미제스와 프리드리히 하이에크는
        건전화폐가 개인의 자유와 번영을 위한 필수 조건임을 강조했습니다.
      </p>

      <InfoBox type="warning" title="인플레이션은 세금이다">
        화폐 공급이 늘어나면 기존 화폐 보유자의 구매력이 감소합니다. 이는 입법 절차 없이
        중앙은행이 부를 조용히 이전하는 메커니즘입니다. 연 2% 인플레이션은 36년 후
        구매력을 절반으로 줄입니다.
      </InfoBox>

      <p>
        구매력이 유지되는 화폐에서는 미래를 위해 저축하는 것이 합리적입니다.
        반면 구매력이 지속적으로 하락하는 화폐에서는 '지금 소비'가 경제적으로 유리하여
        사회 전체의 시간선호(Time Preference)가 높아지고, 장기 투자와 자본 형성이 억제됩니다.
      </p>

      <InfoBox type="info" title="건전화폐의 수학: 비트코인의 발행 공식">
        비트코인의 블록 보상은 매 210,000블록(약 4년)마다 절반으로 줄어들며,
        총 발행량은 수학적으로 정확히 2,100만 BTC에 수렴합니다.
        이 반감기 메커니즘과 공급 공식의 수학적 유도는 5장(희소성)에서 자세히 다룹니다.
      </InfoBox>

      <p>
        역사는 건전화폐를 포기한 문명이 어떤 결말을 맞았는지 반복해서 보여줍니다.
        로마 제국의 데나리우스 은화는 초기 95% 은 함량에서 4세기에는 거의 0%로 떨어지며
        제국의 경제적 몰락을 가속화했습니다. 바이마르 공화국, 짐바브웨, 베네수엘라—
        모두 같은 패턴입니다.
      </p>

      <InfoBox type="tip" title="비트코인 맥시멀리스트 관점">
        비트코인은 단순한 투자 자산이 아닙니다. 인류 역사상 처음으로 수학적으로
        검증 가능하고, 정치적으로 조작 불가능한 건전화폐입니다.
        "Not your keys, not your coins"는 자기주권의 선언입니다.
      </InfoBox>

      <InflationSimulator />

      {/* ── 퀴즈 ── */}
      <QuizSection questions={QUIZ_QUESTIONS} />
    </article>
  );
}
