import { OpenAI } from "openai";
import { buildUserPrompt, SYSTEM_PROMPT } from "~/utils/prompt";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: buildUserPrompt(
            body.level,
            body.subject,
            body.title,
            body.nbQuestions,
          ),
        },
      ],
    });

    return {
      content: completion.choices[0].message.content,
    };
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error generating content",
    });
  }
});
