public with sharing class CadastroVeiculoApex {
    @AuraEnabled
    // Metodo estático que retorna uma lista de veículos
    public static List<Veiculo__c> buscarListaVeiculos()
    {        
        List<Veiculo__c> ListaVeiculos = [Select Nome_Codigo__c, Modelo__c, Marca__c, Nivel__c, Estoque_Venda__c, Estoque_Locacao__c, Sede__c, Preco_de_Venda__c, Preco_de_Locacao__c, Quantidade_Disponivel_Locacao__c From Veiculo__c];
        
        return ListaVeiculos;
    }

    @AuraEnabled
    // Metodo estático que retorna uma lista de sedes
    public static List<Sede__c> buscarListaSedes()
    {        
        List<Sede__c> ListaSedes = [Select Id, Name, Endereco__c, Total_de_Clientes_Cadastrados__c From Sede__c];
        
        return ListaSedes;
    }

    @AuraEnabled
    // Defino método para criar novo veículo utilizando os parametros definidos
    public static void criarVeiculo(String modelo, String marca, String nivel, Decimal estoqueVenda, Decimal estoqueLocacao, String sede, Decimal precoVenda, Decimal precoLocacao, Decimal quantidadeDisponivel)   
    {     
        // Instancio um objeto da classe Veiculo__c
        Veiculo__c novoRegistro = new Veiculo__c();

        // Atribuções para novoRegistro
        novoRegistro.Modelo__c = modelo;
        novoRegistro.Marca__c = marca;
        novoRegistro.Nivel__c = nivel;
        novoRegistro.Estoque_Venda__c = estoqueVenda;
        novoRegistro.Estoque_Locacao__c = estoqueLocacao;
        novoRegistro.Sede__c = sede;
        novoRegistro.Preco_de_Venda__c = precoVenda;
        novoRegistro.Preco_de_Locacao__c = precoLocacao;
        novoRegistro.Quantidade_Disponivel_Locacao__c = quantidadeDisponivel;
        
        insert novoRegistro;
    }

    @AuraEnabled
    // Defino método para deletar veículo utilizando Id como parametro definidos
    public static void deletarVeiculo(String id)
    {      
        // Instancio um objeto da classe Veiculo__c 
        Veiculo__c deletarRegistro = new Veiculo__c();
        
        // Atribuo id para o Id de deletarRegistro
        deletarRegistro.Id = id;
        
        // Realizo o delete de deletarRegistro
        delete deletarRegistro;
    }

    @AuraEnabled
    // Defino método para deletar vários veículos utilizando Id como parametro definidos
    public static void deletarVariosVeiculos(String ids)
    {       
        //linha para transformar um JSON num OBJETO -> "[{item:1, modelo:Focus}]" -> [{'item':1, 'modelo':'Focus'}, {'item':2, 'modelo':'ka'}]
        List<Object> items = (List<Object>) JSON.deserializeUntyped(ids);
       
        // Instancio um objeto da classe Veiculo__c 
        List <Veiculo__c> listaRemocao = new List<Veiculo__c>();

        for (Object itemObj : items) {
            //TRANSFORMA NUM MAPA de STRING -> Isso é necessário pois não há um tipo definido na deserialização
            Map<String, Object> item = (Map<String, Object>) itemObj;

            //POPULA O ARRAY COM REGISTROS DE OPERACAO
            Veiculo__c novoVeiculo = new Veiculo__c();
            //HASH que identifica chave unica de venda, baseado na data/hora da inserção e a quantidade de itens da venda
            novoVeiculo.Id = (Id)item.get('id');
            
            listaRemocao.add(novoVeiculo);
        }
        
        // Realizo o delete de listaRemocao
        delete listaRemocao;
    }

    @AuraEnabled
    // Defino método para atualizar veículo utilizando os parametros definidos
    public static void atualizarVeiculo(String id, String modelo, String marca, String nivel, Decimal estoqueVenda, Decimal estoqueLocacao, String sede, Decimal precoVenda, Decimal precoLocacao, Decimal quantidadeDisponivel)
    {     
        // Instancio um objeto da classe Veiculo__c 
        Veiculo__c registroAlterado = new Veiculo__c();
        
        // Atribuções para registroAlterado
        registroAlterado.Id = id;
        registroAlterado.Modelo__c = modelo;
        registroAlterado.Marca__c = marca;
        registroAlterado.Nivel__c = nivel;
        registroAlterado.Estoque_Venda__c = estoqueVenda;
        registroAlterado.Estoque_Locacao__c = estoqueLocacao;
        registroAlterado.Sede__c = sede;
        registroAlterado.Preco_de_Venda__c = precoVenda;
        registroAlterado.Preco_de_Locacao__c = precoLocacao;
        registroAlterado.Quantidade_Disponivel_Locacao__c = quantidadeDisponivel;
        
        // Realizo o update de registroAlterado
        update registroAlterado;
    }   
}