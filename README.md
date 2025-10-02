# Projeto de Envio de E-mails

Um sistema completo para gerenciamento e envio de campanhas de e-mail, utilizando o servidor SMTP de escolha do usuário para máxima flexibilidade e controle.

---

## Tecnologias Utilizadas

Este projeto é dividido em duas partes principais:

* **Frontend:** Desenvolvido com **Vite** e **React**, garantindo uma interface de usuário rápida e reativa.
* **Backend:** Construído com **FastAPI** (Python), oferecendo alto desempenho e APIs robustas para gerenciar dados e operações de envio.

## Estratégia de Envio de E-mails

O sistema não utiliza um serviço de e-mail próprio. Em vez disso, ele é projetado para usar o **servidor SMTP de escolha do usuário** (configurado na tabela `UsuarioSmtp`).

Esta abordagem oferece as seguintes vantagens:
* **Controle Total:** O usuário mantém total controle sobre sua reputação de remetente.
* **Flexibilidade:** Permite a integração com qualquer serviço de e-mail profissional (como SendGrid, Mailgun, ou até mesmo um servidor corporativo) que ofereça acesso SMTP.

---

## Modelagem do Banco de Dados

A estrutura do banco de dados é fundamental para o gerenciamento eficiente de usuários, listas, campanhas e envios. A seguir, está a explicação de cada tabela (entidade) do sistema, baseada no arquivo `models.py`:

| Tabela | Descrição | Relacionamentos Chave Estrangeira (FK) |
| :--- | :--- | :--- |
| **`Usuario`** | Armazena as informações de login e perfil dos usuários. | - |
| **`UsuarioSmtp`** | Armazena as credenciais e configurações de SMTP (domínio e porta) que o usuário escolheu para realizar os envios. | `IdUsuario` (FK para `Usuario`) |
| **`Lista`** | Contém listas de e-mails para organização de contatos. Possui indicadores de último uso e lixeira. | `IdUsuario` (FK para `Usuario`) |
| **`Campanha`** | Armazena o conteúdo, assunto, e as informações de design (cor, documento/template) das campanhas de e-mail. | `IdUsuario` (FK para `Usuario`) |
| **`Email`** | Armazena os e-mails individuais que compõem uma lista. | `Lista` (FK para `Lista`) |
| **`Envio`** | Registra cada remessa de e-mail realizada, associando uma lista e uma campanha em um determinado momento. Possui um `Token` único para rastreamento. | `IdUsuario` (FK para `Usuario`), `Lista` (FK para `Lista`), `Campanha` (FK para `Campanha`) |
| **`Detalhe`** | Armazena informações detalhadas ou logs de uma operação de envio (erros, avisos, etc.), associada a um envio específico e, opcionalmente, a um e-mail. | `Envio` (FK para `Envio`), `Email` (FK para `Email`) |
| **`StatusEnvio`** | Rastreia o status de cada e-mail individualmente dentro de um envio, incluindo o token para rastreio e se o e-mail foi visualizado (`Visto`). | `IdEnvio` (FK para `Envio`), `IdEmail` (FK para `Email`) |

### Visão Geral do Fluxo de Dados

1.  Um **`Usuario`** cria ou configura sua conta **`UsuarioSmtp`**.
2.  O **`Usuario`** cria `Lista`s e adiciona `Email`s a elas.
3.  O **`Usuario`** cria `Campanha`s (com conteúdo e assunto).
4.  Ao disparar uma remessa, um registro de **`Envio`** é criado, ligando o **`Usuario`** à **`Lista`** e à **`Campanha`** escolhidas.
5.  Para cada **`Email`** na **`Lista`**, um registro em **`StatusEnvio`** é criado para rastrear a entrega e a visualização.
6.  Opcionalmente, o sistema registra logs de erros ou eventos em **`Detalhe`** durante a operação de envio.

---
## Autor
Feito por Daniel Aniceto Rosell

- [Github](https://github.com/DanielRosell06)

- [Linkedin](https://www.linkedin.com/in/daniel-rosell-48bb48305/)

- [Instagram](https://www.instagram.com/daniel_rosell_06/)
