import { OpenAI } from "openai";

const OPENAI_PROXY_PREFIX = "/openai";

export async function whisper(input: Blob): Promise<{ text: string }> {
  const body = new FormData();
  body.append("file", input);
  body.append("model", "whisper-1");
  // FIXME: use method in OpenAI SDK
  const response = await fetch(
    `${OPENAI_PROXY_PREFIX}/v1/audio/transcriptions`,
    {
      method: "POST",
      headers: {
        // 'Content-Type': 'multipart/form-data'
      },
      body,
    }
  );
  if (response.ok) {
    return response.json();
  }
  const e = await response.json().catch(() => null);
  console.error("error json", e);
  const msg = e?.error?.message ?? "whisper(): error happened";
  throw new Error(msg);
}

const f = new OpenAI({
  baseURL: location.origin + OPENAI_PROXY_PREFIX + "/v1",
  dangerouslyAllowBrowser: true,
  apiKey: "SECRET",
});
export async function chatGpt(
  messages: OpenAI.Chat.ChatCompletionMessageParam[]
) {
  const res = await f.chat.completions.create({
    messages,
    model: "gpt-4",
    max_tokens: 1024,
  });
  return res;
}
