({ 
    // Função para iniciar meu componente com com a variável columns preenchida
    init: function (component, event, helper) {

        //CRIA VARIAVEL COM AS OPCOES DO DROPDOWN MENU (dentro da tabela)
        var detalhar = [
            { label: 'Detalhar', name: 'detalhar' }
        ];

        // Seto as label para minha v.columns
        component.set('v.columns', [
            {label: 'Operação', fieldName: 'Operacao__c', type: 'text'},
            {label: 'Item', fieldName: 'Item_Venda__c', type: 'text'},
            {label: 'Veículo', fieldName: 'Modelo_Veiculo__c', type: 'text'},
            {label: 'Cliente', fieldName: 'Cliente_Nome__c', type: 'text'},
            {label: 'Sede', fieldName: 'Nome_Sede__c', type: 'text'},
            {label: 'Valor item', fieldName: 'Valor_Total_Locacao__c', type: 'text'},
            {label: 'Status', fieldName: 'Status__c', type: 'text' },
            {label: '', type: 'action', typeAttributes: { rowActions: detalhar } }
        ]);

        //CRIO VARIAVEL COM A OPCÃO DO DROPDOWN MENU (dentro da tabela de venda)
        var remover = [
            { label: 'Remover Item', name: 'removerItem' }
        ];

        // Seto as label para minha coluna de venda
        component.set('v.colunasVenda', [
            {label: 'Item', fieldName: 'item', type: 'number'},
            {label: 'Sede', fieldName: 'sede_nome', type: 'text'},
            {label: 'Veículo', fieldName: 'veiculo_modelo', type: 'text'},      
            {label: 'Cliente', fieldName: 'cliente_nome', type: 'text'},    
            {label: 'Valor Item', fieldName: 'valor_item', type: 'number'},
            {label: 'Valor Desconto', fieldName: 'valor_desconto', type: 'number'},
            {label: '', type: 'action', typeAttributes: { rowActions: remover } }
        ]);

        //RETORNA OS DADOS 
        helper.retornarListaSedes(component, event);
        helper.retornarListaClientes(component, event);        
        helper.retornarListaOperacoes(component,event);
    }, 

    // Função para seleção de veículo
    selecionaVeiculo: function (component, event, helper) {
        var veiculo = component.find('selectVeiculo').get('v.value');
        var operacao = component.get("v.operacao");
        if(veiculo!=0) {
            component.set("v.veiculo", veiculo);
            if(operacao == 2) {
                var numeroDias = parseInt(component.find('inputDias').get('v.value'));
                var valorTotal = component.get('v.valorTotalLocacao');
                var veiculos = component.get('v.veiculosSelecionados');
                var veiculo = component.get('v.veiculo');
                var percDesconto = 0;
                // Seta número de dias por locação com seu respectivo desconto
                if(numeroDias >= 20) {
                    percDesconto = 0.15;
                } else if(numeroDias >= 13) {
                    percDesconto = 0.1;
                } else if(numeroDias >= 6) {
                    percDesconto = 0.05;
                }
        
                for(var i = 0; i<veiculos.length; i++) {
                    if(veiculos[i].Id == veiculo) {
                        //aplica o desconto no preço do veículo preço da locação * (100% - percentual do desconto)
                        valorTotal = veiculos[i].Preco_de_Locacao__c*(1-percDesconto);
                    }
                }
                component.set('v.valorTotalLocacao',valorTotal);
            }
        }
    }, 

    // Função para seleção de cliente 
    selecionaCliente: function (component, event, helper) {
        var cliente = component.find('selectCliente').get('v.value');
        var clientes = component.get('v.clientes');
        if(cliente!=0) {
            //Verifica se o cliente possui locação para habilitar o desconto
            for(var j = 0; j < clientes.length; j++) {
                if(clientes[j].Id == cliente) {
                    if(clientes[j].Total_gasto_em_locacoes__c > 0) {
                        component.set('v.descontoAtivo',true);
                        component.set('v.valorDesconto',clientes[j].Total_gasto_em_locacoes__c);
                    } else {
                        component.set('v.descontoAtivo',false);
                        component.set('v.valorDesconto',0);
                    }
                }
            }
            component.set("v.cliente", cliente);
        }
    }, 

    // Função para seleção de sede
    selecionaSede: function (component, event, helper) {
        var sede = component.find('selectSede').get('v.value');
        var veiculos = component.get('v.veiculos');
        var sedes = component.get('v.sedes');
        var veiculosSelecionados = [];

        if(sede!=0) {
            component.set("v.sede", sede);
            for(var j = 0; j < sedes.length; j++) {
                if(sedes[j].Id == sede) {
                    sede = sedes[j].Name;
                }
            }
            // Desabilita veículo após escolher sede
            for(var i = 0; i < veiculos.length; i++) {
                if(veiculos[i].Sede__c == sede) {
                    veiculosSelecionados.push(veiculos[i]);
                }
            }
            component.set('v.veiculosSelecionados',veiculosSelecionados);
            component.set('v.desabilitaVeiculo',false);
            
        } else {
            component.set('v.desabilitaVeiculo',true);
            component.set('v.valorTotalLocacao',0);
        }
    },

    // Função que atualiza preço da locação após inserir número de dias
    atualizaPreco: function (component, event) {
        var numeroDias = parseInt(component.find('inputDias').get('v.value'));        
        var valorTotal = component.get('v.valorTotalLocacao');
        var veiculos = component.get('v.veiculosSelecionados');
        var veiculo = component.get('v.veiculo');
        var percDesconto = 0;
        // Seta número de dias por locação com seu respectivo desconto
        if( valorTotal > 0 ) {
            if( numeroDias >= 21 ) {
                percDesconto = 0.15;
            } else if( numeroDias > 13 ) {
                percDesconto = 0.1;
            } else if( numeroDias > 6 ) {
                percDesconto = 0.05;
            }
            // Atualiza número de dias com desconto aplicado || E Valor Total 
            for( var i = 0; i < veiculos.length; i++ ) {
                if(veiculos[i].Id == veiculo) {
                    valorTotal = veiculos[i].Preco_de_Locacao__c*(1-percDesconto);
                    valorTotal = valorTotal*numeroDias;
                }
            }
            // Atribuo valorTotal a atributo valorTotalLocacao
            component.set('v.valorTotalLocacao',valorTotal);
        }
    },
    
    // Função para iniciar operação de venda
    iniciarOperacaoVenda: function(component, event, helper) {
        var clientes = component.get("v.clientes");


        component.set("v.operacao", 1);
        component.set("v.clientesSelecionados",clientes);
        // Realizo a chamada do retornarListaVeiculos da Helper
        helper.retornarListaVeiculos(component, event);
    },

    // Função para iniciar operação de locação
    iniciarOperacaoLocacao: function(component, event, helper) {
        component.set("v.operacao", 2);
        var clientes = component.get("v.clientes");
        var operacoes = component.get("v.operacoes");
        var listaClientes = [];
        var semLocacao = true;
        // Verifica se locação é ativa
        for( var i = 0; i < clientes.length;i++ ) {
            for(var j =0; j < operacoes.length;j++) {
                if(clientes[i].Id == operacoes[j].Cliente__c) {
                    if(operacoes[j].Status__c == 'ATIVO') {
                        semLocacao = false;
                    }
                }
            }
            if(semLocacao) {
                listaClientes.push(clientes[i]);
            }
            semLocacao = true;
        }

        component.set("v.clientesSelecionados",listaClientes);
        // Realizo a chamada do retornarListaVeiculos da Helper
        helper.retornarListaVeiculos(component, event);
    },

    // Função para papocar base de dados de todas as operações
    limpaTudo: function(component, event, helper) {
        alert('PAPOCA');
        helper.limpaTudo(component, event);
    },
    
    // Função do carrinho de venda de veículos
    adicionarItemVenda: function(component, event, helper) {
        var listaCarrosVenda = component.get('v.carrosVenda');
        var veiculos = component.get('v.veiculosSelecionados');
        var sedes = component.get('v.sedes');
        var clientes = component.get('v.clientes');
        var veiculo = component.get('v.veiculo');
        var valorTotal = component.get('v.valorTotalLocacao');
        var cliente = component.get('v.cliente');
        var sede = component.get('v.sede');
        var valorDesconto = 0;
        var preco = 0;
        var qtdEstoque = 0;
        var veiculo_modelo ="";
        var sede_nome ="";
        var cliente_nome ="";
        var qtdCarrinho = 1;


        // Se algum campo não estiver preenchido aparece uma mensagem
        if(veiculo == null || veiculo == 0 || cliente == null || cliente == 0 || sede == null || sede == 0) {
            alert ('Verifique se todos os campos estão preenchidos');
        } else {
            //Uma vez que só tenho o ID do veículo, procuro o modelo, a quantidade de estoque, o preço de venda e alimento o preço total do carrinho
            for(var i = 0; i<veiculos.length; i++) {
                if(veiculos[i].Id == veiculo) {
                    veiculo_modelo = veiculos[i].Modelo__c;
                    preco = veiculos[i].Preco_de_Venda__c;
                    qtdEstoque = veiculos[i].Estoque_Venda__c;
                    valorTotal = valorTotal +preco;
                }
            }
            //Uma vez que só tenho o ID da sede, procuro o nome
            for(var j = 0; j < sedes.length; j++) {
                if(sedes[j].Id == sede) {
                    sede_nome = sedes[j].Name;
                }
            }
            //Uma vez que só tenho o ID do cliente, procuro o nome
            for(var k = 0; k < clientes.length; k++) {
                if(clientes[k].Id == cliente) {
                    cliente_nome = clientes[k].Nome_Completo__c;
                        
                    //Verifica se o desconto é maior que 20% do carro.
                    //Se for, aplica 20% (o máximo)
                    //Se não, aplica o valor maximo do desconto
                    if(clientes[k].Total_gasto_em_locacoes__c/preco >0.2) {
                        valorDesconto = preco*0.2;
                    } else {
                        valorDesconto = clientes[k].Total_gasto_em_locacoes__c;
                    }
                }
            }

            //Toda vez que adicionar um carro novo, vejo todos os carros adicionados para:            
            for(var y = 0; y < listaCarrosVenda.length; y++) {
                //Verificar se já tem desconto aplicado
                if(listaCarrosVenda[y].cliente == cliente && listaCarrosVenda[y].valor_desconto >= 0) {
                    valorDesconto = 0;
                }
                //Verificar se tem estoque disponível para o carro
                if(listaCarrosVenda[y].veiculo == veiculo) {
                    qtdCarrinho++;
                }
            }
            //Se a quantidade de carros adicionadas do mesmo 'MODELO' (id), for menor que a quantidade disponível, ele deixa, se não dá um erro de estoque
            if(qtdCarrinho <= qtdEstoque) {
                listaCarrosVenda.push({
                    item: listaCarrosVenda.length+1,
                    veiculo : veiculo,
                    veiculo_modelo : veiculo_modelo,
                    cliente : cliente,
                    cliente_nome : cliente_nome,
                    sede : sede,
                    sede_nome : sede_nome,
                    valor_item : preco,
                    valor_desconto: valorDesconto
                });
            } else {
                alert('Estoque insuficiente');
            }
            
            component.set('v.valorTotalLocacao',valorTotal);
            component.set('v.carrosVenda',listaCarrosVenda);
        }
    },
    
    // Função que cancela modal de operação venda / locação
    cancelarOperacao: function(component, event, helper) {
        var listaVazia = [];

        component.set('v.id', '');
        component.set('v.veiculo', '');
        component.set('v.cliente', '');
        component.set('v.sede', '');
        component.set('v.carrosVenda', listaVazia);
        component.set('v.valorTotalLocacao', 0);
        component.set('v.valorDesconto',0);
        component.set('v.descontoAtivo',false);
        component.set('v.desabilitaVeiculo',true);
        component.set("v.isModalOpen", false);
        component.set("v.operacaoDetalhe", false);
        component.set("v.mostrarDetalhe", false);
    },
    
    // Função que finaliza venda 
    vender: function(component, event, helper) {
        var listaCarrosVenda = component.get('v.carrosVenda');
        if(listaCarrosVenda.length>0) {
            // Realizo a chamada do adicionarOperacao da Helper
            helper.adicionarOperacao(component, event, helper);
            component.set("v.isModalOpen", false);
        } else {
            alert('Adicione pelo menos um veículo');
        }
        
    },

    // Função que finaliza locação
    alugar: function(component, event, helper) {
        var veiculos = component.get('v.veiculosSelecionados');
        var sedes = component.get('v.sedes');
        var clientes = component.get('v.clientes');
        var veiculo = component.get('v.veiculo');
        var numeroDias = component.get('v.numeroDias');
        var cliente = component.get('v.cliente');
        var sede = component.get('v.sede');
        var valorTotal = component.get('v.valorTotalLocacao');
        var veiculo_modelo ="";
        var sede_nome ="";
        var cliente_nome ="";
        var cliente_mail ="";
        numeroDias = parseInt(numeroDias);
        //Crio uma variavel data e adiciono a quantidade de dias da locação para verificar se cai num FINAL DE SEMANA
        var hoje = new Date();
        hoje.setDate(hoje.getDate() + numeroDias);       


        //Uma vez que só tenho o ID do veículo, procuro o modelo, a quantidade de estoque, o preço de venda e alimento o preço total do carrinho
        for(var i = 0; i<veiculos.length; i++) {
            if(veiculos[i].Id == veiculo) {
                veiculo_modelo = veiculos[i].Modelo__c;
            }
        }
        //Uma vez que só tenho o ID da sede, procuro o nome
        for(var j = 0; j < sedes.length; j++) {
            if(sedes[j].Id == sede) {
                sede_nome = sedes[j].Name;
            }
        }
        //Uma vez que só tenho o ID do cliente, procuro o nome
        for(var k = 0; k < clientes.length; k++) {
            if(clientes[k].Id == cliente) {
                cliente_mail = clientes[k].E_mail__c;
                cliente_nome = clientes[k].Nome_Completo__c;
            }
        }
        
        //Primeiro, vejo se os campos foram preenchidos
        if(veiculo == null || veiculo == 0 || cliente == null || cliente == 0 || sede == null || sede == 0 || numeroDias == 0) {
            alert(veiculo+' - '+cliente+' - '+sede+' - '+numeroDias);
            alert ('Verifique se todos os campos estão preenchidos');
        } else {
            //Depois verifico se cai no fds a devolução, se cair, dá erro
            if(hoje.getDay() == 0 || hoje.getDay() == 6) {
                alert('Altere a quantidade de dias, a devolução não pode cair num fim de semana.');
            } else {
                var listaCarrosVenda = [{
                    item: 1,
                    veiculo : veiculo,
                    veiculo_modelo: veiculo_modelo,
                    cliente : cliente,
                    cliente_mail: cliente_mail,
                    cliente_nome: cliente_nome,
                    sede : sede,
                    sede_nome, sede_nome,
                    valor_item : valorTotal,
                    numeroDias : numeroDias
                }];
                component.set('v.carrosVenda',listaCarrosVenda);
                
                // Realizo a chamada do adicionarOperacao da Helper
                helper.adicionarOperacao(component, event, helper);
                component.set("v.isModalOpen", false);
            }
        }
    },

    //
    encerrarLocacoes : function(component, event, helper) {
        
        var selectedRows = component.get('v.camposSelecionados');
        var validado = true;
        
        for(var i =0; i < selectedRows.length; i++) {
            if(selectedRows[i].Status__c == 'ENCERRADA' || selectedRows[i].Status__c == '') {
                
                validado = false;
            }
        }

        if(validado) {
            // Realizo a chamada do encerrarLocacoesHelper da Helper
            helper.encerrarLocacoesHelper(component, event, helper);
        } else{
            alert('Seleção inválida.');
        }        
    },

    // Função para definir a ação de quando uma linha é selecionada 
    handleSelectItem : function(component, event, helper) {
        var selectedRows = event.getParam('selectedRows');
        component.set('v.camposSelecionados', selectedRows);
    },

    // Função para definir a ação do drop down de VENDA 
    handleRowAction : function(component, event, helper) {
        // Pego a ação do meu event e atribuo para action
        var action = event.getParam('action');
        // Pego a linha do meu event e atribuo para row
        var row = event.getParam('row');
        var listaCarrosVenda = component.get('v.carrosVenda');
        var novaLista = [];        

        switch (action.name) {
            case 'removerItem':
                listaCarrosVenda.splice(row.item-1,1);
                for(var i=0; i<listaCarrosVenda.length;i++) {
                    novaLista.push({
                        item: i+1,
                        veiculo : listaCarrosVenda[i].veiculo,
                        cliente : listaCarrosVenda[i].cliente,
                        sede : listaCarrosVenda[i].sede,
                        valor_item : listaCarrosVenda[i].valor_item
                    });
                }
                component.set('v.carrosVenda',novaLista);
            break;
        }
    },

    // Função para definir a ação do drop down detalhamento
    abrirDetalhe : function(component, event, helper) {  
        // Pego a ação do meu event e atribuo para action      
        var action = event.getParam('action');
        // Pego a linha do meu event e atribuo para row
        var row = event.getParam('row');
        var listaOperacoes = component.get('v.operacoes');
        var precoTotal = 0;
        var novaLista = [];
        
        switch (action.name) {
            case 'detalhar':
                for(var i=0; i<listaOperacoes.length; i++) {
                    if(row.ChaveVenda__c == listaOperacoes[i].ChaveVenda__c) {
                        precoTotal = precoTotal+listaOperacoes[i].Valor_Total_Locacao__c;
                        novaLista.push(listaOperacoes[i]);
                    }
                }
                if(row.Operacao__c == 'VENDA') {
                    // Seto as label para minha coluna detalhe de VENDA
                    component.set('v.colunasDetalhe', [
                        {label: 'Operação', fieldName: 'Operacao__c', type: 'text'},
                        {label: 'Item', fieldName: 'Item_Venda__c', type: 'text'},
                        {label: 'Veículo', fieldName: 'Modelo_Veiculo__c', type: 'text'},
                        {label: 'Cliente', fieldName: 'Cliente_Nome__c', type: 'text'},
                        {label: 'Sede', fieldName: 'Nome_Sede__c', type: 'text'},
                        {label: 'Valor item', fieldName: 'Valor_Total_Locacao__c', type: 'text'},
                        {label: 'Data Venda', fieldName: 'CreatedDate', type: 'text'}
                    ]);
                } else {
                    // Seto as label para minha coluna detalhe de LOCAÇÃO
                    component.set('v.colunasDetalhe', [
                        {label: 'Operação', fieldName: 'Operacao__c', type: 'text'},
                        {label: 'Veículo', fieldName: 'Modelo_Veiculo__c', type: 'text'},
                        {label: 'Cliente', fieldName: 'Cliente_Nome__c', type: 'text'},
                        {label: 'Sede', fieldName: 'Nome_Sede__c', type: 'text'},
                        {label: 'Valor item', fieldName: 'Valor_Total_Locacao__c', type: 'text'},
                        {label: 'Nº Dias', fieldName: 'Quantos_dias__c', type: 'text'},
                        {label: 'Data Devolução', fieldName: 'Data_de_Devolucao__c', type: 'text'},
                        {label: 'Data', fieldName: 'CreatedDate', type: 'text'}
                    ]);
                }
                component.set('v.valorTotalLocacao', precoTotal);
                component.set('v.operacaoDetalhe',novaLista);
                component.set('v.mostrarDetalhe',true);                
            break;
        }
    }
})