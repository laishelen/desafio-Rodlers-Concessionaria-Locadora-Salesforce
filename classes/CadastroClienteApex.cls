public with sharing class CadastroClienteApex {    
    @AuraEnabled
    // Metodo estático que retorna uma lista de clientes 
    public static List<Cliente__c> buscarListaClientes()
    {              
        List<Cliente__c> ListaClientes = [Select Id, Nome_Completo__c, E_mail__c, CPF__c, Numero_Celular__c, Endereco_do_Cliente__c, Sede_do_Cadastro__c, 
        Total_de_Desconto_que_foi_aplicado__c, Total_gasto_em_locacoes__c From Cliente__c ORDER BY CreatedDate desc];
        
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
    // Defino método para criar novo cliente utilizando os parametros definidos
    public static void criarCliente(String nomeCompleto, String email, String cpf, String celular, String endereco, String sedeCadastro, Decimal totalDeDescontoAplicado, Decimal totalGastosLocacoes){     
        // Instancio um objeto da classe Cliente__c          
        Cliente__c novoRegistro = new Cliente__c();

        // Atribuções para novoRegistro
        novoRegistro.Nome_Completo__c = nomeCompleto;
        novoRegistro.E_mail__c = email;
        novoRegistro.CPF__c = cpf;
        novoRegistro.Numero_Celular__c = celular;
        novoRegistro.Endereco_do_Cliente__c = endereco;
        novoRegistro.Sede_do_Cadastro__c = sedeCadastro;
        novoRegistro.Total_de_Desconto_que_foi_aplicado__c = 0;
        novoRegistro.Total_gasto_em_locacoes__c = 0;
        
        // Realizo o insert de novoRegistro
        insert novoRegistro;
    }   

    @AuraEnabled
    // Defino método para deletar cliente utilizando Id como parametro definidos
    public static void deletarCliente(String id)
    {       
        // Instancio um objeto da classe Cliente__c               
        Cliente__c deletarRegistro = new Cliente__c();
        
        // Atribuo id para o Id de deletarRegistro
        deletarRegistro.Id = id;
        
        // Realizo o delete de deletarRegistro
        delete deletarRegistro;
    }     

    @AuraEnabled
    // Defino método para deletar vários clientes utilizando Id como parametro definidos
    public static void deletarVariosClientes(String ids){       
        //linha para transformar um JSON num OBJETO -> "[{item:1, modelo:Focus}]" -> [{'item':1, 'modelo':'Focus'}, {'item':2, 'modelo':'ka'}]
        List<Object> items = (List<Object>) JSON.deserializeUntyped(ids);
        
        // Instancio um objeto da classe Cliente__c   
        List <Cliente__c> listaRemocao = new List<Cliente__c>();

        for (Object itemObj : items) {
            //TRANSFORMA NUM MAPA de STRING -> Isso é necessário pois não há um tipo definido na deserialização
            Map<String, Object> item = (Map<String, Object>) itemObj;

            // Instancio um objeto da classe Cliente__c  
            Cliente__c novoCliente = new Cliente__c();
            //HASH que identifica chave única de venda, baseado na data/hora da inserção e a quantidade de itens da venda
            novoCliente.Id = (Id)item.get('id');
            
            listaRemocao.add(novoCliente);
        }
        
        // Realizo o delete de listaRemocao
        delete listaRemocao;
    }

    @AuraEnabled
    // Defino método para atualizar cliente utilizando os parametros definidos
    public static void atualizarCliente(String id, String nomeCompleto, String email, String cpf, String celular, String endereco, String sedeCadastro, Decimal totalDeDescontoAplicado, Decimal totalGastosLocacoes){     
        // Instancio um objeto da classe Cliente__c       
        Cliente__c registroAlterado = new Cliente__c();
        
        // Atribuções para registroAlterado
        registroAlterado.Id = id;
        registroAlterado.Nome_Completo__c = nomeCompleto;
        registroAlterado.E_mail__c = email;
        registroAlterado.CPF__c = cpf;
        registroAlterado.Numero_Celular__c = celular;
        registroAlterado.Endereco_do_Cliente__c = endereco;
        registroAlterado.Sede_do_Cadastro__c = sedeCadastro;
        registroAlterado.Total_de_Desconto_que_foi_aplicado__c = totalDeDescontoAplicado;
        registroAlterado.Total_gasto_em_locacoes__c = totalGastosLocacoes;
        
        // Realizo o update de registroAlterado
        update registroAlterado;
    }       
}