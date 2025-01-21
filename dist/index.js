"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const DynamoDBClient_1 = require("./utils/DynamoDBClient");
const ClientRepository_1 = require("./repositories/ClientRepository");
const ClientService_1 = require("./services/ClientService");
// Obtemos a instância do DynamoDB e nome da tabela via variáveis de ambiente
const dbClient = DynamoDBClient_1.DynamoDBClientSingleton.getInstance();
const tableName = process.env.DYNAMODB_TABLE || "ClientsTable";
// Criamos instâncias únicas do repository e service
const clientRepository = new ClientRepository_1.ClientRepository(tableName, dbClient);
const clientService = new ClientService_1.ClientService(clientRepository);
/**
 * Handler principal: roteia as requisições HTTP vindas do API Gateway.
 */
async function handler(event, context) {
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
                const clientToUpdate = {
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
    }
    catch (error) {
        console.error("Erro na Lambda:", error);
        return createResponse(500, {
            message: "Erro interno no servidor",
            error: error.message,
        });
    }
}
exports.handler = handler;
/**
 * Função utilitária para criar respostas no formato
 * APIGatewayProxyResult, com JSON stringify e CORS simples.
 */
function createResponse(statusCode, body) {
    return {
        statusCode,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(body),
    };
}
