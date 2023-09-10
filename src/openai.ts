import { OpenAIApi, Configuration, ChatCompletionRequestMessage } from 'openai';

const OPENAI_PROXY_PREFIX = '/openai';

export async function whisper(input: Blob): Promise<{ text: string }> {
  const body = new FormData();
  body.append('file', input);
  body.append('model', 'whisper-1');
  const response = await fetch(`${OPENAI_PROXY_PREFIX}/v1/audio/transcriptions`, {
    method: 'POST',
    headers: {
      // 'Content-Type': 'multipart/form-data'
    },
    body,
  });
  if (response.ok) {
    return response.json();
  }
  const e = await response.json().catch(() => null);
  console.error('error json', e);
  const msg = e?.error?.message ?? 'whisper(): error happened';
  throw new Error(msg);
}

const f = new OpenAIApi(
  new Configuration({ basePath: location.origin + OPENAI_PROXY_PREFIX + '/v1', apiKey: 'SECRET' }),
);
export async function chatGpt(messages: ChatCompletionRequestMessage[]) {
  const res = await f.createChatCompletion({ messages, model: 'gpt-4', max_tokens: 1024 });
  return res.data;
}
