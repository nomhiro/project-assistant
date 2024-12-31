import {
  CosmosClient,
  Database,
  Container,
} from "@azure/cosmos";
import { Project } from "../../types/types";

// プロジェクトを全取得
export const getProjects = async (): Promise<Project[]> => {
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
      
      const projects: Project[] = resources.map((resource: any) => {
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