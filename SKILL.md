# TASK.MD

## 🚨 EM OCORRÊNCIAS
- [ ] Verificar e corrigir a edição de ocorrências (dados não estão sendo persistidos).
- [] add mais bibliotecas de emogis para diversificar as identificações de ocorrencias.
- [] add uma Ia para auxiliar na elaboração de ocorrencias personalizadas. E que possa ser possível salvar os modelos de ocorrencias criados. E que possa ser possível adicionar novos modelos de ocorrencias.

## 📅 ELABORAÇÃO DAS ESCALAS
- [ ] Usar pesistencias: ao add postos, policiais, configurações, essas informações nao podem ser perdidas ao recarregar a pagina. Encontre um modo para o carregamento ser rapido e otimizavel.
- [ ] A impressão das escalar ficou com fontesize muito pequena. em um ambiente prisional as fontes devem ser de tamanho adequado para leitura, principalmente na impressao.
- [ ] add um botao "inicializar em posto" ao inves do fixar no elemento policial. O que faz que o policial penal inicializa em determinado posto; atualmente temos a funçao fixar, que impede do policial ser movido do posto. vamore refatorar a logica para que o mesmo possa ser inicilizado em um determinado posto e que pode ser movido, duplicado ou excluido em qualquer momento. ou seja, iremos descartar a funcionalidade do "fixar" em posto. com isso o sistema ganha mais elasticidade.
- [] em configurações, deve ser possivel excluir ou editar policiais que estão listados no card Controle de presença do efetivo.
- [] No card de efetivo, deve ser possivel adicionar novos policiais penais. Atualmente não tem como add policial penal na lista.
- [] Deve ser possivel a impressão já trazer o nome do chefe de equipe e matricula vinculado.
- [] No card de efetivo, deve ser possivel selecionar varios policiais penais e exclui-los.
- [] No card de efetivo, deve ser possivel editar ou excluir os policiais penais. Atualmente não tem como editar ou excluir os policiais penais.  

## 👥 ADMINSTRAÇÃO 
- [ ] Criar uma funcionalidade para cadastrar chefes de equipe os quais podem está vinculados a um ou mais equipes[ alfa, bravo, charlie ou delta].

## 🖨️ TRATAMENTO DE IMPRESSÃO
- [ ] Corrigir o problema de margem na impressão A4 para impressão de alimentaçao[ almoço/janta/etc].

## 👥 VISITA COMUM
- [ ] reveja o que podemos melhorar no tamaho das fontes para impressao sem quebrar o layout de impressão atual.