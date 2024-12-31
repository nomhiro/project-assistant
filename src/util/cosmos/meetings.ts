import {
  CosmosClient,
} from "@azure/cosmos";
import { Meeting } from "../../types/types";

// ミーティングを全取得
export const getMeetingsByProjectId = async (projectId: string): Promise<Meeting[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const cosmosClient = new CosmosClient(process.env.COSMOS_CONNECTION_STRING!);
      const database = "meetings";
      const container = "meetings";
      
      const databaseInstance = cosmosClient.database(database);
      const containerInstance = databaseInstance.container(container);
      const querySpec = {
        query: `SELECT c.id, c.project_id, c.name, c.description, c["order"] FROM c WHERE c.project_id = @projectId ORDER BY c["order"]`,
        parameters: [
          { name: "@projectId", value: projectId }
        ]
      };
      const { resources } = await containerInstance.items.query(querySpec).fetchAll();
      
      const meetings: Meeting[] = resources.map((resource: { id: string; project_id: string; name: string; description: string; order: number; }) => {
        return {
          id: resource.id,
          project_id: resource.project_id,
          name: resource.name,
          description: resource.description,
          order: resource.order,
        };
      });

      resolve(meetings);
    } catch (error) {
      reject(error);
    }
  });
};