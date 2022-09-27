({
    // Função que atribui nível do veículo com preço de venda e locação
    onChangeLevel: function (component, event, helper) {
        var nivel = component.find('selectNivel').get('v.value');
        var baseLocacao = 50;
        var baseVenda = 50000;
        if(nivel>0) {
            component.set("v.precoVenda", nivel*baseVenda);
            component.set("v.precoLocacao", nivel*baseLocacao);
            switch(nivel){
                case '1':
                    component.set("v.nivelVeiculo", 'Econômico');
                    break;
                case '2':
                    component.set("v.nivelVeiculo", 'Conforto');
                    break;
                case '3':
                    component.set("v.nivelVeiculo", 'Premium');
                    break;
            }
        }
    },   

    // Função que retorna sedes no SELECT
    selecionaSede: function (component, event, helper) {
        var sede = component.find('selectSede').get('v.value');
        if(sede!=0) {
            component.set("v.sede", sede);
        }
    },

    // Função para iniciar meu componente com com a variável columns preenchida
    init: function (component, event, helper) {
        
        //CRIA VARIAVEL COM AS OPCOES DO DROPDOWN MENU (dentro da tabela)
        var actions = [
            { label: 'Editar', name: 'editar' },
            { label: 'Deletar', name: 'deletar' }
        ];
        
        // Seto as label para minha v.columns
        component.set('v.columns', [
            {label: 'Nome/Código', fieldName: 'Nome_Codigo__c'},
            {label: 'Marca', fieldName: 'Marca__c', type: 'text'},  
            {label: 'Modelo', fieldName: 'Modelo__c', type: 'text'},         
            {label: 'Nível', fieldName: 'Nivel__c', type: 'text'},
            {label: 'Estoque Venda', fieldName: 'Estoque_Venda__c', type: 'text'},    
            {label: 'Estoque Locação', fieldName: 'Estoque_Locacao__c', type: 'text'},    
            {label: 'Sede', fieldName: 'Sede__c', type: 'text'},    
            {label: 'Preço de Venda', fieldName: 'Preco_de_Venda__c', type: 'text'},    
            {label: 'Preço de Locação', fieldName: 'Preco_de_Locacao__c', type: 'text'},    
            {label: 'Quantidade Disponível Locação', fieldName: 'Quantidade_Disponivel_Locacao__c', type: 'text'},    
            {label: '', type: 'action', typeAttributes: { rowActions: actions } }
        ]);

        //RETORNA OS DADOS 
        helper.retornarListaVeiculos(component, event);
        helper.retornarListaSedes(component, event);
    },  
    
    // Função para adicionar veículo / Seta itens para vazio / E modal abre
    adicionarVeiculo: function(component, event, helper) {
        // Set isModalOpen true   
        component.set('v.id', '');
        component.set('v.modelo', '');
        component.set('v.marca', '');
        component.set('v.nivel', '');
        component.set('v.estoqueVenda', '');
        component.set('v.estoqueLocacao', '');
        component.set('v.sede', '');
        component.set('v.precoVenda', '');
        component.set('v.precoLocacao', '');
        component.set('v.quantidadeDisponivel', '');
        component.set("v.operacao", 1);

        component.set("v.isModalOpen", true);
    },
    
    // Função para cancelar operação / E modal fecha
    cancelarVeiculo: function(component, event, helper) {        
        component.set("v.isModalOpen", false);
    },
    
    // Função para finalizar adição de veículo
    adicionar: function(component, event, helper) {
        // Realizo a chamada do criarVeiculo da Helper 
        helper.criarVeiculo(component, event, helper);
        component.set("v.isModalOpen", false);
    },

    // Função para finalizar edição de veículo
    editar: function(component, event, helper) {  
        // Realizo a chamada do atualizarVeiculo da Helper 
        helper.atualizarVeiculo(component, event, helper);
        component.set("v.isModalOpen", false);
    },

    // Função para finalizar remoção de veículo
    deletar: function(component, event, helper) {
        // Realizo a chamada do deletarVeiculo da Helper 
        helper.deletarVeiculo(component, event, helper);
        component.set("v.isModalOpen", false);
    },

    // Função para deletar vários veículos
    deletarVarios: function(component, event, helper) {
        // Realizo a chamada do deletarVariosVeiculos da Helper 
        helper.deletarVariosVeiculos(component, event, helper);
    },

    // Função para seleção de linhas
    handleRowSelection : function(component, event, helper){
        var selRows = event.getParam('selectedRows');
        component.set("v.linhasSelecionadas",selRows);
    },

    // Função para definir as ações do drop down 
    handleRowAction : function(component, event, helper) {
        
        // Pego a ação do meu event e atribuo para action
        var action = event.getParam('action');
        // Pego a linha do meu event e atribuo para row
        var row = event.getParam('row');
        
        component.set("v.id", row.Id);
        component.set('v.modelo', row.Modelo__c);
        component.set('v.marca', row.Marca__c);
        component.set('v.nivel', row.Nivel__c);
        component.set('v.estoqueVenda', row.Estoque_Venda__c);
        component.set('v.estoqueLocacao', row.Estoque_Locacao__c);
        component.set('v.sede', row.Sede__c);
        component.set('v.precoVenda', row.Preco_de_Venda__c);
        component.set('v.precoLocacao', row.Preco_de_Locacao__c);
        component.set('v.quantidadeDisponivel', row.Quantidade_Disponivel_Locacao__c); 

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