"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { KatexBlock } from "@/components/content/KatexBlock";
import { InfoBox } from "@/components/content/InfoBox";
import { QuizSection } from "@/components/quiz/QuizSection";
import { Slider } from "@/components/ui/slider";
import { PlotLoading } from "@/components/content/DynamicPlot";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, loading: PlotLoading });

// ─────────────────────────────────────────────
// Section 1: 오스트리안 경제학과 비트코인
// ─────────────────────────────────────────────
function AustrianSection() {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">1. 오스트리안 경제학과 비트코인</h2>
      <p className="mb-3">
        루트비히 폰 미제스(Ludwig von Mises)와 프리드리히 하이에크(Friedrich Hayek)가
        이끈 오스트리안 경제학파는 수십 년 전 이미 중앙은행의 통화 조작이 경기 사이클과
        자원 배분 왜곡을 낳는다고 경고했습니다. 하이에크는 1976년 저서
        <em> The Denationalization of Money</em>에서 "화폐 발행 독점을 국가에서 빼앗아
        시장 경쟁에 맡겨야 한다"고 주장했습니다.
      </p>
      <p className="mb-3">
        사토시 나카모토가 2009년 비트코인을 출시하면서 하이에크의 사상은 처음으로
        현실에서 작동하는 코드로 구현되었습니다. 발행량이 알고리즘으로 고정되어
        어떤 중앙 기관도 자의적으로 공급을 늘릴 수 없습니다.
      </p>

      <InfoBox type="definition" title="미제스의 회귀 정리 (Regression Theorem)">
        화폐는 반드시 이전 세대에 교환 매체로 사용된 상품에서 기원해야 한다.
        비트코인 비판론자들은 이를 들어 BTC는 화폐가 될 수 없다고 주장하지만,
        비트코이너들은 BTC가 초기에 cypherpunk 커뮤니티 내 결제 수단으로 실제
        거래되었다는 사실이 이 요건을 충족한다고 반론합니다.
      </InfoBox>

      <div className="my-4">
        <p className="text-sm text-muted-foreground mb-1">오스트리안 화폐 경쟁 이론 핵심 등식</p>
        <KatexBlock
          math={"\\text{Sound Money} = \\text{Fixed Supply} + \\text{No Central Control} + \\text{Market Adoption}"}
          display={true}
        />
        <p className="text-xs text-muted-foreground mt-1">
          건전화폐 = 고정 공급량 + 중앙 통제 없음 + 시장 자발적 채택
        </p>
      </div>

      <p className="mb-3">
        오스트리안 경제학의 핵심 통찰 세 가지가 비트코인 설계에 그대로 반영되어 있습니다:
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li>
          <strong>계획 불가능한 경제 (Calculation Problem)</strong>: 중앙 기관은 올바른
          이자율과 통화량을 알 수 없습니다. 비트코인은 알고리즘이 발행을 결정합니다.
        </li>
        <li>
          <strong>자발적 질서 (Spontaneous Order)</strong>: 가격은 수백만 참여자의
          분산된 지식을 집약합니다. 비트코인 네트워크는 어떤 CEO도 없이 자율 운영됩니다.
        </li>
        <li>
          <strong>마지널리즘 (Marginalism)</strong>: 가치는 주관적입니다. 21만 사토시나
          21 BTC나 그 주관적 효용에 따라 가치가 결정됩니다.
        </li>
      </ul>

      <InfoBox type="tip" title="하이에크의 예언">
        "나는 이제 더 이상 건전화폐를 되찾을 방법이 어디에도 없다고 생각한다. 유일한
        희망은 정부가 막을 수 없는 무언가를 우리가 시장에 도입하는 것이다."
        — F.A. Hayek, 1984
        <br /><br />
        40년 뒤, 비트코인이 그 답이 되었습니다.
      </InfoBox>
    </section>
  );
}

// ─────────────────────────────────────────────
// Section 2: 시간선호 (Time Preference)
// ─────────────────────────────────────────────
function TimePreferenceSection() {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">2. 시간선호 (Time Preference)</h2>
      <p className="mb-3">
        <strong>시간선호(time preference)</strong>란 미래의 재화보다 현재의 재화를
        얼마나 더 선호하는지를 나타내는 개념입니다. 낮은 시간선호를 가진 사람은
        현재 소비를 희생하고 미래를 위해 저축·투자합니다. 문명의 발전은 낮은
        시간선호에서 비롯됩니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 p-4">
          <h3 className="font-bold text-red-700 dark:text-red-400 mb-2">높은 시간선호</h3>
          <ul className="text-sm space-y-1 text-red-800 dark:text-red-200">
            <li>• 현재 소비 극대화</li>
            <li>• 저축 없음, 부채 증가</li>
            <li>• 단기 쾌락 추구</li>
            <li>• 충동 구매, 과소비</li>
            <li>• 인플레이션이 강제하는 행동</li>
          </ul>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 p-4">
          <h3 className="font-bold text-emerald-700 dark:text-emerald-400 mb-2">낮은 시간선호</h3>
          <ul className="text-sm space-y-1 text-emerald-800 dark:text-emerald-200">
            <li>• 미래를 위한 저축·투자</li>
            <li>• 장기 계획 수립</li>
            <li>• 기술·교육에 투자</li>
            <li>• 문명 건설의 원동력</li>
            <li>• 건전화폐가 장려하는 행동</li>
          </ul>
        </div>
      </div>

      <p className="mb-3">
        법정화폐 시스템은 구조적으로 높은 시간선호를 강제합니다. 은행 계좌에 돈을
        보관할수록 인플레이션에 의해 구매력이 감소하기 때문에, 사람들은 소비를
        앞당기고 부채를 늘리도록 유도됩니다. 이것은 버그가 아니라 중앙은행
        통화정책의 의도된 설계입니다("소비 진작").
      </p>

      <div className="my-4">
        <p className="text-sm text-muted-foreground mb-1">이자율과 시간선호의 관계</p>
        <KatexBlock
          math={"r_{\\text{natural}} = \\frac{\\text{Time Preference}}{1 - \\text{Time Preference}}"}
          display={true}
        />
        <p className="text-xs text-muted-foreground mt-1">
          자연 이자율은 사회 전체의 시간선호를 반영합니다. 중앙은행의 인위적 금리 인하는 이 신호를 왜곡합니다.
        </p>
      </div>

      <InfoBox type="info" title="비트코인과 시간선호">
        비트코인을 장기 보유(HODL)하는 행위는 낮은 시간선호의 극단적 표현입니다.
        비트코이너들은 단기 가격 변동에 흔들리지 않고 4년, 10년, 20년 단위로
        생각합니다. 이는 인플레이션 자산 보유자와 근본적으로 다른 멘탈 모델입니다.
      </InfoBox>
    </section>
  );
}

// ─────────────────────────────────────────────
// Section 3: 디플레이션 화폐
// ─────────────────────────────────────────────
function DeflationSection() {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">3. 디플레이션 화폐 — 오해와 진실</h2>
      <p className="mb-3">
        주류 경제학자들은 "디플레이션이 오면 사람들이 소비를 미루기 때문에 경제가
        붕괴한다"고 주장합니다. 그러나 이는 역사적 증거와 맞지 않습니다.
      </p>

      <InfoBox type="warning" title="케인지안 반론: '아무도 소비 안 한다'">
        "내일 더 싸질 텐데 왜 오늘 사겠어요?"라는 논리입니다. 중앙은행은 이를 근거로
        "적당한 인플레이션"을 정당화합니다.
      </InfoBox>

      <p className="mb-3 mt-4">
        그러나 현실을 보면 전혀 다릅니다:
      </p>

      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border px-3 py-2 text-left">제품</th>
              <th className="border px-3 py-2 text-right">1990년대 가격</th>
              <th className="border px-3 py-2 text-right">2024년 가격</th>
              <th className="border px-3 py-2 text-right">변화율</th>
              <th className="border px-3 py-2 text-left">소비량</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-3 py-2">55인치 TV</td>
              <td className="border px-3 py-2 text-right">$3,000+</td>
              <td className="border px-3 py-2 text-right">$400</td>
              <td className="border px-3 py-2 text-right text-emerald-600">-87%</td>
              <td className="border px-3 py-2">폭발적 증가</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="border px-3 py-2">개인 컴퓨터</td>
              <td className="border px-3 py-2 text-right">$4,000</td>
              <td className="border px-3 py-2 text-right">$800</td>
              <td className="border px-3 py-2 text-right text-emerald-600">-80%</td>
              <td className="border px-3 py-2">폭발적 증가</td>
            </tr>
            <tr>
              <td className="border px-3 py-2">스마트폰</td>
              <td className="border px-3 py-2 text-right">$600 (2007)</td>
              <td className="border px-3 py-2 text-right">실질 더 저렴</td>
              <td className="border px-3 py-2 text-right text-emerald-600">성능↑가격↓</td>
              <td className="border px-3 py-2">80억 대 보급</td>
            </tr>
            <tr className="bg-muted/30">
              <td className="border px-3 py-2">저장 용량 (GB)</td>
              <td className="border px-3 py-2 text-right">$10/GB</td>
              <td className="border px-3 py-2 text-right">$0.02/GB</td>
              <td className="border px-3 py-2 text-right text-emerald-600">-99.8%</td>
              <td className="border px-3 py-2">폭발적 증가</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mb-3">
        기술 디플레이션 속에서도 소비는 계속 증가했습니다. 사람들이 TV를 "더 싸질
        때까지" 영원히 기다리지 않는 이유는 현재의 효용이 미래 절감액보다 크기
        때문입니다. 건전화폐 하의 "디플레이션"도 마찬가지입니다.
      </p>

      <InfoBox type="tip" title="비트코인 디플레이션의 본질">
        비트코인의 구매력 상승은 통화 공급 축소(나쁜 디플레이션)가 아니라
        경제 생산성 증가 + 고정 공급량(좋은 디플레이션)에서 비롯됩니다.
        금본위제 시대 19세기 미국은 꾸준한 디플레이션 속에서 역사상 가장
        빠른 산업 성장을 달성했습니다.
      </InfoBox>
    </section>
  );
}

// ─────────────────────────────────────────────
// Simulation 1: 시간선호 시뮬레이터
// ─────────────────────────────────────────────
function TimePrefSimulator() {
  const [savingsRate, setSavingsRate] = useState(20);
  const [fiatReturn, setFiatReturn] = useState(-3); // real return after inflation
  const [btcReturn, setBtcReturn] = useState(40);
  const [years, setYears] = useState(20);

  const startCapital = 100; // index = 100

  const fiatValues: number[] = [];
  const btcValues: number[] = [];
  const yearLabels: number[] = [];

  let fiatVal = startCapital;
  let btcVal = startCapital;
  for (let y = 0; y <= years; y++) {
    yearLabels.push(y);
    fiatValues.push(parseFloat(fiatVal.toFixed(2)));
    btcValues.push(parseFloat(btcVal.toFixed(2)));
    if (y < years) {
      const fiatContribution = fiatVal * (savingsRate / 100);
      fiatVal = (fiatVal + fiatContribution) * (1 + fiatReturn / 100);
      const btcContribution = btcVal * (savingsRate / 100);
      btcVal = (btcVal + btcContribution) * (1 + btcReturn / 100);
    }
  }

  return (
    <div className="my-8 not-prose rounded-xl border p-5 bg-card">
      <h3 className="text-lg font-bold mb-4">시뮬레이션 ①: 시간선호 & 저축 시뮬레이터</h3>
      <p className="text-sm text-muted-foreground mb-4">
        매년 소득의 일정 비율을 저축할 때, 법정화폐 자산과 BTC 자산의 실질 가치 변화를 비교합니다.
        초기 자산을 100으로 놓고 복리 성장을 시뮬레이션합니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">연간 저축률: {savingsRate}%</label>
            <Slider
              min={1} max={50} step={1}
              value={[savingsRate]}
              onValueChange={([v]) => setSavingsRate(v)}
              className="mt-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">
              법정화폐 실질 수익률: {fiatReturn}% / 년
              <span className="text-xs text-muted-foreground ml-1">(인플레이션 차감 후)</span>
            </label>
            <Slider
              min={-10} max={5} step={0.5}
              value={[fiatReturn]}
              onValueChange={([v]) => setFiatReturn(v)}
              className="mt-2"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">BTC 연 수익률 가정: {btcReturn}%</label>
            <Slider
              min={0} max={100} step={5}
              value={[btcReturn]}
              onValueChange={([v]) => setBtcReturn(v)}
              className="mt-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">시뮬레이션 기간: {years}년</label>
            <Slider
              min={5} max={40} step={1}
              value={[years]}
              onValueChange={([v]) => setYears(v)}
              className="mt-2"
            />
          </div>
        </div>
      </div>

      <Plot
        data={[
          {
            x: yearLabels,
            y: fiatValues,
            type: "scatter",
            mode: "lines" as const,
            name: "법정화폐 자산",
            line: { color: "#ef4444", width: 2.5 },
          },
          {
            x: yearLabels,
            y: btcValues,
            type: "scatter",
            mode: "lines" as const,
            name: "BTC 자산",
            line: { color: "#f97316", width: 2.5 },
          },
        ]}
        layout={{
          title: { text: `${years}년 후 자산 가치 비교 (초기값 = 100)` },
          xaxis: { title: { text: "경과 연도" } },
          yaxis: { title: { text: "자산 가치 (초기값 = 100)" }, type: "log" },
          height: 350,
          margin: { l: 60, r: 20, t: 50, b: 50 },
          legend: { orientation: "h", y: -0.2 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: "100%" }}
      />

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-3 text-center">
          <div className="text-xs text-muted-foreground">법정화폐 자산 ({years}년 후)</div>
          <div className="text-2xl font-bold text-red-600">{fiatValues[years]?.toFixed(1)}</div>
        </div>
        <div className="rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 p-3 text-center">
          <div className="text-xs text-muted-foreground">BTC 자산 ({years}년 후)</div>
          <div className="text-2xl font-bold text-orange-600">{btcValues[years]?.toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Section 4: 게임이론과 채택
// ─────────────────────────────────────────────
function GameTheorySection() {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">4. 게임이론과 비트코인 채택</h2>
      <p className="mb-3">
        비트코인 채택을 게임이론으로 분석하면, 국가와 기업이 BTC를 채택하는 것이
        장기적으로 <strong>내쉬 균형(Nash Equilibrium)</strong>임을 알 수 있습니다.
        내쉬 균형이란 모든 참여자가 상대방의 전략을 전제로 했을 때 자신의 전략을
        바꿀 유인이 없는 상태입니다.
      </p>

      <div className="my-4">
        <p className="text-sm text-muted-foreground mb-1">죄수의 딜레마 보상 구조</p>
        <KatexBlock
          math={"\\text{Payoff}(A, B) = \\begin{pmatrix} (R_A, R_B) & (S_A, T_B) \\\\ (T_A, S_B) & (P_A, P_B) \\end{pmatrix}"}
          display={true}
        />
        <p className="text-xs text-muted-foreground mt-1">
          R = 상호 채택 보상, T = 무임승차 보상, S = 착취당하는 보상, P = 상호 미채택 보상. T &gt; R &gt; P &gt; S일 때 죄수의 딜레마 성립.
        </p>
      </div>

      <p className="mb-3">
        비트코인의 경우, 한 국가가 BTC를 전략적 준비금으로 채택하면 다른 국가들에게
        채택하지 않는 비용이 급격히 증가합니다. 엘살바도르가 먼저 채택했고,
        2025년 미국이 전략적 비트코인 준비금(Strategic Bitcoin Reserve)을 발표하면서
        이 게임은 새로운 국면에 접어들었습니다.
      </p>

      <InfoBox type="info" title="국가 채택의 게임이론적 필연성">
        만약 미국이 BTC를 대규모로 매입한다면, 다른 주요 경제권의 비채택 비용은
        기하급수적으로 증가합니다. 이것이 비트코이너들이 "국가 채택은 필연"이라고
        주장하는 게임이론적 근거입니다.
      </InfoBox>
    </section>
  );
}

// ─────────────────────────────────────────────
// Simulation 2: 게임이론 시각화
// ─────────────────────────────────────────────
function GameTheorySimulator() {
  const [mutualAdopt, setMutualAdopt] = useState(10);   // R: both adopt
  const [defect, setDefect] = useState(15);              // T: one defects
  const [exploited, setExploited] = useState(-5);        // S: get exploited
  const [mutualReject, setMutualReject] = useState(0);  // P: both reject

  // Nash equilibrium detection: dominant strategy
  // If R >= S (mutualAdopt >= exploited), Adopt,Adopt is Nash Equilibrium (Coordination Game)
  // Otherwise: Prisoner's Dilemma → (Reject, Reject) or mixed equilibrium
  const nashAdopt = mutualAdopt >= exploited;

  const matrixData = [
    [mutualAdopt, exploited],   // A:채택 row: (both adopt)=R, (A alone adopts)=S
    [defect, mutualReject],     // A:미채택 row: (B alone adopts)=T, (both reject)=P
  ];

  const annotations: Plotly.Annotations[] = [];
  const rowLabels = ["국가 A: 채택", "국가 A: 미채택"];
  const colLabels = ["국가 B: 채택", "국가 B: 미채택"];

  rowLabels.forEach((_, ri) => {
    colLabels.forEach((_, ci) => {
      annotations.push({
        x: ci,
        y: ri,
        text: `${matrixData[ri][ci]}`,
        showarrow: false,
        font: { size: 20, color: "white" },
      } as Partial<Plotly.Annotations> as Plotly.Annotations);
    });
  });

  const nashAnnotation = {
    x: nashAdopt ? 0 : 1,
    y: nashAdopt ? 0 : 1,
    text: "★ Nash",
    showarrow: false,
    font: { size: 14, color: nashAdopt ? "#fbbf24" : "#ef4444" },
    yshift: -28,
  } as Partial<Plotly.Annotations> as Plotly.Annotations;

  annotations.push(nashAnnotation);

  return (
    <div className="my-8 not-prose rounded-xl border p-5 bg-card">
      <h3 className="text-lg font-bold mb-4">시뮬레이션 ②: 게임이론 보상 행렬</h3>
      <p className="text-sm text-muted-foreground mb-4">
        두 국가의 비트코인 채택/미채택 시나리오별 보상을 조절하세요.
        색이 진할수록 보상이 높습니다. ★는 내쉬 균형 위치입니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">상호 채택 보상 (R): {mutualAdopt}</label>
            <Slider min={-10} max={30} step={1} value={[mutualAdopt]}
              onValueChange={([v]) => setMutualAdopt(v)} className="mt-2" />
          </div>
          <div>
            <label className="text-sm font-medium">무임승차 보상 (T): {defect}</label>
            <Slider min={-10} max={30} step={1} value={[defect]}
              onValueChange={([v]) => setDefect(v)} className="mt-2" />
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">착취당하는 보상 (S): {exploited}</label>
            <Slider min={-20} max={10} step={1} value={[exploited]}
              onValueChange={([v]) => setExploited(v)} className="mt-2" />
          </div>
          <div>
            <label className="text-sm font-medium">상호 미채택 보상 (P): {mutualReject}</label>
            <Slider min={-10} max={20} step={1} value={[mutualReject]}
              onValueChange={([v]) => setMutualReject(v)} className="mt-2" />
          </div>
        </div>
      </div>

      <Plot
        data={[
          {
            z: matrixData,
            x: colLabels,
            y: rowLabels,
            type: "heatmap",
            colorscale: "Blues",
            showscale: true,
            colorbar: { title: { text: "보상" } },
          } as Plotly.Data,
        ]}
        layout={{
          title: { text: "비트코인 채택 게임: 보상 행렬" },
          xaxis: { title: { text: "국가 B의 전략" } },
          yaxis: { title: { text: "국가 A의 전략" } },
          annotations: annotations as Plotly.Layout["annotations"],
          height: 320,
          margin: { l: 120, r: 20, t: 50, b: 80 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: "100%" }}
      />

      <div className={`mt-3 rounded-lg p-3 text-sm font-medium text-center ${
        nashAdopt
          ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200"
          : "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 border border-red-200"
      }`}>
        {nashAdopt
          ? "내쉬 균형: (채택, 채택) — 상호 채택이 지배 전략입니다"
          : "현재 설정: 죄수의 딜레마 구조 — (미채택, 미채택) 또는 혼합 균형"}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Section 5: 채택 S-곡선
// ─────────────────────────────────────────────
function AdoptionCurveSection() {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">5. 기술 채택 S-곡선과 비트코인</h2>
      <p className="mb-3">
        모든 혁신적 기술은 로지스틱 함수 형태의 S자 채택 곡선을 따릅니다.
        초기에는 혁신가(Innovators)와 얼리어답터(Early Adopters)가 채택하고,
        이후 전기 다수(Early Majority) → 후기 다수(Late Majority) → 지각수용자
        (Laggards) 순서로 확산됩니다.
      </p>

      <div className="my-4">
        <p className="text-sm text-muted-foreground mb-1">로지스틱 성장 모델</p>
        <KatexBlock
          math={"P(t) = \\frac{K}{1 + e^{-r(t - t_0)}}"}
          display={true}
        />
        <p className="text-xs text-muted-foreground mt-1">
          P(t) = t시점 채택률, K = 최대 채택률, r = 성장 속도, t₀ = 변곡점 시점
        </p>
      </div>

      <InfoBox type="tip" title="비트코인은 지금 어디?">
        2024년 기준 비트코인 보유자는 전 세계 약 3억~5억 명으로 추정됩니다.
        인터넷이 현재 보급률에 도달하는 데 걸린 시간(약 30년)을 기준으로 하면,
        비트코인은 S-곡선의 초기~중반부(얼리어답터 단계)에 있다고 분석됩니다.
        인터넷보다 채택 속도가 빠르다는 분석도 있습니다.
      </InfoBox>
    </section>
  );
}

// ─────────────────────────────────────────────
// Simulation 3: S-곡선 채택 오버레이
// ─────────────────────────────────────────────
function AdoptionCurveSimulator() {
  const [btcRate, setBtcRate] = useState(0.45);
  const [btcMidpoint, setBtcMidpoint] = useState(2030);

  const logistic = (t: number, K: number, r: number, t0: number) =>
    (K / (1 + Math.exp(-r * (t - t0)))) * 100;

  const years = Array.from({ length: 61 }, (_, i) => 1990 + i); // 1990–2050

  const internetData = years.map((y) => logistic(y, 0.7, 0.35, 2002));
  const mobileData = years.map((y) => logistic(y, 0.85, 0.4, 2012));
  const btcData = years.map((y) => {
    if (y < 2009) return 0;
    return logistic(y, 0.6, btcRate, btcMidpoint);
  });

  return (
    <div className="my-8 not-prose rounded-xl border p-5 bg-card">
      <h3 className="text-lg font-bold mb-4">시뮬레이션 ③: 기술 채택 S-곡선 오버레이</h3>
      <p className="text-sm text-muted-foreground mb-4">
        인터넷·모바일과 비교한 비트코인 채택 S-곡선입니다.
        BTC의 성장 속도와 변곡점을 조절해 다양한 시나리오를 탐색하세요.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium">BTC 성장 속도 (r): {btcRate.toFixed(2)}</label>
          <Slider min={0.1} max={1.0} step={0.05} value={[btcRate]}
            onValueChange={([v]) => setBtcRate(v)} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">클수록 빠른 S-곡선 상승</p>
        </div>
        <div>
          <label className="text-sm font-medium">BTC 변곡점: {btcMidpoint}년</label>
          <Slider min={2025} max={2045} step={1} value={[btcMidpoint]}
            onValueChange={([v]) => setBtcMidpoint(v)} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">S-곡선 중간점(50% 채택) 시점</p>
        </div>
      </div>

      <Plot
        data={[
          {
            x: years, y: internetData,
            type: "scatter", mode: "lines" as const,
            name: "인터넷 (실제)",
            line: { color: "#3b82f6", width: 2, dash: "solid" },
          },
          {
            x: years, y: mobileData,
            type: "scatter", mode: "lines" as const,
            name: "모바일 (실제)",
            line: { color: "#10b981", width: 2, dash: "solid" },
          },
          {
            x: years.filter((y) => y >= 2009), y: btcData.filter((_, i) => years[i] >= 2009),
            type: "scatter", mode: "lines" as const,
            name: "비트코인 (시뮬레이션)",
            line: { color: "#f97316", width: 2.5, dash: "solid" },
          },
          {
            x: [2024, 2024], y: [0, 100],
            type: "scatter", mode: "lines" as const,
            name: "현재 (2024)",
            line: { color: "#6b7280", width: 1.5, dash: "dot" },
          },
        ]}
        layout={{
          title: { text: "기술 채택 S-곡선 비교 (로지스틱 모델)" },
          xaxis: { title: { text: "연도" }, range: [1990, 2050] },
          yaxis: { title: { text: "채택률 (%)" }, range: [0, 100] },
          height: 380,
          margin: { l: 60, r: 20, t: 50, b: 50 },
          legend: { orientation: "h", y: -0.2 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
        }}
        config={{ displayModeBar: false, responsive: true }}
        style={{ width: "100%" }}
      />

      <p className="text-xs text-muted-foreground mt-3 text-center">
        * 인터넷·모바일은 실제 데이터 기반 피팅, BTC는 시나리오 시뮬레이션입니다.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Quiz
// ─────────────────────────────────────────────
const quizQuestions = [
  {
    question: "하이에크가 '화폐의 비국가화'에서 주장한 핵심 논지는 무엇인가요?",
    options: [
      "중앙은행이 금본위제를 유지해야 한다",
      "화폐 발행 경쟁을 시장에 맡겨야 한다",
      "정부가 비트코인을 발행해야 한다",
      "인플레이션은 경제 성장에 필수적이다",
    ],
    answer: 1,
    explanation:
      "하이에크는 화폐 발행 독점을 국가에서 빼앗아 민간 경쟁에 맡기면 더 건전한 화폐가 등장한다고 주장했습니다. 비트코인은 이 주장의 현실화로 볼 수 있습니다.",
  },
  {
    question: "시간선호(Time Preference)가 낮은 사람의 행동 특성으로 옳지 않은 것은?",
    options: [
      "장기 투자와 저축을 우선한다",
      "현재 소비를 위해 부채를 늘린다",
      "교육과 기술 개발에 자원을 투입한다",
      "즉각적 보상보다 미래 보상을 선호한다",
    ],
    answer: 1,
    explanation:
      "부채를 늘려 현재 소비를 극대화하는 것은 높은 시간선호의 특성입니다. 낮은 시간선호는 현재 소비를 미루고 미래를 위해 저축·투자하는 태도입니다.",
  },
  {
    question: "법정화폐 시스템이 구조적으로 높은 시간선호를 유발하는 이유는?",
    options: [
      "이자율이 너무 높기 때문에",
      "인플레이션이 보유 화폐의 구매력을 감소시키기 때문에",
      "은행 계좌 수수료가 높기 때문에",
      "비트코인과의 경쟁 때문에",
    ],
    answer: 1,
    explanation:
      "인플레이션 환경에서는 화폐를 보유할수록 구매력이 감소하므로, 사람들은 소비를 앞당기고 저축을 줄이는 방향으로 행동하게 됩니다. 이것이 통화팽창의 의도된 효과입니다.",
  },
  {
    question: "기술 디플레이션의 사례(TV, 컴퓨터 가격 하락)가 '디플레이션은 소비를 막는다'는 주장을 반박하는 이유는?",
    options: [
      "기술 제품은 화폐가 아니기 때문에 다르다",
      "가격이 하락해도 소비는 계속 증가했기 때문에",
      "정부 보조금 덕분에 소비가 유지되었기 때문에",
      "중앙은행이 통화를 공급했기 때문에",
    ],
    answer: 1,
    explanation:
      "TV와 컴퓨터는 해마다 가격이 하락했지만 소비량은 폭발적으로 증가했습니다. 사람들은 '더 싸질 때까지' 영원히 기다리지 않습니다. 현재 효용이 미래 절감액보다 크기 때문입니다.",
  },
  {
    question: "내쉬 균형(Nash Equilibrium)이란 무엇인가요?",
    options: [
      "모든 참여자가 협력하는 상태",
      "한 참여자만 이익을 보는 상태",
      "모든 참여자가 상대방 전략을 전제로 자신의 전략을 바꿀 유인이 없는 상태",
      "게임이 무한히 반복되는 상태",
    ],
    answer: 2,
    explanation:
      "내쉬 균형은 각 참여자가 다른 참여자들의 전략을 주어진 것으로 볼 때 자신의 전략을 일방적으로 바꿔서 더 좋아질 수 없는 상태입니다.",
  },
  {
    question: "비트코인 국가 채택이 게임이론적으로 '필연'이라는 주장의 근거는?",
    options: [
      "비트코인 가격이 계속 오르기 때문에",
      "한 국가가 채택하면 다른 국가들의 미채택 비용이 급격히 상승하기 때문에",
      "UN이 비트코인 채택을 권고했기 때문에",
      "채굴이 어렵기 때문에",
    ],
    answer: 1,
    explanation:
      "주요 강대국이 BTC를 전략적 준비금으로 채택하면, 채택하지 않은 국가는 상대적으로 불리한 위치에 놓입니다. 이 구조가 다른 국가들의 채택을 유도하는 게임이론적 압력이 됩니다.",
  },
  {
    question: "기술 채택 S-곡선에서 '변곡점'은 무엇을 의미하나요?",
    options: [
      "채택률이 0%에서 1%로 넘어가는 시점",
      "채택 속도가 가장 빠른 시점(약 50% 채택률 부근)",
      "채택이 완전히 멈추는 시점",
      "정부가 기술을 인정하는 시점",
    ],
    answer: 1,
    explanation:
      "로지스틱 함수에서 변곡점은 성장 속도가 가장 빠른 지점으로, 보통 최대 채택률의 절반 부근에 해당합니다. 이 지점을 지나면 성장은 점차 둔화됩니다.",
  },
  {
    question: "미제스의 '회귀 정리'를 비트코인에 적용했을 때, 비트코이너들의 반론으로 옳은 것은?",
    options: [
      "비트코인은 회귀 정리의 예외이므로 이론을 수정해야 한다",
      "비트코인은 초기 cypherpunk 커뮤니티에서 실제 교환 수단으로 사용되었으므로 조건을 충족한다",
      "회귀 정리는 금에만 적용되므로 비트코인에는 무관하다",
      "비트코인은 화폐가 아니므로 회귀 정리를 적용할 필요가 없다",
    ],
    answer: 1,
    explanation:
      "미제스의 회귀 정리는 화폐가 이전에 교환 수단으로 사용된 상품에서 기원해야 한다고 합니다. 비트코이너들은 BTC가 초기 cypherpunk 커뮤니티 내에서 실제 교환 수단으로 사용되었다는 역사적 사실이 이 요건을 충족한다고 주장합니다.",
  },
];

// ─────────────────────────────────────────────
// Main Export
// ─────────────────────────────────────────────
export default function Ch09BitcoinEconomics() {
  return (
    <div>
      <AustrianSection />
      <TimePreferenceSection />
      <TimePrefSimulator />
      <DeflationSection />
      <GameTheorySection />
      <GameTheorySimulator />
      <AdoptionCurveSection />
      <AdoptionCurveSimulator />
      <QuizSection questions={quizQuestions} />
    </div>
  );
}
