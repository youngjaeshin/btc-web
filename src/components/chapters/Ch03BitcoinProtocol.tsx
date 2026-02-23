"use client";

import { useState } from "react";
import { InfoBox } from "@/components/content/InfoBox";
import { KatexBlock } from "@/components/content/KatexBlock";
import { QuizSection } from "@/components/quiz/QuizSection";
import { Plot } from "@/components/content/DynamicPlot";
import { simpleHash } from "@/lib/simpleHash";

function leafHash(tx: string): string {
  return simpleHash("tx:" + tx);
}

function combineHash(a: string, b: string): string {
  return simpleHash(a + b);
}

// ─── SHA-256 Interactive ───────────────────────────────────────────────────
function HashInteractive() {
  const [input, setInput] = useState("Hello, Bitcoin!");
  const [prevInput, setPrevInput] = useState("");
  const hash = simpleHash(input);
  const prevHash = prevInput ? simpleHash(prevInput) : "";

  function diffCount(a: string, b: string): number {
    let diff = 0;
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      if (a[i] !== b[i]) diff++;
    }
    return diff;
  }

  const changed = prevHash && hash !== prevHash ? diffCount(hash, prevHash) : 0;

  return (
    <div className="not-prose my-6 rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20 p-5">
      <h3 className="font-bold text-orange-800 dark:text-orange-200 mb-3 text-base">
        해시 함수 인터랙티브 — 눈사태 효과 체험
      </h3>
      <p className="text-sm text-muted-foreground mb-3">
        아래 텍스트를 수정해보세요. 한 글자만 바꿔도 출력 해시가 완전히 달라집니다.
      </p>
      <label className="block text-xs font-medium mb-1 text-muted-foreground">입력 텍스트</label>
      <textarea
        className="w-full rounded-lg border px-3 py-2 font-mono text-sm bg-white dark:bg-zinc-900 dark:border-zinc-700 resize-none"
        rows={2}
        value={input}
        onChange={(e) => {
          setPrevInput(input);
          setInput(e.target.value);
        }}
      />
      <div className="mt-3">
        <label className="block text-xs font-medium mb-1 text-muted-foreground">
          해시 출력 (SHA-256 시뮬레이션, 64자리 hex)
        </label>
        <div className="font-mono text-xs bg-zinc-900 text-green-400 rounded-lg px-4 py-3 break-all select-all">
          {hash}
        </div>
      </div>
      {changed > 0 && (
        <div className="mt-2 text-xs text-orange-700 dark:text-orange-300 font-medium">
          눈사태 효과: 입력 한 글자 변경 → 출력 {changed}자리 변화 ({Math.round((changed / 64) * 100)}% 변경)
        </div>
      )}
      <div className="mt-3 grid grid-cols-1 gap-2 text-xs">
        <div className="flex gap-2 flex-wrap">
          {["Hello, Bitcoin!", "Hello, Bitcoin?", "hello, bitcoin!", "Satoshi Nakamoto"].map((preset) => (
            <button
              key={preset}
              onClick={() => { setPrevInput(input); setInput(preset); }}
              className="rounded px-2 py-1 border border-orange-300 dark:border-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900/40 text-orange-800 dark:text-orange-200 transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Block Structure Visualizer ────────────────────────────────────────────
const BLOCK_FIELDS = [
  {
    id: "version",
    label: "Version",
    value: "0x20000000",
    desc: "소프트웨어 버전. 어떤 합의 규칙을 따르는지 나타냅니다. 소프트 포크 시그널링에도 사용됩니다.",
    color: "bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700",
  },
  {
    id: "prev_hash",
    label: "Previous Block Hash",
    value: "0000000000000000000abc…",
    desc: "직전 블록의 SHA-256 해시(32바이트). 이 필드가 블록들을 체인으로 연결합니다. 한 블록을 변조하면 이후 모든 블록의 해시가 깨집니다.",
    color: "bg-orange-100 dark:bg-orange-900/40 border-orange-300 dark:border-orange-700",
  },
  {
    id: "merkle",
    label: "Merkle Root",
    value: "4a5e1e4baab89f3a…",
    desc: "블록에 포함된 모든 트랜잭션을 이진 트리 구조로 해싱한 루트값. 트랜잭션 하나라도 변조되면 머클루트가 달라져 블록 해시도 무효화됩니다.",
    color: "bg-green-100 dark:bg-green-900/40 border-green-300 dark:border-green-700",
  },
  {
    id: "timestamp",
    label: "Timestamp",
    value: "2009-01-03 18:15:05 UTC",
    desc: "블록이 채굴된 대략적 시각(Unix 타임스탬프). 네트워크 시간 합의에 사용되며 ±2시간 오차를 허용합니다.",
    color: "bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-700",
  },
  {
    id: "bits",
    label: "Bits (nBits)",
    value: "0x1d00ffff",
    desc: "압축된 난이도 목표값. 유효한 블록 해시는 이 값보다 작아야 합니다. 2016블록마다 자동으로 조절됩니다.",
    color: "bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-700",
  },
  {
    id: "nonce",
    label: "Nonce",
    value: "2083236893",
    desc: "채굴자가 변경하는 32비트 숫자(0~4,294,967,295). 이 값을 바꾸면서 목표 해시를 찾는 것이 채굴의 본질입니다.",
    color: "bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700",
  },
];

function BlockStructureVisualizer() {
  const [selected, setSelected] = useState<string | null>("prev_hash");

  const field = BLOCK_FIELDS.find((f) => f.id === selected);

  return (
    <div className="not-prose my-6 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5">
      <h3 className="font-bold mb-1 text-base">블록 헤더 구조 시각화</h3>
      <p className="text-sm text-muted-foreground mb-4">각 필드를 클릭하면 상세 설명을 볼 수 있습니다.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        <div className="rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600 p-3">
          <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">블록 헤더 (80 bytes)</div>
          <div className="space-y-1.5">
            {BLOCK_FIELDS.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelected(f.id)}
                className={`w-full text-left rounded-md border px-3 py-2 text-xs font-mono transition-all ${f.color} ${selected === f.id ? "ring-2 ring-orange-400 dark:ring-orange-500 scale-[1.01]" : "hover:scale-[1.005]"}`}
              >
                <span className="font-bold">{f.label}</span>
                <span className="ml-2 text-muted-foreground">{f.value}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600 p-3">
          <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">블록 바디</div>
          <div className="space-y-1.5">
            <div className="rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-800">
              <span className="font-bold">Tx Count</span>
              <span className="ml-2 text-muted-foreground font-mono">varint</span>
            </div>
            <div className="rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-8 text-xs bg-zinc-50 dark:bg-zinc-800 text-center text-muted-foreground">
              트랜잭션 목록<br />(4M weight units, 실질 ~1.5–2MB)
            </div>
          </div>
        </div>
      </div>
      {field && (
        <div className={`rounded-lg border p-4 text-sm ${field.color}`}>
          <div className="font-bold mb-1">{field.label}</div>
          <div>{field.desc}</div>
        </div>
      )}
    </div>
  );
}

// ─── Merkle Tree Simulator ─────────────────────────────────────────────────
const DEFAULT_TXS = ["tx_coinbase", "tx_alice_bob", "tx_carol_dave", "tx_eve_frank"];

function MerkleTreeSim() {
  const [txs, setTxs] = useState<string[]>(DEFAULT_TXS);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editVal, setEditVal] = useState("");

  // Build merkle tree layers bottom-up
  function buildTree(leaves: string[]): string[][] {
    const layers: string[][] = [];
    let current = leaves.map(leafHash);
    layers.push(current);
    while (current.length > 1) {
      const next: string[] = [];
      for (let i = 0; i < current.length; i += 2) {
        const left = current[i];
        const right = i + 1 < current.length ? current[i + 1] : current[i];
        next.push(combineHash(left, right));
      }
      layers.push(next);
      current = next;
    }
    return layers;
  }

  const layers = buildTree(txs);
  const root = layers[layers.length - 1][0];

  function short(h: string) {
    return h.slice(0, 6) + "…" + h.slice(-4);
  }

  function handleEdit(i: number) {
    setEditIdx(i);
    setEditVal(txs[i]);
  }

  function commitEdit() {
    if (editIdx === null) return;
    const next = [...txs];
    next[editIdx] = editVal || txs[editIdx];
    setTxs(next);
    setEditIdx(null);
  }

  function reset() {
    setTxs(DEFAULT_TXS);
    setEditIdx(null);
  }

  const layerLabels = ["트랜잭션 해시 (Leaf)", "레벨 1 (쌍 해시)", "레벨 2", "레벨 3"];

  return (
    <div className="not-prose my-6 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20 p-5">
      <h3 className="font-bold text-green-800 dark:text-green-200 mb-1 text-base">머클 트리 시뮬레이터</h3>
      <p className="text-sm text-muted-foreground mb-4">
        트랜잭션 이름을 클릭해 수정하면 머클루트가 어떻게 변하는지 확인하세요.
      </p>

      {/* Transaction inputs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {txs.map((tx, i) => (
          <div key={i} className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Tx {i + 1}</div>
            {editIdx === i ? (
              <div className="flex gap-1">
                <input
                  className="w-full rounded border px-1 py-0.5 text-xs font-mono bg-white dark:bg-zinc-900"
                  value={editVal}
                  onChange={(e) => setEditVal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && commitEdit()}
                  autoFocus
                />
                <button type="button" aria-label="확인" onClick={commitEdit} className="rounded bg-green-600 text-white px-1.5 text-xs">✓</button>
              </div>
            ) : (
              <button
                onClick={() => handleEdit(i)}
                className="w-full rounded-md border border-green-300 dark:border-green-700 px-2 py-1.5 text-xs font-mono bg-white dark:bg-zinc-900 hover:bg-green-100 dark:hover:bg-green-900/40 text-green-800 dark:text-green-200 transition-colors text-left"
              >
                {tx}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Tree visualization */}
      <div className="space-y-2">
        {[...layers].reverse().map((layer, revIdx) => {
          const layerIdx = layers.length - 1 - revIdx;
          const label = layerLabels[Math.min(layerIdx, layerLabels.length - 1)];
          const isRoot = layerIdx === layers.length - 1;
          return (
            <div key={layerIdx}>
              <div className="text-xs text-muted-foreground mb-1">{isRoot ? "머클루트" : label}</div>
              <div className="flex gap-2 flex-wrap">
                {layer.map((h, j) => (
                  <div
                    key={j}
                    className={`font-mono text-xs rounded px-2 py-1.5 border ${isRoot ? "bg-green-600 text-white border-green-700 font-bold w-full text-center" : "bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600"}`}
                  >
                    {isRoot ? h : short(h)}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex justify-end">
        <button type="button" onClick={reset} className="text-xs text-muted-foreground hover:text-foreground underline">초기화</button>
      </div>
    </div>
  );
}

// ─── Quiz ──────────────────────────────────────────────────────────────────
const quizQuestions = [
  {
    question: "사토시 나카모토가 비트코인 백서를 발표한 연도는?",
    options: ["2006년", "2012년", "2010년", "2008년"],
    answer: 3,
    explanation:
      "2008년 10월 31일, 사토시 나카모토는 암호학 메일링 리스트에 'Bitcoin: A Peer-to-Peer Electronic Cash System' 백서를 공개했습니다. 전 세계 금융위기가 한창이던 시기였습니다.",
  },
  {
    question: "제네시스 블록(블록 #0) 코인베이스에 새겨진 타임스탬프 메시지의 출처는?",
    options: [
      "영국 타임스(The Times) 1면",
      "뉴욕타임스 1면",
      "월스트리트저널 1면",
      "사토시 나카모토의 개인 선언문",
    ],
    answer: 0,
    explanation:
      "'Chancellor on brink of second bailout for banks'는 2009년 1월 3일 영국 타임스(The Times) 1면 헤드라인입니다. 사토시는 이 메시지를 새겨 중앙은행 구제금융에 대한 풍자와 함께 비트코인의 탄생 시점을 증명했습니다.",
  },
  {
    question: "UTXO란 무엇의 약자인가?",
    options: [
      "Universal Transaction eXchange Output",
      "Unified Token eXchange Operation",
      "Unspent Transaction Output",
      "Unsigned Transaction eXtra Order",
    ],
    answer: 2,
    explanation:
      "UTXO(Unspent Transaction Output)는 아직 사용되지 않은 트랜잭션 출력입니다. 비트코인 잔액은 실제로 계좌 잔액이 아니라 여러 UTXO의 합계이며, 모든 트랜잭션은 기존 UTXO를 소비(Input)하고 새 UTXO를 생성(Output)합니다.",
  },
  {
    question: "SHA-256 해시 함수의 특성으로 옳지 않은 것은?",
    options: [
      "동일한 입력은 항상 동일한 출력을 낸다 (결정성)",
      "출력으로부터 입력을 역산할 수 있다 (가역성)",
      "입력이 조금만 달라져도 출력이 크게 달라진다 (눈사태 효과)",
      "출력은 항상 256비트(32바이트) 고정 길이다",
    ],
    answer: 1,
    explanation:
      "SHA-256은 단방향 함수입니다. 출력(해시)으로부터 입력을 역산하는 것은 계산적으로 불가능합니다. 이 단방향성이 비트코인 보안의 핵심입니다.",
  },
  {
    question: "블록 헤더에 포함되지 않는 정보는?",
    options: [
      "트랜잭션 상세 내역 (Transaction Details)",
      "머클루트 (Merkle Root)",
      "이전 블록 해시 (Previous Block Hash)",
      "논스 (Nonce)",
    ],
    answer: 0,
    explanation:
      "블록 헤더(80바이트)에는 버전, 이전 블록 해시, 머클루트, 타임스탬프, 난이도(nBits), 논스가 포함됩니다. 실제 트랜잭션 상세 내역은 블록 바디에 저장되며, 헤더에는 이를 요약한 머클루트만 포함됩니다.",
  },
  {
    question: "머클 트리(Merkle Tree)의 주요 역할은?",
    options: [
      "노드 간 트랜잭션 전파 경로를 최적화해 네트워크 전송 속도를 높이기 위해",
      "반감기 일정에 따른 채굴자의 블록 보상 금액을 자동으로 계산하기 위해",
      "개인키와 공개키 쌍을 조합해 새로운 비트코인 주소를 생성하기 위해",
      "모든 트랜잭션을 효율적으로 요약하고 무결성을 검증하기 위해",
    ],
    answer: 3,
    explanation:
      "머클 트리는 블록 내 모든 트랜잭션을 쌍으로 해싱해 하나의 루트(머클루트)로 요약합니다. 이를 통해 트랜잭션 하나가 특정 블록에 포함됐는지 전체 블록 데이터 없이 O(log n)으로 검증할 수 있습니다(SPV 검증).",
  },
  {
    question: "이중지불(Double Spend) 문제를 비트코인은 어떻게 해결하는가?",
    options: [
      "각 트랜잭션에 순차적 고유 시리얼 번호를 부여해 중복 사용 여부를 추적하여",
      "작업증명(PoW)과 분산된 공개 장부(블록체인)를 통해 네트워크 합의로",
      "신뢰할 수 있는 중앙 서버가 모든 지갑 잔액을 실시간으로 추적하고 승인하여",
      "거래 전 사용자 신원 인증(KYC)을 의무화해 이중 사용 시 법적 책임을 부과하여",
    ],
    answer: 1,
    explanation:
      "비트코인은 중앙 기관 없이 작업증명 기반 합의와 공개 블록체인을 통해 이중지불을 방지합니다. 모든 노드가 동일한 원장을 유지하며, 가장 긴 체인(최대 누적 작업량)이 유효한 기록으로 인정됩니다.",
  },
  {
    question: "트랜잭션의 디지털 서명(Digital Signature)이 보장하는 것은?",
    options: [
      "수신자 주소가 실제 존재하는 등록된 지갑임이 네트워크에 의해 확인된다",
      "트랜잭션 데이터 크기와 네트워크 혼잡도에 따라 수수료가 자동으로 계산된다",
      "발신자가 해당 UTXO의 개인키 소유자임을 증명하고 트랜잭션 위변조를 방지한다",
      "서명에 포함된 타임스탬프를 기반으로 블록 채굴 난이도가 자동으로 조절된다",
    ],
    answer: 2,
    explanation:
      "비트코인은 타원곡선 디지털 서명 알고리즘(ECDSA)을 사용합니다. 개인키로 서명하면 네트워크의 누구나 대응하는 공개키로 서명을 검증할 수 있습니다. 개인키를 공개하지 않으면서 소유를 증명하는 것이 핵심입니다.",
  },
];

// ─── Main Component ────────────────────────────────────────────────────────
export default function Ch03BitcoinProtocol() {
  return (
    <div className="space-y-8">
      {/* Section 1: 사토시 나카모토와 백서 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">1. 사토시 나카모토와 백서</h2>
        <p>
          2008년 9월, 리먼브라더스가 파산하면서 전 세계 금융 시스템이 흔들렸습니다. 수십 년간 쌓인 부채와 무책임한
          레버리지가 폭발했고, 각국 정부는 납세자의 돈으로 은행을 구제했습니다. 이 배경 속에서 한 달 뒤인 2008년 10월
          31일, 사토시 나카모토(Satoshi Nakamoto)라는 익명의 개발자가 암호학 메일링 리스트에 9페이지짜리 문서 하나를
          게시했습니다.
        </p>
        <blockquote className="not-prose border-l-4 border-orange-400 pl-4 my-4 italic text-muted-foreground">
          &ldquo;Bitcoin: A Peer-to-Peer Electronic Cash System&rdquo;
          <br />
          <span className="text-xs">— Satoshi Nakamoto, 2008년 10월 31일</span>
        </blockquote>
        <p>
          이 백서는 신뢰할 수 있는 제3자(은행, 정부, 결제 회사) 없이도 두 당사자가 직접 가치를 이전할 수 있는
          시스템을 제안했습니다. 단순해 보이지만 이는 수십 년간 암호학자들이 풀지 못했던 문제에 대한 해답이었습니다.
        </p>
        <InfoBox type="info" title="제네시스 블록의 메시지">
          2009년 1월 3일, 사토시는 비트코인의 첫 번째 블록(제네시스 블록, 블록 #0)을 채굴했습니다. 그는 이
          블록의 코인베이스 트랜잭션에 다음 문구를 새겼습니다:
          <br />
          <br />
          <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-sm">
            The Times 03/Jan/2009 Chancellor on brink of second bailout for banks
          </code>
          <br />
          <br />
          영국 정부가 은행들을 두 번째로 구제하려 한다는 타임스지 1면 헤드라인입니다. 사토시는 이를 통해 비트코인의
          탄생 목적(중앙은행 구제금융 시스템에 대한 대안)을 선명하게 각인시켰습니다. 이 블록에서 발행된 50 BTC는
          영원히 이동할 수 없습니다.
        </InfoBox>
        <p>
          사토시의 정체는 오늘날까지 알려지지 않았습니다. 2010년 말, 사토시는 개발 참여를 점차 줄이며 커뮤니티에
          프로젝트를 넘겼습니다. 이 익명성 자체가 비트코인의 강점입니다. 누구도 사토시를 압박해 프로토콜을
          바꾸거나 비트코인을 &ldquo;끄게&rdquo; 할 수 없습니다.
        </p>
      </section>

      {/* Section 2: P2P 전자화폐 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">2. P2P 전자화폐 — 이중지불 문제의 해결</h2>
        <p>
          디지털 정보의 근본적인 문제는 복사가 자유롭다는 점입니다. 이메일을 보내면 원본이 사라지지 않습니다. 디지털
          파일도 무한히 복사할 수 있습니다. 이 특성이 디지털 화폐에 치명적입니다. 같은 비트코인을 Alice에게도,
          Bob에게도 보낼 수 있다면(이중지불, Double Spend) 가치를 가질 수 없습니다.
        </p>
        <p>
          기존 해결책은 항상 중앙 기관(은행, 페이팔, 비자)이었습니다. 중앙 기관이 모든 잔액을 기록하고 이중지불을
          막습니다. 하지만 이는 검열, 동결, 인플레이션, 신뢰 실패 등의 문제를 수반합니다.
        </p>
        <InfoBox type="tip" title="비트코인의 혁신: 분산된 합의">
          비트코인은 중앙 기관 없이 이중지불을 해결합니다. 모든 트랜잭션을 공개 장부(블록체인)에 기록하고,
          수천 개의 노드가 각자 이 장부의 복사본을 보유합니다. 새로운 트랜잭션이 유효하려면 네트워크 합의(작업증명)를
          거쳐야 합니다. 단 하나의 노드도 신뢰할 필요가 없습니다. 규칙 자체를 신뢰합니다.
          작업증명의 구체적인 메커니즘은 4장에서 상세히 다룹니다.
        </InfoBox>
      </section>

      {/* Section 3: 트랜잭션 구조 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">3. 트랜잭션 구조와 UTXO 모델</h2>
        <p>
          비트코인은 계좌 잔액 방식이 아닙니다. &ldquo;Alice의 지갑에 1 BTC&rdquo;가 있는 것이 아니라, Alice가
          서명권을 가진 여러 UTXO(Unspent Transaction Output, 미사용 트랜잭션 출력)의 합계가 1 BTC인 것입니다.
        </p>

        <div className="not-prose my-5 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          <div className="bg-zinc-50 dark:bg-zinc-800 px-4 py-2 border-b border-zinc-200 dark:border-zinc-700 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            트랜잭션 구조 예시
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg border border-red-200 dark:border-red-800 p-3">
              <div className="font-bold text-red-700 dark:text-red-300 mb-2">Input (소비)</div>
              <div className="space-y-1 text-xs font-mono text-muted-foreground">
                <div>이전 Tx ID: <span className="text-foreground">a3f1…b2c4</span></div>
                <div>Output 인덱스: <span className="text-foreground">0</span></div>
                <div>ScriptSig: <span className="text-foreground">Alice의 서명 + 공개키</span></div>
              </div>
              <div className="mt-2 text-xs text-red-600 dark:text-red-400">이 UTXO를 소비하겠다는 선언</div>
            </div>
            <div className="rounded-lg border border-green-200 dark:border-green-800 p-3">
              <div className="font-bold text-green-700 dark:text-green-300 mb-2">Output (생성)</div>
              <div className="space-y-1 text-xs font-mono text-muted-foreground">
                <div>Output 0: <span className="text-foreground">0.8 BTC → Bob</span></div>
                <div>Output 1: <span className="text-foreground">0.19 BTC → Alice (잔돈)</span></div>
                <div className="text-orange-600 dark:text-orange-400">수수료: 0.01 BTC (채굴자)</div>
              </div>
              <div className="mt-2 text-xs text-green-600 dark:text-green-400">새로운 UTXO가 생성됨</div>
            </div>
          </div>
        </div>

        <p>
          Input 금액의 합은 항상 Output 금액의 합보다 크거나 같아야 합니다. 그 차액이 트랜잭션 수수료로
          채굴자에게 돌아갑니다. Alice가 0.8 BTC를 Bob에게 보내면, 기존 UTXO는 완전히 소비되고 Bob에게는 0.8 BTC짜리
          새 UTXO가, Alice에게는 잔돈(0.19 BTC) UTXO가 생성됩니다.
        </p>

        <InfoBox type="definition" title="UTXO 모델의 장점">
          UTXO 모델은 병렬 검증이 가능합니다. 서로 다른 UTXO를 사용하는 트랜잭션들은 서로 독립적이라 동시에
          검증할 수 있습니다. 또한 개인정보 보호 측면에서도 유리합니다. 매 트랜잭션마다 새 잔돈 주소를 사용하면
          외부에서 잔액 추적이 어렵습니다.
        </InfoBox>

        <h3 className="text-lg font-semibold mt-5 mb-2">디지털 서명</h3>
        <p>
          UTXO를 소비하려면 해당 UTXO의 잠금 조건(ScriptPubKey)을 만족시켜야 합니다. 일반적으로는 ECDSA(타원곡선
          디지털 서명 알고리즘)를 사용합니다. 개인키로 서명하면 네트워크 전체가 대응 공개키로 검증할 수 있습니다.
          개인키를 공개하지 않으면서 소유권을 증명하는 것이 핵심입니다.
        </p>
        <div className="not-prose my-3">
          <KatexBlock math={"\\text{Signature} = \\text{Sign}(\\text{privateKey},\\ \\text{txHash})"} display={true} />
          <KatexBlock math={"\\text{Verify}(\\text{publicKey},\\ \\text{txHash},\\ \\text{Signature}) = \\text{true/false}"} display={true} />
        </div>
        <p className="text-sm text-muted-foreground">
          ※ 개인키(privateKey)로 서명 → 공개키(publicKey)로 누구나 검증 가능. 개인키는 공개되지 않음.
        </p>
      </section>

      {/* Section 4: 블록 구조 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">4. 블록 구조</h2>
        <p>
          유효한 트랜잭션들은 일정 시간(평균 10분)마다 하나의 블록으로 묶입니다. 각 블록은 헤더(80바이트)와
          바디(트랜잭션 목록)로 구성됩니다. 블록 헤더의 필드를 직접 살펴봅시다.
        </p>
        <BlockStructureVisualizer />
        <p>
          블록들은 Previous Block Hash 필드를 통해 체인처럼 연결됩니다. 블록 N의 헤더에는 블록 N-1의
          해시가 포함됩니다. 만약 과거 블록 하나를 변조하면 그 블록의 해시가 달라지고, 이를 참조하는 이후
          모든 블록의 해시도 연쇄적으로 무효화됩니다. 이를 되돌리려면 해당 지점부터 현재까지의 작업증명을
          모두 다시 수행해야 하며, 이는 현실적으로 불가능합니다.
        </p>
      </section>

      {/* Section 5: SHA-256과 해시 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">5. SHA-256과 해시 함수</h2>
        <p>
          비트코인의 보안은 SHA-256(Secure Hash Algorithm 256-bit)에 크게 의존합니다. 해시 함수는 임의 길이의
          입력을 받아 고정 길이(256비트 = 32바이트 = 64자리 hex) 출력을 냅니다.
        </p>

        <div className="not-prose my-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { title: "결정성 (Deterministic)", desc: "같은 입력 → 항상 같은 출력. 단 한 번도 예외 없음.", icon: "🔁" },
            { title: "단방향 (One-Way)", desc: "출력에서 입력으로 역산 불가. 오직 무작위 시도만 가능.", icon: "🚫" },
            { title: "눈사태 효과 (Avalanche)", desc: "입력 1비트 변경 → 출력 약 50%가 무작위로 변함.", icon: "🌊" },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-zinc-200 dark:border-zinc-700 p-4">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="font-semibold text-sm mb-1">{item.title}</div>
              <div className="text-xs text-muted-foreground">{item.desc}</div>
            </div>
          ))}
        </div>

        <HashInteractive />

        <p>
          비트코인은 SHA-256을 두 번 적용(SHA-256d)합니다. 블록 해시 계산, 트랜잭션 ID 계산, 주소 도출 등에
          모두 사용됩니다. 이 해시 포인터가 블록들을 변조 불가능한 체인으로 연결합니다.
        </p>

        <h3 className="text-lg font-semibold mt-5 mb-2">머클 트리 (Merkle Tree)</h3>
        <p>
          블록 내 트랜잭션들은 머클 트리 구조로 요약됩니다. 인접한 트랜잭션 해시를 쌍으로 합쳐 다시 해싱하는
          과정을 반복해 최종적으로 하나의 머클루트(Merkle Root)를 얻습니다. 이 루트가 블록 헤더에 저장됩니다.
        </p>
        <div className="not-prose my-3">
          <KatexBlock
            math={"\\text{MerkleRoot} = H(H(H(T_1) \\| H(T_2)) \\| H(H(T_3) \\| H(T_4)))"}
            display={true}
          />
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          ※ H = SHA-256d, ‖ = 연결(concatenation), T₁~T₄ = 트랜잭션
        </p>
        <MerkleTreeSim />
        <InfoBox type="tip" title="SPV 검증 — 풀노드 없이 트랜잭션 검증">
          머클 트리 덕분에 스마트폰 지갑(SPV 클라이언트)은 블록 전체(수백MB)를 받지 않고도 특정
          트랜잭션이 블록에 포함됐는지 검증할 수 있습니다. O(log n)개의 해시값(머클 경로)만 있으면 충분합니다.
          1,000개 트랜잭션 블록이라면 10개의 해시만으로 검증 가능합니다.
        </InfoBox>
      </section>

      {/* Quiz */}
      <QuizSection questions={quizQuestions} />
    </div>
  );
}
