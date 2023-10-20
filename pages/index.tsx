export function IndexPage() {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <title>Yet Another OpenAI Chat Bot</title>
        <link
          key="css-tailwind"
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css"
          integrity="sha512-wnea99uKIC3TJF7v4eKk4Y+lMz2Mklv18+r4na2Gn1abDRPPOeef95xTzdwGD9e6zXJBteMIhZ1+68QC5byJZw=="
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
        />

        <script src="/static/index.js" defer></script>
      </head>

      <body>
        <div class="max-w-screen-sm mx-auto">
          <div
            id="chat-history"
            style="height: calc(100dvh - 100px)"
            class="overflow-y-scroll"
          ></div>

          <div id="progressbar" hidden></div>
          <hr />
          <div id="buttons" class="text-center">
            <button
              type="button"
              id="toggle-recording"
              style="height: 98px"
              class="flex justify-center items-center w-full whitespace-pre-line"
            >
              Loading...
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
