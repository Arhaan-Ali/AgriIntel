"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Mic, MicOff, Loader2, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------- Types -------------------- */

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

/* -------------------- Component -------------------- */

const FarmerChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your farming assistant. Ask me about crops, soil, pests, irrigation, or farming practices.",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speakingMessageIndex, setSpeakingMessageIndex] = useState<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const finalizedTextRef = useRef<string>(""); // Track all finalized text
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  /* -------------------- Text-to-Speech -------------------- */

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthesisRef.current = window.speechSynthesis;
    }
  }, []);

  const speakMessage = (text: string, messageIndex: number) => {
    if (!synthesisRef.current) {
      return;
    }

    // Stop any currently speaking message
    if (speakingMessageIndex !== null) {
      synthesisRef.current.cancel();
    }

    // Clean text - remove markdown-like formatting for better speech
    const cleanText = text
      .replace(/[•\-\*]/g, "") // Remove bullet points
      .replace(/\d+[\.\)]\s/g, "") // Remove numbered list markers
      .replace(/\n+/g, ". ") // Replace newlines with periods
      .trim();

    if (!cleanText) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = "en-US";

    utterance.onstart = () => {
      setSpeakingMessageIndex(messageIndex);
    };

    utterance.onend = () => {
      setSpeakingMessageIndex(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageIndex(null);
    };

    synthesisRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setSpeakingMessageIndex(null);
    }
  };

  // Stop speaking when component unmounts
  useEffect(() => {
    return () => {
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, []);

  /* -------------------- Speech Recognition -------------------- */

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser");
      setSpeechSupported(false);
      return;
    }

    setSpeechSupported(true);
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true; // Show interim results for better UX
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      // Process all results from the current index
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      // Update finalized text if we have final results
      if (finalTranscript.trim()) {
        finalizedTextRef.current += (finalizedTextRef.current ? " " : "") + finalTranscript.trim();
      }

      // Update input field: show finalized text + current interim text
      setInput(() => {
        if (interimTranscript) {
          return finalizedTextRef.current + (finalizedTextRef.current ? " " : "") + interimTranscript;
        } else {
          return finalizedTextRef.current;
        }
      });
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      
      // Show user-friendly error messages
      if (event.error === "no-speech") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "No speech detected. Please try again.",
            timestamp: new Date(),
          },
        ]);
      } else if (event.error === "not-allowed") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Microphone permission denied. Please enable microphone access in your browser settings.",
            timestamp: new Date(),
          },
        ]);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      // Ensure input shows finalized text when recognition ends
      setInput(finalizedTextRef.current);
    };

    recognitionRef.current = recognition;
  }, []);

  /* -------------------- Auto Scroll -------------------- */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* -------------------- Send Message -------------------- */

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const FASTAPI_URL =
        process.env.NEXT_PUBLIC_FASTAPI_URL || "http://127.0.0.1:8000";

      const history = [...messages, userMessage]
        .filter((m) => m.role !== "assistant" || m !== messages[0])
        .map((msg) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        }));

      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      const response = await fetch(`${FASTAPI_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          conversation_history: history,
        }),
        signal: controller.signal,
      }).catch((fetchError) => {
        clearTimeout(timeoutId);
        if (fetchError.name === "AbortError") {
          throw new Error("Request timeout: The server took too long to respond. Please try again.");
        }
        throw new Error(
          `Cannot connect to backend at ${FASTAPI_URL}. ` +
          `Make sure the backend server is running.`
        );
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content:
          data.message ||
          "I'm sorry, I couldn't generate a response. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${error.message}`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------- Handlers -------------------- */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    
    if (!speechSupported) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.",
          timestamp: new Date(),
        },
      ]);
      return;
    }

    if (!recognition) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Speech recognition is not available. Please refresh the page.",
          timestamp: new Date(),
        },
      ]);
      return;
    }

    try {
      if (isListening) {
        recognition.stop();
        setIsListening(false);
      } else {
        // Clear input and finalized text when starting new recording
        finalizedTextRef.current = "";
        setInput("");
        recognition.start();
      }
    } catch (error: any) {
      console.error("Error toggling speech recognition:", error);
      setIsListening(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error starting voice input: ${error.message || "Unknown error"}`,
          timestamp: new Date(),
        },
      ]);
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="flex flex-col h-full w-full">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🌾 Farming Assistant
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-2",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2 text-sm relative group",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {/* Speaker button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "absolute -top-1 -right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity",
                      msg.role === "user"
                        ? "text-primary-foreground hover:bg-primary-foreground/20"
                        : "text-muted-foreground hover:bg-muted-foreground/20",
                      speakingMessageIndex === i && "opacity-100 animate-pulse"
                    )}
                    onClick={() => {
                      if (speakingMessageIndex === i) {
                        stopSpeaking();
                      } else {
                        speakMessage(msg.content, i);
                      }
                    }}
                    title={
                      speakingMessageIndex === i
                        ? "Stop speaking"
                        : "Read aloud"
                    }
                  >
                    {speakingMessageIndex === i ? (
                      <VolumeX className="h-3 w-3" />
                    ) : (
                      <Volume2 className="h-3 w-3" />
                    )}
                  </Button>

                  <div className="whitespace-pre-wrap space-y-1.5 pr-6">
                    {msg.content.split('\n').map((line, idx) => {
                      const trimmedLine = line.trim();
                      // Format bullet points
                      if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•') || trimmedLine.startsWith('*')) {
                        return (
                          <div key={idx} className="flex items-start gap-2">
                            <span className={cn(
                              "mt-0.5 shrink-0",
                              msg.role === "user" ? "text-primary-foreground" : "text-primary"
                            )}>•</span>
                            <span>{trimmedLine.substring(1).trim()}</span>
                          </div>
                        );
                      }
                      // Format numbered lists
                      if (trimmedLine.match(/^\d+[\.\)]\s/)) {
                        return (
                          <div key={idx} className="ml-1">
                            {trimmedLine}
                          </div>
                        );
                      }
                      // Empty lines
                      if (trimmedLine === '') {
                        return <div key={idx} className="h-1" />;
                      }
                      // Regular text
                      return <div key={idx}>{line}</div>;
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t p-4 flex gap-2"
          >
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about crops, soil, irrigation..."
                disabled={isLoading}
              />

              {speechSupported && (
                <Button
                  type="button"
                  variant={isListening ? "destructive" : "ghost"}
                  size="icon"
                  className={cn(
                    "absolute right-1 top-1/2 -translate-y-1/2",
                    isListening && "animate-pulse"
                  )}
                  onClick={toggleListening}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>

            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerChatbot;