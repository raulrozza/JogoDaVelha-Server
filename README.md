# Jogo da Velha - Servidor

Acesse o servidor [através deste link](https://jogo-da-velha-server.herokuapp.com)

## Introdução

Este pequeno servidor foi desenvolvido para um trabalho da disciplina de Tópicos Especiais I sobre Aplicações Móveis, do curso de Engenharia de Computação da Universidade Federal de Santa Catarina, ministrada pelo Professor Dr. [Fábio de la Rocha](https://github.com/fabiorochaufsc/).

O trabalho consiste numa aplicação de Jogo da Velha, onde jogadores podem entrar em uma sala e iniciar partidas com outros jogadores.

Este projeto trata do servidor da aplicação, encarregado de gerenciar os _sockets_ e a troca de mensagens.

## Estrutura

Para ser sincero, esta foi a primeira vez que eu fiz um projeto unicamente com sockets (sem o modelo REST que estou acostumado), e tive que pensar um pouco para organizar a estrutura do projeto. O fato de não poder usar TypeScript também implica na impossibilidade de usar contratos de objetos (as interfaces).

Resolvi utilizar um padrão orientado a objetos justamente por não poder usar interfaces, a fim de garantir maior controle sobre a estrutura das entidades. O projeto foi organizado da seguinte forma:

### Root

Na raiz da pasta **source** temos as configurações do servidor. O arquivo _app_ é o core da aplicação, inicializando o servidor com Express e Socket.io, e finalmente colocando o serviço para rodar.

O arquivo _index_ é o ponto de entrada do servidor, e para que a aplicação em si seja desacoplada, este arquivo apenas chama o _app_ e liga o servidor para rodar na porta adequada.

### Models

Nesta pasta resolvi guardar algumas entidades que pude abstrair do sistema: User, Socket, Game e GameBoard. Tentei deixar aqui a criação dos objetos destas classes e algumas funções úteis que, para mim, parecem ser responsabilidade destas entidades.

A classe GameBoard não tem muita coisa mesmo, mas achei melhor abstrair a criação de um gameBoard através dela do que poluir o código com matrizes.

### Controllers

Aqui, resolvi colocar as classes que gerenciam certos aspectos do jogo. Para este sistema, consegui abstraí três controlladores: GameController, ConnectionController e LobbyController.

ConnectionController é responsável por gerenciar as conexões dos usuários, providenciando os eventos relacioados a isso para o servidor de sockets, e providenciando métodos que manipulem a lista de usuários conectados.

LobbyController cuida do gerenciamento de convites dos jogos.

GameController é a entidade mestre. Ela controla todo o jogo, e os controladores acima têm seus respectivos objectos instanciados neste controlador.

## Dependências

Foram usadas poucas bibliotecas para montar o projeto:

- [Dotenv](https://www.npmjs.com/package/dotenv): Biblioteca usada para carregar variáveis de ambiente. Atualmente, a única variável de ambiente é **PORT**.
- [Express](https://expressjs.com/pt-br/): Um dos _frameworks_ mais conhecidos para criação expressa de servidores com Node.js.
- [Socket.io](https://socket.io/): Uma famosa biblioteca para gerenciamento de sockets em JavaScript, tanto para servidores quanto para clientes.
