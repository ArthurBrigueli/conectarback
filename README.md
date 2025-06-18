Backend (Nest.js + MySQL)


(LOGIN ADMIN)
- Email: admin@gmail.com
- Password: admin


1. Certifique-se de que o MySQL está instalado e rodando em sua máquina:
     - https://www.mysql.com/products/community/

2. Dentro do mysql crie o banco de dados conectar e conectar_test

   - create database conectar;
   - create database conectar_test;


2. Clone o repositório:
   - git clone https://github.com/ArthurBrigueli/conectarback.git


3. Acesse a pasta do backend:
   - cd conectarback


4. Instale as dependências:
   - npm install

5. Configuração de credenciais OAuth (Google) para configurar o .env

     Para utilizar o login com Google, é necessário configurar suas credenciais:

     Acesse o Google Cloud Console
        - https://console.cloud.google.com/

     Clique em SELECIONAR PROJETO, caso nao tenha voce pode criar na mesma opção

     Vá em acesso rapido e clique em APIs e serviços
     Vá para credenciais
   
     Clique em "Criar credenciais" > "ID do cliente OAuth"
     Escolha Aplicativo da Web

     Origens JavaScript autorizadas
        use a mesma URL que o frontend inicia: (exemplo) http://localhost:5173
   
     Em URIs de redirecionamento autorizados, adicione:
        - http://localhost:3000/auth/google/redirect
   
     Copie o Client ID e o Client Secret para usar no .env
        - GOOGLE_CLIENT_ID=ID_DO_CLIENTE
        - GOOGLE_CLIENT_SECRET=CHAVE_SECRETA_DO_CLIENTE
   

5. Crie os arquivos de ambiente `.env` e `.env.test` na raiz do backend com o seguinte conteúdo:

   - .env:
        DB_HOST=localhost
        DB_PORT=3306
        DB_USER=seu_user
        DB_PASS=sua_senha
        DB_NAME=conectar
        GOOGLE_CLIENT_ID=ID_DO_CLIENTE
        GOOGLE_CLIENT_SECRET=CHAVE_SECRETA_DO_CLIENTE

   - .env.test:
        DB_HOST=localhost
        DB_PORT=3306
        DB_USER=seu_user
        DB_PASS=sua_senha
        DB_NAME=conectar_test


6. Rodar testes:

   - Testes unitários:
     npm run test

   - Testes de integração (end-to-end):
     npm run test:e2e


7. Iniciar a API em modo desenvolvimento:
   - npm run start:dev


 Observações finais

- Verifique se as portas configuradas no backend e no `.env` do frontend estão corretas e batem (ex: backend rodando na 3000).
- Certifique-se de que o frontend esteja liberado pelo Cors indo no arquivo main.ts e colocando a mesma porta que o Frontend inicia
