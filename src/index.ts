// src/index.ts
import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClientSingleton } from "./utils/DynamoDBClient";
import { ClientRepository } from "./repositories/ClientRepository";
import { ClientService } from "./services/ClientService";
import { Client } from "./models/Client";

// Obtemos a instância do DynamoDB e nome da tabela via variáveis de ambiente
const dbClient = DynamoDBClientSingleton.getInstance();
const tableName = process.env.DYNAMODB_TABLE || "ClientsTable";

// Criamos instâncias únicas do repository e service
const clientRepository = new ClientRepository(tableName, dbClient);
const clientService = new ClientService(clientRepository);

/**
 * Handler principal: roteia as requisições HTTP vindas do API Gateway.
 */
export async function handler(
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  try {
    const httpMethod = event.httpMethod;
    const path = event.path;
    const pathParams = event.pathParameters || {};
    const body = event.body ? JSON.parse(event.body) : null;
    let result;

    // Roteamento simples baseado em path e método
    if (path === "/clients" && httpMethod === "GET") {
      // LISTAR TODOS
      result = await clientService.listClients();
      return createResponse(200, result);
    }

    if (path === "/clients" && httpMethod === "POST") {
      // CRIAR
      const created = await clientService.createClient(body);
      return createResponse(201, created);
    }

    if (pathParams.id && path.startsWith("/clients/")) {
      const clientId = pathParams.id;

      if (httpMethod === "GET") {
        // OBTER
        const client = await clientService.getClient(clientId);
        if (!client) {
          return createResponse(404, { message: "Cliente não encontrado" });
        }
        return createResponse(200, client);
      }

      if (httpMethod === "PUT") {
        // ATUALIZAR
        // Montamos objeto do cliente com as informações no body
        const clientToUpdate: Client = {
          clientId,
          fullName: body.fullName,
          birthDate: body.birthDate,
          active: body.active,
          addresses: body.addresses,
          contacts: body.contacts,
        };
        await clientService.updateClient(clientToUpdate);
        return createResponse(200, {
          message: "Cliente atualizado com sucesso",
        });
      }

      if (httpMethod === "DELETE") {
        // EXCLUIR
        await clientService.deleteClient(clientId);
        return createResponse(200, { message: "Cliente excluído com sucesso" });
      }
    }

    // Se chegou aqui, rota não encontrada
    return createResponse(404, { message: "Rota não encontrada" });
  } catch (error: any) {
    console.error("Erro na Lambda:", error);
    return createResponse(500, {
      message: "Erro interno no servidor",
      error: error.message,
    });
  }
}

/**
 * Função utilitária para criar respostas no formato
 * APIGatewayProxyResult, com JSON stringify e CORS simples.
 */
function createResponse(statusCode: number, body: any): APIGatewayProxyResult {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(body),
  };
}
