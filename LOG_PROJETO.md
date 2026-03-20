# 📄 Diário de Bordo: Desenvolvimento do Aplicativo

## 📌 Sprint 1: Setup, Identidade Visual e Tela de Login
**Período:** Março/2026
**Status:** Concluído ✅

### 1. Infraestrutura e Configuração Inicial
* **Backend:** Repositório inicializado (Spring Boot) e conectado ao banco de dados Supabase via variáveis de ambiente. Teste de persistência validado.
* **Frontend:** Projeto React Native (Expo) criado com suporte a TypeScript. Limpeza do template padrão (`reset-project`) executada.
* **Ambiente:** Configuração de permissões de script no Windows (PowerShell) para execução do `npx`.
* **Arquitetura de Pastas:** Estruturação criada (`src/services`, `src/components`, e `src/assets`) para separar a lógica de negócios da interface.

### 2. Design System e Padronização Visual
* **Paleta de Cores:** Criação do arquivo `constants/Colors.ts` mapeando as cores do protótipo (Laranja Vibrante, Azul Marinho, Cinza de fundo, Branco e cores de borda/texto).
* **Estilização Global:** Implementação da estrutura de `StyleSheet` para evitar código duplicado (DRY) e garantir a consistência de botões e inputs.

### 3. Front-end: Construção da Tela de Login (`login.tsx`)
* **Layout Responsivo:** Implementação do Flexbox e Box Model para estruturação de camadas (Header Laranja, Card de Formulário Branco, Rodapé).
* **Neumorfismo:** Aplicação de bordas arredondadas e sombras (`elevation`) nos campos de texto para dar profundidade ao design.
* **Refatoração e Clean Code (Componentização UI):** 
  * Criação de componentes reutilizáveis e escaláveis (`InputCustomizado` e `BotaoCustomizado`).
  * Implementação de contratos rígidos usando `Interfaces` do TypeScript (Props) para garantir a tipagem correta de dados e funções passadas entre as telas.
  * Botão de login principal e links de navegação.
  * Divisor flexível ("--- or ---") criado com Views dinâmicas.
  * Integração da biblioteca `@expo/vector-icons` (FontAwesome) para os botões sociais (Google e Facebook).
* **Estado (State):** Implementação inicial do Hook `useState` para capturar e armazenar os dados digitados de email e senha na memória do aplicativo.

### 4. Navegação e Roteamento (Expo Router)
* Renomeação do arquivo principal para `login.tsx` para assumir a rota `/login`.
* Criação do arquivo `cadastro.tsx` como esqueleto de destino.
* Configuração do roteamento via `useRouter`, com redirecionamento de links ("Cadastre-se").

---

## 🚧 Sprint 2: Telas Pendentes e Integração (Em Andamento)

### O que falta no Front-end:
* **Splash Screen (`index.tsx`):** Substituir o texto temporário "Sistema iniciando" pela logomarca oficial da UNINASSAU/Projeto e refinar a animação de transição para a tela de Login.
* **Tela de Cadastro (`cadastro.tsx`):** Desenvolver a interface de formulário de cadastro seguindo o mesmo Design System (Neumorfismo) do Login reaproveitando os componentes recém-criados (`InputCustomizado` e `BotaoCustomizado`).

### Próximos Passos (Back-end e Integração):
* **Função Fetch:** Substituir o `console.log` atual do formulário de Login por uma requisição HTTP (`fetch`) real.
* **Desenvolvimento da API:** Criar os endpoints no servidor (Python/Spring Boot) para receber o JSON do aplicativo, validar as credenciais no banco de dados e retornar a resposta (Sucesso/Erro).