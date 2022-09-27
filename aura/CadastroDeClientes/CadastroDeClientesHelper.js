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
    
    retornarListaClientes : function(component, event) {
        // Realizo a chamada da função buscarListaClientes na minha BuscarApex
        var action = component.get('c.buscarListaClientes');

        // Seto os parametros necessários para a chamada
        action.setCallback(this, function(response){
            // Atribuo o estado da resposta na variavel resposta
			let resposta = response.getReturnValue();
			
            // Atribuo valor resposta a atributo clientes
            component.set('v.clientes ', resposta);
		});

        // Coloco na fila minha chamada action
		$A.enqueueAction(action);
    },    

    // Função para validar CPF 
    testaCPF : function (strCPF) {        
        var Soma = 0;
        var Resto;
        if (strCPF == "00000000000" || strCPF.length<11) return false;
        
        for (var i=1; i<=9; i++) {
            Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
        }

        Resto = (Soma * 10) % 11;
        
        if ((Resto == 10) || (Resto == 11))  Resto = 0;
        if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;

        Soma = 0;
        for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;
        
        if ((Resto == 10) || (Resto == 11))  Resto = 0;
        if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
        return true;
    },

    criarCliente : function(component, event, helper) {
        // Realizo a chamada do criarCliente da minha CriarApex
		var action = component.get('c.criarCliente');
        
        // Seto os parametros necessários para a chamada
        action.setParams({
            nomeCompleto : component.get('v.nomeCompleto'),
            email : component.get('v.email'),
            cpf : component.get('v.cpf'),
            celular : component.get('v.celular'),
            endereco : component.get('v.endereco'),
            sedeCadastro : component.get('v.sedeCadastro')
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
                helper.retornarListaClientes(component, event);
            }   
            // Verifico de a resposta é ERROR
            if(state === 'ERROR') {                
                console.log('deu ruim');
            }  			
		});
        
        // Coloco na fila minha chamada action
        $A.enqueueAction(action);
	},

    atualizarCliente : function(component, event, helper) {
        // Realizo a chamada do atualizarCliente da minha CriarApex
		var action = component.get('c.atualizarCliente');
        // Seto os parametros necessários para a chamada
        action.setParams({
            id : component.get('v.id'),
            nomeCompleto : component.get('v.nomeCompleto'),
            email : component.get('v.email'),
            cpf : component.get('v.cpf'),
            celular : component.get('v.celular'),
            endereco : component.get('v.endereco'),
            sedeCadastro : component.get('v.sedeCadastro')
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
                helper.retornarListaClientes(component, event);
            }   
            // Verifico de a resposta é ERROR            
            if(state === 'ERROR') {
                console.log('deu ruim');
            }  			
		});
        
        // Coloco na fila minha chamada action
        $A.enqueueAction(action);
	},    

    deletarVariosClientes : function(component, event, helper) {
        var selectedRows = component.get('v.linhasSelecionadas');
        var listaRemocao = [];
        
        for(var i =0; i < selectedRows.length; i++) {
            listaRemocao.push({id: selectedRows[i].Id});
        }
        // Realizo a chamada do deletarVariosClientes da minha CriarApex
		var action = component.get('c.deletarVariosClientes');
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
                helper.retornarListaClientes(component, event);
            }   
            // Verifico de a resposta é ERROR
            if(state === 'ERROR') {
                console.log('deu ruim');
            }  			
		});
        
        // Coloco na fila minha chamada action
        $A.enqueueAction(action);
	},

    deletarCliente : function(component, event, helper) {
        // Realizo a chamada do deletarCliente da minha CriarApex
		var action = component.get('c.deletarCliente');     
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
                helper.retornarListaClientes(component, event);
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
        component.set('v.nomeCompleto', '');
        component.set('v.email', '');
        component.set('v.cpf', '');
        component.set('v.celular', '');
        component.set('v.endereco', '');
        component.set('v.sedeCadastro', '');
        component.set('v.totalDeDescontoAplicado', '');
        component.set('v.totalGastosLocacoes', '');
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
    },

    // Função para aplicar formato de celular
    applayMaskCelular : function(label,input,value,keycode) {
        value += keycode;
       if(label == 'phone'){
           let x = value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
           let phoneMask =!x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
           input.set('v.value',phoneMask);
       }else{
           let x = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/);
           let phoneMask =!x[2] ? x[1] : x[1] + '.' + x[2] + '.' + x[3] + (x[4] ? '-' + x[4] : '');
           input.set('v.value',phoneMask);          
       }       
   }
})