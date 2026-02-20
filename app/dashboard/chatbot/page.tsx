"use client";

import React from "react";
import FarmerChatbot from "@/components/chatbot/FarmerChatbot";

export default function ChatbotPage() {
  return (
    <div className="h-full w-full max-w-4xl mx-auto">
      <div className="h-[calc(100vh-8rem)]">
        <FarmerChatbot />
      </div>
    </div>
  );
}


