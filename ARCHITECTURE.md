# 課題

- メンター側の入力がめんどくさい
- 新歓運営がメンターの入力内容を加工して参加者用のアンケートを作るのが大変
    - フロー
        - 2時間区切りのデータが集まる
        - 名前と回答内容をコピー
- メンターの日程が決まったあとに予定を入れてしまうので大変

## 開発するもの

- UIが良さげな入力フォーム
    - 携帯でもPCでも入力しやすい
    - googleカレンダーの予定を取得して、それを埋め込んどいてあげる
    - 入力したデータがスプレッドシートに反映される
- 運営用の画面が必要
    - 運営が誰がどの日程いけるのか把握できる
    - アンケートを作るために昇順で日程をコピーできる
- メンターが回答してフォームを送信したら仮押さえでgoogleカレンダーが抑えられる

### 画面

- メンター
    - 入力画面
    - 入力後の結果画面
        - 回答ありがとう〜的な画面
- 運営用
    - どの時期のアンケートかを選択できるor作成できる画面
        - 作成時にどのスプシにデータを貯めるのか選択する
            - 名前とスプシのリンクを貼るフォーム
            - 作成したら、データを貯める箱（スプレッドシート）も登録される＆メンターが答えるアンケートも作られる
    - 各アンケートの詳細画面
        - 昇順に並んでいたり、バリデーションがかかっている
        - テーブルがあって、昇順並び替えやコピーができる

# 開発事前準備

## 技術

- Next.js
    - App router
    - 14
- Supabase
    - google認証
    - pogtgresql
- shadcn
- npm
- react-hook-form
- zod

## 設計

- **「画面」＝ components/page**
- **「ドメイン名が付くUI」＝ components/model/{domain}**
- **「見た目だけ」＝ components/ui**
- **「操作（保存・送信・仮押さえ）」＝ usecases**
- **「Google/Sheetsに触る」＝ repositories**
- **「重複NGや整形」＝ models（参照透過関数）**

### 全体

```bash
src/
  app/                  # ルーティングのみ（中身はexportするだけ） :contentReference[oaicite:2]{index=2}
  components/
    page/               # 1ページを表す実体 :contentReference[oaicite:3]{index=3}
    model/              # model文脈のUI（Survey, MentorResponseなど） :contentReference[oaicite:4]{index=4}
    ui/                 # model非依存の見た目部品 :contentReference[oaicite:5]{index=5}
    functional/         # 見た目なしのComponent（必要なら） :contentReference[oaicite:6]{index=6}

  usecases/             # “操作/ユースケース”の純粋関数（司令塔）
  repositories/         # 外部I/O（Google/Spreasheet/DB）に触る層
  models/               # modelの型 + ドメイン関数群（データ構造＋参照透過な関数） :contentReference[oaicite:7]{index=7}
  globalStates/         # 画面横断の状態（必要になったら）
  hooks/                # 汎用hook（UI都合）
  libs/                 # ライブラリラップ
  styles/               # reset/base/variables

```

### app

```bash
src/app/
  mentor/[surveyId].tsx          # export { MentorSurveyPage } from components/page/MentorSurvey
  mentor/[surveyId]/done.tsx     # 送信後ありがとう画面
  organizer/index.tsx            # 一覧（アンケート選択/作成）
  organizer/[surveyId].tsx       # 詳細（回答テーブル＋コピー）
```

### components/page

```bash
src/components/page/
  MentorSurvey/
    MentorSurvey.page.tsx        # レイアウト/Boundary/Suspense担当（任意） :contentReference[oaicite:10]{index=10}
    MentorSurvey.tsx             # 画面本体（フォーム＋送信）
    index.ts

  MentorSurveyDone/
  OrganizerSurveyList/
  OrganizerSurveyDetail/
```

### components/model

```bash
src/components/model/
  survey/
    SurveyPicker/                # 運営：アンケート選択
    SurveyCreateForm/            # 運営：アンケート作成
    SurveySummaryCard/

  mentorResponse/
    MentorResponseForm/          # メンター入力UI（Slot選択）
    MentorResponseTable/         # 運営テーブル（昇順ソート/コピー）
    MentorResponseValidationMessage/

  slot/
    SlotEditor/                  # 任意開始2hの入力（time picker等）
    SlotList/
```

### components/ui

```bash
src/components/ui/
  Button/
  TextField/
  DatePicker/
  TimePicker/
  Modal/
  Table/
  Toast/
```

### usecases

```bash
src/usecases/
  survey/
    createSurvey.ts              # 運営：アンケ作成（保存先スプシ登録含む）
    getSurvey.ts
    listSurveys.ts

  mentorResponse/
    submitMentorResponse.ts      # メンター：回答送信（重複NGチェック→保存→仮押さえ→スプシ反映）
    getMentorResponse.ts
    listMentorResponses.ts       # 運営：一覧
  
  export/
    buildSlotsText.ts            # 参加者向け `10/12 10-12時、...` を生成
```

### repository

```bash
src/repositories/
  googleCalendar/
    calendarRepository.ts        # listEvents, createHoldEvent, deleteHoldEvent...
    types.ts                     # 外部DTO
  googleSheets/
    sheetsRepository.ts          # appendResponseRow, upsertSurveyMeta...
  persistence/
    surveyRepository.ts          # DB or スプシを“DB扱い”するならその抽象
    mentorResponseRepository.ts
    calendarHoldRepository.ts
```

### model

```bash
src/models/
  survey/
    survey.ts                    # type Survey
    surveyRules.ts               # isOpen, canAcceptResponses...
  mentorResponse/
    mentorResponse.ts            # type MentorResponse
    mentorResponseValidators.ts  # validateNoOverlap（同一日overlap禁止）
  slot/
    slot.ts                      # type Slot
    timeRange.ts                 # overlaps()
    slotFormat.ts                # "10/12 10-12時" など
  calendarHold/
    calendarHold.ts              # type CalendarHold（googleEventId含む）
```

# 参考

https://chatgpt.com/share/695333aa-ae58-8000-ab7f-5a01081b9ca8

https://zenn.dev/knowledgework/articles/99f8047555f700?redirected=1