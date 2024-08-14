# IPFlow

## Descrição

**IPFlow** é um sistema de controle de IPs desenvolvido para provedores de internet. O software permite o gerenciamento eficiente de endereços IP, oferecendo funcionalidades como alocação automática, monitoramento em tempo real e geração de relatórios. O sistema é construído com tecnologias web modernas e pode ser transformado em um aplicativo de desktop instalável.

## Funcionalidades Principais

- **Dashboard de IPs**: Exibição de todos os IPs gerenciados, com status atual e informações detalhadas.
- **Alocação Automática**: Sistema de alocação automática de IPs baseado em regras definidas.
- **Histórico de IPs**: Registro do histórico de alocação e liberação de IPs.
- **Notificações**: Alertas sobre conflitos de IP, IPs não utilizados e outros eventos relevantes.
- **Relatórios**: Geração de relatórios sobre a utilização dos IPs para análise de capacidade.

## Tecnologias Utilizadas

- **Frontend**: [React](https://reactjs.org/) - Interface do usuário interativa e responsiva.
- **Backend**: [Node.js](https://nodejs.org/) com [Express](https://expressjs.com/) - API que gerencia as operações de controle de IPs.
- **Banco de Dados**: [MongoDB](https://www.mongodb.com/) - Banco de dados não-relacional para armazenar informações dos IPs.
- **Desktop Wrapper**: [Electron](https://www.electronjs.org/) - Empacota a aplicação web em um aplicativo de desktop multiplataforma.

## Como Executar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/ipflow.git
   cd ipflow
2. **Instale as dependências:**
    ```bash
    npm install
    cd client
    npm install
    cd ..
3. **Execute o backend:**
    ```bash
    Copiar código
    npm run server
4. **Execute o frontend:**
    ```bash
    cd client
    npm start
5. **Empacotar como aplicativo de desktop:**
    ```bash
    Copiar código
    npm run build
    npm run electron

## Transformando em Executável
Para transformar o sistema em um aplicativo instalável:
1. **Build com Electron:**
   ```bash
   npm run electron-pack
2. **Criar instalador:**
    ```bash
    npm run create-installer
3. **Distribuição:**
    - O instalador gerado pode ser distribuído via GitHub Releases ou outras plataformas de distribuição.

## Testes

Execute os testes unitários e funcionais para garantir que tudo esteja funcionando corretamente:
   ```bash
   npm run test
   ```
## Licença
Este projeto está licenciado sob a [MIT License](LICENSE).
