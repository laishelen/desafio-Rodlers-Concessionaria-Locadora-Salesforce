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
            {label: 'Nome Completo', fieldName: 'Nome_Completo__c', type: 'text'},      
            {label: 'E_mail', fieldName: 'E_mail__c', type: 'email'},    
            {label: 'CPF', fieldName: 'CPF__c', type: 'text'},
            {label: 'Número Celular', fieldName: 'Numero_Celular__c', type: 'text'},    
            {label: 'Endereço do Cliente', fieldName: 'Endereco_do_Cliente__c', type: 'text'},    
            {label: 'Sede do Cadastro', fieldName: 'Sede_do_Cadastro__c', type: 'text'},    
            {label: 'Total de vezes que o Desconto foi aplicado', fieldName: 'Total_de_Desconto_que_foi_aplicado__c', type: 'number'},    
            {label: 'Total gasto em locações cliente', fieldName: 'Total_gasto_em_locacoes__c', type: 'number'},   
            {label: '', type: 'action', typeAttributes: { rowActions: actions } } 
        ]);

        //RETORNA OS DADOS 
        helper.retornarListaClientes(component, event);
        helper.retornarListaSedes(component, event);
    },   
    
    // Função para adicionar cliente  / Seta itens para vazio / E modal abre
    adicionarCliente: function(component, event, helper) {        
        // Set isModalOpen true   
        component.set('v.id', '');
        component.set('v.nomeCompleto', '');
        component.set('v.email', '');
        component.set('v.cpf', '');
        component.set('v.celular', '');
        component.set('v.endereco', '');
        component.set('v.sedeCadastro', '');
        component.set('v.totalDeDescontoAplicado', '');
        component.set('v.totalGastosLocacoes', '');
        component.set("v.operacao", 1);

        component.set("v.isModalOpen", true);
    },
    
    // Função para cancelar operação / E modal fecha
    cancelarCliente: function(component, event, helper) {        
        component.set("v.isModalOpen", false);
    },   

    // Função para definir formato de celular
    keyMaskCelular : function(component, event, helper) {
        let label = event.target.className;              
        let input = component.find(label);
        let value = input.get('v.value');
        let keycode = event.key;
       
       const allowed = ['0','1','2','3','4','5','6','7','8','9'];
       const actions = ['Backspace','Delete','ArrowRight','ArrowLeft','Tab'];
       
       if (!event.metaKey && !actions.includes(keycode)){
           event.preventDefault();
         }
       
       if(allowed.includes(keycode)){
           if( value != undefined && value != ""){
                // chama helper para formatar número de celular
                helper.applayMaskCelular(label,input,value,keycode);
           }else{
              input.set('v.value', keycode); 
           }
       }     
    },  
    
    // Função para definir formato de CPF
    handleCpfChange: function (component, event){
        let inputCpf = event.getParam("value");
        component.set("v.cpf", inputCpf);
        let length = component.get("v.cpf").length;
        if(length === 3 || length === 7){
            component.set("v.cpf", inputCpf+'.');
        } else  if(length === 11){
            component.set("v.cpf", inputCpf+'-');
        }
    },

    // Função para finalizar adição de cliente
    adicionar: function(component, event, helper) {     
        var strCPF = component.get('v.cpf');
        strCPF = strCPF.replaceAll('.','');
        strCPF = strCPF.replaceAll('-','');

        // chama helper para validar CPF 
        if(helper.testaCPF(strCPF)) {
            helper.criarCliente(component, event, helper);
            component.set("v.isModalOpen", false);
        } else {
            alert('CPF Inválido');
        }        
    },

    // Função para finalizar edição de cliente
    editar: function(component, event, helper) {    
        var strCPF = component.get('v.cpf');
        strCPF = strCPF.replaceAll('.','');
        strCPF = strCPF.replaceAll('-','');

        // chama helper para validar CPF 
        if(helper.testaCPF(strCPF)) {
            helper.atualizarCliente(component, event, helper);
            component.set("v.isModalOpen", false);
        } else {
            alert('CPF Inválido');
        }
    },

    // Função para finalizar remoção de cliente
    deletar: function(component, event, helper) {     
        // Realizo a chamada do deletarCliente da Helper         
        helper.deletarCliente(component, event, helper);
        component.set("v.isModalOpen", false);
    }, 

    // Função para deletar vários clientes
    deletarVarios: function(component, event, helper) {   
        // Realizo a chamada do deletarVariosClientes da Helper          
        helper.deletarVariosClientes(component, event, helper);
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
        component.set('v.nomeCompleto', row.Nome_Completo__c);
        component.set('v.email', row.E_mail__c);
        component.set('v.cpf', row.CPF__c);
        component.set('v.celular', row.Numero_Celular__c);
        component.set('v.endereco', row.Endereco_do_Cliente__c);
        component.set('v.sedeCadastro', row.Sede_do_Cadastro__c);
        component.set('v.totalDeDescontoAplicado', row.Total_de_Desconto_que_foi_aplicado__c);
        component.set('v.totalGastosLocacoes', row.Total_gasto_em_locacoes__c);      
          
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