"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { InfoBox } from "@/components/content/InfoBox";
import { KatexBlock } from "@/components/content/KatexBlock";
import { QuizSection } from "@/components/quiz/QuizSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Server,
  Network,
  Layers,
  ArrowUpDown,
  RefreshCw,
  Plus,
  Pickaxe,
  Clock,
  Zap,
} from "lucide-react";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

// ─── Types ────────────────────────────────────────────────────────────────────

interface MempoolTx {
  id: string;
  feeRate: number; // sat/vB
  size: number; // vBytes
  totalFee: number; // sats
  inBlock: boolean;
}

// ─── 1. Mempool Simulator ─────────────────────────────────────────────────────

const makeTx = (id: string, feeRate: number, size: number): MempoolTx => ({
  id,
  feeRate,
  size,
  totalFee: Math.round(feeRate * size),
  inBlock: false,
});

const initialTxs: MempoolTx[] = [
  makeTx("tx-001", 85, 140),
  makeTx("tx-002", 42, 250),
  makeTx("tx-003", 120, 140),
  makeTx("tx-004", 15, 500),
  makeTx("tx-005", 200, 140),
  makeTx("tx-006", 8, 1000),
  makeTx("tx-007", 55, 200),
  makeTx("tx-008", 30, 300),
  makeTx("tx-009", 3, 250),
  makeTx("tx-010", 65, 180),
  makeTx("tx-011", 12, 400),
  makeTx("tx-012", 95, 140),
];

function MempoolSimulator() {

  const [txs, setTxs] = useState<MempoolTx[]>(initialTxs);
  const [minedCount, setMinedCount] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const blockCapacity = 1200; // vB — 의도적으로 작게 설정하여 선택/탈락 시각화

  const addTx = () => {
    const rates = [3, 5, 10, 20, 40, 80, 150, 300];
    const sizes = [140, 200, 250, 300, 500];
    const feeRate = rates[Math.floor(Math.random() * rates.length)];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const id = `tx-${String(Date.now()).slice(-4)}`;
    setTxs((prev) => [...prev, makeTx(id, feeRate, size)]);
    setLog((prev) => [`+ ${id} 추가 (${feeRate} sat/vB, ${size} vB)`, ...prev.slice(0, 9)]);
  };

  // Determine which pending txs would be selected for next block
  const getBlockSelection = (pendingTxs: MempoolTx[]) => {
    const sorted = [...pendingTxs].sort((a, b) => b.feeRate - a.feeRate);
    let usedVb = 0;
    const selected: string[] = [];
    for (const tx of sorted) {
      if (usedVb + tx.size <= blockCapacity) {
        usedVb += tx.size;
        selected.push(tx.id);
      }
    }
    return { selected, usedVb };
  };

  const mineBlock = () => {
    const pending = txs.filter((t) => !t.inBlock);
    const { selected } = getBlockSelection(pending);
    if (selected.length === 0) {
      setLog((prev) => ["멤풀이 비어있습니다.", ...prev.slice(0, 9)]);
      return;
    }
    const selectedTxs = pending.filter((t) => selected.includes(t.id));
    const rejectedTxs = pending.filter((t) => !selected.includes(t.id));
    const totalFee = selectedTxs.reduce((s, t) => s + t.totalFee, 0);
    const minFeeIncluded = Math.min(...selectedTxs.map((t) => t.feeRate));

    setTxs((prev) => prev.map((t) => (selected.includes(t.id) ? { ...t, inBlock: true } : t)));
    setMinedCount((c) => c + 1);
    setLog((prev) => [
      `⛏ 블록 #${minedCount + 1}: ${selected.length}개 포함 (최소 ${minFeeIncluded} sat/vB), 수수료 ${totalFee.toLocaleString()} sat`,
      ...(rejectedTxs.length > 0
        ? [`  ↳ ${rejectedTxs.length}개 탈락 — 수수료 부족으로 멤풀에 남음`]
        : []),
      ...prev.slice(0, 7),
    ]);
  };

  const resetMempool = () => {
    setTxs(initialTxs);
    setMinedCount(0);
    setLog([]);
  };

  const pending = txs.filter((t) => !t.inBlock).sort((a, b) => b.feeRate - a.feeRate);
  const confirmed = txs.filter((t) => t.inBlock);
  const { selected: wouldBeSelected, usedVb } = getBlockSelection(pending);

  const feeRates = pending.map((t) => t.feeRate);
  const labels = pending.map((t) => t.id);
  const colors = pending.map((t) =>
    wouldBeSelected.includes(t.id)
      ? (t.feeRate >= 100 ? "#22c55e" : "#4ade80") // 블록 포함 예정: 녹색
      : (t.feeRate >= 15 ? "#f97316" : "#ef4444")   // 탈락 예정: 주황/빨강
  );

  return (
    <div className="not-prose my-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Layers className="h-5 w-5 text-blue-500" />
        <h3 className="font-bold text-lg">멤풀 시각화 시뮬레이터</h3>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <Card className="p-3">
          <div className="text-2xl font-bold text-blue-500">{pending.length}</div>
          <div className="text-xs text-muted-foreground">대기 중 tx</div>
        </Card>
        <Card className="p-3">
          <div className="text-2xl font-bold text-green-500">{confirmed.length}</div>
          <div className="text-xs text-muted-foreground">확인됨</div>
        </Card>
        <Card className="p-3">
          <div className="text-2xl font-bold text-orange-500">{minedCount}</div>
          <div className="text-xs text-muted-foreground">채굴된 블록</div>
        </Card>
      </div>

      {pending.length > 0 && (
        <Plot
          data={[
            {
              type: "bar",
              x: labels,
              y: feeRates,
              marker: { color: colors },
              hovertemplate: "%{x}<br>%{y} sat/vB<extra></extra>",
            },
          ]}
          layout={{
            height: 220,
            margin: { t: 30, b: 40, l: 60, r: 10 },
            title: { text: "멤풀 대기 트랜잭션 (수수료율 순)" },
            yaxis: { title: { text: "sat/vB" } },
            xaxis: { title: { text: "트랜잭션 ID" } },
            paper_bgcolor: "transparent",
            plot_bgcolor: "transparent",
            font: { size: 11, color: "#666" },
          }}
          config={{ displayModeBar: false, responsive: true }}
          style={{ width: "100%" }}
        />
      )}

      <div className="flex gap-2 flex-wrap">
        <Button size="sm" variant="outline" onClick={addTx} className="gap-1">
          <Plus className="h-4 w-4" />
          트랜잭션 추가
        </Button>
        <Button size="sm" onClick={mineBlock} className="gap-1 bg-orange-500 hover:bg-orange-600 text-white">
          <Pickaxe className="h-4 w-4" />
          블록 채굴
        </Button>
        <Button size="sm" variant="ghost" onClick={resetMempool} className="gap-1">
          <RefreshCw className="h-4 w-4" />
          초기화
        </Button>
      </div>

      {log.length > 0 && (
        <div className="bg-slate-950 text-green-400 rounded-md p-3 text-xs font-mono space-y-0.5 max-h-32 overflow-y-auto">
          {log.map((l, i) => (
            <div key={i}>&gt; {l}</div>
          ))}
        </div>
      )}

      <div className="text-xs text-muted-foreground flex flex-wrap gap-3">
        <span><span className="inline-block w-3 h-3 rounded-sm bg-green-500 mr-1 align-middle"></span>블록 포함 예정</span>
        <span><span className="inline-block w-3 h-3 rounded-sm bg-orange-500 mr-1 align-middle"></span>탈락 (수수료 부족)</span>
        <span className="ml-auto">블록 용량: {blockCapacity} vB — 채굴자는 수수료율 높은 순서로 선택</span>
      </div>
    </div>
  );
}

// ─── 2. Fee Estimator ─────────────────────────────────────────────────────────

const URGENCY_PRESETS = [
  { label: "다음 블록 (~10분)", feeRate: 120 },
  { label: "3블록 (~30분)", feeRate: 40 },
  { label: "6블록 (~1시간)", feeRate: 20 },
  { label: "하루 이내", feeRate: 5 },
];

function FeeEstimator() {
  const [txSize, setTxSize] = useState(140);
  const [urgencyIdx, setUrgencyIdx] = useState(0);
  const [customRate, setCustomRate] = useState(120);

  const effectiveRate = customRate;
  const totalSat = effectiveRate * txSize;
  const totalBtc = (totalSat / 1e8).toFixed(8);
  const totalKrw = Math.round((totalSat / 1e8) * 130_000_000); // ~1 BTC = 130M KRW

  const feeRates = URGENCY_PRESETS.map((u) => u.feeRate);
  const urgencyLabels = URGENCY_PRESETS.map((u) => u.label);

  return (
    <div className="not-prose my-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <ArrowUpDown className="h-5 w-5 text-orange-500" />
        <h3 className="font-bold text-lg">수수료 추정기</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">트랜잭션 크기 (vBytes)</label>
          <div className="flex items-center gap-3">
            <Slider
              min={100}
              max={2000}
              step={10}
              value={[txSize]}
              onValueChange={([v]) => setTxSize(v)}
              className="flex-1"
            />
            <span className="text-sm font-mono w-16 text-right">{txSize} vB</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            일반 P2WPKH: ~140 vB / 배치: ~250 vB / 레거시: ~250 vB
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">수수료율 (sat/vB)</label>
          <div className="flex items-center gap-3">
            <Slider
              min={1}
              max={500}
              step={1}
              value={[customRate]}
              onValueChange={([v]) => {
                setCustomRate(v);
                const closest = URGENCY_PRESETS.reduce((best, u, i) =>
                  Math.abs(u.feeRate - v) < Math.abs(URGENCY_PRESETS[best].feeRate - v) ? i : best, 0
                );
                setUrgencyIdx(closest);
              }}
              className="flex-1"
            />
            <span className="text-sm font-mono w-16 text-right">{customRate} s/vB</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {URGENCY_PRESETS.map((u, i) => (
          <Button
            key={i}
            size="sm"
            variant={urgencyIdx === i ? "default" : "outline"}
            onClick={() => { setUrgencyIdx(i); setCustomRate(u.feeRate); }}
            className="text-xs"
          >
            {u.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <Card className="p-3 border-orange-200 dark:border-orange-800">
          <div className="text-xl font-bold text-orange-500">{totalSat.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">satoshi</div>
        </Card>
        <Card className="p-3">
          <div className="text-xl font-bold">{totalBtc}</div>
          <div className="text-xs text-muted-foreground">BTC</div>
        </Card>
        <Card className="p-3">
          <div className="text-xl font-bold text-emerald-500">₩{totalKrw.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">KRW (BTC ≈ ₩1.3억 기준, 참고용)</div>
        </Card>
      </div>

      <Plot
        data={[
          {
            type: "bar",
            x: urgencyLabels,
            y: feeRates,
            marker: {
              color: urgencyLabels.map((_, i) => i === urgencyIdx ? "#f97316" : "#94a3b8"),
            },
            hovertemplate: "%{x}<br>%{y} sat/vB<extra></extra>",
          },
        ]}
        layout={{
          height: 200,
          margin: { t: 30, b: 70, l: 60, r: 10 },
          title: { text: "긴급도별 기준 수수료율" },
          yaxis: { title: { text: "sat/vB" } },
          xaxis: { tickangle: -15 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          font: { size: 11 },
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: "100%" }}
      />
    </div>
  );
}

// ─── 3. Network Propagation Simulator ────────────────────────────────────────

interface NodeState {
  id: number;
  x: number;
  y: number;
  received: boolean;
  round: number;
}

function buildGraph(n: number, connectivity: number): number[][] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.random() < connectivity) {
        adj[i].push(j);
        adj[j].push(i);
      }
    }
  }
  // BFS connectivity check — ensure all nodes are reachable from node 0
  const visited = new Set<number>();
  const queue = [0];
  visited.add(0);
  while (queue.length > 0) {
    const cur = queue.shift()!;
    for (const nb of adj[cur]) {
      if (!visited.has(nb)) { visited.add(nb); queue.push(nb); }
    }
  }
  for (let i = 0; i < n; i++) {
    if (!visited.has(i)) {
      const target = [...visited][0];
      adj[i].push(target);
      adj[target].push(i);
      visited.add(i);
    }
  }
  return adj;
}

function NetworkSimulator() {
  const [nodeCount, setNodeCount] = useState(12);
  const [connectivity, setConnectivity] = useState(0.35);
  const [nodes, setNodes] = useState<NodeState[]>([]);
  const [adj, setAdj] = useState<number[][]>([]);
  const [round, setRound] = useState(0);
  const roundRef = useRef(0);
  const [stats, setStats] = useState({ total: 0, reached: 0, rounds: 0 });

  const initNetwork = useCallback(() => {
    const n = nodeCount;
    const newAdj = buildGraph(n, connectivity);
    const angle = (2 * Math.PI) / n;
    const newNodes: NodeState[] = Array.from({ length: n }, (_, i) => ({
      id: i,
      x: 0.5 + 0.4 * Math.cos(i * angle - Math.PI / 2),
      y: 0.5 + 0.4 * Math.sin(i * angle - Math.PI / 2),
      received: i === 0,
      round: i === 0 ? 0 : -1,
    }));
    setNodes(newNodes);
    setAdj(newAdj);
    roundRef.current = 0;
    setRound(0);
    setStats({ total: n, reached: 1, rounds: 0 });
  }, [nodeCount, connectivity]);

  const stepPropagation = () => {
    setNodes((prev) => {
      const next = prev.map((n) => ({ ...n }));
      let changed = false;
      prev.forEach((node) => {
        if (node.received) {
          adj[node.id].forEach((neighbor) => {
            if (!next[neighbor].received) {
              next[neighbor].received = true;
              next[neighbor].round = roundRef.current + 1;
              changed = true;
            }
          });
        }
      });
      if (changed) {
        const reached = next.filter((n) => n.received).length;
        roundRef.current = roundRef.current + 1;
        setRound(roundRef.current);
        setStats((s) => ({ ...s, reached, rounds: roundRef.current }));
      }
      return next;
    });
  };

  const propagateAll = () => {
    let currentNodes = nodes.map((n) => ({ ...n }));
    let currentRound = round;
    let changed = true;
    while (changed) {
      changed = false;
      const next = currentNodes.map((n) => ({ ...n }));
      currentNodes.forEach((node) => {
        if (node.received) {
          adj[node.id].forEach((neighbor) => {
            if (!next[neighbor].received) {
              next[neighbor].received = true;
              next[neighbor].round = currentRound + 1;
              changed = true;
            }
          });
        }
      });
      if (changed) {
        currentNodes = next;
        currentRound++;
      }
    }
    const reached = currentNodes.filter((n) => n.received).length;
    setNodes(currentNodes);
    setRound(currentRound);
    setStats({ total: nodeCount, reached, rounds: currentRound });
  };

  // Build Plotly traces
  const edgeX: (number | null)[] = [];
  const edgeY: (number | null)[] = [];
  adj.forEach((neighbors, i) => {
    if (nodes[i]) {
      neighbors.forEach((j) => {
        if (j > i && nodes[j]) {
          edgeX.push(nodes[i].x, nodes[j].x, null);
          edgeY.push(nodes[i].y, nodes[j].y, null);
        }
      });
    }
  });

  const nodeColors = nodes.map((n) =>
    n.received ? (n.round === 0 ? "#f97316" : "#3b82f6") : "#94a3b8"
  );

  return (
    <div className="not-prose my-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Network className="h-5 w-5 text-cyan-500" />
        <h3 className="font-bold text-lg">블록 전파 시뮬레이터</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">노드 수: {nodeCount}</label>
          <Slider min={6} max={24} step={1} value={[nodeCount]} onValueChange={([v]) => setNodeCount(v)} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">연결성: {Math.round(connectivity * 100)}%</label>
          <Slider min={0.1} max={0.9} step={0.05} value={[connectivity]} onValueChange={([v]) => setConnectivity(v)} />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button size="sm" onClick={initNetwork} className="gap-1">
          <RefreshCw className="h-4 w-4" />
          네트워크 생성
        </Button>
        {nodes.length > 0 && (
          <>
            <Button size="sm" variant="outline" onClick={stepPropagation} className="gap-1">
              <Clock className="h-4 w-4" />
              1 라운드 전파
            </Button>
            <Button size="sm" variant="outline" onClick={propagateAll} className="gap-1">
              <Zap className="h-4 w-4" />
              전체 전파
            </Button>
          </>
        )}
      </div>

      {nodes.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-3 text-center">
            <Card className="p-3">
              <div className="text-xl font-bold text-blue-500">{stats.reached}</div>
              <div className="text-xs text-muted-foreground">블록 수신</div>
            </Card>
            <Card className="p-3">
              <div className="text-xl font-bold text-slate-400">{stats.total - stats.reached}</div>
              <div className="text-xs text-muted-foreground">미수신</div>
            </Card>
            <Card className="p-3">
              <div className="text-xl font-bold text-orange-500">{stats.rounds}</div>
              <div className="text-xs text-muted-foreground">전파 라운드</div>
            </Card>
          </div>

          <Plot
            data={[
              {
                type: "scatter",
                mode: "lines" as const,
                x: edgeX,
                y: edgeY,
                line: { color: "#e2e8f0", width: 1 },
                hoverinfo: "skip" as const,
              },
              {
                type: "scatter",
                mode: "text+markers" as const,
                x: nodes.map((n) => n.x),
                y: nodes.map((n) => n.y),
                text: nodes.map((n) => String(n.id + 1)),
                textposition: "middle center",
                textfont: { color: "#fff", size: 10 },
                marker: {
                  size: 28,
                  color: nodeColors,
                  line: { color: "#fff", width: 1.5 },
                },
                hovertemplate: nodes.map(
                  (n) =>
                    `노드 ${n.id + 1}<br>${n.received ? `라운드 ${n.round}에 수신` : "미수신"}<extra></extra>`
                ),
              },
            ]}
            layout={{
              height: 300,
              margin: { t: 20, b: 20, l: 20, r: 20 },
              xaxis: { visible: false, range: [0, 1] },
              yaxis: { visible: false, range: [0, 1], scaleanchor: "x" },
              showlegend: false,
              paper_bgcolor: "transparent",
              plot_bgcolor: "transparent",
            }}
            config={{ displayModeBar: false, responsive: true }}
            style={{ width: "100%" }}
          />
          <div className="text-xs text-muted-foreground flex gap-4">
            <span><span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-1"></span>최초 발견 노드</span>
            <span><span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span>블록 수신</span>
            <span><span className="inline-block w-3 h-3 rounded-full bg-slate-400 mr-1"></span>미수신</span>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Quiz ──────────────────────────────────────────────────────────────────────

const quizQuestions = [
  {
    question: "비트코인 풀노드(Full Node)의 핵심 역할은 무엇인가?",
    options: [
      "해시 파워를 제공하여 블록을 채굴하고 코인베이스 보상을 수령한다",
      "라이트닝 채널을 개설하여 오프체인 소액결제를 중계하고 수수료를 받는다",
      "중앙 서버에 접속하여 블록체인 데이터를 조회하고 잔액을 확인한다",
      "모든 트랜잭션과 블록을 독립적으로 검증하고 합의 규칙을 집행한다",
    ],
    answer: 3,
    explanation:
      "'Don't trust, verify.' — 풀노드는 외부 권위에 의존하지 않고 모든 블록과 트랜잭션을 스스로 검증합니다. 이것이 비트코인 탈중앙화의 핵심입니다.",
  },
  {
    question: "멤풀(Mempool)이란 무엇인가?",
    options: [
      "아직 블록에 포함되지 않은 미확인 트랜잭션들의 대기 공간",
      "블록체인에 영구 기록된 확정 트랜잭션의 인덱스 데이터베이스",
      "ASIC 채굴 장치가 해시 연산을 수행하는 전용 메모리 버퍼",
      "피어 노드의 IP 주소와 연결 상태를 관리하는 네트워크 테이블",
    ],
    answer: 0,
    explanation:
      "멤풀은 메모리 풀(Memory Pool)의 줄임말로, 브로드캐스트되었지만 아직 블록에 포함되지 않은 트랜잭션들이 임시 대기하는 공간입니다. 각 노드마다 자체 멤풀을 유지합니다.",
  },
  {
    question: "비트코인 수수료 시장에서 채굴자는 어떤 기준으로 트랜잭션을 선택하는가?",
    options: [
      "트랜잭션이 멤풀에 도착한 순서(선착순)",
      "sat/vByte 기준 수수료율이 높은 순서",
      "트랜잭션 금액이 큰 순서",
      "발신자의 지갑 잔액이 많은 순서",
    ],
    answer: 1,
    explanation:
      "채굴자는 한정된 블록 공간(~4MB weight)에서 수익을 극대화하기 위해 sat/vByte(가중 바이트당 사토시) 기준 수수료율이 높은 트랜잭션을 우선 선택합니다.",
  },
  {
    question: "RBF(Replace-By-Fee)란 무엇인가?",
    options: [
      "블록에 이미 확정된 트랜잭션을 채굴자 합의로 취소하고 환불하는 기능",
      "여러 개의 소액 UTXO를 단일 출력으로 통합하여 수수료를 절감하는 기능",
      "더 높은 수수료를 붙인 새 트랜잭션으로 멤풀의 미확인 트랜잭션을 교체하는 기능",
      "라이트닝 채널에서 최신 커밋먼트 트랜잭션으로 이전 상태를 무효화하는 기능",
    ],
    answer: 2,
    explanation:
      "RBF(Replace-By-Fee)는 수수료가 낮아 트랜잭션이 지연될 때, 동일한 입력(UTXO)을 사용하되 더 높은 수수료를 설정한 새 트랜잭션을 브로드캐스트하여 기존 트랜잭션을 교체하는 메커니즘입니다.",
  },
  {
    question: "비트코인 블록 크기 전쟁(2015-2017)에서 무엇이 결정되었는가?",
    options: [
      "블록 크기를 8MB로 영구 확장하는 하드포크에 전체 커뮤니티가 합의했다",
      "채굴 해시파워 과반수를 확보한 채굴자들이 프로토콜 변경의 최종 결정권을 가짐이 확인되었다",
      "비트코인 재단이 Core 개발팀을 감독하며 프로토콜 변경 방향을 통제하기로 결정했다",
      "SegWit(Segregated Witness) 소프트포크로 효율성을 높이고 풀노드의 중요성이 재확인되었다",
    ],
    answer: 3,
    explanation:
      "블록 크기 전쟁은 SegWit 소프트포크 활성화와 Bitcoin Cash 분리로 마무리되었습니다. 가장 중요한 교훈은 채굴자나 기업이 아닌 경제적 노드(풀노드를 운영하는 사용자)가 프로토콜 변경의 최종 거부권을 가진다는 것이었습니다.",
  },
  {
    question: "Compact Blocks의 목적은 무엇인가?",
    options: [
      "이미 멤풀에 알고 있는 트랜잭션은 ID만 전송하여 블록 전파 대역폭과 시간을 줄인다",
      "블록 데이터를 zlib으로 압축하여 디스크 저장 공간과 대역폭을 동시에 절약한다",
      "2016 블록마다 네트워크 해시파워를 측정하여 채굴 난이도를 자동으로 재조정한다",
      "노드 간 P2P 통신에 TLS 암호화를 적용하여 도청과 중간자 공격을 방지한다",
    ],
    answer: 0,
    explanation:
      "Compact Blocks(BIP 152)는 노드가 이미 멤풀에 보유한 트랜잭션은 해시(short ID)만 전송하여 새 블록의 전파에 필요한 데이터량을 대폭 줄입니다. 이로써 블록 전파 지연과 고아 블록(stale block) 발생이 감소합니다.",
  },
  {
    question: "비트코인 네트워크에서 노드 수가 많을수록 좋은 이유는?",
    options: [
      "노드가 많아질수록 네트워크 총 해시파워가 증가하여 채굴 블록 생성 속도가 빨라진다",
      "더 많은 독립적 검증자가 합의 규칙을 집행하므로 단일 기관의 프로토콜 변경이 어려워진다",
      "노드가 많아질수록 멤풀 경쟁이 줄어들어 평균 거래 수수료가 자동으로 낮아진다",
      "노드가 많아질수록 블록 전파 경로가 최적화되어 10분 블록 생성 주기가 단축된다",
    ],
    answer: 1,
    explanation:
      "풀노드를 운영하는 주체가 많고 다양할수록, 어떤 정부·기업·채굴 풀도 비트코인 프로토콜을 일방적으로 변경하기 어려워집니다. 탈중앙화의 실질적 의미는 노드 운영자들의 경제적 거부권에 있습니다.",
  },
  {
    question: "트랜잭션 수수료를 sat/vByte로 표현하는 이유는?",
    options: [
      "비트코인 가격이 달러로 표시되어 BTC 단위 계산이 불편하므로 정수인 sat 단위가 표준이 되었기 때문이다",
      "각국 세무 당국이 sat/vByte 기준으로 채굴 수익을 신고하도록 규정하고 있기 때문이다",
      "블록 공간이 가중 바이트(vByte) 단위로 측정되므로, 면적당 수수료율로 공정하게 비교하기 위해서이다",
      "라이트닝 네트워크의 msat(밀리사토시) 수수료 체계와 단위를 통일하여 호환성을 높이기 위해서이다",
    ],
    answer: 2,
    explanation:
      "SegWit 이후 블록 공간은 가중 단위(weight units = vByte × 4)로 측정됩니다. sat/vByte(사토시/가중 바이트)는 트랜잭션 크기에 무관하게 채굴자가 받는 수익률을 공정하게 비교하는 단위입니다.",
  },
];

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function Ch07NetworkNodes() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      {/* Section 1: Full Node */}
      <h2>1. 풀노드의 역할: Don&apos;t Trust, Verify</h2>

      <p>
        비트코인 네트워크는 수천 개의 <strong>풀노드(Full Node)</strong>로 이루어져 있습니다.
        풀노드는 2009년 최초 블록(제네시스 블록)부터 현재까지의 모든 거래 내역을 다운로드하고
        검증합니다. 중앙 서버에 의존하지 않습니다.
      </p>

      <InfoBox type="definition" title="풀노드(Full Node)란">
        비트코인 블록체인 전체를 독립적으로 검증하는 소프트웨어 노드. 누구나 풀노드를 실행할 수
        있으며, 현재 전 세계에 ~15,000개 이상의 공개 풀노드가 운영 중입니다. 풀노드 소프트웨어는
        여러 독립적 구현체가 존재합니다 — <strong>Bitcoin Core</strong>(레퍼런스 구현, 가장 널리 사용),
        <strong> Bitcoin Knots</strong>(Luke Dashjr 포크, 강화된 정책 필터링 옵션 제공),
        <strong> btcd</strong>(Go 언어 구현), <strong>libbitcoin</strong> 등이 있습니다.
        어떤 구현체를 사용하든 동일한 비트코인 프로토콜을 따르는 한 같은 네트워크에 참여합니다.
      </InfoBox>

      <p>
        풀노드는 다음을 독립적으로 검증합니다:
      </p>
      <ul>
        <li>모든 트랜잭션 서명의 유효성 (공개키 암호학)</li>
        <li>UTXO 소비 규칙 — 이미 사용된 UTXO는 다시 사용 불가</li>
        <li>블록 난이도 목표 충족 여부 (작업증명)</li>
        <li>코인베이스 보상 금액 (반감기 적용)</li>
        <li>합의 규칙 전체 (BIP 준수)</li>
      </ul>

      <InfoBox type="tip" title="'Don't Trust, Verify'">
        은행 계좌 잔액은 은행의 장부를 신뢰해야 합니다. 비트코인 풀노드는 아무도 신뢰하지 않고
        모든 것을 스스로 확인합니다. 이것이 비트코인이 &quot;신뢰가 필요 없는(trustless)&quot; 시스템인 이유입니다.
      </InfoBox>

      {/* Section 2: Block Propagation */}
      <h2>2. 블록 전파</h2>

      <p>
        채굴자가 새 블록을 발견하면, 해당 블록은 피어-투-피어(P2P) 방식으로 전체 네트워크에
        퍼집니다. 이 과정은 수 초 이내에 전 세계 노드 대부분에 도달합니다.
      </p>

      <p>
        전파 효율을 높이는 핵심 기술이 <strong>Compact Blocks(BIP 152)</strong>입니다.
        노드가 이미 멤풀에 해당 트랜잭션을 갖고 있다면, 블록에는 트랜잭션 전체 대신
        짧은 ID(short transaction ID)만 포함하면 됩니다. 일반 블록 전파 대비 대역폭을
        평균 80–90% 절감합니다 (이상적 조건에서 최대 98%).
      </p>

      <div className="not-prose my-4">
        <KatexBlock
          math={"\\text{Compact Block Size} \\approx 80 \\text{ (header)} + n_{\\text{new}} \\cdot 250 \\text{ B} + n_{\\text{known}} \\cdot 6 \\text{ B}"}
          display={true}
        />
        <p className="text-sm text-muted-foreground text-center mt-1">
          {/* n_new: 새 트랜잭션, n_known: 이미 아는 트랜잭션 */}
          새 트랜잭션은 전체 포함, 기존 멤풀 트랜잭션은 6바이트 ID만 전송
        </p>
      </div>

      <InfoBox type="info" title="고아 블록(Stale Block)">
        두 채굴자가 거의 동시에 서로 다른 유효한 블록을 발견하면, 네트워크가 어느 쪽을 수용할지
        일시적으로 분기됩니다. Compact Blocks처럼 전파가 빠를수록 고아 블록 발생이 줄고 채굴 낭비가
        감소합니다.
      </InfoBox>

      <NetworkSimulator />

      {/* Section 3: Mempool */}
      <h2>3. 멤풀(Mempool): 트랜잭션의 대기실</h2>

      <p>
        트랜잭션을 브로드캐스트하면 즉시 블록에 포함되지 않습니다. 먼저 각 노드의
        <strong> 멤풀(Memory Pool)</strong>에 저장되어 채굴자의 선택을 기다립니다.
        멤풀은 중앙 서버가 아닌 각 노드가 독립적으로 유지하므로, 노드마다 약간씩 다를 수 있습니다.
      </p>

      <ul>
        <li>블록 공간은 약 10분마다 4,000,000 weight units (실질 약 1.5–2MB)만 공급됩니다</li>
        <li>멤풀이 꽉 차면 낮은 수수료 트랜잭션부터 제거됩니다</li>
        <li>수수료가 낮으면 수 시간~수 일이 걸릴 수 있습니다</li>
        <li>RBF(Replace-By-Fee)로 수수료를 올려 우선순위를 높일 수 있습니다</li>
      </ul>

      <MempoolSimulator />

      {/* Section 4: Fee Market */}
      <h2>4. 수수료 시장: 블록 공간의 경매</h2>

      <p>
        비트코인 블록 공간은 희소합니다. 약 10분마다 하나의 블록이 생성되고, 블록 크기는
        물리적으로 제한되어 있습니다. 이 제약이 <strong>수수료 시장</strong>을 형성합니다.
        사용자들은 자신의 트랜잭션이 빨리 포함되기를 원하면 더 높은 수수료를 제시합니다.
      </p>

      <div className="not-prose my-4">
        <KatexBlock
          math={"\\text{Total Fee} = \\text{Fee Rate (sat/vB)} \\times \\text{Tx Size (vB)}"}
          display={true}
        />
      </div>

      <InfoBox type="warning" title="수수료는 채굴자 수입의 미래">
        4장에서 살펴본 반감기로 블록 보조금이 점차 줄어들기 때문에, 장기적으로 채굴자 수입은
        수수료에 의존하게 됩니다. 건전한 수수료 시장이 형성되어야 비트코인 보안 예산이 유지되며,
        이 주제는 10장 &quot;보안 모델 장기 전망&quot;에서 더 자세히 다룹니다.
      </InfoBox>

      <FeeEstimator />

      {/* Section 5: Decentralization */}
      <h2>5. 탈중앙화의 실제 의미</h2>

      <p>
        &quot;탈중앙화&quot;는 마케팅 용어가 아닙니다. 비트코인에서 탈중앙화는 구체적으로 측정 가능합니다.
        핵심 지표는 <strong>경제적 풀노드의 수와 다양성</strong>입니다.
      </p>

      <h3>프로토콜이 중요하다, 구현체가 아니라</h3>

      <p>
        비트코인은 특정 소프트웨어가 아닌 <strong>프로토콜(규칙의 집합)</strong>입니다.
        Bitcoin Core는 가장 널리 쓰이는 <em>레퍼런스 구현체</em>이지만, 유일한 선택지는 아닙니다.
        현재 여러 독립적인 풀노드 구현체들이 동일한 비트코인 프로토콜을 구현하고 있습니다:
      </p>

      <ul>
        <li>
          <strong>Bitcoin Core</strong> — C++ 기반의 레퍼런스 구현. 네트워크의 약 95%가 사용.
          Satoshi Nakamoto의 원래 코드에서 발전.
        </li>
        <li>
          <strong>Bitcoin Knots</strong> — Bitcoin Core의 포크(Luke Dashjr 개발).
          Core보다 보수적인 멤풀 정책, 스팸 필터링 강화 등 추가 기능 제공.
          동일한 합의 규칙을 따르므로 같은 체인에 참여.
        </li>
        <li>
          <strong>btcd</strong> — Go 언어로 작성된 완전한 비트코인 노드 구현.
          다양한 언어 생태계에서 비트코인 통합을 가능하게 함.
        </li>
        <li>
          <strong>libbitcoin</strong> — C++ 라이브러리 기반의 독립 구현체. 모듈식 설계.
        </li>
      </ul>

      <InfoBox type="info" title="다양한 구현체가 왜 건강한가?">
        여러 독립 팀이 같은 프로토콜을 서로 다른 코드로 구현한다는 것은 단일 코드베이스의 버그나
        취약점이 네트워크 전체를 위협하지 않음을 의미합니다. 또한 Bitcoin Core 개발팀이 프로토콜의
        &quot;게이트키퍼&quot;가 될 수 없다는 것을 보장합니다 — 사용자들은 언제든지 다른 구현체로
        전환할 수 있기 때문입니다. <strong>중요한 것은 소프트웨어가 아니라 합의 규칙(프로토콜)입니다.</strong>
      </InfoBox>

      <InfoBox type="warning" title="블록 크기 전쟁의 교훈 (2015–2017)">
        대형 기업들과 일부 채굴 풀은 블록 크기를 8MB로 늘려 처리량을 높이길 원했습니다.
        그러나 풀노드를 운영하는 수천 명의 사용자들이 이를 거부했습니다. 결국 Bitcoin Cash가 분리되었고,
        비트코인은 SegWit 소프트포크를 채택했습니다.
        <br /><br />
        <strong>핵심 교훈:</strong> 채굴자도, 기업도, 개발자도 — Bitcoin Core 팀조차도 — 프로토콜 변경을
        강제할 수 없습니다. 최종 결정권은 경제적 노드(풀노드를 운영하는 사용자)에게 있습니다.
        사용자들이 변경을 거부하면, 그 변경은 다른 코인(포크)이 될 뿐입니다.
      </InfoBox>

      <p>
        왜 블록 크기를 무한정 늘리지 않을까요? 블록이 클수록:
      </p>
      <ul>
        <li>풀노드 운영 비용(스토리지, 대역폭)이 증가합니다</li>
        <li>개인이 풀노드를 운영하기 어려워집니다</li>
        <li>노드 수가 줄면 소수 기관이 네트워크를 통제할 가능성이 높아집니다</li>
        <li>검열 저항성과 불변성이 약해집니다</li>
      </ul>

      <InfoBox type="tip" title="지금 풀노드를 실행해보세요">
        Raspberry Pi 4 + 1TB SSD로 약 10–15만원에 풀노드를 운영할 수 있습니다.
        Bitcoin Core, Bitcoin Knots 중 본인의 철학에 맞는 구현체를 선택하세요.
        Umbrel, Start9, RaspiBlitz 등 사용자 친화적 솔루션도 있습니다.
        자신의 풀노드로 자신의 비트코인을 검증하는 것이 진정한 자기주권입니다.
      </InfoBox>

      <QuizSection questions={quizQuestions} />
    </article>
  );
}
