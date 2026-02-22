"use client";

import { useState } from "react";
import { InfoBox } from "@/components/content/InfoBox";
import { KatexBlock } from "@/components/content/KatexBlock";
import { QuizSection } from "@/components/quiz/QuizSection";
import { Plot } from "@/components/content/DynamicPlot";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Quiz questions
// ---------------------------------------------------------------------------
const quizQuestions = [
  {
    question: '"Not your keys, not your coins"의 의미는 무엇입니까?',
    options: [
      "거래소에 비트코인을 보관하면 실제로 당신의 비트코인이 아니다",
      "비트코인을 잃어버리면 복구할 방법이 없다",
      "비트코인 지갑은 항상 암호화해야 한다",
      "개인키를 타인과 공유해야 한다",
    ],
    answer: 0,
    explanation:
      "거래소에 비트코인을 보관하면 거래소가 개인키를 보유하며, 당신은 IOU(차용증)만 갖습니다. Mt. Gox(2014), FTX(2022) 파산 사례에서 수백만 명이 비트코인을 잃었습니다. 개인키를 직접 보관해야 진정한 소유권을 갖습니다.",
  },
  {
    question: "비트코인에서 개인키(Private Key)로부터 도출되는 순서는 무엇입니까?",
    options: [
      "주소 → 공개키 → 개인키",
      "개인키 → 주소 → 공개키",
      "공개키 → 개인키 → 주소",
      "개인키 → 공개키 → 주소",
    ],
    answer: 3,
    explanation:
      "개인키(256비트 랜덤수)에서 타원곡선 곱셈(secp256k1)으로 공개키를 생성하고, 공개키를 SHA-256 및 RIPEMD-160 해시하여 비트코인 주소를 만듭니다. 역방향 계산은 수학적으로 불가능합니다.",
  },
  {
    question: "BIP-39 시드 문구(Seed Phrase)에서 12단어는 몇 비트의 엔트로피를 나타냅니까?",
    options: [
      "64비트",
      "256비트",
      "128비트",
      "512비트",
    ],
    answer: 2,
    explanation:
      "BIP-39에서 12단어는 128비트 엔트로피(+ 4비트 체크섬 = 132비트)를 나타내고, 24단어는 256비트 엔트로피(+ 8비트 체크섬 = 264비트)를 나타냅니다. 128비트도 현존하는 컴퓨터로는 무차별 대입이 불가능합니다.",
  },
  {
    question: "HD 지갑(BIP-32)의 파생 경로 m/44'/0'/0'/0/0에서 첫 번째 0'은 무엇을 나타냅니까?",
    options: [
      "비트코인 코인 타입(coin type)",
      "첫 번째 주소 인덱스",
      "변경 주소 여부",
      "계정 번호",
    ],
    answer: 0,
    explanation:
      "BIP-44 파생 경로 m/purpose'/coin_type'/account'/change/index에서 coin_type 0'은 비트코인을 나타냅니다(BIP-44 표준). 이더리움은 60', 라이트코인은 2'입니다.",
  },
  {
    question: "UTXO(Unspent Transaction Output)에 대한 올바른 설명은?",
    options: [
      "비트코인 잔액은 은행처럼 단일 숫자로 중앙 서버에 기록된다",
      "UTXO는 거래소 내부 원장에서만 쓰이는 개념으로 온체인에는 존재하지 않는다",
      "UTXO는 액면가를 유지한 채 필요한 만큼 부분적으로 분할해 전송할 수 있다",
      "UTXO는 이전 거래에서 받은 미사용 출력으로, 새 거래의 입력으로 사용된다",
    ],
    answer: 3,
    explanation:
      "비트코인은 계좌 모델이 아닌 UTXO 모델을 사용합니다. UTXO는 '아직 사용하지 않은 거래 출력'으로, 현금 지폐와 유사합니다. 거래 시 UTXO 전체를 입력으로 사용하고, 잔돈은 새 UTXO로 돌려받습니다.",
  },
  {
    question: "시드 문구(Seed Phrase)를 분실했을 때의 올바른 대처는?",
    options: [
      "지갑 앱 고객센터에 연락하면 계정 인증 후 복구를 받을 수 있다",
      "복구가 불가능하다 — 시드 문구 백업이 유일한 복구 수단이다",
      "비트코인 재단에 신원 확인 서류를 제출하면 복구 절차가 진행된다",
      "하드웨어 지갑 제조사가 내부 백업 데이터로 복구해 줄 수 있다",
    ],
    answer: 1,
    explanation:
      "시드 문구를 분실하면 해당 지갑의 비트코인은 영구적으로 접근 불가합니다. 어떤 기관도 복구를 도울 수 없습니다. 이것이 자기주권의 양날의 검입니다 — 완전한 통제권과 함께 완전한 책임이 따릅니다.",
  },
  {
    question: "콜드 월렛(Cold Wallet)과 핫 월렛(Hot Wallet)의 핵심 차이는?",
    options: [
      "콜드 월렛은 인터넷에 연결되지 않아 해킹 위험이 낮다",
      "콜드 월렛은 보관 한도가 없고 핫 월렛은 소액만 보관할 수 있다",
      "핫 월렛은 전용 하드웨어 장치를 사용하고 콜드 월렛은 소프트웨어다",
      "콜드 월렛은 거래소가 운영하는 보관 서비스를 가리키는 용어다",
    ],
    answer: 0,
    explanation:
      "핫 월렛은 인터넷에 연결된 소프트웨어 지갑으로 편리하지만 해킹 위험이 있습니다. 콜드 월렛(하드웨어 지갑, 페이퍼 지갑)은 개인키가 오프라인에 보관되어 해킹으로부터 안전합니다. 대규모 자산은 콜드 월렛에 보관하는 것이 원칙입니다.",
  },
  {
    question: "비트코인 주소를 공개해도 안전한 이유는?",
    options: [
      "블록체인이 주소를 실시간으로 암호화해 외부에서 볼 수 없기 때문에",
      "비트코인 네트워크가 주소와 신원 정보를 분리해 익명성을 보장하기 때문에",
      "주소에서 공개키나 개인키를 역산하는 것이 수학적으로 불가능하기 때문에",
      "HD 지갑이 거래마다 주소를 자동 교체해 추적이 불가능하기 때문에",
    ],
    answer: 2,
    explanation:
      "비트코인 주소는 공개키의 단방향 해시입니다. 주소에서 공개키를, 공개키에서 개인키를 역산하는 것은 타원곡선 이산로그 문제와 SHA-256 역상 저항성으로 인해 현존하는 컴퓨터로는 불가능합니다.",
  },
];

// ---------------------------------------------------------------------------
// Simulation 1: Entropy and security strength calculator
// ---------------------------------------------------------------------------
function EntropyCalculatorSim() {
  const [entropyBits, setEntropyBits] = useState(128);

  // Combinations: 2^entropyBits (display as scientific notation string)
  const combinations = Math.pow(2, entropyBits);

  // Time to brute force at 1 trillion guesses/second
  const secondsToBrute = combinations / 1e12;
  const universeAge = 4.3e17; // seconds (~13.8 billion years)
  const universeMultiple = secondsToBrute / universeAge;

  function formatSci(n: number): string {
    if (!isFinite(n) || n > 1e300) return "∞ (사실상 무한대)";
    const exp = Math.floor(Math.log10(n));
    const mantissa = n / Math.pow(10, exp);
    return `${mantissa.toFixed(2)} × 10^${exp}`;
  }

  const snapPoints = [64, 96, 128, 160, 192, 256];
  const nearestSnap = snapPoints.reduce((a, b) =>
    Math.abs(b - entropyBits) < Math.abs(a - entropyBits) ? b : a
  );

  return (
    <Card className="p-4 my-6">
      <h3 className="font-bold text-lg mb-2">시뮬레이션 1: 엔트로피와 보안 강도 계산기</h3>
      <p className="text-sm text-muted-foreground mb-4">
        슬라이더로 엔트로피 비트 수를 조정해 보안 강도가 어떻게 달라지는지 확인하세요.
      </p>
      <div className="mb-4">
        <label className="text-sm font-medium">
          엔트로피: <span className="text-primary font-bold">{entropyBits}비트</span>
          {entropyBits === 128 && " (12단어 시드)"}
          {entropyBits === 256 && " (24단어 시드)"}
        </label>
        <Slider
          min={64}
          max={256}
          step={1}
          value={[entropyBits]}
          onValueChange={(v) => setEntropyBits(v[0])}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>64비트</span>
          <span>128비트 (12단어)</span>
          <span>256비트 (24단어)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">가능한 시드 조합 수</div>
          <div className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-300 break-all">
            2^{entropyBits} = {formatSci(combinations)}
          </div>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">무차별 대입 소요 시간</div>
          <div className="font-mono text-sm font-bold text-blue-700 dark:text-blue-300 break-all">
            {formatSci(secondsToBrute)} 초
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            (초당 1조 회 시도 기준)
          </div>
        </div>
        <div className="p-3 bg-violet-50 dark:bg-violet-950/30 rounded-lg md:col-span-2">
          <div className="text-xs text-muted-foreground mb-1">우주 나이 대비</div>
          <div className="font-bold text-violet-700 dark:text-violet-300">
            {universeMultiple > 1e20
              ? `우주 나이의 ${formatSci(universeMultiple)} 배 — 사실상 해킹 불가능`
              : universeMultiple > 1e6
              ? `우주 나이의 ${formatSci(universeMultiple)} 배`
              : universeMultiple > 1
              ? `우주 나이의 ${universeMultiple.toExponential(2)} 배`
              : `우주 나이의 ${(universeMultiple * 100).toFixed(4)}% — 취약할 수 있음!`}
          </div>
        </div>
      </div>

      <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-sm">
        <strong>결론:</strong> 128비트(12단어) 엔트로피조차 현존하는 모든 컴퓨터를 합쳐도
        우주 수명 안에 해킹할 수 없습니다. 가장 가까운 표준 엔트로피: <strong>{nearestSnap}비트</strong>
        {nearestSnap === 128 ? " (12단어 BIP-39)" : nearestSnap === 256 ? " (24단어 BIP-39)" : ""}.
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Simulation 2: UTXO visualizer
// ---------------------------------------------------------------------------

interface Utxo {
  id: string;
  amount: number;
  label: string;
}

const INITIAL_UTXOS: Utxo[] = [
  { id: "utxo-a", amount: 0.5, label: "UTXO A" },
  { id: "utxo-b", amount: 1.2, label: "UTXO B" },
  { id: "utxo-c", amount: 0.3, label: "UTXO C" },
  { id: "utxo-d", amount: 0.8, label: "UTXO D" },
];

function UtxoVisualizerSim() {
  const [sendAmount, setSendAmount] = useState(0.7);
  const [feeRate, setFeeRate] = useState(0.0001);

  const totalBalance = INITIAL_UTXOS.reduce((s, u) => s + u.amount, 0);
  const needed = sendAmount + feeRate;

  // Simple greedy coin selection: smallest first that covers needed
  let selected: Utxo[] = [];
  let accumulated = 0;
  const sorted = [...INITIAL_UTXOS].sort((a, b) => a.amount - b.amount);
  for (const utxo of sorted) {
    if (accumulated >= needed) break;
    selected.push(utxo);
    accumulated += utxo.amount;
  }
  const change = accumulated - sendAmount - feeRate;
  const valid = accumulated >= needed && sendAmount > 0;

  return (
    <Card className="p-4 my-6">
      <h3 className="font-bold text-lg mb-2">시뮬레이션 2: UTXO 시각화</h3>
      <p className="text-sm text-muted-foreground mb-4">
        지갑 잔액은 여러 UTXO(미사용 거래 출력)로 구성됩니다.
        전송 금액을 조정하면 어떤 UTXO가 선택되고 잔돈이 어떻게 생기는지 확인하세요.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium block mb-1">
            전송 금액: <span className="text-primary font-bold">{sendAmount.toFixed(3)} BTC</span>
          </label>
          <Slider
            min={0.1}
            max={2.5}
            step={0.05}
            value={[sendAmount]}
            onValueChange={(v) => setSendAmount(v[0])}
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">
            수수료: <span className="text-orange-500 font-bold">{feeRate.toFixed(4)} BTC</span>
          </label>
          <Slider
            min={0.0001}
            max={0.005}
            step={0.0001}
            value={[feeRate]}
            onValueChange={(v) => setFeeRate(v[0])}
          />
        </div>
      </div>

      {/* UTXO boxes */}
      <div className="mb-4">
        <div className="text-sm font-medium mb-2">내 지갑 UTXO (총 {totalBalance.toFixed(1)} BTC):</div>
        <div className="flex flex-wrap gap-2">
          {INITIAL_UTXOS.map((utxo) => {
            const isSelected = selected.some((s) => s.id === utxo.id);
            return (
              <div
                key={utxo.id}
                className={`rounded-lg border-2 p-3 text-center min-w-[90px] transition-all ${
                  isSelected
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30"
                    : "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                }`}
              >
                <div className="text-xs text-muted-foreground">{utxo.label}</div>
                <div className="font-mono font-bold text-sm mt-1">{utxo.amount.toFixed(2)}</div>
                <div className="text-xs">BTC</div>
                {isSelected && (
                  <div className="text-xs text-orange-600 dark:text-orange-400 mt-1 font-medium">선택됨</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction result */}
      {valid ? (
        <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
          <div className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">거래 구성</div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>입력 (선택된 UTXO 합계):</span>
              <span className="font-mono font-bold">{accumulated.toFixed(4)} BTC</span>
            </div>
            <div className="flex justify-between text-orange-600 dark:text-orange-400">
              <span>출력 1 (수신자):</span>
              <span className="font-mono font-bold">-{sendAmount.toFixed(4)} BTC</span>
            </div>
            <div className="flex justify-between text-red-600 dark:text-red-400">
              <span>채굴자 수수료:</span>
              <span className="font-mono font-bold">-{feeRate.toFixed(4)} BTC</span>
            </div>
            <div className="flex justify-between text-blue-600 dark:text-blue-400 border-t border-green-200 dark:border-green-700 pt-1">
              <span>출력 2 (잔돈, 내 새 UTXO):</span>
              <span className="font-mono font-bold">{change.toFixed(4)} BTC</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
          잔액 부족: 필요 {needed.toFixed(4)} BTC, 보유 {totalBalance.toFixed(1)} BTC
        </div>
      )}

      <div className="mt-3 text-sm text-muted-foreground">
        <strong>핵심:</strong> UTXO는 현금 지폐와 같습니다. 1만원짜리로 7,000원을 내면 3,000원 잔돈을 받듯,
        UTXO 전체를 입력으로 사용하고 잔돈은 새 UTXO로 돌려받습니다.
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Simulation 3: HD wallet key derivation tree
// ---------------------------------------------------------------------------
function HdWalletSim() {
  const [account, setAccount] = useState(0);
  const [addressIndex, setAddressIndex] = useState(0);
  const [isChange, setIsChange] = useState(false);

  const purpose = 44;
  const coinType = 0; // Bitcoin mainnet
  const change = isChange ? 1 : 0;

  const derivationPath = `m/${purpose}'/${coinType}'/${account}'/${change}/${addressIndex}`;

  // Simulate deterministic "key" display (not real crypto, just demonstration)
  function deterministicHex(seed: string): string {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
    }
    const abs = Math.abs(hash);
    const hex = abs.toString(16).padStart(8, "0");
    return hex.repeat(4).substring(0, 32) + "..." ;
  }

  const masterSeed = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
  const childKey = deterministicHex(derivationPath + masterSeed);

  // Visualize tree nodes
  const nodes = [
    { level: 0, label: "마스터 키 (m)", path: "m", color: "bg-violet-100 dark:bg-violet-900/40 border-violet-400" },
    { level: 1, label: `목적 (${purpose}')`, path: `m/${purpose}'`, color: "bg-blue-100 dark:bg-blue-900/40 border-blue-400" },
    { level: 2, label: `코인 타입 (${coinType}' = BTC)`, path: `m/${purpose}'/${coinType}'`, color: "bg-cyan-100 dark:bg-cyan-900/40 border-cyan-400" },
    { level: 3, label: `계정 (${account}')`, path: `m/${purpose}'/${coinType}'/${account}'`, color: "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400" },
    { level: 4, label: `${isChange ? "잔돈 주소" : "외부 주소"} (${change})`, path: `m/${purpose}'/${coinType}'/${account}'/${change}`, color: "bg-amber-100 dark:bg-amber-900/40 border-amber-400" },
    { level: 5, label: `주소 인덱스 (${addressIndex})`, path: derivationPath, color: "bg-orange-100 dark:bg-orange-900/40 border-orange-400" },
  ];

  return (
    <Card className="p-4 my-6">
      <h3 className="font-bold text-lg mb-2">시뮬레이션 3: HD 지갑 키 파생 데모</h3>
      <p className="text-sm text-muted-foreground mb-4">
        하나의 마스터 키(시드)에서 무한한 자식 키를 생성할 수 있습니다.
        파라미터를 변경하면 파생 경로와 키가 어떻게 달라지는지 확인하세요.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="text-sm font-medium block mb-1">
            계정 번호: <span className="text-primary font-bold">{account}</span>
          </label>
          <Slider
            min={0}
            max={5}
            step={1}
            value={[account]}
            onValueChange={(v) => setAccount(v[0])}
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">
            주소 인덱스: <span className="text-primary font-bold">{addressIndex}</span>
          </label>
          <Slider
            min={0}
            max={19}
            step={1}
            value={[addressIndex]}
            onValueChange={(v) => setAddressIndex(v[0])}
          />
        </div>
        <div className="flex items-end pb-1">
          <Button
            variant={isChange ? "default" : "outline"}
            size="sm"
            onClick={() => setIsChange((v) => !v)}
            className="w-full"
          >
            {isChange ? "잔돈 주소 (change=1)" : "외부 주소 (change=0)"}
          </Button>
        </div>
      </div>

      {/* Tree visualization */}
      <div className="mb-4 space-y-1">
        {nodes.map((node, i) => (
          <div
            key={node.path}
            className="flex items-center"
            style={{ paddingLeft: `${node.level * 20}px` }}
          >
            {node.level > 0 && (
              <span className="text-muted-foreground mr-2 text-xs">└─</span>
            )}
            <div className={`rounded border px-2 py-1 text-xs font-medium ${node.color} ${i === nodes.length - 1 ? "ring-2 ring-orange-400" : ""}`}>
              {node.label}
            </div>
          </div>
        ))}
      </div>

      {/* Derivation result */}
      <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border">
        <div className="text-xs text-muted-foreground mb-1">파생 경로</div>
        <div className="font-mono text-sm font-bold text-primary">{derivationPath}</div>
        <div className="text-xs text-muted-foreground mt-2 mb-1">파생된 자식 키 (시뮬레이션)</div>
        <div className="font-mono text-xs text-muted-foreground break-all">{childKey}</div>
      </div>

      <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-sm">
        <strong>핵심:</strong> 하나의 12단어 시드만 백업하면 이 트리에서 파생되는
        <strong> 수십억 개의 주소</strong>를 모두 복구할 수 있습니다.
        각 계정과 주소는 독립적으로 동작하며 프라이버시를 향상시킵니다.
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function Ch06WalletsCustody() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      {/* ------------------------------------------------------------------ */}
      {/* Section 1: Not your keys, not your coins */}
      {/* ------------------------------------------------------------------ */}
      <h2>1. &quot;Not Your Keys, Not Your Coins&quot;</h2>

      <p>
        비트코인의 가장 근본적인 원칙 중 하나입니다.
        거래소에 비트코인을 &quot;보관&quot;하는 것은 실제로 비트코인을 소유하는 것이 아닙니다.
        거래소는 당신의 비트코인 개인키를 보유하고, 당신에게는 장부상의 숫자(IOU)만 줍니다.
      </p>

      <InfoBox type="warning" title="역사가 증명한 거래소 리스크">
        <ul className="list-none space-y-1 text-sm">
          <li><strong>Mt. Gox (2014):</strong> 당시 전 세계 BTC 거래의 70% 처리 → 85만 BTC 해킹 분실. 고객들은 수년간 법적 싸움.</li>
          <li><strong>QuadrigaCX (2019):</strong> CEO 급사(또는 사기) → 고객 1.9억 달러 접근 불가.</li>
          <li><strong>FTX (2022):</strong> 한때 세계 2위 거래소 → SBF의 고객 자금 횡령. 80억 달러 손실. 수십만 명 피해.</li>
          <li><strong>교훈:</strong> 거래소는 은행이 아닙니다. 예금자 보호도, FDIC 보험도 없습니다.</li>
        </ul>
      </InfoBox>

      <p>
        자기주권(Self-Custody)은 번거롭게 느껴질 수 있습니다. 하지만 비트코이너에게
        자기 개인키를 직접 보유하는 것은 선택이 아닌 <strong>원칙</strong>입니다.
        비트코인은 당신이 중간자 없이 직접 통제할 수 있는 최초의 화폐입니다.
        그 자유와 함께 책임도 따릅니다.
      </p>

      <InfoBox type="definition" title="자기주권 화폐 (Self-Sovereign Money)">
        어떤 제3자(은행, 거래소, 정부)의 허가나 신뢰 없이 개인이 완전한 통제권을 가진 화폐.
        비트코인의 개인키를 직접 보유하면, 당신의 비트코인은 물리적으로 현금을 보유하는 것처럼
        진정으로 당신 것입니다.
      </InfoBox>

      {/* ------------------------------------------------------------------ */}
      {/* Section 2: 공개키 암호학 기초 */}
      {/* ------------------------------------------------------------------ */}
      <h2>2. 공개키 암호학 기초</h2>

      <p>
        비트코인의 보안은 <strong>타원곡선 암호학(ECC)</strong>에 기반합니다.
        구체적으로 secp256k1 곡선을 사용합니다. 핵심 아이디어는
        &quot;단방향 함수&quot;로, 한 방향으로는 쉽게 계산되지만 역방향은 사실상 불가능합니다.
      </p>

      <h3>키 생성 과정</h3>

      <div className="not-prose my-6">
        <div className="flex flex-col md:flex-row items-center gap-2 overflow-x-auto">
          {[
            { label: "개인키 (Private Key)", desc: "256비트 랜덤 숫자", color: "bg-red-100 dark:bg-red-900/40 border-red-400", icon: "🔑" },
            { label: "→ secp256k1 곱셈", desc: "단방향, 역산 불가", color: "bg-slate-100 dark:bg-slate-800 border-slate-400", icon: "×" },
            { label: "공개키 (Public Key)", desc: "압축형 33바이트 (264비트)", color: "bg-blue-100 dark:bg-blue-900/40 border-blue-400", icon: "🔓" },
            { label: "→ SHA256 + RIPEMD160", desc: "해시 함수, 역산 불가", color: "bg-slate-100 dark:bg-slate-800 border-slate-400", icon: "#" },
            { label: "비트코인 주소", desc: "Base58Check 인코딩", color: "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400", icon: "📮" },
          ].map((step, i) => (
            <div
              key={i}
              className={`rounded-lg border-2 p-3 text-center min-w-[130px] ${step.color}`}
            >
              <div className="text-2xl mb-1">{step.icon}</div>
              <div className="text-xs font-bold">{step.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <KatexBlock
        display
        math={"K_{\\text{pub}} = k_{\\text{priv}} \\cdot G \\quad (\\text{secp256k1 elliptic curve point multiplication})"}
      />
      <p className="text-sm text-muted-foreground -mt-2">
        여기서 · 는 일반 곱셈이 아니라 타원곡선 위의 점 덧셈을 반복하는 스칼라 곱셈입니다.
        (공개키 = 개인키 × 생성점 G, secp256k1 곡선 위에서의 타원곡선 스칼라 곱셈)
      </p>

      <InfoBox type="info" title="이산 로그 문제(Discrete Logarithm Problem)">
        K = k × G 에서 K(공개키)와 G(생성점)를 알아도 k(개인키)를 계산하는 것은
        타원곡선 이산 로그 문제로, 현존하는 컴퓨터로는 우주 수명 동안도 풀 수 없습니다.
        이것이 비트코인 보안의 수학적 기반입니다.
      </InfoBox>

      <p>
        공개키는 안전하게 공유할 수 있습니다. 누구나 공개키로 서명을 검증할 수 있지만,
        공개키에서 개인키를 역산하는 것은 불가능합니다.
        비트코인 주소는 공개키의 해시로, 공개적으로 공유해도 안전합니다.
      </p>

      {/* ------------------------------------------------------------------ */}
      {/* Section 3: 시드 문구 (BIP-39) */}
      {/* ------------------------------------------------------------------ */}
      <h2>3. 시드 문구(BIP-39) — 니모닉의 비밀</h2>

      <p>
        256비트의 랜덤 숫자(개인키)를 직접 백업하는 것은 실수하기 쉽습니다.
        BIP-39(Bitcoin Improvement Proposal 39)는 이 문제를 해결하기 위해
        인간이 읽을 수 있는 단어 목록(니모닉)으로 변환하는 표준을 제안했습니다.
      </p>

      <div className="not-prose my-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border-2 border-amber-300 dark:border-amber-700">
        <div className="text-sm font-bold text-amber-800 dark:text-amber-200 mb-3">예시 12단어 시드 (실제로 사용하지 마세요)</div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {["abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "abandon", "about"].map((word, i) => (
            <div key={i} className="bg-white dark:bg-neutral-900 rounded border border-amber-200 dark:border-amber-700 p-2 text-center">
              <div className="text-xs text-muted-foreground">{i + 1}</div>
              <div className="font-mono text-sm font-bold">{word}</div>
            </div>
          ))}
        </div>
        <div className="text-xs text-amber-700 dark:text-amber-300 mt-2">
          이 시드는 BIP-39 테스트 벡터입니다. 절대 실제 자산 보관에 사용하지 마세요.
        </div>
      </div>

      <h3>엔트로피와 체크섬</h3>
      <KatexBlock
        display
        math={"\\text{12 words} = 128\\text{-bit entropy} + 4\\text{-bit checksum} = 132\\text{ bits}"}
      />
      <KatexBlock
        display
        math={"\\text{24 words} = 256\\text{-bit entropy} + 8\\text{-bit checksum} = 264\\text{ bits}"}
      />

      <p>
        BIP-39 단어 목록은 2,048개의 단어로 구성되어 있습니다.
        (<KatexBlock math={"2^{11} = 2048"} />)
        각 단어는 11비트를 나타내며, 12단어 × 11비트 = 132비트 중
        마지막 4비트는 체크섬으로 오타를 감지합니다.
      </p>

      <EntropyCalculatorSim />

      <InfoBox type="tip" title="시드 문구 보안 원칙">
        <ul className="list-none space-y-1 text-sm">
          <li>🔒 <strong>절대 디지털 저장 금지:</strong> 클라우드, 이메일, 사진, 메모앱에 저장하지 마세요.</li>
          <li>📄 <strong>물리적 백업 필수:</strong> 종이에 써서 방화금고에 보관. 금속판 각인도 좋습니다.</li>
          <li>✂️ <strong>분산 보관:</strong> Shamir의 비밀 분산(SLIP-39) 또는 2개소 이상에 분산 보관.</li>
          <li>🚫 <strong>절대 타인에게 공유 금지:</strong> 합법적인 어떤 서비스도 시드 문구를 요청하지 않습니다.</li>
        </ul>
      </InfoBox>

      {/* ------------------------------------------------------------------ */}
      {/* Section 4: HD 지갑 (BIP-32/44) */}
      {/* ------------------------------------------------------------------ */}
      <h2>4. HD 지갑(BIP-32/44) — 하나의 씨앗, 무한한 키</h2>

      <p>
        Hierarchical Deterministic(HD) 지갑은 단 하나의 마스터 시드에서
        결정론적으로 무한한 자식 키를 생성합니다.
        이전에는 각 주소마다 별도의 키를 백업해야 했지만,
        HD 지갑은 하나의 시드만 백업하면 모든 키를 복구할 수 있습니다.
      </p>

      <h3>BIP-44 파생 경로 구조</h3>

      <KatexBlock
        display
        math={"m / \\text{purpose}' / \\text{coin\\_type}' / \\text{account}' / \\text{change} / \\text{index}"}
      />

      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-emerald-100 dark:bg-emerald-900/40">
              <th className="border border-emerald-200 dark:border-emerald-700 px-3 py-2 text-left">레벨</th>
              <th className="border border-emerald-200 dark:border-emerald-700 px-3 py-2 text-left">이름</th>
              <th className="border border-emerald-200 dark:border-emerald-700 px-3 py-2 text-left">BTC 값</th>
              <th className="border border-emerald-200 dark:border-emerald-700 px-3 py-2 text-left">의미</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["m", "마스터", "m", "마스터 시드에서 파생"],
              ["1", "Purpose", "44'", "BIP-44 표준 (강화 파생)"],
              ["2", "Coin Type", "0'", "비트코인 메인넷 (강화 파생)"],
              ["3", "Account", "0'", "첫 번째 계정 (강화 파생)"],
              ["4", "Change", "0 또는 1", "0=외부 주소, 1=잔돈 주소"],
              ["5", "Index", "0, 1, 2...", "주소 인덱스 (무제한 생성 가능)"],
            ].map(([level, name, value, meaning], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white dark:bg-neutral-900" : "bg-emerald-50 dark:bg-emerald-950/20"}>
                <td className="border border-emerald-200 dark:border-emerald-700 px-3 py-2 font-mono">{level}</td>
                <td className="border border-emerald-200 dark:border-emerald-700 px-3 py-2">{name}</td>
                <td className="border border-emerald-200 dark:border-emerald-700 px-3 py-2 font-mono text-primary">{value}</td>
                <td className="border border-emerald-200 dark:border-emerald-700 px-3 py-2 text-muted-foreground">{meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <HdWalletSim />

      <InfoBox type="info" title="강화 파생(Hardened Derivation)">
        경로에 어포스트로피(&apos;)가 붙은 레벨은 &quot;강화 파생&quot;으로, 부모 공개키와 자식 키 사이의
        연결을 차단합니다. 이를 통해 자식 키 하나가 유출되더라도 부모 키나 형제 키가
        노출되지 않도록 보호합니다.
      </InfoBox>

      {/* ------------------------------------------------------------------ */}
      {/* Section 5: UTXO 관리 */}
      {/* ------------------------------------------------------------------ */}
      <h2>5. UTXO 관리 — 비트코인의 회계 시스템</h2>

      <p>
        비트코인은 은행의 &quot;계좌 잔액&quot; 방식이 아닌 <strong>UTXO(Unspent Transaction Output)</strong> 모델을 사용합니다.
        당신의 지갑 &quot;잔액&quot;은 사실 여러 개의 개별 UTXO 묶음입니다.
        마치 지갑 속 여러 장의 지폐와 같습니다.
      </p>

      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <Card className="p-4">
          <h4 className="font-bold mb-3 text-base">은행 계좌 모델</h4>
          <div className="space-y-2 text-sm">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200 dark:border-blue-800">
              <div className="font-mono">잔액: 2,000,000원</div>
            </div>
            <div className="text-muted-foreground">
              단일 숫자로 관리, 중앙 DB에 기록,
              은행이 &quot;실제로&quot; 당신 돈을 보유 (부분준비은행)
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <h4 className="font-bold mb-3 text-base">비트코인 UTXO 모델</h4>
          <div className="space-y-1 text-sm mb-2">
            {[
              { label: "UTXO #1", amount: "0.5 BTC" },
              { label: "UTXO #2", amount: "1.2 BTC" },
              { label: "UTXO #3", amount: "0.3 BTC" },
            ].map((u) => (
              <div key={u.label} className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded border border-orange-200 dark:border-orange-800 flex justify-between">
                <span>{u.label}</span>
                <span className="font-mono font-bold">{u.amount}</span>
              </div>
            ))}
          </div>
          <div className="text-muted-foreground text-sm">
            개별 &quot;지폐&quot;로 관리, 전 세계 노드가 검증,
            진정한 소유권 (자기 보관 시)
          </div>
        </Card>
      </div>

      <UtxoVisualizerSim />

      <h3>UTXO와 프라이버시</h3>
      <p>
        UTXO 관리는 단순한 회계를 넘어 프라이버시에도 영향을 줍니다.
        여러 UTXO를 하나의 거래에서 합치면(consolidation) 같은 지갑임이 드러납니다.
        반면 UTXO를 신중하게 선택하면 프라이버시를 향상시킬 수 있습니다.
      </p>

      <InfoBox type="tip" title="UTXO 관리 팁">
        <ul className="list-none space-y-1 text-sm">
          <li>🪙 <strong>코인 선택(Coin Control):</strong> 어떤 UTXO를 사용할지 직접 선택하면 프라이버시 향상.</li>
          <li>🔀 <strong>주소 재사용 금지:</strong> 매 거래마다 새 주소 사용 (HD 지갑이 자동으로 처리).</li>
          <li>📦 <strong>UTXO 통합:</strong> 수수료가 낮을 때 소액 UTXO를 통합해 수수료 효율화.</li>
          <li>🛡️ <strong>CoinJoin:</strong> 여러 사람의 거래를 섞어 UTXO 출처를 불명확하게 만드는 프라이버시 기술.</li>
        </ul>
      </InfoBox>

      <InfoBox type="tip" title="Bitcoiner의 보안 피라미드">
        <div className="space-y-2 text-sm">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded">
            <strong>최고 보안:</strong> 하드웨어 지갑 + 금속 시드 백업 + 멀티시그
            — 대규모 장기 보유에 적합
          </div>
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded">
            <strong>중간 보안:</strong> 하드웨어 지갑 + 종이 시드 백업
            — 대부분의 장기 보유자에게 권장
          </div>
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">
            <strong>일반 사용:</strong> 스마트폰 소프트웨어 지갑 (소액만)
            — 일상 지출, 라이트닝 결제용
          </div>
          <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
            <strong>절대 금지:</strong> 거래소에 장기 보관
            — &quot;Not your keys, not your coins&quot;
          </div>
        </div>
      </InfoBox>

      {/* ------------------------------------------------------------------ */}
      {/* Quiz */}
      {/* ------------------------------------------------------------------ */}
      <QuizSection questions={quizQuestions} />
    </article>
  );
}
