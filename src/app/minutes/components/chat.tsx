"use client";

import { useState } from "react";
import Message from "./message";
import { ChatMessage } from "@/types/types";

export default function Chat({
  selectedProject,
  selectedMeeting,
}: {
  selectedProject: string;
  selectedMeeting: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("project"); // デフォルトはProject全体

  const handleSend = async () => {
    if (input.trim()) {
      setMessages([...messages, { role: "user", content: input }]);

      // 推論 /api/minutes/inferenceにPOSTリクエスト
      const response = await fetch(`/api/minutes/inference`, {
        method: "POST",
        body: JSON.stringify({
          input: input,
          projectId: selectedProject,
          meetingId: selectedMeeting,
          mode: mode,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("data:", data);

      // const response = `# a\n\n## b\n- 1\n- **2**`;
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: data.response },
      ]);

      setInput("");
    }
  };

  return (
    <div>
      {selectedMeeting && (
        <>
        <div className="flex flex-col h-full p-4">
          <div className="mb-4">
            <label>
              <input
                type="radio"
                value="project"
                checked={mode === "project"}
                onChange={() => setMode("project")}
              />
              Project全体
            </label>
            <label className="ml-4">
              <input
                type="radio"
                value="meeting"
                checked={mode === "meeting"}
                onChange={() => setMode("meeting")}
              />
              同じMTGのみ
            </label>
          </div>
          <div className="flex-1 overflow-y-auto border border-gray-300 rounded-lg p-2">
            {messages.map((msg, index) => (
              <div key={index}>
                <Message {...msg} />
              </div>
            ))}
          </div>
          <div className="flex flex-col mt-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 mb-2"
              placeholder="メッセージを入力..."
              rows={4}
            />
            <button
              onClick={handleSend}
              className="bg-blue-500 text-white rounded-lg px-4 h-10 self-end hover:bg-blue-700"
            >
              送信
            </button>
          </div>
        </div>
        </>
      )}
    </div>
  );
}