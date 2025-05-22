# Sistema de Gerenciamento CCR

![Logo CCR](public/imagens/logo_viamobilidade.png)

## Visão Geral

O Sistema de Gerenciamento CCR é uma aplicação web desenvolvida para gerenciar incidentes, usuários e recursos da empresa. A plataforma permite o registro, acompanhamento e resolução de incidentes, com diferentes níveis de acesso para administradores e usuários comuns.

## Tecnologias Utilizadas

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Java Spring Boot (API RESTful)
- **Autenticação**: JWT (JSON Web Tokens)
- **Estilização**: Tailwind CSS, Font Awesome
- **Armazenamento**: Banco de dados relacional (acessado via API)

## Requisitos

- Node.js 18.x ou superior
- NPM 9.x ou superior
- Java 17 ou superior (para o backend)
- Acesso à API backend (configurável via variáveis de ambiente)

## Instalação e Configuração

### 1. Clone o repositório

\`\`\`bash
git clone https://github.com/alunostdspa/Sprint4_FrontEnd_1TDSPA.git
cd ccr-sistema
\`\`\`

### 2. Instale as dependências

\`\`\`bash
npm install
\`\`\`

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

\`\`\`
NEXT_PUBLIC_API_URL=https://ccr-api-snk9.onrender.com/api
DB_URL=jdbc:oracle:thin:@oracle.fiap.com.br:1521:ORCL
DB_USER=rm559617
DB_PASSWORD=180794
\`\`\`

Ajuste as URLs conforme necessário para apontar para o seu backend.

### 4. Inicie o servidor de desenvolvimento

\`\`\`bash
npm run dev
\`\`\`

A aplicação estará disponível em `http://localhost:3000` || `https://front-end-1-tdspa-sprint4.vercel.app/login`.

### 5. Build para produção

\`\`\`bash
npm run build
npm start
\`\`\`

## Estrutura do Projeto

\`\`\`
├── app/                    # Diretório principal da aplicação Next.js
│   ├── actions/            # Server Actions
│   ├── admin/              # Páginas de administração
│   ├── api/                # Rotas de API
│   ├── dashboard/          # Dashboard do usuário
│   ├── editar-conta/       # Edição de perfil
│   ├── historico/          # Histórico de incidentes
│   ├── incidente/          # Detalhes de incidentes
│   ├── login/              # Página de login
│   ├── notificacao/        # Notificações de incidentes
│   ├── registro-escolha/   # Escolha de tipo de registro
│   ├── registro-incidente/ # Registro de incidente com foto
│   ├── registro-incidente-simples/ # Registro de incidente simples
│   ├── globals.css         # Estilos globais
│   └── layout.tsx          # Layout principal
├── components/             # Componentes reutilizáveis
├── context/                # Contextos React (AuthContext)
├── public/                 # Arquivos estáticos
│   └── imagens/            # Imagens do sistema
│       └── incidente/      # Imagens de incidentes
├── services/               # Serviços de API
└── middleware.ts           # Middleware de autenticação
\`\`\`

## Funcionalidades Principais

### Autenticação e Autorização

- Login com email e senha
- Autenticação baseada em JWT
- Controle de acesso baseado em cargos (ADMIN, MANAGER, USER, OPERATOR)
- Middleware para proteção de rotas

### Gerenciamento de Incidentes

- Registro de incidentes com ou sem foto
- Visualização de incidentes não resolvidos (notificações)
- Histórico completo de incidentes com filtros
- Detalhes de incidentes com opção de resolução
- Upload de imagens para documentação de incidentes

### Administração

- Painel administrativo para gerentes e administradores
- Gerenciamento de incidentes (editar, resolver, excluir)
- Visualização de informações do usuário

### Perfil de Usuário

- Visualização e edição de informações pessoais
- Alteração de senha

## Guia de Uso

### Acesso ao Sistema

1. Acesse a página de login (`/login`)
2. Insira suas credenciais (email e senha)
3. Usuarios recomendados para teste ( email: admin@ccr.com.br senha:admin1) com acesso a pagina admin possibilitando edição dos incidentes e acesso as paginas de um usuario padrão tambem e ( email: ana.costa@ccr.com.br senha: senha) usuario comum podendo apenas criar incidentes e editar suas proprias infos
4. O sistema redirecionará automaticamente para o dashboard apropriado com base no seu cargo

### Registro de Incidentes

1. Acesse "Novo Incidente" no dashboard ou na página de notificações
2. Escolha entre registro simples ou com foto
3. Preencha os detalhes do incidente (tipo, gravidade, localização, descrição)
4. Para registro com foto, faça upload de uma imagem
5. Envie o formulário para registrar o incidente

### Visualização de Incidentes

- **Notificações**: Mostra incidentes não resolvidos
- **Histórico**: Exibe todos os incidentes com opções de filtro
- **Detalhes**: Clique em um incidente para ver informações completas

### Administração de Incidentes

1. Acesse o painel administrativo (`/admin`)
2. Navegue para "Gerenciar Incidentes"
3. Use as opções para editar, resolver ou excluir incidentes

### Edição de Perfil

1. Acesse "Meu Perfil" no dashboard
2. Edite suas informações pessoais
3. Para alterar a senha, use a seção específica na página de edição de perfil

## API e Endpoints

O sistema se comunica com uma API RESTful. Os principais endpoints são:

### Autenticação

- `POST /api/login`: Autenticação de usuário
- `GET /api/usuarios/me`: Obter dados do usuário atual

### Incidentes

- `GET /api/incidentes`: Listar todos os incidentes
- `GET /api/incidentes/{id}`: Obter detalhes de um incidente
- `POST /api/incidentes`: Criar novo incidente
- `PUT /api/incidentes/{id}`: Atualizar incidente
- `DELETE /api/incidentes/{id}`: Excluir incidente
- `PUT /api/incidentes/{id}/resolver`: Marcar incidente como resolvido

### Usuários

- `GET /api/usuarios/{id}`: Obter dados de um usuário
- `PUT /api/usuarios/{id}`: Atualizar dados de um usuário

## Solução de Problemas Comuns

### Erro de Autenticação

Se você encontrar erros de autenticação:
- Verifique se suas credenciais estão corretas
- Certifique-se de que o token JWT não expirou
- Limpe o armazenamento local do navegador e tente novamente

### Problemas com Upload de Imagens

Se o upload de imagens não funcionar:
- Verifique se a pasta `public/imagens/incidente` existe e tem permissões de escrita
- Certifique-se de que o tamanho da imagem não excede o limite permitido
- Verifique se o formato da imagem é suportado (JPG, PNG, GIF)

### Erros de API

Se ocorrerem erros de comunicação com a API:
- Verifique se a API está em execução e acessível
- Confirme se as variáveis de ambiente estão configuradas corretamente
- Verifique os logs do console para mensagens de erro específicas

## Contribuição e Desenvolvimento

### Ambiente de Desenvolvimento

1. Configure o ambiente conforme as instruções de instalação
2. Use `npm run dev` para iniciar o servidor de desenvolvimento
3. As alterações no código serão refletidas automaticamente

### Padrões de Código

- Use TypeScript para todos os componentes e funções
- Siga o padrão de nomenclatura kebab-case para arquivos
- Utilize os componentes e estilos existentes para manter a consistência

### Adição de Novas Funcionalidades

1. Crie um branch para sua funcionalidade
2. Implemente e teste a funcionalidade
3. Envie um pull request para revisão

## Licença

Este projeto é propriedade da CCR e seu uso é restrito aos termos estabelecidos pela empresa.

## Contato

Para suporte ou dúvidas, entre em contato com a equipe de desenvolvimento.
