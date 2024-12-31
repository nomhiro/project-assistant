"use client";

import React from "react";
import Markdown from 'react-markdown';
import { ChatMessage } from "@/types/types";

const Message: React.FC<ChatMessage> = ( chatMessage: ChatMessage ) => {
  if (chatMessage.role !== "assistant" && chatMessage.role !== "user") {
    return null;
  }

  return (
    <div
      className={`my-1 p-2 border border-gray-300 rounded-lg ${
        chatMessage.role === "user" ? "bg-blue-100 text-right self-end" : "bg-gray-100 text-left self-start"
      }`}
      style={{ wordWrap: "break-word" }}
    >
      <div className="markdown">
        <Markdown className="markdown">
          {chatMessage.content}
        </Markdown >
      </div>
    </div>
  );
};

export default Message;