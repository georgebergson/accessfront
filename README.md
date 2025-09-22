# AccessFront - Gerenciamento de Acesso (Frontend Angular)

Este é o frontend Angular para uma aplicação de gerenciamento de acesso, projetado para interagir com um backend Java/Spring Boot. Ele oferece funcionalidades de autenticação, dashboard e gerenciamento de usuários com perfis de acesso distintos (Administrador e Usuário Comum).

## ✨ Funcionalidades

*   **Autenticação Segura:** Login de usuários com JWT (JSON Web Tokens).
*   **Gerenciamento de Sessão:** Armazenamento seguro de dados de autenticação no `localStorage`.
*   **Perfis de Acesso:**
    *   **Administrador (ROLE_ADMIN):**
        *   Acesso total ao Dashboard.
        *   Pode criar novos usuários.
        *   Pode listar e visualizar todos os usuários cadastrados.
        *   Pode editar o perfil (username, password e **role**) de qualquer usuário.
    *   **Usuário Comum (ROLE_USER):**
        *   Acesso ao Dashboard.
        *   Pode editar **apenas o seu próprio perfil** (username e password).
        *   O campo `role` é desabilitado para edição.
        *   É redirecionado para o Dashboard se tentar acessar páginas de gerenciamento de usuários (Criar, Listar, Editar outros usuários).
*   **Navegação Dinâmica:** Menu de navegação que se adapta ao status de login e ao perfil do usuário.
*   **Edição de Perfil Pessoal:** Opção para o usuário logado editar seu próprio perfil diretamente do menu.
*   **Logout Automático:** Ao editar o próprio perfil (seja admin ou usuário comum), o usuário é automaticamente desconectado para reautenticação com as novas credenciais/permissões.

## 🚀 Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas:

*   **Node.js** (versão LTS recomendada)
*   **npm** (gerenciador de pacotes do Node.js, geralmente vem com o Node.js)
*   **Angular CLI** (`npm install -g @angular/cli`)
*   **Backend Java/Spring Boot:** Este frontend requer um backend Java/Spring Boot rodando na porta `8080` (ou configurada para tal) para autenticação e gerenciamento de usuários. Certifique-se de que o backend esteja configurado para:
    *   Expor endpoints de autenticação (`/api/auth/login`).
    *   Expor endpoints de gerenciamento de usuários (`/api/auth/users`).
    *   Retornar o `id`, `token`, `role` e `admin` na resposta de login.
    *   Ter a configuração **CORS** adequada para permitir requisições do `http://localhost:4200`.

## 📦 Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/georgebergson/accessfront
    cd accessFront
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    # ou yarn install
    ```

## ⚙️ Configuração do Backend (Crucial!)

Este frontend espera que um backend esteja rodando em `http://localhost:8080`.

**Certifique-se de que seu backend Java/Spring Boot esteja configurado para:**

1.  **Endpoints:**
    *   `POST http://localhost:8080/api/auth/login` para autenticação.
    *   `GET http://localhost:8080/api/auth/users` para listar usuários.
    *   `GET http://localhost:8080/api/auth/users/{id}` para obter um usuário específico.
    *   `POST http://localhost:8080/api/auth/users` para criar um usuário.
    *   `PUT http://localhost:8080/api/auth/users/{id}` para atualizar um usuário.
2.  **Resposta de Login:** O endpoint de login deve retornar um JSON contendo `id` (ID do usuário), `token` (JWT), `role` (perfil do usuário, ex: "ROLE_ADMIN", "ROLE_USER") e `admin` (booleano indicando se é admin). Exemplo:
    ```json
    {
        "id": 1,
        "token": "eyJhbGciOiJIUzM4NCJ9...",
        "role": "ROLE_ADMIN",
        "admin": true
    }
    ```
3.  **CORS (Cross-Origin Resource Sharing):** É **fundamental** que seu backend permita requisições do frontend. Para Spring Boot, você pode adicionar uma configuração global como esta:

    ```java
    // Exemplo de configuração CORS no backend Spring Boot
    import org.springframework.context.annotation.Configuration;
    import org.springframework.web.servlet.config.annotation.CorsRegistry;
    import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

    @Configuration
    public class WebConfig implements WebMvcConfigurer {

        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry.addMapping("/**") // Aplica a todos os endpoints
                    .allowedOrigins("http://localhost:4200") // Permite o frontend Angular
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Métodos permitidos
                    .allowedHeaders("*") // Permite todos os cabeçalhos
                    .allowCredentials(true); // Permite credenciais (cookies, headers de auth)
        }
    }
    ```
    **Lembre-se de reiniciar seu servidor backend após qualquer alteração de configuração.**

## ▶️ Rodando a Aplicação

1.  **Certifique-se de que seu backend esteja rodando.**
2.  **Inicie o servidor de desenvolvimento Angular:**
    ```bash
    ng serve
    ```
3.  Abra seu navegador e navegue para `http://localhost:4200`.

## 🗺️ Rotas da Aplicação

*   **`/login`**: Página de login.
*   **`/dashboard`**: Página inicial após o login.
*   **`/create-user`**: Formulário para criar novos usuários (visível apenas para Administradores).
*   **`/list-users`**: Lista de todos os usuários cadastrados (visível apenas para Administradores).
*   **`/edit-user/:id`**: Formulário para editar um usuário específico.
    *   **Administradores:** Podem acessar e editar qualquer usuário.
    *   **Usuários Comuns:** Podem acessar e editar **apenas o seu próprio perfil** (o ID na URL deve corresponder ao seu ID logado).

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
