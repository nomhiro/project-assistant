import { Minutes } from "@/models/minutes";

/**
 * Chat Completionで推論し議事録をJsonStructuredモードで生成する
 * @param input 推論を行うテキスト
 * @param systemMessage システムメッセージ
 * @returns 推論結果
 */

// ...existing code...

export const getMinutesJson = async (input: string): Promise<Minutes> => {
  return new Promise(async (resolve, reject) => {
    console.log(" 🚀議事録生成開始");

    try {
      const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
      const apiKey = process.env.AZURE_OPENAI_API_KEY!;
      const deployment = process.env.AZURE_OPENAI_CHAT_DEPLOYMENT_NAME!;
      const apiVersion = "2024-10-21";

      const systemMessage = `整理された会議の議事録を作成し、会議出席者でない人でも理解しやすい形にします。会議の各議題や内容に基づいてセクションを分割し、各セクションをMarkdown形式で記述してください。その後、各セクションをJSONオブジェクトとしてまとめます。

# 出力の要件
1. **会議内容をセクション単位に整理**
   - 会議内容ごとに章ごとに分かれていること。
   - 各セクションに適切なタイトルを付けること。

2. **Markdown形式**
   - 各内容を箇条書きや見出しを使ってわかりやすくMarkdownで記述。
   - 必要に応じて表や番号付きリストを使用。

3. **全体をJSONに構造化**
   - 各セクションがJSON要素として構造化されていること。
   - JSON形式は以下の構造であること。
     minutes: [
       {
         section_title: "<セクションタイトル>",
         minutes_section: "<Markdown形式の議事録内容>"
       },
       ...
     ]

# 出力形式
次の形式で結果を出力してください：

- 各セクションを分割し整理。
- Markdown形式で書かれた内容を"minutes_section"に書く。
- JSON形式のリストとして、セクションごとに配列の要素を作成。

# 出力例 
以下は出力のサンプル例です：

{
  "date": "2024-12-28T10:42:25.4133333+00:00",
  "minutes": [
    {
      "section_title": "オープニング",
      "minutes_section": "## オープニング\n- 会議の開始時間: 10:00 AM\n- 出席者: 山田太郎、鈴木一郎、佐藤花子\n\n### アジェンダ\n1. 前回の議事録確認\n2. 新プロジェクトの進捗報告"
    },
    {
      "section_title": "新プロジェクト進捗報告",
      "minutes_section": "## 新プロジェクト進捗報告\n- プロジェクト名: プロジェクトAlpha\n- 現在の進捗: 50%達成\n- 課題:\n  - リソース不足\n  - 納期遅延のリスク\n\n### 次のアクション\n1. 新たなメンバーを追加する提案\n2. 納期再調整の検討"
    },
    {
      "section_title": "クロージング",
      "minutes_section": "## クロージング\n- 次回会議予定: 2023年10月15日 10:00 AM\n- 会議中のアクションアイテムを各担当者に通知する"
    }
  ]
}

# 注意点
- 内容や背景が明確でない箇所は不要に省略せず、補足説明をMarkdown内に記載する。
- 出席者やアジェンダ、決定事項などがあれば必ず記録に含める。
- JSONフォーマットが常に有効であるように注意してください。`

      const url = `${endpoint}openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;
      console.log("    url:", url);

      const headers = {
        "api-key": apiKey,
        "Content-Type": "application/json"
      };

      const body = {
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: input }
        ],
        temperature: 0.0,
        top_p: 0.0,
        max_tokens: 16384,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "Minutes",
            strict: true,
            schema: {
              type: "object",
              properties: {
                date: { type: "string" },
                minutes: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      section_title: { type: "string" },
                      minutes_section: { type: "string" }
                    },
                    required: ["section_title", "minutes_section"],
                    additionalProperties: false
                  }
                }
              },
              required: ["date", "minutes"],
              additionalProperties: false
            }
          }
        }
      };

      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      const data: Minutes = JSON.parse(responseData.choices[0].message.content);
      resolve(data as Minutes);
    } catch (error) {
      reject(error);
    }
  });
};
