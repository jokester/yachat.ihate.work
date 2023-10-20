import { Deferred } from "@jokester/ts-commonutil/lib/concurrency/deferred";

import { startRecording } from "./recorder";
import { chatGpt, whisper } from "./openai";
import type { OpenAI } from "openai";

namespace ChatHistory {
  const root = document.querySelector("#chat-history") as HTMLDivElement;

  export function append(text: string, className = "") {
    const p = document.createElement("p");
    p.textContent = text;
    p.className = className;
    root.appendChild(p);
    p.scrollIntoView({ behavior: "smooth" });
  }
}

function initRecorder() {
  const startBtn = document.querySelector(
    "#toggle-recording"
  ) as HTMLButtonElement;
  const initialText = (startBtn.textContent = `
Start Talking (Please permit use of microphone if prompted)
話しかける (マイク権限を許可してください)`.trim());

  const defaultText = `
Start Talking
話しかける`.trim();

  let loading: null | Deferred<void> = null;

  let next: OpenAI.Chat.ChatCompletionMessageParam[] = [];

  startBtn.onclick = async () => {
    if (loading) {
      loading.fulfill();
      return;
    }
    try {
      loading = new Deferred<void>();
      startBtn.textContent = `
Recording... (click to stop)
録音中... (押すと発言終了) `.trim();
      startBtn.addEventListener("click", () => loading?.fulfill(), {
        once: true,
      });
      const clip = await startRecording(loading);

      startBtn.disabled = true;

      startBtn.textContent = `
Recognizing...
音声認識中... `.trim();
      const message = await whisper(clip);
      ChatHistory.append(`You: ${message.text}`, "bg-yellow-200 px-2 py-1");

      startBtn.textContent = `
Waiting for response...
応答待ち...`.trim();
      const reply = await chatGpt([
        ...next,
        { role: "user", content: message.text },
      ]);
      ChatHistory.append(
        `ChatGPT: ${reply.choices[0].message?.content ?? "no response"}`,
        "bg-blue-200 px-2 py-1"
      );

      next.push(
        {
          role: "user",
          content: message.text,
        },
        {
          role: "assistant",
          content: reply.choices[0].message?.content ?? "",
        }
      );
      if (
        /* not following finish_reason */ 0 &&
        reply.choices[0].finish_reason
      ) {
        if (reply.choices[0].finish_reason === "stop") {
          ChatHistory.append(`session finished.`, "bg-red-200 px-2 py-1");
        } else {
          ChatHistory.append(
            `session finished.\nreason: ${reply.choices[0].finish_reason} `,
            "bg-red-200 px-2 py-1"
          );
        }
        next = [];
      }

      console.debug("answer", reply);
    } catch (e: any) {
      console.error(e);
      alert(e?.message ?? "error happened");
    } finally {
      startBtn.textContent = defaultText;
      startBtn.disabled = false;
      loading = null;
    }
  };
}

setTimeout(initRecorder);
