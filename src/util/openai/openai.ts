import { AzureOpenAI } from "openai";
import { ChatMessage } from "@/types/types";

/**
 * Get the embedding of the given message.
 * @param input The message to get the embedding of.
 * @returns The embedding of the message.
 */
export const getEmbedding = async (input: string): Promise<number[]> => {
  return new Promise(async (resolve, reject) => {
    console.log(" 🚀ベクトル化開始");

    try {
      const endpoint = process.env.AZURE_OPENAI_ENDPOINT!;
      const apiKey = process.env.AZURE_OPENAI_API_KEY!;
      const deployment = process.env.AZURE_OPENAI_VEC_DEPLOYMENT_NAME!;
      const apiVersion = "2024-10-21";
      
      const client = new AzureOpenAI({ endpoint, apiKey, deployment, apiVersion });
      const embeddings = await client.embeddings.create({ input: [input], model: deployment });

      resolve(embeddings.data[0].embedding);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

/** 
 * Get Chat Completion from OpenAI.
 * @param messages Type ChatMessage. The messages to get the completion of.
*/
export const getChatCompletion = async (messages: ChatMessage[]): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    console.log(" 🚀OpenAI Chat Completion");

    try {
      const endpoint = process.env.AZURE_OPENAI_ENDPOINT!;
      const apiKey = process.env.AZURE_OPENAI_API_KEY!;
      const deployment = process.env.AZURE_OPENAI_CHAT_DEPLOYMENT_NAME!;
      const apiVersion = "2024-10-21";
      
      const client = new AzureOpenAI({ endpoint, apiKey, deployment, apiVersion });
      
      // const chatMessages: { role: string, content: string }[] = messages.map((message) => {
      //   return { role: message.role, content: message.content };
      // });
      // const completion = await client.chat.completions.create({ 
      //   messages: chatMessages, 
      //   model: deployment
      // });
      const systemMessage = messages.find(message => message.role === 'system');
      const userMessage = messages.find(message => message.role === 'user');
      if (!systemMessage || !userMessage) {
        throw new Error("System or user message is missing");
      }
      const completion = await client.chat.completions.create({
        messages: [
          { role: "system", content: systemMessage.content },
          { role : "user", content: userMessage.content }
        ],
        model: deployment,
        stream: false
      });

      console.log("   completion:", completion.choices[0].message);

      const inferenceContent = completion.choices[0].message.content;
      if (inferenceContent !== null) {
        resolve(inferenceContent);
      } else {
        reject(new Error("Message content is null"));
      }
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};