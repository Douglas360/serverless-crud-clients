---

## **Endpoints da API**

| Método | Endpoint                  | Descrição                   |
|--------|---------------------------|-----------------------------|
| POST   | `/clients`                 | Cria um novo cliente        |
| GET    | `/clients/{clientId}`       | Obtém um cliente específico |
| PUT    | `/clients/{clientId}`       | Atualiza dados do cliente   |
| DELETE | `/clients/{clientId}`       | Exclui um cliente           |

---

## **Tecnologias Utilizadas**

- **AWS Lambda:** Processamento serverless
- **AWS API Gateway:** Gerenciamento de API REST
- **AWS DynamoDB:** Banco de dados NoSQL
- **AWS CloudFormation:** Infraestrutura como código (IaC)
- **TypeScript:** Linguagem de programação
- **Node.js:** Plataforma de execução
- **Postman:** Teste de API

---

## **Problemas Comuns e Soluções**

- **Erro `Missing Authentication Token`:**

  - Certifique-se de que está acessando a URL correta da API.
  - Adicione `/clients` ao final do caminho ao fazer requisições.

- **Erro `The specified key does not exist`:**

  - Confirme se o arquivo ZIP foi enviado corretamente para o S3.

- **Erro `É necessário pelo menos um contato`:**
  - Certifique-se de enviar pelo menos um contato com `isPrimary: true`.

---

## **Licença**

Este projeto está licenciado sob a [MIT License](LICENSE).
