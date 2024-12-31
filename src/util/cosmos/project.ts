import {
  CosmosClient
} from "@azure/cosmos";
import { project } from "../../types/types";

// プロジェクトを全取得
export const getProjects = async (): Promise<project[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const cosmosClient = new CosmosClient(process.env.COSMOS_CONNECTION_STRING!);
      const database = "projects";
      const container = "projects";
      
      const databaseInstance = cosmosClient.database(database);
      const containerInstance = databaseInstance.container(container);
      const querySpec = {
        query: `SELECT c.id, c.name, c.description, c["order"] FROM c ORDER BY c["order"]`,
      };
      const { resources } = await containerInstance.items.query(querySpec).fetchAll();
      
      const projects: project[] = resources.map((resource: { id: string; name: string; description: string; order: number; }) => {
        return {
          id: resource.id,
          name: resource.name,
          description: resource.description,
          order: resource.order,
        };
      });

      resolve(projects);
    } catch (error) {
      reject(error);
    }
  });
};