"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientService = void 0;
const crypto_1 = require("crypto");
/**
 * Camada de serviço contendo regras de negócio relacionadas a Clientes.
 */
class ClientService {
    clientRepository;
    constructor(clientRepository) {
        this.clientRepository = clientRepository;
    }
    /**
     * Cria um cliente novo após realizar validações.
     * Gera um clientId único caso não exista.
     */
    async createClient(client) {
        // Valida se ao menos um contato é principal
        if (!client.contacts || client.contacts.length === 0) {
            throw new Error("É necessário pelo menos um contato.");
        }
        const hasPrimary = client.contacts.some((c) => c.isPrimary);
        if (!hasPrimary) {
            throw new Error("Ao menos um contato deve ser marcado como principal.");
        }
        // Gera ID único, caso não fornecido
        const finalClient = {
            clientId: client.clientId || (0, crypto_1.randomUUID)(),
            fullName: client.fullName || "",
            birthDate: client.birthDate || "",
            active: client.active ?? true,
            addresses: client.addresses || [],
            contacts: client.contacts,
        };
        // Salva no DynamoDB
        await this.clientRepository.createClient(finalClient);
        return finalClient;
    }
    /**
     * Retorna um cliente específico.
     */
    async getClient(clientId) {
        return this.clientRepository.getClient(clientId);
    }
    /**
     * Atualiza os dados do cliente.
     * Mantém as mesmas regras de validação que no create.
     */
    async updateClient(client) {
        if (!client.contacts || client.contacts.length === 0) {
            throw new Error("É necessário pelo menos um contato.");
        }
        const hasPrimary = client.contacts.some((c) => c.isPrimary);
        if (!hasPrimary) {
            throw new Error("Ao menos um contato deve ser marcado como principal.");
        }
        await this.clientRepository.updateClient(client);
    }
    /**
     * Remove o cliente do sistema.
     */
    async deleteClient(clientId) {
        await this.clientRepository.deleteClient(clientId);
    }
    /**
     * Lista todos os clientes cadastrados.
     */
    async listClients() {
        return this.clientRepository.listClients();
    }
}
exports.ClientService = ClientService;
