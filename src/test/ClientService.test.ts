// test/ClientService.test.ts
import { test, beforeEach } from "node:test";
import assert from "node:assert";
import { ClientService } from "../services/ClientService";
import { ClientRepository } from "../repositories/ClientRepository";
import { Client } from "../models/Client";

/**
 * Mock do ClientRepository para testes.
 * Evita chamadas reais ao DynamoDB.
 */
class MockClientRepository extends ClientRepository {
  private store: Record<string, Client> = {};

  constructor() {
    super("TestTable", {} as any);
  }

  async createClient(client: Client): Promise<void> {
    this.store[client.clientId] = client;
  }

  async getClient(clientId: string): Promise<Client | null> {
    return this.store[clientId] || null;
  }

  async updateClient(client: Client): Promise<void> {
    if (this.store[client.clientId]) {
      this.store[client.clientId] = client;
    }
  }

  async deleteClient(clientId: string): Promise<void> {
    delete this.store[clientId];
  }

  async listClients(): Promise<Client[]> {
    return Object.values(this.store);
  }
}

let mockRepo: MockClientRepository;
let clientService: ClientService;

beforeEach(() => {
  // Executado antes de cada teste
  mockRepo = new MockClientRepository();
  clientService = new ClientService(mockRepo);
});

test("Deve criar cliente com sucesso (contato principal presente)", async () => {
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

  assert.strictEqual(fetched?.fullName, "Fulano de Tal");
  assert.strictEqual(fetched?.contacts[0].email, "principal@example.com");
  assert.strictEqual(
    fetched?.active,
    true,
    "Cliente deve estar ativo por padrão"
  );
});

test("Não deve criar cliente sem contato principal", async () => {
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
    assert.fail("Deveria lançar erro de falta de contato principal");
  } catch (error: any) {
    assert.match(
      error.message,
      /principal/,
      "Mensagem de erro deve indicar ausência de contato principal"
    );
  }
});

test("Deve listar clientes", async () => {
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
  assert.strictEqual(all.length, 2, "Deve haver 2 clientes cadastrados");
});
