"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDBClientSingleton = void 0;
// src/utils/DynamoDBClient.ts
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
/**
 * Classe responsável por fornecer uma instância única do DynamoDBClient.
 */
class DynamoDBClientSingleton {
    static instance;
    constructor() {
        // Construtor privado para impedir múltiplas instâncias
    }
    /**
     * Retorna a instância singleton do DynamoDBClient.
     */
    static getInstance() {
        if (!this.instance) {
            this.instance = new client_dynamodb_1.DynamoDBClient({});
        }
        return this.instance;
    }
}
exports.DynamoDBClientSingleton = DynamoDBClientSingleton;
