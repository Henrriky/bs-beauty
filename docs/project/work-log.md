# Diário de Bordo do PIE
O presente documento tem por objetivo servir como um *diário de bordo* do projeto, isto é, um registro da evolução semanal referente ao Projeto Integrado de Extensão desenvolvido pela equipe, contendo o que foi trabalhado e obtido ao longo de cada semana.

## Semana 1 – 18.03 a 23.03

Começamos oficialmente o projeto esta semana, então tudo ainda está ganhando forma. A primeira tarefa foi definir os integrantes do grupo e combinar as responsabilidades de cada um. **Alyson** será o gestor do projeto; **Giovanna** ficará encarregada da saúde da documentação; **Henrriky** será o Tech Lead já **Eliel, Henrique** e **Bruno** atuarão como desenvolvedores de software.

Na sequência retomamos a parceria com a mesma cliente da disciplina de *Engenharia de Software IV*: o salão de beleza da **Bruna**, um coworking onde vários profissionais alugam cabines por hora. Bruna, a proprietária, faz a ponte com cabeleireiros, manicures e demais prestadores. Nossa primeira reunião com ela ocorreu no dia **22/03** para entender que problema precisa ser resolvido, quais regras de negócio já existem e o que mudou desde o semestre passado. A conversa gerou vários insights sobre como organizar as agendas dos profissionais e controlar o rateio de despesas. 

Por fim, criamos um **workspace no Notion**, onde inserimos um checklist com todos os requisitos solicitados pelo professor orientador e as tarefas internas da equipe. A ferramenta já está ajudando bastante na divisão de tarefas.
 
> **Resumo:** Equipe definida, cliente alinhado e ferramentas de organização no ar.

*Por Giovanna Carvalho*

## Semana 2 – 24.03 a 30.03
Na segunda semana o foco foi dominar as ferramentas de gestão e consolidar as primeiras demandas do cliente. No dia **25/03**, após uma breve apresentação do professor, testamos o *ProjectLibre* e já montamos o cronograma-base com tarefas macro e durações. Já no dia **30/03** recebemos da Bruna as respostas ao questionário enviado, contendo dados sobre horários de pico, política de cancelamento, porcentagem de comissão e controle de produtos. Essas informações permitiram esboçar requisitos como bloqueio de cabines para manutenção e cálculo automático de repasses. Para registrar tudo, criamos no Notion a página **“Q&A Bruna”**, com perguntas e respostas, e outra chamada **“Requisitos Identificados”**, que lista cada requisito, seu status e o responsável.

> **Resumo:** Uso do *ProjectLibre* consolidado para gestão, informações do cliente recebidas e requisitos iniciais documentados.

*Por Giovanna Carvalho*

## Semana 3 – 31.03 a 06.04
No dia **01/04** definimos formalmente as funcionalidades do **MVP** e fizemos uma breve apresentação ao professor sobre nossa ideia de aplicativo para o salão de beleza coworking da **Bruna** (entidade parceira), validando a viabilidade do projeto. Logo após, o professor orientador pediu uma apresentação mais formal no dia **08/04** para explicar em detalhes o escopo, a arquitetura e o caminho até o MVP. Para sustentar a apresentação, preparamos um conjunto de slides que mostram o contexto da Bruna, o problema (falta de um sistema de agendamento e gestão) e a solução proposta (aplicação web com controle de acesso para diferentes funcionalidades), além do processo a ser desenvolvido para o MVP (**agendamento simplificado** de serviços no salão por clientes).

Ainda neste dia, continuamos com o planejamento no **ProjectLibre**, adicionando mais detalhes: Cadastramos as tarefas iniciais, definimos prazos, atribuíram-se responsáveis e estabelecemos marcos-chave que guiarão cada fase do desenvolvimento até o MVP. 

No dia 06/04, nos reunimos no **Discord** para distribuir entre os integrantes os tópicos que cada um apresentará para ter a ideia do projeto aprovada, de forma que todos participem da **apresentação**.

> **Resumo**: conversa inicial de ideia e viabilidade; planejamento detalhado no ProjectLibre; preparação para a apresentação formal.  

*Por Giovanna Carvalho*

## Semana 4 – 07.04 a 13.04
Nesta semana tivemos nossa primeira entrega: apresentação formal do projeto ao professor orientador e à turma, detalhando a entidade parceira, o tema e o fluxo do MVP, com a finalidade de receber feedbacks para alguns pequenos ajustes.  

O orientador solicitou que, logo após o login, separássemos o agendamento entre quem deseja um profissional específico e quem não se importa com a especificação do funcionário.  

Em seguida, atualizamos o cronograma no _ProjectLibre_, adicionando marcos-chave — início de sprints, atividades da equipe e entregas parciais — e alocando cada integrante como recurso humano.  

Por fim, em **13 de abril**, definimos adotar **Scrum** como metodologia de trabalho, distribuindo os papéis de **Product Owner** para **Henrriky**, **Scrum Master** para **Alyson** e os demais integrantes como time de desenvolvimento.  

> **Resumo:** Apresentação formal do projeto; *ProjectLibre* com marcos e recursos; separação de agendamento por profissional específico ou genérico; Scrum definido.

*Por Giovanna Carvalho*

## Semana 5 – 14.04 a 20.04
Começamos a semana criando no GitHub a **branch `docs`** para concentrar arquivos de documentação e artefatos do projeto, como o *ProjectLibre*. No dia **15/04**, após orientações do professor sobre o desenho da arquitetura, elaboramos o **diagrama de componentes** com os elementos essenciais ao sistema e o subimos ao repositório. Ainda em **15/04**, definimos os responsáveis por cada tópico da documentação e, em seguida, adicionamos no *ProjectLibre* as respectivas tarefas, alocando os recursos humanos correspondentes.

> **Resumo:** branch `docs` no GitHub criada; diagrama de componentes desenvolvido; responsáveis pela documentação definidos e refletidos no *ProjectLibre*.

*Por Giovanna Carvalho*

## Semana 6 – 21.04 a 27.04
No início da semana, recebemos orientações do professor para considerar um dia de trabalho como apenas uma hora em vez das oito horas padrão no *ProjectLibre*, a fim de facilitar a análise de **viabilidade** **financeira**. 

No dia **22/04**, conforme solicitado em aula, estudamos o **diagrama de implantação**, identificamos os hardwares onde os componentes do sistema serão executados e o subimos ao GitHub. 

Já em **26/04**, nos reunimos no Discord, aplicar o método **MoSCoW** para priorizar os requisitos levantados com a entidade parceira e registramos a análise em uma página no Notion.

> **Resumo:** *ProjectLibre* reconfigurado; diagrama de implantação criado; análise MoSCoW.

*Por Giovanna Carvalho*

## Semana 7 – 28.04 a 04.05
No dia **29/04**, apresentamos ao professor orientador e à turma os **diagramas** de componentes e de implantação desenvolvidos nas semanas anteriores. Posteriormente, seguindo recomendações do orientador, realizamos ajustes para melhorar a diferenciação de componentes. Em seguida, iniciamos a **documentação** formal do projeto usando o modelo de trabalho acadêmico da ferramenta **abnTeX2**, no ambiente **TexStudio**, para escrever em **LaTeX**. Então, subimos os arquivos no **GitHub** para conseguirmos escrever colaborativamente.

> **Resumo:** diagramas apresentados e ajustados; documentação formal iniciada com abnTeX2.

*Por Giovanna Carvalho*

## Semana 8 – 05.04 a 11.05
Começamos a semana ajustando a estrutura do repositório no **GitHub** para atender às orientações do professor orientador quanto à arquitetura de pastas do projeto e atualizamos o **README.md** com informações sobre o projeto e os integrantes do grupo. Logo após, iniciamos o desenvolvimento do **diário de bordo**, criando o arquivo `work-log.md` no **GitHub** para registrar semanalmente as atividades. 

Já no dia **08/05**, mandamos perguntas a nossa entidade parceira, Bruna, para entender melhor o funcionamento do salão e sanar dúvidas de requisitos. Em seguida, em **09/05**, registramos as perguntas e respostas na página do **Notion**, criada na semana 2. Também criamos uma nova página no **Notion** para identificar e analisar todas as regras de negócio e requisitos (funcionais e não funcionais). 

Por fim, iniciamos a modelagem do **MER** e subimos no **GitHub**.

> **Resumo:** GitHub reestruturado; README.md atualizado; diário de bordo criado; conversa com entidade parceira; análise de requisitos; MER modelado

## Semana 9 – 12.05 a 18.05
No início da semana, padronizamos a **nomenclatura** e definimos a **estrutura de arquivos** da documentação. Em seguida, com as informações da entidade parceira, organizamos melhor as **regras de negócio**, para extrair os requisitos funcionais e não funcionais, formalizando tudo no **Notion** com descrições, prioridades e status.

Em **15/05**, mostramos o **MER** ao professor orientador e, em reunião no Discord posterior, discutimos ajustes pedidos por ele. 

A partir de **17/05**, iniciamos os preparativos para a **Prova de Conceito (PoC)** prevista para a próxima aula, **20/05**. Para isso, definimos o escopo, criamos as instâncias e sub-redes via Docker, configuramos o DNS (DuckDNS), montamos a arquitetura na AWS e atribuímos responsabilidades na hora da apresentação. Por fim, aprimoramos o **diário de bordo** no `work-log.md`, incorporando registros das semanas iniciais.

> **Resumo:** documentação padronizada; regras de negócio e requisitos formalizados; MER ajustado; PoC planejada; diário de bordo atualizado.

*Por Giovanna Carvalho*

## Semana 10 – 19.05 a 25.05

No dia 20/05 reapresentamos os diagramas de componentes e implantação, dessa vez ajustados de acordo com as orientações recebidas na semana 7, para a turma e o professor orientador. Posteriormente, com base nos diagramas ajustados, realizamos a apresentação da **Prova de Conceito** a fim de comprovar que sabemos utilizar todas as tecnologias apresentadas nos diagrama: Inicialmente, mostramos – na instância da **AWS** – a tabela de clientes presente no banco de dados para exibir seu estado atual (comprovando que sabemos utilizar os serviços da AWS). Depois, no site do sistema do projeto, demonstramos o login utilizando a conta do Google (comprovando a utilização do **Google OAuth API**). Em seguida, foi apresentado um formulário (construído com **React**, outra ferramenta utilizada pela equipe) para completar o **cadastro do usuário**. Por fim, voltando para a instância da AWS, exibimos novamente a tabela de clientes, comprovando que o novo usuário foi devidamente cadastrado e os dados registrados no banco. Também apresentamos brevemente a utilização do **Node.js** por meio do log de erros do back-end.

Ao longo da semana, seguimos trabalhando na **documentação**, criando de fato a padronização e estrutura definida na semana anterior (9) no repositório Git. Removemos alguns arquivos de documentação desnecessários presentes no repositório Git e criamos um arquivo `.gitignore` para evitar que os arquivos gerados automaticamente pelo LaTeX fossem rastreados pelo git a fim de deixar o repositório menos poluído com arquivos desnecessários.

Até o momento, conseguimos atualizar completamente o **Diário de Bordo** no repositório, registrando todas as semanas anteriores até a atual. Além disso, desenvolvemos melhor o **ProjectLibre**, adicionando novas tarefas nas etapas definidas e ajustando a porcentagem de conclusão da maioria das tarefas já existentes. Por fim, alocamos os recursos humanos (integrantes da equipe) a cada tarefa para identificar os responsáveis por cada atividade.

> **Resumo:** Diagramas ajustados reapresentados; Prova de Conceito demonstrada; Documentação padronizada e organizada no Git; Diário de Bordo atualizado; ProjectLibre detalhado com tarefas e responsáveis.

*Por Giovanna Carvalho*


## Semana 11 - 26.05 a 01.06
Conforme solicitado pelo professor, começamos a nos preparar para apresentar o **modelo físico** do **banco de dados** do nosso sistema. Portanto, no início da semana definimos os responsáveis e identificamos os tópicos mais importantes para realizar a apresentação durante uma ligação no discord. Além disso, seguimos trabalhando na **documentação**, começando a desenvolver melhor as seções de desenvolvimento.

Logo após, definimos as tarefas necessárias para a **melhoria** e consequente entrega do **MVP**, nos baseando na aplicação que desenvolvemos na disciplina de Engenharia de Software IV e já atribuindo os respectivos responsáveis por cada tarefa.

> **Resumo:** Preparação Apresentação BD; Continuação documentação; Melhorias MVP planejadas.

*Por Giovanna Carvalho*

## Semana 12 - 02.06 a 08.06

Durante esta semana, utilizamos o **ProjectLibre** para estruturar todas as atividades do segundo semestre, já que na disciplina SPOPIE2 vamos desenvolver as demais funcionalidades do sistema que não foram contempladas no MVP. No cronograma, identificamos e registramos os responsáveis atribuídos a cada tarefa e atualizamos a porcentagem de conclusão de algumas delas, garantindo uma visão clara do **andamento do projeto**.

Em 03/06, realizamos uma reunião com o professor orientador para apresentar o banco de dados. Explicamos o **MER** e o **DER** da aplicação, além de apontar quais entidades fariam parte do **MVP** e quais seriam desenvolvidas apenas na disciplina SPOPIE2. Esse alinhamento foi fundamental para assegurar a coerência da apresentação final.

Sobre a **documentação**, desenvolvemos com clareza todos os tópicos necessários, adicionando os respectivos textos, figuras, quadros e tabelas. Como resultado, alcançamos uma documentação quase completa, cobrindo o **escopo principal** da aplicação.

Paralelamente, demos início à elaboração do **plano de testes**, definindo quais testes seriam pertinentes para o projeto e considerando a adoção de testes automatizados. Esse planejamento garantirá a qualidade do desenvolvimento no próximo semestre.

Por fim, começamos a implementar melhorias no **MVP**. O primeiro passo foi a reestruturação do **banco de dados** para adequá-lo ao novo MER, o que exigiu a correção de alguns **bugs** decorrentes dessa mudança. Além disso, padronizamos as respostas da **API** para que os dados fossem retornados de forma mais eficiente e coerente com a aplicação.

> **Resumo**: cronograma completo no ProjectLibre, MER e DER validados, documentação avançada; plano de testes definido, banco de dados refatorado e APIs padronizadas.

*Por Giovanna Carvalho*

## Semana 13 - 09.06 a 15.06

Durante esta semana foram feitos alguns **ajustes finais** de referências e gramática na **documentação** antes de discuti-la com o professor orientador. Após a reunião, realizaram-se outras mudanças para padronizar diferentes aspectos do material.

No **GitHub**, realizou-se o **merge** das diversas **branches** do repositório em uma branch chamada **gource**, a fim de recuperar **commits “perdidos”** devido ao uso do comando git squash nos momentos iniciais do projeto.

No **ProjectLibre**, efetuaram-se **melhorias** para evitar a sobrecarga de recursos humanos e atualizou-se a porcentagem de conclusão de determinadas tarefas.

Por fim, no **MVP**, conseguiu-se corrigir um **bug** que atribuía a mesma **imagem de perfil** a usuários que se cadastram simultaneamente no sistema.

> **Resumo**: documentação padronizada, branches mescladas no GitHub (gource), cronograma otimizado no ProjectLibre; bug de imagem corrigido no MVP.

*Por Giovanna Carvalho*

## Semana 14 - 16.06 a 22.06

Ao longo desta semana, concentramos nossos esforços em aprimorar o **MVP**: finalizamos o design da página inicial, mantendo a identidade visual do sistema, e iniciamos a implementação do segundo fluxo de **agendamento**, agora permitindo que o usuário escolha diretamente uma profissional específica. Paralelamente, preparamos uma demonstração informal do estado atual da aplicação para o professor orientador e a turma, a fim de obter **feedback antecipado** que nos ajude a refinar detalhes antes da entrega final.

Também avançamos na preparação da apresentação final da disciplina. Após o sorteio de datas, fomos designados para **apresentar** em **08/07**; por isso, começamos a criar os primeiros slides e estruturar a divisão da apresentação pelos integrantes. 

Por fim, exploramos a ferramenta **GitStat** indicada pelo professor para gerar **métricas** do repositório **GitHub**. As **estatísticas** produzidas (número de commits, linhas de código e frequência de merges) foram analisadas e exportadas em gráficos com o objetivo de serem incorporadas ao material da apresentação final, evidenciando a **participação** de cada membro e oferecendo insights para otimizar nosso fluxo de trabalho.

> **Resumo**: homepage finalizada, fluxo de agendamento alterado, apresentação final agendada, estatísticas geradas.

*Por Giovanna Carvalho*

# Semana 15 - 23.06 a 29.06 

Na aula de 24/06 apresentamos o estado atual do **MVP** ao professor orientador e à turma, momento em que também coletamos **feedbacks** valiosos a fim de aprimorar nossa apresentação final. A partir desse retorno, identificamos os ajustes finais necessários no sistema para corrigir determinados bugs que ainda persistiam.

Para a **apresentação final**, definimos claramente as **responsabilidades** de cada membro da equipe e nos dedicamos ao aprimoramento dos **slides**, garantindo uma divisão equilibrada de tarefas e uma comunicação visual mais eficaz.

> Resumo: feedback MVP; desenvolvimento apresentação final.

*Por Giovanna Carvalho*

## Semana 16 - 30.06.2025 a 06.07.2025

Durante esta última semana antes da apresentação do **MVP**, foram feitas **correções** pontuais na documentação para ajustar valores errados na parte de Viabilidade Financeira e corrigir o prontuário dos integrantes do grupo. Adicionalmente, realizamos alguns **ajustes finais** no MVP com base no *feedback* coletado na semana anterior com o orientador. Além disso, o problema de sobreposição de agendamentos que existia no MVP foi resolvido. 

Por fim, finalizamos o design e a criação dos slides a serem utilizados na **apresentação final** do MVP.

> Resumo: Correções MVP e documentação; finalização apresentação final.
*Por Giovanna Carvalho*

## Semana 17 - 07.07.2025 a 13.07.2025

Durante esta semana, os esforços foram concentrados na finalização e realização da apresentação do MVP do projeto. No repositório, incluímos os arquivos de configuração necessários para gerar o **vídeo Gource** e fizemos o upload no YouTube.

No dia **08/07**, realizamos a **apresentação do nosso MVP** para os professores orientadores e a turma. Na ocasião, abordamos o **bjetivo** do projeto, o **Problema Identificado**, a **Solução Proposta** e a **Descrição do Negócio**. Por fim, detalhamos a **Arquitetura do Sistema** e a **Viabilidade** do projeto. Também apresentamos o vídeo Gource e algumas estatísticas geradas pelo GitHub para apontar a contribuição de cada membro. 

Ao final, coletamos diversos *feedbacks* com os professores presentes na banca a fim de **promover melhorias** no sistema.

> Resumo: Vídeo Gource gerado, apresentação MVP realizada; *feedbacks* da banca coletados.
*Por Giovanna Carvalho*

## Semanas 18, 19 e 20 - 14.07.2025 a 03.08.2025

Após a apresentação final, fomos **aprovados** na disciplina de **SPOPIE1** e, com o encerramento das atividades, entramos em **recesso acadêmico**. Aproveitamos esse período para descansar e recuperar as energias necessárias para dar continuidade ao desenvolvimento do projeto no próximo semestre, na disciplina de **SPOPIE2**.

Desta forma, não tivemos nenhuma atividade significativa, com exceção de algumas alterações pontuais em arquivos README presentes no repositório remoto.

> Resumo: Aprovação em SPOPIE1; recesso acadêmico.
*Por Giovanna Carvalho*

## Semana 21 - 04.08.2025 a 10.08.2025

Com o fim do recesso e antes do começo do segundo semestre letivo, retomamos as atividades do projeto. Durante a semana, fizemos um estudo de ferramentas voltadas para gerenciamento Scrum visando substituir o Notion, que apresentava certas limitações.

Após a análise, optamos pela ferramenta Taiga por ser uma plataforma simples, fácil de utilizar e por suprir as necessidades da equipe para a próxima fase do desenvolvimento.

> Resumo: Retorno às atividades; escolha do Taiga para gerenciamento Scrum.
*Por Giovanna Carvalho*

## Semana 22 - 11.08.2025 a 17.08.2025

Nesta semana, iniciamos a organização do nosso **product backlog** no Taiga, adicionando as **features** que serão implementadas no sistema.

Além disso, realizamos outras alterações no ambiente da ferramenta para adequá-lo às nossas necessidades, como a definição dos **papéis** de cada membro da equipe.

> Resumo: Organização product backlog; definição papéis da equipe.
*Por Giovanna Carvalho*

## Semana 23 - 18.08.2025 a 24.08.2025

Durante esta semana, a pedido do novo professor orientador Johnata, elaboramos um **planejamento das sprints** do projeto a fim de detalhar o período de duração de cada sprint, bem como as features que planejamos desenvolver em cada momento.

Seguindo também as orientações do orientador Marcelo Tavares, entramos em contato novamente com nossa entidade parceira a fim de **validar** e formalizar os **requisitos** do sistema antes de iniciar o desenvolvimento. Nesse momento, expomos o que seríamos capazes de entregar e o que ficaria de fora por agora, como o envio de mensagens via SMS e Whatsapp.

> Resumo: Planejamento sprints; formalização de requisitos com a entidade parceira.
*Por Giovanna Carvalho*

## Semana 24 - 25.08.2025 a 31.08.2025

A semana 24 marca o começo da **Sprint 1** do projeto e, portanto, do desenvolvimento do sistema além do MVP. Nele, focamos em **corrigir** um bug de **sobreposição** de agendamentos identificado na banca de SPOPIE1 e também trabalhamos em uma forma alternativa de **cadastro/login** diferente do `Google OAuth`.

Para isso, as tarefas foram distribuídas entre os membros: 
- Alyson definiu as atividades e implementou as novas telas de autenticação; 
- Bruno criou o design da tela; 
- Eliel revisou a modelagem do banco de dados e realizou refatorações no front-end; 
- Giovanna realizou os testes de integração das funcionalidades; 
- Henrique implementou a lógica da nova autenticação; 
- Henrriky corrigiu o bug de sobreposição.

> Resumo: Sprint 1; correção do bug de sobreposição; implementação novo método de autenticação.
*Por Giovanna Carvalho*

## Semana 25 - 01.09.2025 a 07.09.2025

Nesta semana, iniciamos a **Sprint 2**, focado em realizar **melhorias** no processo de **agendamento** do salão. O desenvolvimento incluiu a exibição de um resumo do agendamento e das formas de pagamento aceitas. Também foi implementada uma antecedência mínima e uma limitação na quantidade de agendamentos diários a fim de evitar possíveis *spams*.

As tarefas foram distribuídas da seguinte forma: 
- Alyson e Henrriky definiram as atividades do grupo; 
- Eliel implementou a tela de resumo do agendamento; 
- Henrriky implementou as regras de antecedência e limitação;
- Giovanna reaçizou os testes de integração das regras de limitação; 
- Bruno desenvolveu o design da tela de configuração das informações do salão, que foi implementada por Alyson. 
- Henrique implementou novas lógicas para verificação de e-mail, redefinição de senha e refresh token.

> Resumo: Sprint 2; melhorias no agendamento; implementação lógicas de autenticação.
*Por Giovanna Carvalho*

## Semana 26 - 15.09.2025 a 21.09.2025

Nesta semana, a **Sprint 3** foi voltado para realizar melhorias de **segurança** nos processos de **login e cadastro**, bem como aprimorar a experiência dos clientes na **exibição dos serviços**. Para isso, os serviços foram agrupados por categoria e um filtro de busca foi implementado na tela de agendamento.

Ademais, implementamos algumas funcionalidades extras a pedido da entidade parceira, como um informe de **captação de clientes** (para que saibam como conheceram o salão) e a **autorização de uso de imagem** para divulgação dos serviços. 

Em paralelo, iniciamos o desenvolvimento do design das telas de **relatórios do sistema**, com foco em dados financeiros e de produtividade.

> Resumo: Melhorias de segurança; filtro de serviços; implementação de captação de clientes e autorização de uso de imagem.
*Por Giovanna Carvalho*
