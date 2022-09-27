({
    retornarListaSedes : function(component, event) {
        // Realizo a chamada da função buscarListaSedes na minha BuscarApex
        var action = component.get('c.buscarListaSedes');

        // Seto os parametros necessários para a chamada
        action.setCallback(this, function(response){
            // Atribuo o estado da resposta na variavel resposta
			let resposta = response.getReturnValue();
			
            // Atribuo valor resposta a atributo sedes
            component.set('v.sedes ', resposta);
		});

        // Coloco na fila minha chamada action
		$A.enqueueAction(action);
    },

    criarSede : function(component, event, helper) {
        // Realizo a chamada do criarSede da minha CriarApex
		var action = component.get('c.criarSede');

        // Seto os parametros necessários para a chamada
        action.setParams({
			nome : component.get('v.nomeSede'),
            endereco : component.get('v.endereco')
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
                helper.retornarListaSedes(component, event);
            }   
            // Verifico de a resposta é ERROR
            if(state === 'ERROR') {
                console.log('deu ruim');
            }  			
		});
        
        // Coloco na fila minha chamada action
        $A.enqueueAction(action);
	},

    atualizarSede : function(component, event, helper) {
        // Realizo a chamada do atualizarSede da minha CriarApex
		var action = component.get('c.atualizarSede');
        // Seto os parametros necessários para a chamada
        action.setParams({
            id : component.get('v.id'),
			nome : component.get('v.nomeSede'),
            endereco : component.get('v.endereco')
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
                helper.retornarListaSedes(component, event);
            }   
            // Verifico de a resposta é ERROR
            if(state === 'ERROR') {
                console.log('deu ruim');
            }  			
		});
        
        // Coloco na fila minha chamada action
        $A.enqueueAction(action);
	},

    deletarSede : function(component, event, helper) {
        // Realizo a chamada do deletarSede da minha CriarApex
		var action = component.get('c.deletarSede');
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
                helper.retornarListaSedes(component, event);
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
        component.set('v.nomeSede', '');
        component.set('v.endereco', '');
        component.set('v.clientesCadastrados', '')
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