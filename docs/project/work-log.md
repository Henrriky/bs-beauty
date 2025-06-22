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

> Resumo: cronograma completo no ProjectLibre, MER e DER validados, documentação avançada; plano de testes definido, banco de dados refatorado e APIs padronizadas.

*Por Giovanna Carvalho*

## Semana 13 - 09.06 a 15.06

Durante esta semana foram feitos alguns **ajustes finais** de referências e gramática na **documentação** antes de discuti-la com o professor orientador. Após a reunião, realizaram-se outras mudanças para padronizar diferentes aspectos do material.

No **GitHub**, realizou-se o **merge** das diversas **branches** do repositório em uma branch chamada **gource**, a fim de recuperar **commits “perdidos”** devido ao uso do comando git squash nos momentos iniciais do projeto.

No **ProjectLibre**, efetuaram-se **melhorias** para evitar a sobrecarga de recursos humanos e atualizou-se a porcentagem de conclusão de determinadas tarefas.

Por fim, no **MVP**, conseguiu-se corrigir um **bug** que atribuía a mesma **imagem de perfil** a usuários que se cadastram simultaneamente no sistema.

> Resumo: documentação padronizada, branches mescladas no GitHub (gource), cronograma otimizado no ProjectLibre; bug de imagem corrigido no MVP.

*Por Giovanna Carvalho*
