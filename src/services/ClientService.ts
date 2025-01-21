// src/services/ClientService.ts
import { Client, Contact } from "../models/Client";
import { ClientRepository } from "../repositories/ClientRepository";
import { randomUUID } from "crypto";

/**
 * Camada de serviço contendo regras de negócio relacionadas a Clientes.
 */
export class ClientService {
  private clientRepository: ClientRepository;

  constructor(clientRepository: ClientRepository) {
    this.clientRepository = clientRepository;
  }

  /**
   * Cria um cliente novo após realizar validações.
   * Gera um clientId único caso não exista.
   */
  async createClient(client: Partial<Client>): Promise<Client> {
    // Valida se ao menos um contato é principal
    if (!client.contacts || client.contacts.length === 0) {
      throw new Error("É necessário pelo menos um contato.");
    }
    const hasPrimary = client.contacts.some((c) => c.isPrimary);
    if (!hasPrimary) {
      throw new Error("Ao menos um contato deve ser marcado como principal.");
    }

    // Gera ID único, caso não fornecido
    const finalClient: Client = {
      clientId: client.clientId || randomUUID(),
      fullName: client.fullName || "",
      birthDate: client.birthDate || "",
      active: client.active ?? true, // default: true
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
  async getClient(clientId: string): Promise<Client | null> {
    return this.clientRepository.getClient(clientId);
  }

  /**
   * Atualiza os dados do cliente.
   * Mantém as mesmas regras de validação que no create.
   */
  async updateClient(client: Client): Promise<void> {
    if (!client.contacts || client.contacts.length === 0) {
      throw new Error("É necessário pelo menos um contato.");
    }

    const hasPrimary = client.contacts.some((c: Contact) => c.isPrimary);
    if (!hasPrimary) {
      throw new Error("Ao menos um contato deve ser marcado como principal.");
    }

    await this.clientRepository.updateClient(client);
  }

  /**
   * Remove o cliente do sistema.
   */
  async deleteClient(clientId: string): Promise<void> {
    await this.clientRepository.deleteClient(clientId);
  }

  /**
   * Lista todos os clientes cadastrados.
   */
  async listClients(): Promise<Client[]> {
    return this.clientRepository.listClients();
  }
}
