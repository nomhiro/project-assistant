import {
  CosmosClient,
  Database,
  Container,
} from "@azure/cosmos";
import { minutes } from '@/types/types';

// minutesアイテムを登録する
export const upsertMinutes = async (minutes: minutes): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const cosmosClient = new CosmosClient(process.env.COSMOS_CONNECTION_STRING!);
    const database = cosmosClient.database('meetings');
    const container = database.container('minutes');
    await container.items.upsert(minutes);
    resolve();
  });
}

// idに紐づくminutesアイテムを取得する
export const getMinutesById = async (Id: string): Promise<minutes> => {
  return new Promise(async (resolve, reject) => {
    console.log(`🚀Cosmos Get minutes by id`);  
    const cosmosClient = new CosmosClient(process.env.COSMOS_CONNECTION_STRING!);
    const database = cosmosClient.database('meetings');
    const container = database.container('minutes');
    const { resources } = await container.items
      .query({
        query: "SELECT * FROM c WHERE c.id = @id",
        parameters: [{ name: "@id", value: Id }]
      })
      .fetchAll();
    resolve(resources[0]);
  });
}