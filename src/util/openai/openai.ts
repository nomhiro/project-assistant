import { AzureOpenAI } from "openai";
import { DefaultAzureCredential, getBearerTokenProvider } from "@azure/identity";
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
      
      const scope = "https://cognitiveservices.azure.com/.default";
      const azureADTokenProvider = getBearerTokenProvider(new DefaultAzureCredential(), scope);
      
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
      
      const scope = "https://cognitiveservices.azure.com/.default";
      const azureADTokenProvider = getBearerTokenProvider(new DefaultAzureCredential(), scope);
      
      const client = new AzureOpenAI({ endpoint, apiKey, deployment, apiVersion });
      const completion = await client.chat.completions.create({ messages: messages, model: deployment });

      console.log("   completion:", completion.choices[0].message);

      resolve(completion.choices[0].message);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};