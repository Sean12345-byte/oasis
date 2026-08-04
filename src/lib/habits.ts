// ── 預設微習慣清單 ──
// 設計原則：小到不可能失敗，無壓力的起點

export interface MicroHabit {
  id: string;
  icon: string;        // Lucide icon name
  title: string;
  description: string;
  category: "body" | "mind" | "connection" | "rest";
  /** 完成後的溫柔回應 */
  completionMessages: string[];
}

export const DEFAULT_HABITS: MicroHabit[] = [
  {
    id: "drink-water",
    icon: "Droplets",
    title: "喝一口水，深呼吸三次",
    description: "感受水滑過喉嚨，讓呼吸帶走緊繃",
    category: "body",
    completionMessages: [
      "水潤的身體，才能溫柔地承載每一天",
      "這樣就很好了，記得隨時補水",
    ],
  },
  {
    id: "stretch",
    icon: "Armchair",
    title: "站起來，伸展 10 秒",
    description: "轉轉脖子、聳聳肩，讓身體說說話",
    category: "body",
    completionMessages: [
      "你的身體會感謝你的這份留意",
      "伸展過的身體，帶著新的角度看待世界",
    ],
  },
  {
    id: "read-one-page",
    icon: "BookOpen",
    title: "打開書，看一頁就好",
    description: "一頁、一段、甚至一行都可以，翻開就是開始",
    category: "mind",
    completionMessages: [
      "一頁的養分，已經悄悄在心裡扎根",
      "閱讀的片刻，是給自己最好的禮物",
    ],
  },
  {
    id: "three-things",
    icon: "Heart",
    title: "想起一件值得感謝的小事",
    description: "也許是今天的陽光，也許是剛喝到的熱茶",
    category: "mind",
    completionMessages: [
      "感謝不是功課，是讓心柔軟的方式",
      "能看見微小美好的人，已經很富足了",
    ],
  },
  {
    id: "breathe",
    icon: "Wind",
    title: "閉上眼睛，專注呼吸 30 秒",
    description: "不需要冥想，只要感覺空氣進出就好",
    category: "mind",
    completionMessages: [
      "三十秒的空白，就是最奢侈的休息",
      "回到呼吸的那一刻，你已經在照顧自己了",
    ],
  },
  {
    id: "step-outside",
    icon: "Sun",
    title: "走到窗邊或陽台，感受外面的空氣",
    description: "讓皮膚感受溫度，讓眼睛看看遠處",
    category: "connection",
    completionMessages: [
      "你和這個世界，始終保持著連結",
      "外面的風，記得你的模樣",
    ],
  },
  {
    id: "message-someone",
    icon: "MessageCircle",
    title: "傳一個貼圖給想念的人",
    description: "不必寫長篇大論，一個表情符號就夠了",
    category: "connection",
    completionMessages: [
      "有時候，一個小小的連結就足以溫暖一整天",
      "你的存在，對某個人來說就是光",
    ],
  },
  {
    id: "rest-eyes",
    icon: "EyeOff",
    title: "讓眼睛休息 20 秒",
    description: "閉上眼，或看向窗外最遠的那棵樹",
    category: "rest",
    completionMessages: [
      "休息不是偷懶，是為了走更遠的路",
      "閉上眼睛的勇氣，不亞於睜開眼睛",
    ],
  },
];

// ── 反罪惡感文案 ──
// 使用者當天沒做任何習慣時顯示（隨機挑選）

export const NO_PRESSURE_MESSAGES: string[] = [
  "今天辛苦了，休息也是進度的一部分，我們隨時重新開始。",
  "沒有做到也沒關係。你在這裡，這本身就已經足夠。",
  "有時候，什麼都不做就是最好的照顧。明天見。",
  "微習慣的存在是為了陪伴，不是為了追逐。休息吧。",
  "你的價值，從來不需要用完成多少事來證明。",
  "窗外的雲，不會因為今天沒飄到某個地方就自責。你也是。",
  "暫停，也是一種前進。",
  "今天你活著、呼吸著、還在這裡——這已經是最重要的事了。",
];

// ── 隨機挑選工具 ──
export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
