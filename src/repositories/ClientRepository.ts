// src/repositories/ClientRepository.ts
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Client } from "../models/Client";

/**
 * Classe responsável por interagir com a tabela de Clients no DynamoDB.
 */
export class ClientRepository {
  private tableName: string;
  private dbClient: DynamoDBClient;

  constructor(tableName: string, dbClient: DynamoDBClient) {
    this.tableName = tableName;
    this.dbClient = dbClient;
  }

  /**
   * Cria um novo cliente na tabela DynamoDB.
   * @param client Objeto do cliente a ser criado
   */
  async createClient(client: Client): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: marshall(client),
    };

    await this.dbClient.send(new PutItemCommand(params));
  }

  /**
   * Retorna um cliente com base em seu clientId.
   * @param clientId
   */
  async getClient(clientId: string): Promise<Client | null> {
    const params = {
      TableName: this.tableName,
      Key: marshall({ clientId }),
    };

    const result = await this.dbClient.send(new GetItemCommand(params));
    if (!result.Item) {
      return null;
    }

    return unmarshall(result.Item) as Client;
  }

  /**
   * Atualiza um cliente existente.
   * Neste exemplo, atualizamos todos os campos. Opcionalmente, você pode
   * montar instruções de Update parciais com ExpressionAttributeNames/Values.
   * @param client Objeto do cliente atualizado
   */
  async updateClient(client: Client): Promise<void> {
    // Exemplo simples: substituição completa, usando PutItem
    // Alternativamente, poderíamos usar UpdateItemCommand com expression.
    const params = {
      TableName: this.tableName,
      Item: marshall(client),
    };
    await this.dbClient.send(new PutItemCommand(params));
  }

  /**
   * Exclui um cliente pelo clientId.
   * @param clientId
   */
  async deleteClient(clientId: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: marshall({ clientId }),
    };

    await this.dbClient.send(new DeleteItemCommand(params));
  }

  /**
   * Lista todos os clientes da tabela.
   * Em produção, poderia usar paginação (LastEvaluatedKey).
   */
  async listClients(): Promise<Client[]> {
    const params = {
      TableName: this.tableName,
    };

    const result = await this.dbClient.send(new ScanCommand(params));
    const items = result.Items || [];
    return items.map((item) => unmarshall(item) as Client);
  }
}
