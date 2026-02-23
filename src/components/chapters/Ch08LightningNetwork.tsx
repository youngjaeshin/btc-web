"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { InfoBox } from "@/components/content/InfoBox";
import { KatexBlock } from "@/components/content/KatexBlock";
import { QuizSection } from "@/components/quiz/QuizSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  ArrowRight,
  RefreshCw,
  Lock,
  Unlock,
  CheckCircle,
  ArrowLeftRight,
} from "lucide-react";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

// ─── 1. Payment Channel Simulator ─────────────────────────────────────────────

const CHANNEL_CAPACITY = 1_000_000; // sats

function ChannelSimulator() {
  const [aliceBalance, setAliceBalance] = useState(600_000);
  const [payAmount, setPayAmount] = useState(50_000);
  const [direction, setDirection] = useState<"alice-to-bob" | "bob-to-alice">("alice-to-bob");
  const [txHistory, setTxHistory] = useState<
    { from: string; to: string; amount: number; aliceAfter: number }[]
  >([]);

  const bobBalance = CHANNEL_CAPACITY - aliceBalance;
  const sliderMax = Math.min(300_000, direction === "alice-to-bob" ? aliceBalance : bobBalance);

  const sendPayment = () => {
    const from = direction === "alice-to-bob" ? "Alice" : "Bob";
    const to = direction === "alice-to-bob" ? "Bob" : "Alice";
    const senderBalance = direction === "alice-to-bob" ? aliceBalance : bobBalance;

    if (payAmount > senderBalance) {
      return;
    }

    const newAlice =
      direction === "alice-to-bob"
        ? aliceBalance - payAmount
        : aliceBalance + payAmount;

    setAliceBalance(newAlice);
    setTxHistory((prev) => [
      { from, to, amount: payAmount, aliceAfter: newAlice },
      ...prev.slice(0, 7),
    ]);
  };

  const resetChannel = () => {
    setAliceBalance(600_000);
    setTxHistory([]);
  };

  const alicePct = (aliceBalance / CHANNEL_CAPACITY) * 100;
  const bobPct = (bobBalance / CHANNEL_CAPACITY) * 100;
  const senderBalance = direction === "alice-to-bob" ? aliceBalance : bobBalance;
  const canSend = payAmount <= senderBalance;

  return (
    <div className="not-prose my-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <ArrowLeftRight className="h-5 w-5 text-yellow-500" />
        <h3 className="font-bold text-lg">결제 채널 시뮬레이터</h3>
      </div>

      <div className="text-sm text-muted-foreground">
        채널 용량: {(CHANNEL_CAPACITY / 1000).toFixed(0)}K sat — 온체인 트랜잭션 없이 잔액을 즉시 이동합니다.
      </div>

      {/* Channel balance bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-blue-500">Alice: {(aliceBalance / 1000).toFixed(0)}K sat</span>
          <span className="text-orange-500">Bob: {(bobBalance / 1000).toFixed(0)}K sat</span>
        </div>
        <div className="flex h-8 rounded-full overflow-hidden border">
          <div
            className="bg-blue-400 transition-all duration-500 flex items-center justify-center text-white text-xs font-bold"
            style={{ width: `${alicePct}%` }}
          >
            {alicePct.toFixed(0)}%
          </div>
          <div
            className="bg-orange-400 transition-all duration-500 flex items-center justify-center text-white text-xs font-bold"
            style={{ width: `${bobPct}%` }}
          >
            {bobPct.toFixed(0)}%
          </div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>← Alice 측 용량</span>
          <span>Bob 측 용량 →</span>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={direction === "alice-to-bob" ? "default" : "outline"}
            onClick={() => {
              setDirection("alice-to-bob");
              setPayAmount((prev) => Math.min(prev, Math.min(300_000, aliceBalance)));
            }}
            className="flex-1 gap-1 text-xs"
          >
            Alice → Bob
          </Button>
          <Button
            size="sm"
            variant={direction === "bob-to-alice" ? "default" : "outline"}
            onClick={() => {
              setDirection("bob-to-alice");
              setPayAmount((prev) => Math.min(prev, Math.min(300_000, bobBalance)));
            }}
            className="flex-1 gap-1 text-xs"
          >
            Bob → Alice
          </Button>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">
            결제 금액: {(payAmount / 1000).toFixed(0)}K sat
          </label>
          <Slider
            min={1000}
            max={sliderMax}
            step={1000}
            value={[Math.min(payAmount, sliderMax)]}
            onValueChange={([v]) => setPayAmount(v)}
          />
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={sendPayment}
            disabled={!canSend}
            className="gap-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
          >
            <Zap className="h-4 w-4" />
            즉시 결제
          </Button>
          <Button size="sm" variant="ghost" onClick={resetChannel} className="gap-1">
            <RefreshCw className="h-4 w-4" />
            초기화
          </Button>
        </div>
        {!canSend && (
          <p className="text-xs text-red-500">
            잔액 부족 — {direction === "alice-to-bob" ? "Alice" : "Bob"}의 잔액({(senderBalance / 1000).toFixed(0)}K sat)이 결제 금액보다 적습니다.
          </p>
        )}
      </div>

      {/* History */}
      {txHistory.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">결제 내역 (오프체인)</p>
          <div className="bg-slate-950 text-green-400 rounded-md p-3 text-xs font-mono space-y-0.5 max-h-32 overflow-y-auto">
            {txHistory.map((t, i) => (
              <div key={i}>
                ⚡ {t.from} → {t.to}: {(t.amount / 1000).toFixed(0)}K sat
                (Alice 잔액: {(t.aliceAfter / 1000).toFixed(0)}K)
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            온체인 트랜잭션: 채널 개설 1회 + 채널 종료 1회 — 중간 결제는 모두 오프체인
          </p>
        </div>
      )}
    </div>
  );
}

// ─── 2. HTLC Routing Visualizer ────────────────────────────────────────────────

type HtlcStep =
  | "idle"
  | "hash-reveal"
  | "alice-lock"
  | "bob-lock"
  | "carol-claim"
  | "bob-claim"
  | "settlement"
  | "complete";

const HTLC_STEPS: { step: HtlcStep; title: string; desc: string }[] = [
  {
    step: "idle",
    title: "초기 상태",
    desc: "Alice는 Carol에게 50,000 sat을 보내고 싶습니다. 직접 채널이 없으므로 Bob을 통해 라우팅합니다.",
  },
  {
    step: "hash-reveal",
    title: "프리이미지 & 해시 생성",
    desc: "Carol이 비밀값 R(프리이미지)을 생성하고, H = SHA256(R)을 계산합니다. H를 Alice에게 공유합니다.",
  },
  {
    step: "alice-lock",
    title: "Alice → Bob: HTLC 설정",
    desc: "Alice는 Bob에게 '해시 H의 프리이미지를 공개하면 50,000 sat + 수수료(100 sat)를 받을 수 있다. 단, T+48시간 내에.' 조건을 설정합니다.",
  },
  {
    step: "bob-lock",
    title: "Bob → Carol: HTLC 설정",
    desc: "Bob은 Carol에게 '해시 H의 프리이미지를 공개하면 50,000 sat을 받을 수 있다. 단, T+24시간 내에.' 조건을 설정합니다.",
  },
  {
    step: "carol-claim",
    title: "Carol: 프리이미지 공개",
    desc: "Carol이 비밀값 R을 공개하여 50,000 sat을 청구합니다. 이제 Bob도 R을 알게 됩니다.",
  },
  {
    step: "bob-claim",
    title: "Bob: 프리이미지로 청구",
    desc: "Bob은 R을 사용하여 Alice로부터 50,100 sat(수수료 포함)을 청구합니다.",
  },
  {
    step: "settlement",
    title: "결제 완료",
    desc: "Alice는 50,100 sat을 지불했고(수수료 100 sat 포함), Carol은 50,000 sat을 받았습니다. Bob은 100 sat 수수료를 획득했습니다.",
  },
  {
    step: "complete",
    title: "원자적 교환 완료",
    desc: "모든 과정이 성공 또는 전부 실패(타임아웃 시 환불)로 원자적으로 처리되었습니다. 중간자인 Bob조차 자금을 훔칠 수 없습니다.",
  },
];

function HtlcVisualizer() {
  const [stepIdx, setStepIdx] = useState(0);
  const current = HTLC_STEPS[stepIdx];

  const bobFee = stepIdx >= 6 ? 100 : 0;

  const nodeStatus = (node: "alice" | "bob" | "carol") => {
    if (node === "carol") {
      if (stepIdx >= 4) return "success";
      if (stepIdx >= 3) return "locked";
      return "idle";
    }
    if (node === "bob") {
      if (stepIdx >= 5) return "success";
      if (stepIdx >= 2) return "locked";
      return "idle";
    }
    // alice
    if (stepIdx >= 6) return "success";
    if (stepIdx >= 2) return "locked";
    return "idle";
  };

  const statusColor = (s: string) =>
    s === "success" ? "bg-green-100 border-green-400 dark:bg-green-950/40" :
    s === "locked" ? "bg-yellow-100 border-yellow-400 dark:bg-yellow-950/40" :
    "bg-slate-100 border-slate-300 dark:bg-slate-800";

  const statusIcon = (s: string) =>
    s === "success" ? <CheckCircle className="h-4 w-4 text-green-500" /> :
    s === "locked" ? <Lock className="h-4 w-4 text-yellow-500" /> :
    <Unlock className="h-4 w-4 text-slate-400" />;

  return (
    <div className="not-prose my-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Lock className="h-5 w-5 text-purple-500" />
        <h3 className="font-bold text-lg">HTLC 라우팅 시각화</h3>
      </div>

      {/* Node row */}
      <div className="flex items-center gap-2">
        {(["alice", "bob", "carol"] as const).map((node, i) => (
          <div key={node} className="flex items-center gap-2 flex-1">
            <div className={`flex-1 rounded-lg border-2 p-3 text-center ${statusColor(nodeStatus(node))}`}>
              <div className="flex items-center justify-center gap-1 mb-1">
                {statusIcon(nodeStatus(node))}
                <span className="font-bold text-sm capitalize">{node}</span>
              </div>
              {node === "alice" && stepIdx >= 6 && (
                <div className="text-xs text-red-600 font-mono">−50,100 sat</div>
              )}
              {node === "bob" && stepIdx >= 6 && (
                <div className="text-xs text-green-600 font-mono">+{bobFee} sat</div>
              )}
              {node === "carol" && stepIdx >= 4 && (
                <div className="text-xs text-green-600 font-mono">+50,000 sat</div>
              )}
            </div>
            {i < 2 && <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
          </div>
        ))}
      </div>

      {/* Step info */}
      <Card className="p-4 space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">단계 {stepIdx + 1}/{HTLC_STEPS.length}</Badge>
          <span className="font-semibold text-sm">{current.title}</span>
        </div>
        <p className="text-sm text-muted-foreground">{current.desc}</p>
        {stepIdx === 1 && (
          <div className="font-mono text-xs bg-slate-100 dark:bg-slate-800 rounded p-2 mt-2 space-y-1">
            <div>R = <span className="text-purple-500">a3f8...2c1d</span> (비밀 프리이미지)</div>
            <div>H = SHA256(R) = <span className="text-blue-500">7e4b...9f3a</span></div>
          </div>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
          disabled={stepIdx === 0}
        >
          이전
        </Button>
        <div className="flex gap-1 flex-1 justify-center">
          {HTLC_STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStepIdx(i)}
              className={`h-2 rounded-full transition-all ${
                i === stepIdx ? "w-6 bg-yellow-500" : "w-2 bg-slate-300 dark:bg-slate-600"
              }`}
            />
          ))}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setStepIdx((i) => Math.min(HTLC_STEPS.length - 1, i + 1))}
          disabled={stepIdx === HTLC_STEPS.length - 1}
        >
          다음
        </Button>
      </div>

      {stepIdx === 0 && (
        <Button size="sm" className="w-full gap-1 bg-purple-500 hover:bg-purple-600 text-white" onClick={() => setStepIdx(1)}>
          <ArrowRight className="h-4 w-4" />
          시뮬레이션 시작
        </Button>
      )}
    </div>
  );
}

// ─── 3. On-chain vs LN Fee Comparison ────────────────────────────────────────

function FeeComparison() {
  const [amountKrw, setAmountKrw] = useState(10_000);

  const BTC_KRW = 130_000_000;
  const amountBtc = amountKrw / BTC_KRW;
  const amountSat = Math.round(amountBtc * 1e8);

  // On-chain: fixed ~140 vB * 30 sat/vB = 4200 sat (~5500 KRW)
  const onchainFeeSat = 4200;
  const onchainFeeKrw = Math.round((onchainFeeSat / 1e8) * BTC_KRW);
  const onchainFeePct = ((onchainFeeKrw / amountKrw) * 100).toFixed(2);

  // Lightning: ~1 sat base + 0.0001% (1 ppm)
  const lnFeeSat = Math.max(1, Math.ceil(amountSat * 0.000001 + 1));
  const lnFeeKrw = Math.round((lnFeeSat / 1e8) * BTC_KRW);
  const lnFeePct = ((lnFeeKrw / amountKrw) * 100).toFixed(4);

  const amounts = [100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 10000000];

  const onchainPcts = amounts.map((a) => {
    const feePct = (onchainFeeKrw / a) * 100;
    return Math.min(feePct, 200);
  });

  const lnPcts = amounts.map((a) => {
    const sat = Math.round((a / BTC_KRW) * 1e8);
    const fee = Math.max(1, Math.ceil(sat * 0.000001 + 1));
    const feeKrw = (fee / 1e8) * BTC_KRW;
    return (feeKrw / a) * 100;
  });

  return (
    <div className="not-prose my-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <ArrowLeftRight className="h-5 w-5 text-emerald-500" />
        <h3 className="font-bold text-lg">온체인 vs 라이트닝 수수료 비교</h3>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">
          결제 금액: ₩{amountKrw.toLocaleString()}
        </label>
        <Slider
          min={100}
          max={10_000_000}
          step={100}
          value={[amountKrw]}
          onValueChange={([v]) => setAmountKrw(v)}
        />
        <div className="text-xs text-muted-foreground mt-1">
          ≈ {amountSat.toLocaleString()} sat ({amountBtc.toFixed(8)} BTC)
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 border-slate-200 dark:border-slate-700">
          <div className="text-xs font-semibold text-muted-foreground mb-2">온체인 (약 30 sat/vB)</div>
          <div className="text-2xl font-bold">₩{onchainFeeKrw.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">{onchainFeeSat.toLocaleString()} sat</div>
          <div className={`text-lg font-bold mt-1 ${Number(onchainFeePct) > 10 ? "text-red-500" : "text-orange-500"}`}>
            {onchainFeePct}%
          </div>
          <div className="text-xs text-muted-foreground">결제액 대비 수수료</div>
        </Card>
        <Card className="p-4 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20">
          <div className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 mb-2">라이트닝 (~1 ppm)</div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">₩{Math.max(1, lnFeeKrw).toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">{lnFeeSat.toLocaleString()} sat</div>
          <div className="text-lg font-bold mt-1 text-green-500">{lnFeePct}%</div>
          <div className="text-xs text-muted-foreground">결제액 대비 수수료</div>
        </Card>
      </div>

      <Plot
        data={[
          {
            type: "scatter",
            mode: "lines+markers",
            x: amounts.map((a) => a),
            y: onchainPcts,
            name: "온체인",
            line: { color: "#f97316", width: 2 },
            marker: { size: 5 },
            hovertemplate: "₩%{x:,.0f}<br>수수료율: %{y:.2f}%<extra>온체인</extra>",
          },
          {
            type: "scatter",
            mode: "lines+markers",
            x: amounts.map((a) => a),
            y: lnPcts,
            name: "라이트닝",
            line: { color: "#eab308", width: 2 },
            marker: { size: 5 },
            hovertemplate: "₩%{x:,.0f}<br>수수료율: %{y:.4f}%<extra>라이트닝</extra>",
          },
        ]}
        layout={{
          height: 260,
          margin: { t: 30, b: 50, l: 65, r: 20 },
          title: { text: "결제 금액별 수수료율 (%)" },
          xaxis: {
            title: { text: "결제 금액 (KRW)" },
            type: "log",
            tickformat: ",.0f",
          },
          yaxis: { title: { text: "수수료율 (%)" }, type: "log" },
          legend: { x: 0.7, y: 0.9 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          font: { size: 11, color: "#666" },
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: "100%" }}
      />

      <div className="text-xs text-muted-foreground">
        온체인 수수료는 결제 금액에 무관하게 거의 고정(~₩5,500). 소액일수록 라이트닝의 절감 효과가 극대화됩니다.
      </div>
    </div>
  );
}

// ─── Quiz ──────────────────────────────────────────────────────────────────────

const quizQuestions = [
  {
    question: "라이트닝 네트워크가 필요한 이유는 무엇인가?",
    options: [
      "비트코인 온체인은 처리량이 ~7 TPS로 제한되어 있어 소액·즉시 결제에 비효율적이기 때문에",
      "비트코인 블록체인의 작업증명 보안이 불충분하여 이중지불 공격이 빈번하게 발생하기 때문에",
      "라이트닝 네트워크가 별도의 사이드체인 토큰을 발행하여 비트코인 공급량을 보완하기 때문에",
      "채굴자들이 온체인 수수료 외에 라우팅 수수료를 추가로 확보하도록 설계되었기 때문에",
    ],
    answer: 0,
    explanation:
      "비트코인 기본 레이어(L1)는 10분 블록 간격, 제한된 블록 크기로 인해 약 7 TPS에 불과합니다. 커피 한 잔 결제에 온체인 수수료를 내는 것은 비효율적입니다. 라이트닝은 블록체인 보안을 활용하면서 즉각적이고 저렴한 결제를 가능하게 합니다.",
  },
  {
    question: "결제 채널을 개설할 때 온체인 트랜잭션이 필요한 이유는?",
    options: [
      "라이트닝 노드 디렉터리 서버에 채널 개설 사실을 등록하고 수수료를 지불하기 위해",
      "채널 라우팅 수수료율을 네트워크 전체에 공표하고 gossip 프로토콜에 반영하기 위해",
      "채널 참여자의 공개키와 노드 ID를 블록체인 OP_RETURN 출력에 영구 기록하기 위해",
      "2-of-2 다중서명 주소에 자금을 잠그는 펀딩 트랜잭션이 필요하기 때문에",
    ],
    answer: 3,
    explanation:
      "결제 채널 개설 시 두 참여자가 공동 서명해야만 출금 가능한 2-of-2 다중서명 주소에 자금을 잠그는 '펀딩 트랜잭션'이 블록체인에 기록됩니다. 이후 채널 내 결제는 오프체인으로 이루어지며, 채널 종료 시에만 다시 온체인 트랜잭션이 필요합니다.",
  },
  {
    question: "HTLC(Hash Time-Locked Contract)에서 '해시 잠금'의 역할은?",
    options: [
      "각 커밋먼트 트랜잭션에 블록 높이 타임스탬프를 포함시켜 채널 내 이중 지불을 방지한다",
      "채굴자가 논스를 반복 대입하여 목표 해시값 이하의 블록 헤더를 찾는 작업증명에 사용한다",
      "비밀값(프리이미지) R의 해시 H를 아는 사람만 자금을 청구할 수 있도록 조건을 설정한다",
      "라이트닝 노드 간 Noise 프로토콜 핸드셰이크에서 세션 키를 교환하고 통신을 암호화한다",
    ],
    answer: 2,
    explanation:
      "HTLC는 'H = SHA256(R)을 만족하는 R을 공개하면 자금 청구 가능'이라는 해시 잠금 조건을 사용합니다. 최종 수신자(Carol)만 R을 알고 있으므로, Carol이 R을 공개하면 전체 경로의 결제가 연쇄적으로 완료됩니다.",
  },
  {
    question: "라이트닝 네트워크에서 '시간 잠금(Time Lock)'이 필요한 이유는?",
    options: [
      "중간 노드가 자금을 가로채거나 실패한 결제를 방치할 경우 환불 경로를 보장하기 위해",
      "결제 확인 절차를 의도적으로 지연시켜 사기 시도를 탐지하고 차단하기 위해",
      "2016 블록 주기마다 난이도 조정이 이루어지는 동안 채굴 보상 지급을 일시 동결하기 위해",
      "채널 양측의 잔액 불균형이 일정 임계값을 초과할 때 자동으로 유동성을 재분배하기 위해",
    ],
    answer: 0,
    explanation:
      "시간 잠금(CLTV/CSV)은 결제가 실패하거나 중간 노드가 응답하지 않을 때 일정 시간 후 자동으로 자금이 환불되도록 보장합니다. 라우팅 경로의 각 홉은 앞 단계보다 짧은 타임아웃을 설정하여 중간자가 자금을 인질로 삼는 것을 방지합니다.",
  },
  {
    question: "라이트닝 네트워크의 양파 라우팅(Onion Routing)이 제공하는 이점은?",
    options: [
      "경로 탐색 알고리즘을 병렬화하여 멀티홉 결제의 확인 속도를 비약적으로 향상시킨다",
      "중간 라우팅 노드가 전체 경로와 결제 금액을 알 수 없어 프라이버시가 보호된다",
      "각 채널의 잔액 정보를 네트워크 전체에 공유하여 유동성을 자동으로 균등 분배한다",
      "홉마다 수수료 경쟁 입찰을 실행하여 발신자에게 가장 저렴한 경로를 자동으로 선택한다",
    ],
    answer: 1,
    explanation:
      "Tor 네트워크에서 영감 받은 양파 라우팅(Sphinx)은 각 중간 노드가 자신의 이전/다음 홉만 알 수 있도록 경로를 암호화합니다. 결제 발신자, 수신자, 금액은 중간 노드에 노출되지 않습니다.",
  },
  {
    question: "라이트닝 채널을 종료하는 방법 중 '협력 종료(Cooperative Close)'의 특징은?",
    options: [
      "한쪽이 상대방 동의 없이 최신 커밋먼트 트랜잭션을 일방적으로 브로드캐스트하고 타임아웃을 기다린다",
      "분쟁 발생 시 라이트닝 네트워크 감시 노드(Watchtower)가 자동으로 중재하고 패널티를 집행한다",
      "채굴자가 미확인 커밋먼트 트랜잭션을 감지하여 양측 자금을 동결하고 채널을 강제 정산한다",
      "두 참여자가 합의하여 최신 잔액을 반영한 종료 트랜잭션에 함께 서명하고 즉시 자금을 받는다",
    ],
    answer: 3,
    explanation:
      "협력 종료는 양측이 동의할 때 가장 효율적인 방법입니다. 두 참여자가 최신 잔액을 반영한 트랜잭션에 함께 서명하므로 불필요한 대기 시간 없이 자금을 즉시 수령할 수 있습니다. 강제 종료(Force Close)는 분쟁 시 타임아웃 대기가 필요합니다.",
  },
  {
    question: "라이트닝 네트워크로 '스트리밍 사토시(Streaming Sats)'가 가능한 이유는?",
    options: [
      "비트코인 L1 프로토콜이 OP_STREAM 스크립트로 초당 자동 분할 결제를 기본 지원하기 때문에",
      "라이트닝 노드가 잔액을 밀리사토시(msat) 단위로 자동 분할하여 균등 스트림으로 변환하기 때문에",
      "채널 내 결제는 온체인 수수료나 블록 확인이 필요 없어 초당 수백~수천 sat 단위 결제가 가능하기 때문에",
      "라이트닝 네트워크가 스트리밍 전용 사이드체인 토큰을 발행하여 실시간 결산을 처리하기 때문에",
    ],
    answer: 2,
    explanation:
      "오프체인 채널 내 결제는 블록 확인 없이 즉시 완료되며 수수료가 극히 낮습니다. 이를 이용해 팟캐스트 청취 시간당 sat 지불(Podcasting 2.0), API 호출당 microsats 청구, 실시간 급여 스트리밍 등 새로운 결제 모델이 가능해집니다.",
  },
  {
    question: "라이트닝 채널에서 '채널 유동성(Liquidity)' 문제란?",
    options: [
      "송금 방향으로 충분한 잔액이 없어 원하는 경로로 결제를 라우팅하지 못하는 문제",
      "채널 개설 시 피어 노드와의 TCP 연결이 불안정하여 펀딩 트랜잭션 전파가 실패하는 문제",
      "네트워크에 라우팅 노드가 지나치게 많아 Dijkstra 경로 탐색이 수 초씩 지연되는 문제",
      "채굴자가 mempool 혼잡을 이유로 채널 종료 트랜잭션 확인을 의도적으로 지연하는 문제",
    ],
    answer: 0,
    explanation:
      "채널 유동성은 라이트닝의 핵심 과제입니다. Alice→Bob→Carol로 결제하려면 Alice→Bob 방향 Bob 측 용량, Bob→Carol 방향 Bob 측 용량이 모두 충분해야 합니다. 유동성 부족 시 Circular Rebalancing, Loop Out, 채널 재개설 등으로 해결합니다.",
  },
];

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function Ch08LightningNetwork() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      {/* Section 1: Why Layer 2 */}
      <h2>1. 왜 레이어2가 필요한가: 블록 공간의 귀중함</h2>

      <p>
        4장과 7장에서 살펴본 것처럼, 비트코인은 약 10분 블록 간격과 제한된 블록 크기로
        탈중앙화와 보안을 유지합니다. 그러나 이 설계는 초당 약 7건(TPS)이라는 처리량 한계를 만듭니다.
        전 세계 80억 명이 매일 비트코인으로 거래하려면 온체인만으로는 부족합니다.
      </p>

      <InfoBox type="warning" title="블록 공간은 희소 자원">
        Visa는 ~24,000 TPS를 처리합니다. 7장에서 본 것처럼 블록 공간의 희소성은
        탈중앙화를 위한 의도된 설계입니다. 해결책은 블록체인을 &quot;결산 레이어&quot;로
        사용하고, 일상 결제는 레이어2에서 처리하는 것입니다.
      </InfoBox>

      <p>
        비트코인 Bitcoiner들은 블록 공간의 희소성을 약점이 아닌 강점으로 봅니다.
        온체인에서 처리되는 것은 &quot;반드시 블록체인에 있어야 하는&quot; 가치 이전이어야 합니다.
        소액 커피 결제는 라이트닝이 처리하고, 온체인은 채널 개폐 등 최종 결산에 사용합니다.
      </p>

      {/* Section 2: Payment Channels */}
      <h2>2. 결제 채널: 오프체인 결제의 기반</h2>

      <p>
        라이트닝의 핵심 아이디어는 <strong>결제 채널(Payment Channel)</strong>입니다.
        Alice와 Bob이 채널을 개설하면, 이후 두 사람 간의 결제는 블록체인에 기록되지 않고
        즉시 완료됩니다.
      </p>

      <p>채널 생애주기:</p>
      <ol>
        <li>
          <strong>펀딩 (온체인):</strong> Alice와 Bob이 각자 자금을 2-of-2 다중서명 주소에 잠급니다.
          이 트랜잭션만 블록체인에 기록됩니다.
        </li>
        <li>
          <strong>결제 (오프체인):</strong> 채널 내에서 잔액을 재조정하는 &quot;커밋먼트 트랜잭션&quot;을
          서로 교환합니다. 블록체인 불필요, 즉시 완료.
        </li>
        <li>
          <strong>종료 (온체인):</strong> 최종 잔액을 반영한 종료 트랜잭션을 브로드캐스트합니다.
          협력 종료 또는 강제 종료(일방 브로드캐스트) 가능.
        </li>
      </ol>

      <InfoBox type="definition" title="커밋먼트 트랜잭션(Commitment Transaction)">
        채널 내 각 결제 후 양측이 서명하는 최신 잔액 분배 트랜잭션. 아직 브로드캐스트되지 않았지만,
        어느 쪽이든 원하면 언제든 온체인에 제출할 수 있습니다. 이것이 상대방이 자금을 가로챌 수 없는
        이유입니다 — 최신 커밋먼트 트랜잭션이 항상 존재하기 때문입니다.
      </InfoBox>

      <ChannelSimulator />

      {/* Section 3: HTLC */}
      <h2>3. HTLC: 직접 채널 없이도 결제하기</h2>

      <p>
        Alice와 Carol 사이에 직접 채널이 없어도 됩니다. Alice→Bob→Carol 경로로
        <strong> 원자적(atomic)</strong>으로 결제할 수 있습니다. 이를 가능하게 하는 것이
        <strong> HTLC(Hash Time-Locked Contract)</strong>입니다.
      </p>

      <p>HTLC의 두 가지 조건:</p>
      <ul>
        <li>
          <strong>해시 잠금:</strong> 비밀값 R의 해시 H를 조건으로 설정.
          H = SHA256(R)을 만족하는 R을 공개하는 사람만 자금 청구 가능.
        </li>
        <li>
          <strong>시간 잠금:</strong> T 시간이 지나도 R이 공개되지 않으면 자동 환불.
          중간 노드가 자금을 인질로 삼는 것을 방지.
        </li>
      </ul>

      <InfoBox type="tip" title="원자성(Atomicity) 보장">
        HTLC 덕분에 결제는 전체 성공 또는 전체 실패합니다. 중간 노드(Bob)는 Carol이 R을
        공개해야만 자금을 받을 수 있고, Alice는 R 공개 여부로 결제 성공을 확인합니다.
        Bob이 자금을 횡령하는 것은 암호학적으로 불가능합니다.
      </InfoBox>

      <HtlcVisualizer />

      {/* Section 4: Routing */}
      <h2>4. 라우팅과 양파 암호화</h2>

      <p>
        라이트닝 결제는 여러 채널을 거쳐 목적지에 도달합니다. 발신자는 목적지까지의
        경로를 미리 계산하고, <strong>양파 라우팅(Sphinx Onion Routing)</strong>으로
        각 홉에 암호화된 라우팅 정보를 전달합니다.
      </p>

      <p>양파 라우팅의 프라이버시:</p>
      <ul>
        <li>각 중간 노드는 자신의 이전 홉과 다음 홉만 알 수 있음</li>
        <li>결제 최종 목적지를 중간 노드가 알 수 없음</li>
        <li>결제 금액도 각 홉에서 부분적으로만 노출</li>
      </ul>

      <InfoBox type="info" title="라우팅 수수료">
        라우팅 노드는 자신을 통과하는 결제에 소액 수수료를 받습니다.
        일반적으로 기본 수수료(base fee) + 금액 비례 수수료(fee rate)로 구성됩니다.
        대부분 1~1,000 msat(밀리사토시) 수준으로 극히 저렴합니다.
      </InfoBox>

      <div className="not-prose my-4">
        <KatexBlock
          math={"\\text{Fee} = \\text{base\\_fee} + \\frac{\\text{fee\\_rate} \\times \\text{amount}}{1{,}000{,}000}"}
          display={true}
        />
        <p className="text-sm text-muted-foreground text-center mt-1">
          {/* base_fee: 기본 수수료(msat), fee_rate: ppm(parts per million), amount: 결제액(msat) — 코드 계산은 sat 단위로 근사 */}
          base_fee (밀리사토시) + fee_rate × amount / 1,000,000 — 코드 계산은 sat 단위로 근사, 대부분 소수점 이하 수준
        </p>
      </div>

      {/* Section 5: Possibilities */}
      <h2>5. 라이트닝의 가능성</h2>

      <p>
        라이트닝 네트워크는 단순한 결제 속도 향상이 아닙니다.
        온체인에서 불가능했던 완전히 새로운 경제 모델을 가능하게 합니다.
      </p>

      <InfoBox type="tip" title="스트리밍 사토시(Streaming Sats)">
        팟캐스트를 청취하면서 분당 100 sat 지불, API 호출 1회당 10 sat, 웹사이트 읽기
        1초당 1 sat — 이 모든 것이 라이트닝으로 가능합니다. Podcasting 2.0, Nostr,
        Value4Value 생태계가 실제로 구현 중입니다.
      </InfoBox>

      <p>라이트닝이 여는 새로운 가능성들:</p>
      <ul>
        <li><strong>즉시 결제:</strong> 블록 확인 없이 밀리초 단위 완료</li>
        <li><strong>초소액 결제:</strong> 1 sat(약 0.002원) 단위 결제 가능</li>
        <li><strong>글로벌 결제:</strong> 국경과 은행 없이 어디서든 BTC 전송</li>
        <li><strong>프로그래머블 결제:</strong> 조건부·시간제한 결제, LNURL, Zaps</li>
        <li><strong>프라이버시 강화:</strong> 온체인보다 추적하기 어려운 결제 경로</li>
      </ul>

      <FeeComparison />

      <InfoBox type="warning" title="라이트닝의 한계와 트레이드오프">
        라이트닝은 완벽하지 않습니다. 채널 유동성 관리, 라우팅 실패, 온라인 상태 유지 필요,
        대용량 결제의 어려움 등 현실적 제약이 있습니다. 그러나 이는 초기 인프라의 성장통이며,
        LSP(Lightning Service Provider), Phoenix Wallet, Mutiny 등 사용성을 크게 개선하는
        솔루션들이 빠르게 발전하고 있습니다.
      </InfoBox>

      <p>
        라이트닝은 비트코인 레이어1의 보안과 최종성을 희생하지 않으면서 확장성을 제공합니다.
        레이어1은 최종 결산(settlement)을, 레이어2는 일상 거래를 담당하는 계층적 구조가
        비트코인 생태계의 장기 비전입니다.
      </p>

      <QuizSection questions={quizQuestions} />
    </article>
  );
}
