"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRepository = void 0;
// src/repositories/ClientRepository.ts
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
/**
 * Classe responsável por interagir com a tabela de Clients no DynamoDB.
 */
class ClientRepository {
    tableName;
    dbClient;
    constructor(tableName, dbClient) {
        this.tableName = tableName;
        this.dbClient = dbClient;
    }
    /**
     * Cria um novo cliente na tabela DynamoDB.
     * @param client Objeto do cliente a ser criado
     */
    async createClient(client) {
        const params = {
            TableName: this.tableName,
            Item: (0, util_dynamodb_1.marshall)(client),
        };
        await this.dbClient.send(new client_dynamodb_1.PutItemCommand(params));
    }
    /**
     * Retorna um cliente com base em seu clientId.
     * @param clientId
     */
    async getClient(clientId) {
        const params = {
            TableName: this.tableName,
            Key: (0, util_dynamodb_1.marshall)({ clientId }),
        };
        const result = await this.dbClient.send(new client_dynamodb_1.GetItemCommand(params));
        if (!result.Item) {
            return null;
        }
        return (0, util_dynamodb_1.unmarshall)(result.Item);
    }
    /**
     * Atualiza um cliente existente.
     * Neste exemplo, atualizamos todos os campos. Opcionalmente, você pode
     * montar instruções de Update parciais com ExpressionAttributeNames/Values.
     * @param client Objeto do cliente atualizado
     */
    async updateClient(client) {
        // Exemplo simples: substituição completa, usando PutItem
        // Alternativamente, poderíamos usar UpdateItemCommand com expression.
        const params = {
            TableName: this.tableName,
            Item: (0, util_dynamodb_1.marshall)(client),
        };
        await this.dbClient.send(new client_dynamodb_1.PutItemCommand(params));
    }
    /**
     * Exclui um cliente pelo clientId.
     * @param clientId
     */
    async deleteClient(clientId) {
        const params = {
            TableName: this.tableName,
            Key: (0, util_dynamodb_1.marshall)({ clientId }),
        };
        await this.dbClient.send(new client_dynamodb_1.DeleteItemCommand(params));
    }
    /**
     * Lista todos os clientes da tabela.
     * Em produção, poderia usar paginação (LastEvaluatedKey).
     */
    async listClients() {
        const params = {
            TableName: this.tableName,
        };
        const result = await this.dbClient.send(new client_dynamodb_1.ScanCommand(params));
        const items = result.Items || [];
        return items.map((item) => (0, util_dynamodb_1.unmarshall)(item));
    }
}
exports.ClientRepository = ClientRepository;
