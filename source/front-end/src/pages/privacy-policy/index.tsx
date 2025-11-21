import Title from '../../components/texts/Title'

function PrivacyPolicy() {
  return (
    <div className="flex flex-col items-center justify-start px-4 sm:px-8 lg:px-16 py-8 max-w-5xl mx-auto animate-fadeIn">
      <Title align="center">
        Política de Privacidade e Uso de Dados do BSBeauty
      </Title>

      <div className="mt-8 space-y-8 text-[#D9D9D9] w-full">
        {/* Welcome Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[#B19B86]">
            Bem-vindo(a) ao BSBeauty!
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Esta política descreve como a BSBeauty coleta, usa, armazena e
            protege seus dados pessoais quando você utiliza nosso software para
            agendamento de serviços de beleza. Ao usar o BSBeauty, você concorda
            com as práticas descritas nesta política. Nosso compromisso é com a
            sua privacidade e com a transparência no uso das suas informações,
            sempre em conformidade com a Lei Geral de Proteção de Dados (LGPD)
            do Brasil.
          </p>
        </section>
        <br />
        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[#B19B86]">
            1. Dados Coletados
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Coletamos os seguintes dados pessoais diretamente de você quando
            você se cadastra ou utiliza o BSBeauty:
          </p>
          <ul className="list-none space-y-3 ml-4">
            <li className="text-sm sm:text-base leading-relaxed">
              <span className="font-semibold text-[#B19B86]">
                Nome Completo:
              </span>{' '}
              Para sua identificação no agendamento e no salão de beleza.
            </li>
            <li className="text-sm sm:text-base leading-relaxed">
              <span className="font-semibold text-[#B19B86]">
                Endereço de E-mail:
              </span>{' '}
              Essencial para envio de confirmações de agendamento, lembretes,
              recuperação de senha e comunicações importantes sobre seus
              serviços agendados.
            </li>
            <li className="text-sm sm:text-base leading-relaxed">
              <span className="font-semibold text-[#B19B86]">
                Número de Telefone:
              </span>{' '}
              Crucial para que o salão de beleza possa contatá-lo(a) sobre seu
              agendamento (ex: atrasos, remarcações, cancelamentos) e, se você
              autorizar, para notificações via SMS.
            </li>
            <li className="text-sm sm:text-base leading-relaxed">
              <span className="font-semibold text-[#B19B86]">
                Data de Nascimento:
              </span>{' '}
              Para verificação de idade (se necessário para algum serviço
              específico) e, se você desejar, para o envio de mensagens de
              aniversário ou ofertas especiais.
            </li>
          </ul>
        </section>
        <br />
        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[#B19B86]">
            2. Finalidade da Coleta e Uso dos Dados
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Utilizamos seus dados pessoais exclusivamente para as seguintes
            finalidades, visando otimizar sua experiência no BSBeauty e no salão
            de beleza:
          </p>
          <ul className="list-none space-y-3 ml-4">
            <li className="text-sm sm:text-base leading-relaxed">
              <span className="font-semibold text-[#B19B86]">
                Agendamento e Gestão de Serviços de Beleza:
              </span>{' '}
              Permitir que você agende, visualize e gerencie seus horários e
              serviços específicos oferecidos pelo salão de beleza.
            </li>
            <li className="text-sm sm:text-base leading-relaxed">
              <span className="font-semibold text-[#B19B86]">
                Comunicação Essencial sobre Agendamentos:
              </span>{' '}
              Enviar automaticamente confirmações, lembretes e informações
              importantes relacionadas aos seus horários agendados via e-mail ou
              SMS.
            </li>
            <li className="text-sm sm:text-base leading-relaxed">
              <span className="font-semibold text-[#B19B86]">
                Atendimento ao Cliente e Suporte do Salão:
              </span>{' '}
              Facilitar o contato do salão de beleza com você em caso de
              necessidade sobre seu agendamento ou para oferecer um serviço mais
              personalizado.
            </li>
            <li className="text-sm sm:text-base leading-relaxed">
              <span className="font-semibold text-[#B19B86]">
                Melhoria Contínua do Software:
              </span>{' '}
              Analisar o uso do BSBeauty de forma agregada para identificar
              pontos de melhoria, desenvolver novas funcionalidades e aprimorar
              a sua experiência de agendamento.
            </li>
            <li className="text-sm sm:text-base leading-relaxed">
              <span className="font-semibold text-[#B19B86]">
                Segurança e Prevenção de Fraudes:
              </span>{' '}
              Proteger sua conta e o software contra atividades não autorizadas
              e garantir a segurança e integridade dos nossos sistemas.
            </li>
            <li className="text-sm sm:text-base leading-relaxed">
              <span className="font-semibold text-[#B19B86]">
                Cumprimento de Obrigações Legais e Regulatórias:
              </span>{' '}
              Atender a requisitos legais ou regulatórios, se necessário.
            </li>
          </ul>
        </section>
        <br />
        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[#B19B86]">
            3. Compartilhamento de Dados
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Não compartilhamos seus dados pessoais com terceiros para fins de
            marketing ou outras finalidades não essenciais ao serviço, exceto
            nas seguintes situações e sempre com a garantia de que as partes
            envolvidas também estão em conformidade com a LGPD:
          </p>
          <ul className="list-none space-y-3 ml-4">
            <li className="text-sm sm:text-base leading-relaxed">
              <span className="font-semibold text-[#B19B86]">
                Com o Salão de Beleza Específico Agendado:
              </span>{' '}
              Seu nome, e-mail, telefone e data de nascimento serão
              compartilhados apenas com o salão de beleza onde você realizou o
              agendamento. Este compartilhamento é fundamental para que o salão
              possa identificar você, prestar o serviço contratado e fazer
              comunicações relativas ao seu horário.
            </li>
            <li className="text-sm sm:text-base leading-relaxed">
              <span className="font-semibold text-[#B19B86]">
                Prestadores de Serviços Essenciais:
              </span>{' '}
              Com empresas que nos auxiliam diretamente na operação do software
              e na entrega dos nossos serviços (ex: provedores de hospedagem de
              servidores, plataformas de envio de SMS/e-mail para lembretes).
              Essas empresas atuam sob nossos contratos e instruções estritas de
              proteção de dados.
            </li>
            <li className="text-sm sm:text-base leading-relaxed">
              <span className="font-semibold text-[#B19B86]">
                Obrigação Legal:
              </span>{' '}
              Se formos legalmente obrigados a fazê-lo por ordem judicial ou
              para cumprir uma lei ou regulamento aplicável.
            </li>
          </ul>
        </section>
        <br />
        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[#B19B86]">
            4. Seus Direitos como Titular dos Dados
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Em conformidade com a LGPD, você possui controle sobre seus dados
            pessoais e tem os seguintes direitos em relação a eles:
          </p>
          <ul className="list-none space-y-3 ml-4">
            <li className="text-sm sm:text-base leading-relaxed">
              <span className="font-semibold text-[#B19B86]">
                Acesso e Confirmação:
              </span>{' '}
              Solicitar a confirmação de que seus dados estão sendo tratados e
              obter acesso a eles.
            </li>
            <li className="text-sm sm:text-base leading-relaxed">
              <span className="font-semibold text-[#B19B86]">Correção:</span>{' '}
              Pedir a correção de dados incompletos, inexatos ou desatualizados.
            </li>
            <li className="text-sm sm:text-base leading-relaxed">
              <span className="font-semibold text-[#B19B86]">
                Anonimização, Bloqueio ou Eliminação:
              </span>{' '}
              Requisitar a anonimização, bloqueio ou eliminação de dados que
              sejam desnecessários, excessivos ou que estejam sendo tratados em
              desconformidade com a LGPD.
            </li>
            <li className="text-sm sm:text-base leading-relaxed">
              <span className="font-semibold text-[#B19B86]">
                Portabilidade:
              </span>{' '}
              Solicitar a transferência de seus dados para outro fornecedor de
              serviço ou produto, mediante requisição expressa.
            </li>
            <li className="text-sm sm:text-base leading-relaxed">
              <span className="font-semibold text-[#B19B86]">Eliminação:</span>{' '}
              Pedir a eliminação de dados pessoais tratados com base no seu
              consentimento, a qualquer momento.
            </li>
            <li className="text-sm sm:text-base leading-relaxed">
              <span className="font-semibold text-[#B19B86]">
                Informação sobre Compartilhamento:
              </span>{' '}
              Ser informado sobre as entidades públicas e privadas com as quais
              realizamos uso compartilhado de seus dados.
            </li>
            <li className="text-sm sm:text-base leading-relaxed">
              <span className="font-semibold text-[#B19B86]">
                Informação sobre o Não Consentimento:
              </span>{' '}
              Ser informado sobre a possibilidade de não fornecer consentimento
              e sobre as consequências de tal recusa para a utilização do
              serviço.
            </li>
            <li className="text-sm sm:text-base leading-relaxed">
              <span className="font-semibold text-[#B19B86]">
                Revogação do Consentimento:
              </span>{' '}
              Retirar seu consentimento a qualquer momento, o que não afetará a
              legalidade do tratamento realizado antes da revogação.
            </li>
          </ul>
          <p className="text-sm sm:text-base leading-relaxed mt-4">
            Para exercer qualquer um desses direitos, entre em contato conosco
            através do e-mail.
          </p>
        </section>
        <br />
        {/* Section 5 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[#B19B86]">
            5. Segurança dos Dados
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Empregamos medidas técnicas e organizacionais rigorosas para
            proteger seus dados pessoais contra acesso não autorizado, perda,
            alteração, divulgação ou destruição. Nosso compromisso com a
            segurança inclui:
          </p>
          <ul className="list-none space-y-3 ml-4">
            <li className="text-sm sm:text-base leading-relaxed">
              <span className="font-semibold text-[#B19B86]">
                Criptografia:
              </span>{' '}
              Utilização de criptografia para proteger seus dados tanto em
              trânsito (quando são transmitidos) quanto em repouso (quando estão
              armazenados).
            </li>
            <li className="text-sm sm:text-base leading-relaxed">
              <span className="font-semibold text-[#B19B86]">
                Controles de Acesso:
              </span>{' '}
              Implementação de controles de acesso restritos aos nossos sistemas
              e informações, garantindo que apenas pessoal autorizado tenha
              acesso aos dados necessários para suas funções.
            </li>
            <li className="text-sm sm:text-base leading-relaxed">
              <span className="font-semibold text-[#B19B86]">
                Monitoramento Contínuo:
              </span>{' '}
              Realizamos monitoramento constante de segurança para identificar e
              responder rapidamente a quaisquer ameaças.
            </li>
            <li className="text-sm sm:text-base leading-relaxed">
              <span className="font-semibold text-[#B19B86]">
                Treinamento da Equipe:
              </span>{' '}
              Nossos colaboradores são treinados regularmente sobre as melhores
              práticas de proteção de dados e privacidade.
            </li>
          </ul>
        </section>
        <br />
        {/* Section 6 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[#B19B86]">
            6. Retenção de Dados
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Manteremos seus dados pessoais apenas pelo tempo necessário para
            cumprir as finalidades para as quais foram coletados (ex: manter seu
            histórico de agendamentos para sua conveniência), ou conforme
            exigido por lei ou regulamentação. Após esse período, seus dados
            serão eliminados de forma segura ou anonimizados, impedindo sua
            identificação.
          </p>
        </section>
        <br />
        {/* Section 7 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[#B19B86]">
            7. Alterações a Esta Política
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Podemos atualizar esta Política de Privacidade periodicamente para
            refletir mudanças em nossas práticas ou em requisitos legais.
            Publicaremos a versão revisada em nosso site e recomendamos que você
            revise esta política regularmente.
          </p>
        </section>
        <br />
        {/* Section 8 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[#B19B86]">8. Contato</h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Se tiver dúvidas sobre esta Política de Privacidade ou sobre nossas
            práticas de dados, entre em contato através do e-mail.
          </p>
        </section>
        <br />
        {/* Closing */}
        <section className="space-y-4 pt-4 border-t border-[#3B3B3B]">
          <p className="text-sm sm:text-base leading-relaxed text-center font-medium text-[#B19B86]">
            Agradecemos por confiar no BSBeauty para agendar seus serviços de
            beleza!
          </p>
          <p className="text-sm text-center text-[#A5A5A5]">
            7 de junho de 2025
          </p>
        </section>
      </div>
    </div>
  )
}

export default PrivacyPolicy
