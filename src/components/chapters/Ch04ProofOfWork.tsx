"use client";

import { useState, useEffect, useRef } from "react";
import { InfoBox } from "@/components/content/InfoBox";
import { KatexBlock } from "@/components/content/KatexBlock";
import { QuizSection } from "@/components/quiz/QuizSection";
import { Plot } from "@/components/content/DynamicPlot";
import { simpleHash } from "@/lib/simpleHash";

function blockHash(nonce: number, difficulty: number): string {
  return simpleHash(`block:nonce=${nonce}:diff=${difficulty}:data=bitcoin`);
}

// ─── Mining Simulator ──────────────────────────────────────────────────────
function MiningSimulator() {
  const [difficulty, setDifficulty] = useState(3);
  const [nonce, setNonce] = useState(0);
  const [hash, setHash] = useState("");
  const [found, setFound] = useState(false);
  const [running, setRunning] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [capExceeded, setCapExceeded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nonceRef = useRef(0);
  const foundRef = useRef(false);

  const target = "0".repeat(difficulty);

  function reset() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setNonce(0);
    setHash("");
    setFound(false);
    setAttempts(0);
    setCapExceeded(false);
    nonceRef.current = 0;
    foundRef.current = false;
  }

  function start() {
    reset();
    setRunning(true);
    foundRef.current = false;
    nonceRef.current = 0;

    intervalRef.current = setInterval(() => {
      if (foundRef.current) {
        clearInterval(intervalRef.current!);
        return;
      }
      // Process 5 nonces per tick for speed
      for (let i = 0; i < 5; i++) {
        const n = nonceRef.current;
        const h = blockHash(n, difficulty);
        nonceRef.current++;
        if (h.startsWith(target)) {
          foundRef.current = true;
          setNonce(n);
          setHash(h);
          setFound(true);
          setAttempts(n + 1);
          setRunning(false);
          clearInterval(intervalRef.current!);
          return;
        }
      }
      setNonce(nonceRef.current);
      setAttempts(nonceRef.current);
      setHash(blockHash(nonceRef.current - 1, difficulty));

      // Safety: stop after dynamic cap based on difficulty
      const nonceCap = Math.min(Math.pow(16, difficulty) * 3, 2_000_000);
      if (nonceRef.current > nonceCap) {
        clearInterval(intervalRef.current!);
        setRunning(false);
        setCapExceeded(true);
      }
    }, 20);
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const highlightHash = (h: string) => {
    if (!h) return null;
    const leadingZeros = h.match(/^(0*)/)?.[1] ?? "";
    const rest = h.slice(leadingZeros.length);
    return (
      <>
        <span className="text-green-400 font-bold">{leadingZeros}</span>
        <span className={found ? "text-yellow-300" : "text-zinc-400"}>{rest}</span>
      </>
    );
  };

  return (
    <div className="not-prose my-6 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950/30 p-5">
      <h3 className="font-bold text-stone-800 dark:text-stone-200 mb-1 text-base">채굴 시뮬레이터</h3>
      <p className="text-sm text-muted-foreground mb-4">
        난이도(선행 0 개수)를 설정하고 Start를 누르면 논스를 증가시키며 목표 해시를 탐색합니다.
      </p>

      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm font-medium min-w-max">
          난이도 (선행 0 개수): <span className="font-bold text-orange-600 dark:text-orange-400">{difficulty}</span>
        </label>
        <input
          type="range"
          min={1}
          max={5}
          value={difficulty}
          onChange={(e) => { reset(); setDifficulty(Number(e.target.value)); }}
          className="flex-1 accent-orange-500"
          disabled={running}
        />
      </div>

      <div className="mb-3 text-xs text-muted-foreground">
        목표: 해시가 <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">{"0".repeat(difficulty)}...</code>으로 시작해야 함
        &nbsp;·&nbsp; 확률 ≈ 1/{(16 ** difficulty).toLocaleString()}
      </div>

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={start}
          disabled={running}
          className="rounded-lg px-4 py-2 text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white transition-colors disabled:opacity-50"
        >
          {running ? "채굴 중..." : "시작"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg px-4 py-2 text-sm font-semibold border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          초기화
        </button>
      </div>

      <div className="rounded-lg bg-zinc-900 px-4 py-3 font-mono text-xs mb-3">
        <div className="text-zinc-400 mb-1">Nonce: <span className="text-white">{nonce.toLocaleString()}</span>&nbsp;&nbsp;시도 횟수: <span className="text-white">{attempts.toLocaleString()}</span></div>
        <div className="text-zinc-400 mb-1">Hash:</div>
        <div className="break-all text-sm leading-relaxed">
          {hash ? highlightHash(hash) : <span className="text-zinc-600">— 채굴을 시작하세요 —</span>}
        </div>
      </div>

      {found && (
        <div className="rounded-lg bg-green-900/40 border border-green-500 px-4 py-3 text-green-300 text-sm font-semibold text-center">
          블록 발견! Nonce = {nonce.toLocaleString()} · {attempts.toLocaleString()}번 시도 만에 성공
        </div>
      )}

      {running && (
        <div className="rounded-lg bg-amber-900/30 border border-amber-600 px-4 py-2 text-amber-300 text-xs text-center animate-pulse">
          논스 탐색 중… ({attempts.toLocaleString()}회 시도)
        </div>
      )}

      {capExceeded && !found && (
        <div className="rounded-lg bg-red-900/40 border border-red-500 px-4 py-3 text-red-300 text-sm font-semibold text-center">
          탐색 한계 초과 — Reset 후 다시 시도하세요
        </div>
      )}
    </div>
  );
}

// ─── Halving Supply Chart ──────────────────────────────────────────────────
function HalvingChart() {
  // Halving events: block height, year, reward
  const halvings = [
    { height: 0, year: 2009, reward: 50 },
    { height: 210000, year: 2012, reward: 25 },
    { height: 420000, year: 2016, reward: 12.5 },
    { height: 630000, year: 2020, reward: 6.25 },
    { height: 840000, year: 2024, reward: 3.125 },
    { height: 1050000, year: 2028, reward: 1.5625 },
    { height: 1260000, year: 2032, reward: 0.78125 },
    { height: 1470000, year: 2036, reward: 0.390625 },
  ];

  // Build step data
  const blockHeights: number[] = [];
  const rewards: number[] = [];
  const cumulative: number[] = [];
  let cum = 0;

  for (let i = 0; i < halvings.length - 1; i++) {
    const start = halvings[i].height;
    const end = halvings[i + 1].height;
    const reward = halvings[i].reward;

    blockHeights.push(start, end - 1);
    rewards.push(reward, reward);

    const btcInPeriod = reward * 210000;
    cumulative.push(cum, cum + btcInPeriod);
    cum += btcInPeriod;
  }

  // Vertical lines for halvings
  const halvingShapes = halvings.slice(1, 7).map((h) => ({
    type: "line" as const,
    x0: h.height,
    x1: h.height,
    y0: 0,
    y1: 50,
    line: { color: "rgba(251,146,60,0.5)", width: 1.5, dash: "dot" as const },
  }));

  const halvingAnnotations = halvings.slice(1, 7).map((h) => ({
    x: h.height,
    y: 48,
    text: `${h.year}<br>${h.reward} BTC`,
    showarrow: false,
    font: { size: 9, color: "rgb(251,146,60)" },
    textangle: "-90",
    xanchor: "left" as const,
    yanchor: "top" as const,
  })) satisfies Partial<import("plotly.js").Annotations>[];

  return (
    <div className="not-prose my-6 rounded-xl border border-violet-200 dark:border-violet-800 overflow-hidden">
      <div className="px-4 py-3 bg-violet-50 dark:bg-violet-950/30 border-b border-violet-200 dark:border-violet-800">
        <h3 className="font-bold text-violet-800 dark:text-violet-200 text-base">반감기 공급 스케줄</h3>
        <p className="text-xs text-muted-foreground mt-0.5">블록 높이에 따른 블록 보상(BTC)과 누적 발행량</p>
      </div>
      <div className="p-2">
        <Plot
          data={[
            {
              x: blockHeights,
              y: rewards,
              type: "scatter",
              mode: "lines",
              name: "블록 보상 (BTC)",
              line: { color: "rgb(251,146,60)", width: 2.5, shape: "hv" },
              yaxis: "y",
            },
            {
              x: blockHeights,
              y: cumulative.map((c) => c / 1e6),
              type: "scatter",
              mode: "lines",
              name: "누적 발행량 (백만 BTC)",
              line: { color: "rgb(139,92,246)", width: 2, dash: "dash" },
              yaxis: "y2",
            },
          ]}
          layout={{
            height: 350,
            margin: { t: 20, r: 70, b: 50, l: 55 },
            paper_bgcolor: "rgba(0,0,0,0)",
            plot_bgcolor: "rgba(0,0,0,0)",
            xaxis: {
              title: { text: "블록 높이" },
              gridcolor: "rgba(128,128,128,0.15)",
              tickformat: ",.0f",
            },
            yaxis: {
              title: { text: "블록 보상 (BTC)", font: { color: "rgb(251,146,60)" } },
              gridcolor: "rgba(128,128,128,0.15)",
              range: [0, 55],
              tickfont: { color: "rgb(251,146,60)" },
            },
            yaxis2: {
              title: { text: "누적 발행량 (백만 BTC)", font: { color: "rgb(139,92,246)" } },
              overlaying: "y",
              side: "right",
              range: [0, 22],
              tickfont: { color: "rgb(139,92,246)" },
            },
            shapes: halvingShapes,
            annotations: halvingAnnotations,
            legend: { x: 0.5, y: 1.02, xanchor: "center", orientation: "h" },
            font: { size: 11 },
          }}
          config={{ displayModeBar: false, responsive: true }}
        />
      </div>
      <div className="px-4 pb-3">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {halvings.slice(0, 4).map((h) => (
            <div key={h.height} className="rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 p-2">
              <div className="font-bold text-orange-700 dark:text-orange-300">{h.year}</div>
              <div className="text-muted-foreground">{h.reward} BTC</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Quiz ──────────────────────────────────────────────────────────────────
const quizQuestions = [
  {
    question: "비트코인의 작업증명(PoW)에서 채굴자가 찾아야 하는 것은?",
    options: [
      "블록 헤더를 암호화하는 비밀 개인키 값",
      "블록에 포함할 최적의 트랜잭션 조합과 순서",
      "블록 헤더의 해시가 목표값(난이도) 이하가 되는 논스(Nonce)",
      "네트워크 노드 과반수로부터 받는 디지털 서명 승인",
    ],
    answer: 2,
    explanation:
      "채굴자는 블록 헤더의 논스(Nonce) 값을 계속 바꿔가며 SHA-256 해시를 반복 계산합니다. 그 해시 결과가 현재 난이도 목표값(앞에 0이 충분히 많은 값)보다 작아지는 논스를 찾으면 블록을 발견한 것입니다.",
  },
  {
    question: "비트코인 난이도는 얼마나 자주 조절되는가?",
    options: [
      "2016블록마다 (약 2주)",
      "매일 (144블록)",
      "매 블록마다 (약 10분)",
      "반감기마다 (210,000블록)",
    ],
    answer: 0,
    explanation:
      "비트코인은 2016블록(약 2주)마다 난이도를 자동 조절합니다. 직전 2016블록이 실제로 걸린 시간을 2주(20,160분)와 비교해 난이도를 늘리거나 줄입니다. 목표는 항상 평균 블록 생성 시간을 약 10분으로 유지하는 것입니다.",
  },
  {
    question: "비트코인 반감기(Halving)란?",
    options: [
      "비트코인 가격이 절반으로 떨어지는 사건",
      "네트워크 해시레이트가 절반으로 줄어드는 사건",
      "트랜잭션 수수료가 절반으로 줄어드는 사건",
      "210,000블록마다 채굴 보상이 절반으로 줄어드는 사건",
    ],
    answer: 3,
    explanation:
      "반감기(Halving)는 210,000블록(약 4년)마다 채굴자에게 지급되는 블록 보상이 절반으로 줄어드는 프로토콜 규칙입니다. 2009년 50 BTC로 시작해 2012년 25 BTC, 2016년 12.5 BTC, 2020년 6.25 BTC, 2024년 3.125 BTC로 줄었습니다.",
  },
  {
    question: "비트코인의 총 발행 한도는?",
    options: [
      "1,000만 BTC",
      "2,100만 BTC",
      "2,000만 BTC",
      "1,500만 BTC",
    ],
    answer: 1,
    explanation:
      "비트코인 프로토콜에 하드코딩된 총 발행 한도는 21,000,000 BTC(2,100만 BTC)입니다. 반감기를 거듭하면서 채굴 보상이 0에 수렴하며, 약 2140년경 마지막 비트코인이 채굴될 것으로 예상됩니다. 이후 채굴자는 트랜잭션 수수료로만 수입을 얻습니다.",
  },
  {
    question: "작업증명(PoW)에서 에너지 소비가 보안에 필수적인 이유는?",
    options: [
      "에너지 소비가 블록 생성 비용(Unforgeable Costliness)을 만들어 역사 변조를 경제적으로 불가능하게 하기 때문에",
      "에너지 소비량에 비례해 채굴자의 투표권이 늘어나기 때문에",
      "전력 소모량이 클수록 해시 결과가 더 강하게 암호화되기 때문에",
      "에너지 소비량에 따라 블록 보상이 추가로 지급되기 때문에",
    ],
    answer: 0,
    explanation:
      "PoW의 핵심은 'Unforgeable Costliness(위조 불가능한 비용)'입니다. 과거 블록을 변조하려면 그 블록부터 현재까지의 모든 작업증명을 다시 수행해야 합니다. 이 물리적 에너지 비용이 공격을 경제적으로 불합리하게 만듭니다. 에너지 소비 자체가 보안의 근거입니다.",
  },
  {
    question: "비트코인이 채굴자들이 소비하는 에너지의 상당 부분이 '좌초 에너지'라는 주장의 의미는?",
    options: [
      "채굴 장비가 전력망이 없는 오지 사막 지역에만 설치된다는 의미",
      "채굴에 태양광·풍력 등 인증된 재생에너지만 법적으로 허용된다는 의미",
      "채굴 해시 연산 과정에서 입력 에너지의 대부분이 열로 영구 손실된다는 의미",
      "수송이 불가능하거나 버려지는 잉여 에너지(수력, 풍력 잉여분 등)를 활용한다는 의미",
    ],
    answer: 3,
    explanation:
      "좌초 에너지(Stranded Energy)란 지리적 위치나 시간적 조건으로 인해 사용되지 못하고 버려지는 잉여 에너지입니다. 비트코인 채굴은 인터넷만 있으면 어디서든 가능하므로, 송전선이 닿지 않는 오지의 수력발전소나 전력망이 흡수 못 하는 풍력·태양광 잉여전력을 활용하는 경향이 있습니다.",
  },
  {
    question: "해시레이트(Hashrate)가 두 배가 되면 다음 난이도 조절 시 어떻게 변하는가?",
    options: [
      "난이도가 변하지 않는다",
      "난이도가 두 배로 늘어난다",
      "난이도가 절반으로 줄어든다",
      "블록 보상이 절반으로 줄어든다",
    ],
    answer: 1,
    explanation:
      "해시레이트가 두 배가 되면 블록이 목표보다 두 배 빨리(5분마다) 생성됩니다. 다음 2016블록 조절 시 실제 걸린 시간(약 1주)이 목표(2주)의 절반이므로, 난이도는 두 배로 상승합니다. 이를 통해 블록 타임이 다시 10분으로 회복됩니다.",
  },
  {
    question: "비트코인의 마지막 블록 보상이 사라진 이후(약 2140년) 채굴자의 수입은?",
    options: [
      "더 이상 채굴 수입이 없어 채굴자가 모두 사라진다",
      "새로운 프로토콜 업그레이드로 보상이 다시 시작된다",
      "트랜잭션 수수료만으로 수입을 얻는다",
      "비트코인 네트워크가 자동 종료된다",
    ],
    answer: 2,
    explanation:
      "약 2140년 이후 블록 보상이 0에 수렴하면, 채굴자는 오직 트랜잭션 수수료로만 수입을 얻습니다. 비트코인의 장기 보안 모델은 트랜잭션 수수료가 충분한 수익을 제공할 것이라고 가정합니다. 라이트닝 네트워크 등 레이어2의 성장도 온체인 수수료 수익의 지속 가능성에 중요합니다.",
  },
];

// ─── Main Component ────────────────────────────────────────────────────────
export default function Ch04ProofOfWork() {
  return (
    <div className="space-y-8">
      {/* Section 1: PoW의 의미 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">1. 작업증명(PoW)이란 무엇인가</h2>
        <p>
          비트코인이 해결해야 했던 근본 문제는 신뢰입니다. 중앙 기관 없이 누가 다음 거래 기록을 작성할 권리를
          가지는지 어떻게 결정할까요? 비트코인의 답은 에너지입니다. 실제로 에너지를 소비한 자(작업을 증명한 자)에게
          블록 생성 권한을 부여합니다.
        </p>
        <p>
          이 개념의 핵심은 <strong>Unforgeable Costliness(위조 불가능한 비용)</strong>입니다. 금을 채굴하려면
          실제 물리적 에너지와 자원이 필요합니다. 이 비용은 금의 가치를 만드는 것이 아니라, 금의 공급을
          쉽게 늘릴 수 없게 만들어 <strong>희소성을 보장</strong>합니다. 비트코인의 작업증명도
          같은 역할입니다. 비트코인 블록을 생성하려면 실제로 전기를 소비해야 하므로, 과거 기록을 변조하려면
          막대한 물리적 비용이 듭니다. PoW는 비트코인의 <strong>가치</strong>를 만드는 것이 아니라,
          원장의 <strong>불변성과 보안</strong>을 보장합니다.
        </p>
        <InfoBox type="definition" title="작업증명 (Proof of Work)">
          작업증명은 컴퓨터가 일정량의 계산 작업(에너지 소비)을 수행했음을 쉽게 검증할 수 있는 메커니즘입니다.
          SHA-256 해시를 계산하는 것은 비용이 들지만, 결과를 검증하는 것은 매우 빠릅니다. 채굴자는 많은 에너지를
          써서 해시를 찾고, 네트워크는 한 번의 해시 계산만으로 결과를 검증합니다.
        </InfoBox>
        <InfoBox type="warning" title="흔한 오해: 생산 비용 = 가치?">
          &ldquo;비트코인을 채굴하는 데 에너지가 들기 때문에 비트코인이 가치를 갖는다&rdquo;는 주장은
          <strong>노동가치론(Labor Theory of Value)</strong>이라는 오래된 경제학적 오류입니다.
          실제로 비트코인의 가치는 사용자들의 수요, 즉 검열 저항성, 자기주권, 고정된 공급 한도, 국경 없는
          이동성 등 비트코인의 <strong>고유한 화폐적 속성</strong>에서 나옵니다.
          채굴 비용은 가격을 따라갑니다 — 비트코인 가격이 오르면 채굴자들이 더 많은 에너지를 투자하는 것이지,
          에너지를 더 쓴다고 가격이 오르는 것이 아닙니다. PoW의 역할은 가치 창출이 아니라
          <strong>원장 보안</strong>입니다.
        </InfoBox>
        <p>
          PoW의 또 다른 의미는 <strong>1 CPU = 1 표</strong>입니다. 네트워크 지배력은 신원이 아닌 실제
          계산력(에너지 투자)에 비례합니다. 신원을 속여 투표를 조작하는 시빌 공격(Sybil Attack)을 에너지 비용으로
          방어합니다.
        </p>
      </section>

      {/* Section 2: 채굴 과정 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">2. 채굴 과정 — 논스 탐색</h2>
        <p>
          채굴은 본질적으로 복권 추첨입니다. 채굴자는 블록 헤더의 논스(Nonce) 값을 0부터 시작해
          4,294,967,295(32비트 최대값)까지 반복해 바꾸면서 SHA-256 해시를 계산합니다. 목표는 결과 해시가
          현재 난이도 목표값 이하가 되는 논스를 찾는 것입니다.
        </p>

        <div className="not-prose my-4">
          <KatexBlock
            math={"\\text{SHA256d}(\\text{Header} \\| \\text{Nonce}) < \\text{Target}"}
            display={true}
          />
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          ※ SHA256d = SHA-256을 두 번 적용, Target = 현재 난이도 목표값 (앞에 0이 많을수록 어려움)
        </p>

        <p>
          어떤 논스가 답인지 미리 알 수 없습니다. 유일한 방법은 무작위 대입(Brute Force)입니다. 이것이 채굴에
          에너지가 드는 이유입니다. 현재 비트코인 네트워크는 초당 수백 엑사해시(EH/s)를 계산합니다. 전 세계
          채굴자들이 동시에 이 복권을 구매하고, 약 10분마다 한 명이 당첨됩니다.
        </p>

        <MiningSimulator />

        <InfoBox type="warning" title="51% 공격의 현실적 비용">
          비트코인 네트워크의 해시레이트 절반 이상을 확보해 역사를 변조하려면 수천억 달러의 채굴 장비와
          막대한 전기료가 필요합니다. 설사 성공한다 해도, 공격 사실이 알려지면 비트코인 가격이 폭락해
          공격에 투자한 모든 장비의 가치가 사라집니다. 정직하게 채굴하는 것이 공격하는 것보다 훨씬 이익입니다.
          이것이 게임이론적으로 비트코인 보안이 유지되는 이유입니다.
        </InfoBox>
      </section>

      {/* Section 3: 해시레이트와 난이도 조절 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">3. 해시레이트와 난이도 자동 조절</h2>
        <p>
          비트코인 네트워크는 스스로 난이도를 조절합니다. 채굴자가 많아져 해시레이트가 높아지면 블록이
          10분보다 빨리 생성됩니다. 반대로 채굴자가 줄면 블록 생성이 느려집니다.
        </p>
        <p>
          이를 보정하기 위해 비트코인은 <strong>2016블록마다(약 2주)</strong> 난이도를 자동 조절합니다.
          직전 2016블록이 실제로 얼마나 걸렸는지 측정해 난이도를 비례적으로 조정합니다.
        </p>

        <div className="not-prose my-4">
          <KatexBlock
            math={"\\text{New Difficulty} = \\text{Old Difficulty} \\times \\frac{\\text{Target Time (2 weeks)}}{\\text{Actual Time}}"}
            display={true}
          />
        </div>

        <p>
          이 메커니즘은 놀라울 정도로 강건합니다. 2021년 중국 채굴 금지로 글로벌 해시레이트가 하루아침에
          50% 이상 급감했지만, 두 번의 난이도 조절 이후 비트코인 네트워크는 완전히 정상화됐습니다. 어떤
          외부 충격이 와도 네트워크는 스스로 적응합니다.
        </p>
      </section>

      {/* Section 4: 반감기 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">4. 반감기(Halving) — 예측 가능한 통화 정책</h2>
        <p>
          비트코인의 채굴 보상은 고정되어 있지 않습니다. <strong>210,000블록마다(약 4년)</strong> 보상이
          정확히 절반으로 줄어듭니다. 이것이 반감기(Halving)입니다.
        </p>

        <div className="not-prose my-4 overflow-x-auto">
          <table className="w-full text-sm text-center border-collapse">
            <thead>
              <tr className="bg-orange-50 dark:bg-orange-950/30">
                <th className="px-4 py-2 border border-orange-200 dark:border-orange-800">반감기</th>
                <th className="px-4 py-2 border border-orange-200 dark:border-orange-800">연도</th>
                <th className="px-4 py-2 border border-orange-200 dark:border-orange-800">블록 보상</th>
                <th className="px-4 py-2 border border-orange-200 dark:border-orange-800">누적 발행량</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { n: "창세기", year: "2009", reward: "50 BTC", cum: "0 ~ 10,500,000" },
                { n: "1차", year: "2012", reward: "25 BTC", cum: "10,500,000 ~ 15,750,000" },
                { n: "2차", year: "2016", reward: "12.5 BTC", cum: "15,750,000 ~ 18,375,000" },
                { n: "3차", year: "2020", reward: "6.25 BTC", cum: "18,375,000 ~ 19,687,500" },
                { n: "4차", year: "2024", reward: "3.125 BTC", cum: "19,687,500 ~ 20,343,750" },
                { n: "…", year: "…", reward: "→ 0", cum: "→ 21,000,000" },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "" : "bg-zinc-50 dark:bg-zinc-900/30"}>
                  <td className="px-4 py-2 border border-orange-100 dark:border-orange-900 font-medium">{row.n}</td>
                  <td className="px-4 py-2 border border-orange-100 dark:border-orange-900">{row.year}</td>
                  <td className="px-4 py-2 border border-orange-100 dark:border-orange-900 font-mono font-bold text-orange-600 dark:text-orange-400">{row.reward}</td>
                  <td className="px-4 py-2 border border-orange-100 dark:border-orange-900 font-mono text-xs text-muted-foreground">{row.cum}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <HalvingChart />

        <p>
          반감기는 비트코인의 통화 정책이 완전히 예측 가능하고 변경 불가능함을 보여줍니다. 어떤 중앙은행도,
          어떤 정부도, 심지어 사토시 나카모토도 이 스케줄을 바꿀 수 없습니다.
          이 반감기 구조로 인해 총 발행량은 수학적으로 정확히 2,100만 BTC에 수렴합니다.
          공급 공식의 수학적 유도와 Stock-to-Flow 분석, 그리고 이것이 만들어내는
          디지털 희소성의 의미는 5장(희소성)에서 깊이 있게 다룹니다.
        </p>
      </section>

      {/* Section 5: 에너지 소비 논쟁 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">5. 에너지 소비 논쟁 — 비트코이너의 관점</h2>
        <p>
          비트코인 채굴이 전기를 낭비한다는 비판이 있습니다. 하지만 이는 PoW의 역할을 이해하지 못한 비판입니다.
          비트코인의 에너지 소비는 낭비가 아니라 <strong>보안 메커니즘</strong>입니다. 물리적 에너지 소비가
          있기 때문에 어떤 국가나 기업도 비트코인 원장을 마음대로 변조할 수 없습니다.
        </p>

        <div className="not-prose my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-red-200 dark:border-red-800 p-4">
            <div className="font-bold text-red-700 dark:text-red-300 mb-2">일반적 비판</div>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>• "비트코인은 너무 많은 전기를 소비한다"</li>
              <li>• "환경에 해롭다"</li>
              <li>• "더 효율적인 방법이 있다"</li>
              <li>• "실용적 가치가 없는 에너지 낭비다"</li>
            </ul>
          </div>
          <div className="rounded-xl border border-green-200 dark:border-green-800 p-4">
            <div className="font-bold text-green-700 dark:text-green-300 mb-2">비트코이너의 답변</div>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>• 에너지 소비 = 보안의 물리적 근거 (기능, 버그 아님)</li>
              <li>• 좌초 에너지·잉여 재생에너지 활용 → 재생에너지 투자 촉진</li>
              <li>• 채굴 비용은 가격을 따라감 (가치→비용, 비용→가치 아님)</li>
              <li>• 금 채굴·기존 금융 시스템도 막대한 에너지 소비</li>
            </ul>
          </div>
        </div>

        <InfoBox type="info" title="에너지 사용의 본질">
          에너지를 &ldquo;낭비&rdquo;인지 판단하는 것은 가치 판단의 문제입니다. 세계 은행 시스템 유지(수백만 개
          지점, 서버, ATM, 직원), 금 채굴 및 정제, 크리스마스 조명, 게임용 그래픽카드도 모두 에너지를
          사용합니다. 비트코인이 제공하는 가치(검열 저항, 자기주권, 건전화폐)가 그 에너지 비용을 정당화하는지는
          개인이 판단해야 합니다.
        </InfoBox>

        <p>
          비트코인은 에너지의 <strong>최종 구매자(Buyer of Last Resort)</strong>입니다. 전력망이 닿지 않아
          버려지던 오지의 수력발전 잉여 전력, 해가 쨍쨍한 낮에 전력망이 흡수 못 하는 태양광 잉여분,
          바람이 강한 날의 풍력 잉여분 — 이런 좌초 에너지를 비트코인 채굴이 즉시 현금화합니다.
        </p>
        <p>
          이것은 재생에너지 산업에 중대한 의미를 갖습니다. 재생에너지의 가장 큰 문제는 간헐성(해가 지면 태양광
          발전이 멈추고, 바람이 안 불면 풍력이 멈춤)과 송전 인프라 부족입니다. 비트코인 채굴은 이 잉여 전력에
          <strong>항시 수요</strong>를 제공함으로써 재생에너지 프로젝트의 수익성을 근본적으로 개선합니다.
          채굴 수익이 보장되면 오지에 풍력·태양광 발전소를 건설하는 것이 경제적으로 가능해지고,
          이는 결과적으로 전체 재생에너지 인프라의 확충을 촉진합니다. 비트코인 채굴은 에너지를 소비하는 동시에
          더 많은 재생에너지 생산을 유도하는 <strong>순환적 인센티브 구조</strong>를 만듭니다.
        </p>

        <InfoBox type="tip" title="PoS와 비교: '더 효율적인 방법'의 트레이드오프">
          지분증명(PoS, Proof of Stake)은 에너지를 적게 쓴다는 장점이 있습니다. 하지만 비트코이너들은
          PoS의 근본적 한계를 지적합니다. PoS에서는 지분을 많이 가진 자(초기 투자자, 재단)가 네트워크 권력을
          가지며, 새로운 참여자가 이를 뒤집으려면 기존 보유자로부터 토큰을 구매해야 합니다 — 결국 기존 권력 구조가
          영속됩니다. 반면 PoW에서는 누구든 채굴기를 돌리면 네트워크에 참여할 수 있고, 보안은 디지털 장부 안의
          숫자가 아닌 <strong>현실 세계의 물리적 에너지</strong>에 기반합니다. 비트코인의 에너지 소비는 버그가
          아니라 합의를 물리 법칙에 고정(anchoring)시키는 핵심 설계입니다.
        </InfoBox>
      </section>

      {/* Quiz */}
      <QuizSection questions={quizQuestions} />
    </div>
  );
}
