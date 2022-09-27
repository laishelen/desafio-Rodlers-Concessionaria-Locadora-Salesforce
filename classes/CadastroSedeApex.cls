public with sharing class CadastroSedeApex {    
    @AuraEnabled
    // Metodo estático que retorna uma lista de sedes 
    public static List<Sede__c> buscarListaSedes()
    {        
        List<Sede__c> ListaSedes = [Select Id, Name, Endereco__c, Total_de_Clientes_Cadastrados__c From Sede__c];
        List<Cliente__c> ListaClientes = [Select Id, Sede_do_Cadastro__c  From Cliente__c];

        // Crio um for para retornar total de clientes cadastrados por sede
        for(Integer i = 0; i < ListaSedes.size(); i++) {
            Integer total_cliente = 0;
            for(Integer j = 0; j < ListaClientes.size(); j++){
                if(ListaSedes[i].Name == ListaClientes[j].Sede_do_Cadastro__c){
                    total_cliente++;
                }
            }
            ListaSedes[i].Total_de_Clientes_Cadastrados__c = total_cliente;
        }        
        return ListaSedes;
    }
   
    @AuraEnabled
    // Defino método para criar sede utilizando os parametros definidos
    public static void criarSede(String nome, String endereco)   
    {     
        // Instancio um objeto da classe Sede__c            
        Sede__c novoRegistro = new Sede__c();
        
        // Atribuções para novoRegistro
        novoRegistro.Name = nome;
        novoRegistro.Endereco__c = endereco;
        
        // Realizo o insert de novoRegistro
        insert novoRegistro;
    }
    
    @AuraEnabled
    // Defino método para deletar sede utilizando Id como parametro definidos
    public static void deletarSede(String id)
    {       
        // Instancio um objeto da classe Sede__c            
        Sede__c deletarRegistro = new Sede__c();
        
        // Atribuo id para o Id de registroAlterado
        deletarRegistro.Id = id;
        
        // Realizo o delete de deletarRegistro
        delete deletarRegistro;
    }
    
    @AuraEnabled
    // Defino método para atualizar sede utilizando os parametros definidos
    public static void atualizarSede(String id, String nome, String endereco)
    {     
        // Instancio um objeto da classe Sede__c          
        Sede__c registroAlterado = new Sede__c();
        
        // Atribuções para registroAlterado
        registroAlterado.Id = id;
        registroAlterado.Name = nome;
        registroAlterado.Endereco__c = endereco;
        
        // Realizo o update de registroAlterado
        update registroAlterado;
    }   
}