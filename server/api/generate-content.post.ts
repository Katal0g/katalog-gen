import { Mistral } from "@mistralai/mistralai";
import { SYSTEM_PROMPT } from "~/utils/prompt";
import { H3Event, createEventStream, appendResponseHeaders } from "h3";
const runtimeConfig = useRuntimeConfig();

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);

  const client = new Mistral({ apiKey: runtimeConfig.MISTRAL_API_KEY });

  try {
    const stream = await client.agents.stream({
      messages: [
        {
          role: "user",
          content: body.finalPrompt,
        },
      ],
      agentId: runtimeConfig.MISTRAL_AGENT_ID,
      stream: true,
    });

    const eventStream = createEventStream(event);
    appendResponseHeaders(event, {
      "cache-control": "no-cache",
      connection: "keep-alive",
      "content-type": "text/event-stream",
    });

    (async () => {
      for await (const chunk of stream) {
        const content = chunk.data.choices[0]?.delta?.content || "";

        if (content) {
          eventStream.push(content).then();
        }

        if (chunk.data.choices[0].finishReason === "stop") {
          eventStream.close().then();
          break;
        }
      }
    })().then((r) => r);

    eventStream.onClosed(async () => {
      await eventStream.close();
    });

    return eventStream.send();
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error generating content",
    });
  }
});
