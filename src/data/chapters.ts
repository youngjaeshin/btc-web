import {
  Coins,
  Landmark,
  FileText,
  Pickaxe,
  Gem,
  KeyRound,
  Network,
  Zap,
  TrendingUp,
  Telescope,
} from "lucide-react";

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface Chapter {
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Coins;
  color: string;
  component: string;
  keywords: string[];
}

export const chapterMeta: Chapter[] = [
  {
    slug: "what-is-money",
    number: 1,
    title: "화폐란 무엇인가",
    subtitle: "What is Money?",
    description:
      "물물교환의 한계, 화폐의 5가지 속성(내구성·휴대성·분할성·희소성·검증가능성), 금 vs 법정화폐 vs 비트코인 비교를 다룹니다.",
    icon: Coins,
    color: "from-amber-500 to-yellow-500",
    component: "Ch01WhatIsMoney",
    keywords: ["건전화폐", "화폐 속성", "금본위제", "가치 저장"],
  },
  {
    slug: "fiat-problem",
    number: 2,
    title: "법정화폐의 문제",
    subtitle: "The Fiat Problem",
    description:
      "닉슨 쇼크(1971), 중앙은행 통화팽창, 인플레이션 은폐세, 칸티용 효과, M2 공급량 추이를 다룹니다.",
    icon: Landmark,
    color: "from-red-500 to-rose-500",
    component: "Ch02FiatProblem",
    keywords: ["닉슨 쇼크", "칸티용 효과", "인플레이션", "M2 통화량"],
  },
  {
    slug: "bitcoin-protocol",
    number: 3,
    title: "비트코인 탄생과 원리",
    subtitle: "Bitcoin Protocol",
    description:
      "사토시 나카모토 백서, P2P 전자화폐, UTXO 모델, 트랜잭션 구조, 블록 구조를 다룹니다.",
    icon: FileText,
    color: "from-orange-500 to-amber-500",
    component: "Ch03BitcoinProtocol",
    keywords: ["사토시 나카모토", "UTXO", "SHA-256", "블록체인"],
  },
  {
    slug: "proof-of-work",
    number: 4,
    title: "작업증명과 채굴",
    subtitle: "Proof of Work & Mining",
    description:
      "PoW의 물리적 근거, 해시레이트, 난이도 조절, 반감기, 채굴 보상 구조, 에너지 소비 논쟁을 다룹니다.",
    icon: Pickaxe,
    color: "from-stone-500 to-zinc-500",
    component: "Ch04ProofOfWork",
    keywords: ["작업증명", "해시레이트", "난이도 조절", "반감기"],
  },
  {
    slug: "scarcity",
    number: 5,
    title: "희소성과 공급 스케줄",
    subtitle: "Scarcity & Stock-to-Flow",
    description:
      "2,100만개 상한, 발행 스케줄, Stock-to-Flow 모델, 금·은 비교, 디지털 희소성의 의미를 다룹니다.",
    icon: Gem,
    color: "from-violet-500 to-purple-500",
    component: "Ch05Scarcity",
    keywords: ["2100만", "Stock-to-Flow", "반감기", "디지털 희소성"],
  },
  {
    slug: "wallets-custody",
    number: 6,
    title: "지갑과 자기주권",
    subtitle: "Wallets & Self-Custody",
    description:
      "공개키/개인키, 시드 문구(BIP-39), HD 지갑(BIP-32/44), UTXO 관리, 'Not your keys, not your coins'를 다룹니다.",
    icon: KeyRound,
    color: "from-emerald-500 to-green-500",
    component: "Ch06WalletsCustody",
    keywords: ["개인키", "시드 문구", "HD 지갑", "자기주권"],
  },
  {
    slug: "network-nodes",
    number: 7,
    title: "네트워크와 노드",
    subtitle: "Network & Nodes",
    description:
      "풀노드의 역할, 블록 전파, 멤풀, 수수료 시장, 탈중앙화의 실제 의미를 다룹니다.",
    icon: Network,
    color: "from-blue-500 to-cyan-500",
    component: "Ch07NetworkNodes",
    keywords: ["풀노드", "멤풀", "수수료 시장", "탈중앙화"],
  },
  {
    slug: "lightning-network",
    number: 8,
    title: "라이트닝 네트워크",
    subtitle: "Lightning Network",
    description:
      "레이어2 솔루션, 결제 채널, HTLC, 라우팅, 즉시 결제·초소액 결제를 다룹니다.",
    icon: Zap,
    color: "from-yellow-400 to-orange-500",
    component: "Ch08LightningNetwork",
    keywords: ["레이어2", "결제 채널", "HTLC", "라우팅"],
  },
  {
    slug: "bitcoin-economics",
    number: 9,
    title: "비트코인과 경제학",
    subtitle: "Bitcoin & Economics",
    description:
      "오스트리안 경제학, 시간선호, 저축 문화, 디플레이션 화폐의 의미, 게임이론과 채택을 다룹니다.",
    icon: TrendingUp,
    color: "from-indigo-500 to-blue-500",
    component: "Ch09BitcoinEconomics",
    keywords: ["오스트리안 경제학", "시간선호", "게임이론", "채택 곡선"],
  },
  {
    slug: "future-of-bitcoin",
    number: 10,
    title: "비트코인의 미래",
    subtitle: "The Future of Bitcoin",
    description:
      "비트코인 스탠다드, 하이퍼비트코이너화, 보안 모델 장기 전망, 오해와 반론, 개인의 비트코인 여정을 다룹니다.",
    icon: Telescope,
    color: "from-fuchsia-500 to-violet-500",
    component: "Ch10FutureOfBitcoin",
    keywords: ["비트코인 스탠다드", "하이퍼비트코이너화", "보안 예산", "채택"],
  },
];
