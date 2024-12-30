import {
  CosmosClient,
  Database,
  Container,
} from "@azure/cosmos";
import { minutes_chunk } from '@/types/types';

// minutes_chunkアイテムを登録する
export const upsertMinutesChunk = async (minutesChunk: minutes_chunk): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const cosmosClient = new CosmosClient(process.env.COSMOS_CONNECTION_STRING!);
    const database = cosmosClient.database('meetings');
    const container = database.container('minutes_chunk');
    await container.items.upsert(minutesChunk);
    resolve();
  });
}

// ProjectIdでフィルターしたうえでベクトル検索を行う
export const getMinutesChunkByVecFilteredProject = async (embedding: number[], projectId: string): Promise<minutes_chunk[]> => {
  return new Promise(async (resolve, reject) => {
    console.log(` 🚀CosmosDB検索 minutes_chunk by project_id`);
    console.log(`    projectId: ${projectId}`);
    const cosmosClient = new CosmosClient(process.env.COSMOS_CONNECTION_STRING!);
    const database = cosmosClient.database('meetings');
    const container = database.container('minutes_chunk');
    // similarity scoreでフィルター、ソートして、類似度の高い順に取得
    const { resources } = await container.items
      .query({
          query: "SELECT TOP 10 c.id, c.project_id, c.meeting_id, c.minutes_id, c.date, c.minutes_chunk, VectorDistance(c.vector, @embedding) AS SimilarityScore FROM c WHERE c.project_id = @projectId and VectorDistance(c.vector, @embedding) > 0.50 ORDER BY VectorDistance(c.vector, @embedding)",
          parameters: [
            { name: "@embedding", value: embedding },
            { name: "@projectId", value: projectId }
          ]
      })
      .fetchAll();
    for (const item of resources) {
      console.log(`      searched: ${item.id}, ${item.minutes_chunk}, ${item.SimilarityScore}\n`);
    }
    resolve(resources);
  });
};

// ProjectIdとMeetingIdでフィルターしたうえでベクトル検索を行う
export const getMinutesChunkByVecFilteredMeeting = async (embedding: number[], projectId: string, meetingId: string): Promise<minutes_chunk[]> => {
  return new Promise(async (resolve, reject) => {
    console.log(` 🚀CosmosDB検索 minutes_chunk by projectId and meetingId`);
    console.log(`   projectId: ${projectId}, meetingId: ${meetingId}`);
    const cosmosClient = new CosmosClient(process.env.COSMOS_CONNECTION_STRING!);
    const database = cosmosClient.database('meetings');
    const container = database.container('minutes_chunk');
    // similarity scoreでフィルター、ソートして、類似度の高い順に取得
    const { resources } = await container.items
      .query({
        query: "SELECT TOP 10  c.id, c.project_id, c.meeting_id, c.minutes_id, c.date, c.minutes_chunk, VectorDistance(c.vector, @embedding) AS SimilarityScore FROM c WHERE c.project_id = @projectId and c.meeting_id = @meetingId and VectorDistance(c.vector, @embedding) > 0.45 ORDER BY VectorDistance(c.vector, @embedding)",
        parameters: [
          { name: "@embedding", value: embedding },
          { name: "@projectId", value: projectId },
          { name: "@meetingId", value: meetingId }
        ]
      })
        .fetchAll();
    for (const item of resources) {
      console.log(`      searched: ${item.id}, ${item.minutes_chunk}, ${item.SimilarityScore}\n`);
    }
    resolve(resources);
  });
};