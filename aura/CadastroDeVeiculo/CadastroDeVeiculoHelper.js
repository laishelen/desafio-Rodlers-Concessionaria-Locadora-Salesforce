({
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
    
    retornarListaVeiculos : function(component, event) {
        // Realizo a chamada da função buscarListaVeiculos na minha BuscarApex
        var action = component.get('c.buscarListaVeiculos');

        // Seto os parametros necessários para a chamada
        action.setCallback(this, function(response){
            // Atribuo o estado da resposta na variavel resposta
			let resposta = response.getReturnValue();
			
            // Atribuo valor resposta a atributo veiculos
            component.set('v.veiculos ', resposta);
		});

        // Coloco na fila minha chamada action
		$A.enqueueAction(action);
    },

    criarVeiculo : function(component, event, helper) {
        // Realizo a chamada do criarVeiculo da minha CriarApex
		var action = component.get('c.criarVeiculo');
        
        // Seto os parametros necessários para a chamada
        action.setParams({
			modelo : component.get('v.modelo'),
            marca : component.get('v.marca'),
            nivel : component.get('v.nivelVeiculo'),
            estoqueVenda : component.get('v.estoqueVenda'),
            estoqueLocacao : component.get('v.estoqueLocacao'),
            sede : component.get('v.sede'),
            precoVenda : component.get('v.precoVenda'),
            precoLocacao : component.get('v.precoLocacao'),
            quantidadeDisponivel : component.get('v.estoqueLocacao')
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
                helper.retornarListaVeiculos(component, event);
            }   
            // Verifico de a resposta é ERROR
            if(state === 'ERROR') {
                console.log('deu ruim');
            }  			
		});
        
        // Coloco na fila minha chamada action
        $A.enqueueAction(action);
	},

    atualizarVeiculo : function(component, event, helper) {
        // Realizo a chamada do atualizarVeiculo da minha CriarApex
		var action = component.get('c.atualizarVeiculo');
        // Seto os parametros necessários para a chamada
        action.setParams({
            id : component.get('v.id'),
            modelo : component.get('v.modelo'),
            marca : component.get('v.marca'),
            nivel : component.get('v.nivelVeiculo'),
            estoqueVenda : component.get('v.estoqueVenda'),
            estoqueLocacao : component.get('v.estoqueLocacao'),
            sede : component.get('v.sede'),
            precoVenda : component.get('v.precoVenda'),
            precoLocacao : component.get('v.precoLocacao'),
            quantidadeDisponivel : component.get('v.quantidadeDisponivel')
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
                helper.retornarListaVeiculos(component, event);
            }   
            // Verifico de a resposta é ERROR
            if(state === 'ERROR') {
                console.log('deu ruim');
            }  			
		});
        
        // Coloco na fila minha chamada action
        $A.enqueueAction(action);
	},

    deletarVariosVeiculos : function(component, event, helper) {
        var selectedRows = component.get('v.linhasSelecionadas');
        var listaRemocao = [];
        
        for(var i =0; i < selectedRows.length; i++) {
            listaRemocao.push({id: selectedRows[i].Id});
        }
        // Realizo a chamada do deletarVariosVeiculos da minha CriarApex
		var action = component.get('c.deletarVariosVeiculos');
        // Seto os parametros necessários para a chamada
        action.setParams({
            ids: JSON.stringify(listaRemocao)
		});
        
                
        // Realizo um callback para validar e pegar a resposta do meu back-end
        action.setCallback(this, function(response){
            // Atribuo o estado da resposta na variavel state
			let state = response.getState();
			// Verifico de a resposta é SUCCESS
            if(state === 'SUCCESS')
            {
                var lista = [];
                component.set('v.setLinhasSelecionadas', lista);
                // Chamando (showToast)
                helper.showToast(component, event, helper, 'success');
                // Chamando (limparCampos)    
                helper.limparCampos(component, event, helper);
                helper.retornarListaVeiculos(component, event);
            }   
            // Verifico de a resposta é ERROR
            if(state === 'ERROR') {
                console.log('deu ruim');
            }  			
		});
        
        // Coloco na fila minha chamada action
        $A.enqueueAction(action);
	},

    deletarVeiculo : function(component, event, helper) {
        // Realizo a chamada do deletarVeiculo da minha CriarApex
		var action = component.get('c.deletarVeiculo');
        // Seto os parametros necessários para a chamada
        action.setParams({
            id : component.get('v.id')
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
                helper.retornarListaVeiculos(component, event);
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
        component.set('v.modelo', '');
        component.set('v.marca', '');
        component.set('v.nivel', '');
        component.set('v.estoqueVenda', '');
        component.set('v.estoqueLocacao', '');
        component.set('v.sede', '');
        component.set('v.precoVenda', '');
        component.set('v.precoLocacao', '');
        component.set('v.quantidadeDisponivel', '')
    },
    
    // Função para inserir mensagem de Operação concluída
    showToast : function(component, event, helper, type) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Successo!",
            "type": type,
            "message": "Operação concluida."
        });
        // Disparo meu toastEvent
        toastEvent.fire();
    }
})