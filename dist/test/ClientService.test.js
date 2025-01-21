"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// test/ClientService.test.ts
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const ClientService_1 = require("../services/ClientService");
const ClientRepository_1 = require("../repositories/ClientRepository");
/**
 * Mock do ClientRepository para testes.
 * Evita chamadas reais ao DynamoDB.
 */
class MockClientRepository extends ClientRepository_1.ClientRepository {
    store = {};
    constructor() {
        super("TestTable", {});
    }
    async createClient(client) {
        this.store[client.clientId] = client;
    }
    async getClient(clientId) {
        return this.store[clientId] || null;
    }
    async updateClient(client) {
        if (this.store[client.clientId]) {
            this.store[client.clientId] = client;
        }
    }
    async deleteClient(clientId) {
        delete this.store[clientId];
    }
    async listClients() {
        return Object.values(this.store);
    }
}
let mockRepo;
let clientService;
(0, node_test_1.beforeEach)(() => {
    // Executado antes de cada teste
    mockRepo = new MockClientRepository();
    clientService = new ClientService_1.ClientService(mockRepo);
});
(0, node_test_1.test)("Deve criar cliente com sucesso (contato principal presente)", async () => {
    const clientPartial = {
        fullName: "Fulano de Tal",
        birthDate: "2000-01-01",
        contacts: [
            {
                email: "principal@example.com",
                phone: "99999-9999",
                isPrimary: true,
            },
            {
                email: "secundario@example.com",
                phone: "88888-8888",
                isPrimary: false,
            },
        ],
    };
    const createdClient = await clientService.createClient(clientPartial);
    const fetched = await mockRepo.getClient(createdClient.clientId);
    node_assert_1.default.strictEqual(fetched?.fullName, "Fulano de Tal");
    node_assert_1.default.strictEqual(fetched?.contacts[0].email, "principal@example.com");
    node_assert_1.default.strictEqual(fetched?.active, true, "Cliente deve estar ativo por padrão");
});
(0, node_test_1.test)("Não deve criar cliente sem contato principal", async () => {
    const clientPartial = {
        fullName: "Ciclano de Tal",
        birthDate: "1990-05-10",
        contacts: [
            {
                email: "secundario@example.com",
                phone: "77777-7777",
                isPrimary: false,
            },
        ],
    };
    try {
        await clientService.createClient(clientPartial);
        node_assert_1.default.fail("Deveria lançar erro de falta de contato principal");
    }
    catch (error) {
        node_assert_1.default.match(error.message, /principal/, "Mensagem de erro deve indicar ausência de contato principal");
    }
});
(0, node_test_1.test)("Deve listar clientes", async () => {
    // Cadastra 2 clientes
    await clientService.createClient({
        fullName: "Cliente 1",
        birthDate: "1999-12-31",
        contacts: [
            {
                email: "c1@example.com",
                phone: "1234-5678",
                isPrimary: true,
            },
        ],
    });
    await clientService.createClient({
        fullName: "Cliente 2",
        birthDate: "1985-06-10",
        contacts: [
            {
                email: "c2@example.com",
                phone: "8765-4321",
                isPrimary: true,
            },
        ],
    });
    const all = await clientService.listClients();
    node_assert_1.default.strictEqual(all.length, 2, "Deve haver 2 clientes cadastrados");
});
