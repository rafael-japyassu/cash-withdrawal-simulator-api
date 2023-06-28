# API Cash Withdrawal Simulator

#### Pre requisito para rodar a aplicação:
- Node.js (versão lts) [Download](https://nodejs.org/en/download)
- Docker [Download](https://www.docker.com/products/docker-desktop/)

#### Setup da aplicação
1 - Instale as dependências da aplicação:
```shell
yarn install
```

2 - Crie um arquivo `.env` com base no `.env.sample` e preencha as variáveis de ambiente

3 - Crie o banco de dados da aplicação com o docker:
```shell
docker-compose up -d
```

4 - Execute o comando para subir as migrations:
```shell
yarn db:migration:up
```

5 - Rode a aplicação:
```shell
yarn dev
```

#### Executar testes

1 - Rodar testes da aplicação:
```shell
yarn test
```

2 - Rodar testes da aplicação com coverage:
```shell
yarn test:coverage
```

