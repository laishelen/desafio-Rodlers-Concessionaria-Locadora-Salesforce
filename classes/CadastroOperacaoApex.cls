public with sharing class CadastroOperacaoApex {

    @AuraEnabled
    // Metodo estático que retorna uma lista de clientes 
    public static List<Cliente__c> buscarListaClientes()
    {        
        List<Cliente__c> ListaClientes = [Select Id, Nome_Completo__c, E_mail__c, CPF__c, Celular__c, Endereco_do_Cliente__c, Sede_do_Cadastro__c, Total_de_Desconto_que_foi_aplicado__c, Total_gasto_em_locacoes__c From Cliente__c];
        
        return ListaClientes;
    }
    
    @AuraEnabled
    // Metodo estático que retorna uma lista de sedes
    public static List<Sede__c> buscarListaSedes()
    {        
        List<Sede__c> ListaSedes = [Select Id, Name, Endereco__c, Total_de_Clientes_Cadastrados__c From Sede__c];
        
        return ListaSedes;
    }

    @AuraEnabled
   public static List<Veiculo__c> buscarListaVeiculos(Integer operacao)
    {   
        List<Veiculo__c> ListaVeiculos;
        
        if(operacao == 1) {
            ListaVeiculos = [Select Id, Modelo__c, Marca__c, Nivel__c, Estoque_Venda__c, Estoque_Locacao__c, Sede__c, Preco_de_Venda__c, Preco_de_Locacao__c, Quantidade_Disponivel_Locacao__c From Veiculo__c Where Estoque_Venda__c>0];
        } else  {
            ListaVeiculos = [Select Id, Modelo__c, Marca__c, Nivel__c, Estoque_Venda__c, Estoque_Locacao__c, Sede__c, Preco_de_Venda__c, Preco_de_Locacao__c, Quantidade_Disponivel_Locacao__c From Veiculo__c where Quantidade_Disponivel_Locacao__c>0];
        }
       
       return ListaVeiculos;
    }

    @AuraEnabled
    // Metodo estático que retorna uma lista de veículos
    public static List<Veiculo__c> buscarTodosVeiculos()
    {        
        List<Veiculo__c> ListaVeiculos = [Select Id, Modelo__c, Marca__c, Nivel__c, Estoque_Venda__c, Estoque_Locacao__c, Sede__c, Preco_de_Venda__c, Preco_de_Locacao__c, Quantidade_Disponivel_Locacao__c From Veiculo__c];
        
        return ListaVeiculos;
    }

    @AuraEnabled
    //VENDA ou LOCACAO, JSON 
    public static void criarOperacao(String operacao, String veiculos)
    {
        //linha para transformar um JSON num OBJETO -> "[{item:1, modelo:Focus}]" -> [{'item':1, 'modelo':'Focus'}, {'item':2, 'modelo':'ka'}]
        List<Object> items = (List<Object>) JSON.deserializeUntyped(veiculos);
        
        //Lista de Operações
        List<Cadastro_Locacao_Venda__c> ListaOperacao = new List<Cadastro_Locacao_Venda__c>();
        //Listas de Veiculos
        List<Veiculo__c> ListaVeiculos = new List<Veiculo__c>();
        //Listas de Clientes
        List<Cliente__c> ListaClientes = new List<Cliente__c>();
        
        //----Campos pra controle do desconto email
        String idCliente;
        String emailCliente;
        String nomeCliente;
        Decimal valorLocacao;
        //----
        
        for (Object itemObj : items) {
            //TRANSFORMA NUM MAPA de STRING -> Isso é necessário pois não há um tipo definido na deserialização
            Map<String, Object> item = (Map<String, Object>) itemObj;

            Veiculo__c v = new Veiculo__c();
            //preenche o id do veículo
            v.Id = (String)item.get('veiculo');
            Cliente__c c = new Cliente__c();
            //preenche o id do cliente
            c.Id = (String)item.get('cliente');

            //Crio os objetos que serão utilizados para inserir uma operação: Operação, Veículo (para atualizar quantidade), Cliente (para atualizar o gasto)
            Cadastro_Locacao_Venda__c novoRegistro = new Cadastro_Locacao_Venda__c();

            //HASH que identifica chave unica de venda, baseado na data/hora da inserção e a quantidade de itens da venda
            novoRegistro.ChaveVenda__c = String.valueOf(System.hashCode(String.valueOf(Datetime.now())+String.valueOf(items.size())));
            novoRegistro.Operacao__c = operacao;
            novoRegistro.Item_Venda__c = (Integer)item.get('item');
            novoRegistro.Veiculo__c = (String)item.get('veiculo');
            novoRegistro.Cliente__c = (String)item.get('cliente');
            novoRegistro.Sede__c = (String)item.get('sede');
            novoRegistro.Valor_Total_Locacao__c = (Decimal)item.get('valor_item');
            novoRegistro.Nome_Sede__c = (String)item.get('sede_nome');
            novoRegistro.Modelo_Veiculo__c = (String)item.get('veiculo_modelo');
            novoRegistro.Cliente_Nome__c = (String)item.get('cliente_nome');
            
            if(operacao != 'VENDA') {
                //SÓ EXISTEM SE FOR LOCACAO
                idCliente = (String)item.get('cliente');
                nomeCliente = (String)item.get('cliente_nome');
                emailCliente = (String)item.get('cliente_mail');
                valorLocacao = (Decimal)item.get('valor_item');

                //registro exclusivos da operação locação
                novoRegistro.Quantos_dias__c = (Integer)item.get('numeroDias');
                //Coloco NO CLIENTE temporariamente o valor de locação DESSA operação
                c.Total_gasto_em_locacoes__c = (Decimal)item.get('valor_item');
            } else {
                //Coloco NO CLIENTE temporariamente o valor de desconto DESSA operação
                c.Total_de_Desconto_que_foi_aplicado__c = (Decimal)item.get('valor_desconto');
                novoRegistro.Valor_Total_Locacao__c = novoRegistro.Valor_Total_Locacao__c - (Decimal)item.get('valor_desconto');
            }            
            
            ListaOperacao.add(novoRegistro);
            ListaVeiculos.add(v);
            ListaClientes.add(c);
        }
        //reduz a quantidade dos veiculos, seja venda (estoque venda) ou locação (quantidade disponivel)
        reduzirQuantidades(operacao,ListaVeiculos);
        //Atualiza o total gasto com locação do cliente e aumenta a qtd de vezes que o desconto foi usado (se necessário)
        atualizarCliente(operacao, ListaClientes);
        if(operacao != 'VENDA') {
                //verifica se o cliente tem 10 mil gasto e envio de email
                verificaDesconto(idCliente, nomeCliente, emailCliente, valorLocacao);
        }

        insert ListaOperacao;
    }
    //retorna TRUE se já usou o desconto do email ou FALSE se não tiver usado (ou seja, recebe email dnv)
    public static void atualizarCliente(String operacao, List<Cliente__c> cliente_operacao) {
        List<Cliente__c> ListaOriginal_Clientes = [Select Id, Nome_Completo__c, Total_de_Desconto_que_foi_aplicado__c, Total_gasto_em_locacoes__c From Cliente__c];
        List<Cliente__c> ListaUpdate = new List<Cliente__c>();
        Boolean teveOperacao = false;
        Decimal valorDescontoAuxiliar = 0;
        Decimal valorLocadoAuxiliar = 0;

        for(Integer i = 0; i < ListaOriginal_Clientes.size(); i++) {

            //QTS VEZES TEVE DESCONTO ATÉ AGORA
            valorDescontoAuxiliar = ListaOriginal_Clientes[i].Total_de_Desconto_que_foi_aplicado__c;
            //QUANTO GASTOU EM LOCACOES ATÉ AGORA
            valorLocadoAuxiliar = ListaOriginal_Clientes[i].Total_gasto_em_locacoes__c;

            for(Integer j = 0; j < cliente_operacao.size(); j++) {
                
                //Verifico nas operações que foram feitas, todas as operações daquele cliente
                if(ListaOriginal_Clientes[i].Id == cliente_operacao[j].Id) {
                    
                    //Se houve operação, avisa. Para depois inserir o cliente
                    teveOperacao = true;
                    if(operacao == 'VENDA') {
                        //DEBITA DO TOTAL LOCADO ATÉ AGORA O VALOR DO DESCONTO
                        valorLocadoAuxiliar = valorLocadoAuxiliar - cliente_operacao[j].Total_de_Desconto_que_foi_aplicado__c;
                        //AUMENTA A QUANTIDADE DE VEZES QUE O DESCONTO FOI APLICADO
                        valorDescontoAuxiliar = valorDescontoAuxiliar + 1;
                    } else {
                        //AUMENTA O TOTAL GASTO EM LOCACAO
                        valorLocadoAuxiliar = valorLocadoAuxiliar + cliente_operacao[j].Total_gasto_em_locacoes__c;
                    }
                }
            }
            //Após varrer todas as operações para meu cliente, caso o cliente tenha tido operação ele adiciona na lista de update
            if(teveOperacao) {
                Cliente__c c = new Cliente__c();
                c.Id = ListaOriginal_Clientes[i].Id;
                c.Total_de_Desconto_que_foi_aplicado__c = valorDescontoAuxiliar;
                c.Total_gasto_em_locacoes__c = valorLocadoAuxiliar;

                ListaUpdate.add(c);
            }
        }
        //Após preencher a lista de update para as novas operações de cada cliente, atualize a lista
        update ListaUpdate;
    }

    // Método que verifica se o valor total de locações atingir valor >= 10000 | Envia email do Descontão
    public static void verificaDesconto(String idCliente, String nomeCliente, String emailCliente, Decimal valorLocacao) {
        List<Cadastro_Locacao_Venda__c> ListaOperacoes = [Select Id, Operacao__c, Cliente__c, Valor_Total_Locacao__c From Cadastro_Locacao_Venda__c Where Operacao__c = 'LOCACAO' and Cliente__c = :idCliente];
        Decimal total_locacoes = 0;

        for(Integer i = 0; i < ListaOperacoes.size(); i++) {
            total_locacoes = total_locacoes + ListaOperacoes[i].Valor_Total_Locacao__c;
        }

        if(total_locacoes+valorLocacao >= 10000) {
            //envia email
            mandaEmail(emailCliente, nomeCliente);
        }
    }

    // Método para mandar email
    public static void mandaEmail(String destinatario, String nome) {
        Messaging.reserveSingleEmailCapacity(1);

        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();

        String[] toAddresses = new String[] {destinatario};
        mail.setToAddresses(toAddresses);
        mail.setReplyTo('laishellen@hotmail.com');
        mail.setSenderDisplayName('Rodler Concessionaria');
        mail.setSubject('Desconto Recebido');

        // Especifica o conteúdo de texto do e-mail.
        mail.setPlainTextBody('Your Case: ' + case.Id +' has been created.');

        mail.setHtmlBody('Olá '+nome+',<br/><br/>'+'Queremos agradecer por todas as suas locações aqui conosco na Rodler\'s Concessionária e Locadora. Por todas as locações que você fez durante esse tempo, estamos oferecendo um desconto de 20% na sua próxima compra!<br/></br>Sim, você leu isso corretamente!<br/><br/>Na sua próxima compra em qualquer uma de nossas sedes, você poderá aplicar um desconto de 20% no valor de um veículo! Não perca essa chance!<br/><br/>Atenciosamente,<br/>Rodler\'s Concessionária e Locadora');

        // Envia o e-mail que criei
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
    }

    @AuraEnabled
    public static void encerrarLocacaoApex(String operacoes)
    {
        //linha para transformar um JSON num OBJETO -> "[{item:1, modelo:Focus}]" -> [{'item':1, 'modelo':'Focus'}, {'item':2, 'modelo':'ka'}]
        List<Object> items = (List<Object>) JSON.deserializeUntyped(operacoes);
        
        //Lista de Operações
        List<Cadastro_Locacao_Venda__c> ListaOperacao = new List<Cadastro_Locacao_Venda__c>();
        //Listas de Veiculos
        List<Veiculo__c> ListaVeiculos = new List<Veiculo__c>();
        for (Object itemObj : items) {
            //TRANSFORMA NUM MAPA de STRING -> Isso é necessário pois não há um tipo definido na deserialização
            Map<String, Object> item = (Map<String, Object>) itemObj;

            //POPULA O ARRAY COM REGISTROS DE OPERACAO
            Cadastro_Locacao_Venda__c novoRegistro = new Cadastro_Locacao_Venda__c();
            //HASH que identifica chave unica de venda, baseado na data/hora da inserção e a quantidade de itens da venda
            novoRegistro.Id = (Id)item.get('id');
            novoRegistro.Status__c = false;
            ListaOperacao.add(novoRegistro);

            //POPULA O ARRAY DE VEICULOS COM OS IDS DOS VEICULOS REGISTRADOS
            Veiculo__c v = new Veiculo__c();
            v.Id = (Id)item.get('veiculo');
            ListaVeiculos.add(v);
        }
        //VEICULOS(ID_PUNTO, ID_FOCUS, ID_COROLLA)
        aumentarQuantidades(ListaVeiculos);

        update ListaOperacao;
    }

    @AuraEnabled
    public static void aumentarQuantidades(List<Veiculo__c> veiculos_operacoes)
    {
        List<Veiculo__c> ListaOriginal_Veiculos = [Select Id, Modelo__c, Marca__c, Nivel__c, Estoque_Venda__c, Estoque_Locacao__c, Sede__c, Preco_de_Venda__c, Preco_de_Locacao__c, Quantidade_Disponivel_Locacao__c From Veiculo__c];
        List<Veiculo__c> ListaUpdate = new List<Veiculo__c>();

        Boolean verificaOperacao = false;
        Integer qtdLoc =0;

        for (Integer i = 0; i < ListaOriginal_Veiculos.size(); i++) { //-> SÃO TODOS OS VEICULOS
            
            for(Integer j = 0; j < veiculos_operacoes.size(); j++) { //-> ESSE VEIO DOS PARAMETROS, SÃO OS QUE EU MANDEI

                if(ListaOriginal_Veiculos[i].Id == veiculos_operacoes[j].Id) { //VERIFICA SE NA LISTA ORIGINAL, TEVE OPERACAO, AUMENTA QNT DE LOCAÇÃO
                    verificaOperacao = true;
                    qtdLoc++;
                }
            }
            if(verificaOperacao) {
                ListaOriginal_Veiculos[i].Quantidade_Disponivel_Locacao__c = ListaOriginal_Veiculos[i].Quantidade_Disponivel_Locacao__c + qtdLoc;
                ListaUpdate.add(ListaOriginal_Veiculos[i]);
            }
            qtdLoc = 0;
            verificaOperacao = false;
        }

        //ENVIA PARA ATUALIZAÇÃO UM ARRAY COM ID E O CAMPO A SER ATUALIZADO (ESTOQUE_VENDA OU QUANTIDADE_LOCACAO)
        update ListaUpdate;
    }

    @AuraEnabled
    public static void reduzirQuantidades(String operacao, List<Veiculo__c> veiculos_operacoes)
    {
        List<Veiculo__c> ListaOriginal_Veiculos = [Select Id, Modelo__c, Marca__c, Nivel__c, Estoque_Venda__c, Estoque_Locacao__c, Sede__c, Preco_de_Venda__c, Preco_de_Locacao__c, Quantidade_Disponivel_Locacao__c From Veiculo__c];
        List<Veiculo__c> ListaUpdate = new List<Veiculo__c>();

        Boolean verificaOperacao = false;
        Integer qtdVenda =0;
        Integer qtdLoc =0;

        for (Integer i = 0; i < ListaOriginal_Veiculos.size(); i++) { //-> SÃO TODOS OS VEICULOS
            
            for(Integer j = 0; j < veiculos_operacoes.size(); j++) { //-> ESSE VEIO DOS PARAMETROS, SÃO OS QUE EU MANDEI

                if(ListaOriginal_Veiculos[i].Id == veiculos_operacoes[j].Id) { //VERIFICA SE NA LISTA ORIGINAL, TEVE OPERACAO
                    verificaOperacao = true;
                    if(operacao == 'VENDA') { //DEPOIS, SE TEVE OPERAÇÃO, INDICA QUAL PROPRIEDADE DEVE SER ALTERADA
                        qtdVenda++;
                    } else {
                        qtdLoc++;
                    }
                }
            }
            if(verificaOperacao) {
                ListaOriginal_Veiculos[i].Estoque_Venda__c = ListaOriginal_Veiculos[i].Estoque_Venda__c - qtdVenda;
                ListaOriginal_Veiculos[i].Quantidade_Disponivel_Locacao__c = ListaOriginal_Veiculos[i].Quantidade_Disponivel_Locacao__c - qtdLoc;
                ListaUpdate.add(ListaOriginal_Veiculos[i]);
            }
            qtdLoc = 0;
            qtdVenda = 0;
            verificaOperacao = false;
        }

        //ENVIA PARA ATUALIZAÇÃO UM ARRAY COM ID E O CAMPO A SER ATUALIZADO (ESTOQUE_VENDA OU QUANTIDADE_LOCACAO)
        update ListaUpdate;
    }

   @AuraEnabled
   // Metodo estático que retorna uma lista de retorno de operação
   public static List<Cadastro_Locacao_Venda__c> buscarListaOperacoes()
   {
        List<Veiculo__c> ListaVeiculos = [Select Id, Modelo__c, Marca__c, Nivel__c, Estoque_Venda__c, Estoque_Locacao__c, Sede__c, Preco_de_Venda__c, Preco_de_Locacao__c, Quantidade_Disponivel_Locacao__c From Veiculo__c];
        List<Cliente__c> ListaClientes = [Select Id, Nome_Completo__c, E_mail__c, CPF__c, Celular__c, Endereco_do_Cliente__c, Sede_do_Cadastro__c, Total_de_Desconto_que_foi_aplicado__c, Total_gasto_em_locacoes__c From Cliente__c];
        List<Sede__c> ListaSedes = [Select Id, Name, Endereco__c, Total_de_Clientes_Cadastrados__c From Sede__c];
        List<Cadastro_Locacao_Venda__c> ListaOperacoes = [Select Id, CreatedDate, ChaveVenda__c, Item_Venda__c, Operacao__c, Veiculo__c, Cliente__c, Sede__c, Quantos_dias__c, Status__c, Data_de_Devolucao__c, Quanto_Desconto_foi_Aplicado__c, Valor_Total_Locacao__c From Cadastro_Locacao_Venda__c order by CreatedDate desc, ChaveVenda__c, Item_Venda__c];
        List<Cadastro_Locacao_Venda__c> listaRetorno = new List<Cadastro_Locacao_Venda__c>();

        for(Cadastro_Locacao_Venda__c operacao : ListaOperacoes) {

            for(Veiculo__c veiculo_operacao : ListaVeiculos){
                if(veiculo_operacao.Id == operacao.Veiculo__c) {
                    operacao.Modelo_Veiculo__c = veiculo_operacao.Modelo__c;
                }
            }

            for(Cliente__c cliente_operacao : ListaClientes){
                if(cliente_operacao.Id == operacao.Cliente__c) {
                    operacao.Cliente_Nome__c = cliente_operacao.Nome_Completo__c;
                }
            }

            for(Sede__c sede_operacao : ListaSedes){
                if(sede_operacao.Id == operacao.Sede__c) {
                    operacao.Nome_Sede__c = sede_operacao.Name;
                }
            }
            listaRetorno.add(operacao);
        }

        return listaRetorno;
   }

   @AuraEnabled
   public static void limpaTudoApex()
   {   
       List<Cadastro_Locacao_Venda__c> ListaOperacoes = [Select Id, CreatedDate, ChaveVenda__c, Item_Venda__c, Operacao__c, Veiculo__c, Cliente__c, Sede__c, Quantos_dias__c, Data_de_Devolucao__c, Quanto_Desconto_foi_Aplicado__c, Valor_Total_Locacao__c From Cadastro_Locacao_Venda__c order by CreatedDate desc, ChaveVenda__c, Item_Venda__c];
       
       delete ListaOperacoes;
   }   
}