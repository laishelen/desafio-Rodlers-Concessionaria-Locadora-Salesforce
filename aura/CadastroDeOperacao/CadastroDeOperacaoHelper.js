({
    retornarListaOperacoes : function(component, event) {
        // Realizo a chamada da função buscarListaOperacoes na minha BuscarApex
        var action = component.get('c.buscarListaOperacoes');

        // Seto os parametros necessários para a chamada
        action.setCallback(this, function(response){
            // Atribuo o estado da resposta na variavel resposta
			let resposta = response.getReturnValue();

            // 
            for(var i = 0; i<resposta.length; i++) {
                if(resposta[i].Operacao__c == "LOCACAO") {
                    if(resposta[i].Status__c) {
                        resposta[i].Status__c = 'ATIVO';
                    } else {
                        resposta[i].Status__c = 'ENCERRADA';
                    }
                } else {
                    resposta[i].Status__c = '';
                }
                
            }
            // Atribuo valor resposta a atributo operacoes
			component.set('v.operacoes', resposta);
		});

        // Coloco na fila minha chamada action
		$A.enqueueAction(action);
    },

    retornarListaVeiculos : function(component, event) {
        // Realizo a chamada da função buscarListaVeiculos na minha BuscarApex
        var action = component.get('c.buscarListaVeiculos');
        var operacao = parseInt(component.get("v.operacao"));

        action.setParams({
            operacao: operacao
		});   

        // Seto os parametros necessários para a chamada
        action.setCallback(this, function(response){
            // Atribuo o estado da resposta na variavel resposta
			let resposta = response.getReturnValue();

            // Atribuo valor resposta a atributo veiculos
            component.set('v.veiculos', resposta);
            // Atribuo valor verdadeiro a Modal
            component.set("v.isModalOpen", true);
		});

        // Coloco na fila minha chamada action
		$A.enqueueAction(action);
    },

    retornarListaClientes : function(component, event) {
        // Realizo a chamada da função buscarListaClientes na minha BuscarApex
        var action = component.get('c.buscarListaClientes');

        // Seto os parametros necessários para a chamada
        action.setCallback(this, function(response){
            // Atribuo o estado da resposta na variavel resposta
			let resposta = response.getReturnValue();

            // Atribuo valor resposta a atributo clientes
            component.set('v.clientes', resposta);
		});

        // Coloco na fila minha chamada action
		$A.enqueueAction(action);
    },

    retornarListaSedes : function(component, event) {
        // Realizo a chamada da função buscarListaSedes na minha BuscarApex
        var action = component.get('c.buscarListaSedes');

        // Seto os parametros necessários para a chamada
        action.setCallback(this, function(response){
            // Atribuo o estado da resposta na variavel resposta
			let resposta = response.getReturnValue();
            // Atribuo valor resposta a atributo sedes
            component.set('v.sedes', resposta);
            
		});
        // Coloco na fila minha chamada action
		$A.enqueueAction(action);
    },

    adicionarOperacao : function(component, event, helper) {
        var listaCarrosVenda = component.get('v.carrosVenda');
        var operacao = parseInt(component.get("v.operacao"));
        if(operacao == 1) {
            operacao = 'VENDA';
        } else {
            operacao = 'LOCACAO';
        }
        // Realizo a chamada do criarOperacao da minha CriarApex
		var action = component.get('c.criarOperacao');
        action.setParams({
            operacao: operacao,
			veiculos: JSON.stringify(listaCarrosVenda)
		});        
          
        // Realizo um callback para validar e pegar a resposta do meu back-end
        action.setCallback(this, function(response){
            // Atribuo o estado da resposta na variavel state
			let state = response.getState();
            // Verifico de a resposta é SUCCESS
            if(state === 'SUCCESS')
            {
                // Chamando (showToast) 
                helper.showToast(component, event, helper, 'success');
                // Chamando (limparCampos)    
                helper.limparCampos(component, event, helper);
                helper.retornarListaOperacoes(component, event);
            }   
            // Verifico de a resposta é ERROR    
            if(state === 'ERROR') {
                console.log('deu ruim');
            }  
			
		});   
        // Coloco na fila minha chamada action     
        $A.enqueueAction(action);
	},

    encerrarLocacoesHelper : function(component, event, helper) {
        var selectedRows = component.get('v.camposSelecionados');
        var listaEncerramento = [];
        for(var i =0; i < selectedRows.length; i++) {
            listaEncerramento.push({
                                        id: selectedRows[i].Id,
                                        veiculo: selectedRows[i].Veiculo__c,
                                        status: false  
                                    });
        }
        // Realizo a chamada do encerrarLocacaoApex da minha CriarApex
        var action = component.get('c.encerrarLocacaoApex');
        action.setParams({
            operacoes: JSON.stringify(listaEncerramento)
		});        
        // Realizo um callback para validar e pegar a resposta do meu back-end       
        action.setCallback(this, function(response){
            // Atribuo o estado da resposta na variavel state
			let state = response.getState();
            // Verifico de a resposta é SUCCESS
            if(state === 'SUCCESS')
            {
                var lista = [];
                component.set('v.setCamposSelecionados', lista);
                // Chamando (showToast)
                helper.showToast(component, event, helper, 'success');
                // Chamando (limparCampos)  
                helper.limparCampos(component, event, helper);
                helper.retornarListaOperacoes(component, event);
            }   
            // Verifico de a resposta é ERROR
            if(state === 'ERROR') {
                console.log('deu ruim');
            }  			
		});    
        // Coloco na fila minha chamada action    
        $A.enqueueAction(action);
	},

    limpaTudo : function(component, event, helper) {
        // Realizo a chamada do limpaTudoApex da minha CriarApex
        var action = component.get('c.limpaTudoApex');
          
        // Realizo um callback para validar e pegar a resposta do meu back-end
        action.setCallback(this, function(response){
            // Atribuo o estado da resposta na variavel state
			let state = response.getState();
            // Verifico de a resposta é SUCCESS
            if(state === 'SUCCESS')
            {
                // Chamando (showToast) 
                helper.showToast(component, event, helper, 'success');
                // Chamando (limparCampos) 
                helper.limparCampos(component, event, helper);
                helper.retornarListaOperacoes(component, event);
            }   
            // Verifico de a resposta é ERROR
            if(state === 'ERROR') {
                console.log('deu ruim');
            }  
			
		});        
        // Coloco na fila minha chamada action
        $A.enqueueAction(action);
	},
    
    // Função para limpar variáveis
    limparCampos : function(component, event, helper) {
        var listaVazia = [];

        component.set('v.id', '');
        component.set('v.veiculo', '');
        component.set('v.cliente', '');
        component.set('v.sede', '');
        component.set('v.carrosVenda', listaVazia);
        component.set('v.descontoAtivo',false);
        component.set('v.valorDesconto',0);
        component.set('v.valorTotalLocacao', 0);
        component.set('v.desabilitaVeiculo',true);
        component.set("v.isModalOpen", false);
    },
    
    // Função para inserir mensagem de Operação concluída
    showToast : function(component, event, helper, type) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Successo!",
            "type": type,
            "message": "Operação concluída."
        });
        // Disparo meu toastEvent
        toastEvent.fire();
    }
})