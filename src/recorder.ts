/**
 * taken from MDN:
 * https://github.com/mdn/dom-examples/blob/main/media/web-dictaphone/scripts/app.js
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API/Using_the_MediaStream_Recording_API
 */

export async function startRecording(
  stopped: PromiseLike<unknown>
): Promise<File> {
  const stream = await navigator.mediaDevices
    ?.getUserMedia({ audio: true })
    .catch(() => null);
  if (!stream) {
    throw new Error("音声入力をできませんでした | Could not record audio");
  }
  const recorder = new MediaRecorder(stream, {
    audioBitsPerSecond: 128000,
    mimeType: "audio/webm",
    // mimeType: 'audio/mpeg-3',
    // mimeType: 'audio/mp4',
  });
  const chunks: Blob[] = [];

  const recorded = await new Promise<File>((fulfill, reject) => {
    recorder.ondataavailable = (chunk) => {
      chunks.push(chunk.data);
    };

    recorder.onstop = () => {
      const blob = new File(chunks, `recorded-${Date.now()}.webm`, {
        type: "audio/webm;codecs=opus",
      });
      fulfill(blob);
    };

    recorder.onerror = reject;
    recorder.start();
    Promise.race([
      stopped,
      new Promise((f) => setTimeout(f, 5 * 60e3)),
    ]).finally(() => {
      recorder.stop();
      stream.getTracks().forEach((t) => t.stop());
    });
  });

  return recorded;
}
