// src/models/Client.ts

/**
 * Representa um endereço no cadastro do cliente.
 */
export type Address = {
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
};

/**
 * Representa um contato do cliente.
 * - Ao menos um contato deve ter "isPrimary = true".
 */
export type Contact = {
  email: string;
  phone: string;
  isPrimary: boolean;
};

/**
 * Representa o objeto de Cliente armazenado no DynamoDB.
 */
export interface Client {
  clientId: string; // chave única (UUID ou gerada)
  fullName: string; // Nome completo
  birthDate: string; // Data de nascimento (ISO string ou yyyy-MM-dd)
  active: boolean; // Status se está ativo ou inativo
  addresses: Address[]; // Lista de endereços
  contacts: Contact[]; // Lista de contatos (um deve ser principal)
}
