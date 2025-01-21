// src/utils/DynamoDBClient.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

/**
 * Classe responsável por fornecer uma instância única do DynamoDBClient.
 */
export class DynamoDBClientSingleton {
  private static instance: DynamoDBClient;

  private constructor() {
    // Construtor privado para impedir múltiplas instâncias
  }

  /**
   * Retorna a instância singleton do DynamoDBClient.
   */
  public static getInstance(): DynamoDBClient {
    if (!this.instance) {
      this.instance = new DynamoDBClient({});
    }
    return this.instance;
  }
}
