# possy
新歓運営 - メンター においてアンケート作成や回答を楽にするアプリ

## データ復旧方法
- スプレッドシートにデータが反映されない場合に使用
- supabaseのsql editorから該当の`survey_id`で検索する
```sql
SELECT
  m.mentor_name AS "名前",
  m.email AS "メールアドレス",
  m.posse AS "所属posse",
  m.university AS "大学",
  m.generation AS "期生",
  m.available_capacity AS "対応可能チーム数",
  string_agg(
    (slot->>'date') || ' ' || (slot->>'startTime') || '-' || (slot->>'endTime'),
    '、'
    ORDER BY (slot->>'date'), (slot->>'startTime')
  ) AS "可能日程"
FROM mentor_responses AS m
CROSS JOIN LATERAL jsonb_array_elements(m.slots) AS slot
WHERE m.survey_id = ''
GROUP BY m.id;
```

## 開発方法
codespaceで開発をしています
- cloneする際に、`codespace`s > `create codespaces on develop` を選択。
- その後に左下の青色の`codespaces`を選択。そして、open in vscode desktopを選択。
- vscodeで開発ができます
