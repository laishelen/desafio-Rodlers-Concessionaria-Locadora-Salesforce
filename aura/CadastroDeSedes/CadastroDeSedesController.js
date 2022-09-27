({    
    // Função para iniciar meu componente com com a variável columns preenchida
    init: function (component, event, helper) {
        
        //CRIA VARIAVEL COM AS OPCOES DO DROPDOWN MENU (dentro da tabela)
        var actions = [
            { label: 'Editar', name: 'editar' },
            { label: 'Deletar', name: 'deletar' }
        ];
        
        // Seto as label para minha v.columns
        component.set('v.columns', [
            {label: 'Nome da Sede', fieldName: 'Name', type: 'text'},      
            {label: 'Endereço', fieldName: 'Endereco__c', type: 'text'},    
            {label: 'Total Clientes', fieldName: 'Total_de_Clientes_Cadastrados__c', type: 'Number'},
            {label: '', type: 'action', typeAttributes: { rowActions: actions } }
        ]);

        //RETORNA OS DADOS 
        helper.retornarListaSedes(component, event);        
    },    
    
    // Função para adicionar sede / Seta itens para vazio / E modal abre
    adicionarSede: function(component, event, helper) {
        // Set isModalOpen true
        component.set('v.id', '');
        component.set('v.nomeSede', '');
        component.set('v.endereco', '');
        component.set('v.clientesCadastrados', '')

        component.set("v.operacao", 1);
        component.set("v.isModalOpen", true);
    },
    
    // Função para cancelar operação / E modal fecha
    cancelarSede: function(component, event, helper) {     
        component.set("v.isModalOpen", false);
    },
    
    // Função para finalizar adição de sede
    adicionar: function(component, event, helper) {
        // Realizo a chamada do criarSede da Helper  
        helper.criarSede(component, event, helper);
        component.set("v.isModalOpen", false);
    },

    // Função para finalizar edição de sede
    editar: function(component, event, helper) {    
        // Realizo a chamada do atualizarSede da Helper       
        helper.atualizarSede(component, event, helper);
        component.set("v.isModalOpen", false);        
    },    

    // Função para finalizar remoção de sede
    deletar: function(component, event, helper) {
        // Realizo a chamada do deletarSede da Helper 
        helper.deletarSede(component, event, helper);
        component.set("v.isModalOpen", false);
    },

    // Função para definir as ações do drop down
    handleRowAction : function(component, event, helper) {
        
        // Pego a ação do meu event e atribuo para action
        var action = event.getParam('action');
        // Pego a linha do meu event e atribuo para row
        var row = event.getParam('row');
        
        component.set("v.id", row.Id);
        component.set("v.nomeSede", row.Name);
        component.set("v.endereco", row.Endereco__c);

        switch (action.name) {
            case 'editar':
                component.set("v.operacao", 2);
                component.set("v.isModalOpen", true);
                break;
            case 'deletar':
                component.set("v.operacao", 3);
                component.set("v.isModalOpen", true);
                break;
        }
    }
})