const API_URL = "http://localhost:5213/api";

 
async function getListaGastos() {
    
    try {
        document.getElementById("loading-overlay").style.display = "block";

        let endpoint = `${API_URL}/gasto`;
        const response = await axios.get(endpoint);
        console.log(response)
        
        const total = response.data.resposta.total;
        const gastoMax = response.data.resposta.gastoMax;
        const listaGastos = response.data.resposta.gastos;
        console.log(listaGastos);
        const tabelaBody = document.querySelector('#tabela tbody');
        const tabelaContainer = document.querySelector('.container');

        tabelaBody.innerHTML = '';

        if(listaGastos === null) {
            tabelaBody.innerHTML = '';

            const msg = document.createElement('h1');
            msg.classList.add('text-center', 'mt-5');
            msg.textContent = 'Nenhum despesa registrada no sistema';
            tabelaContainer.appendChild(msg);
            
            var totalPagar = document.getElementById('total-pagar');
            totalPagar.innerText = `${total.toFixed(2).replace(".", ",")} R$`;

            var maximoGasto = document.getElementById('max-gastar');
            maximoGasto.innerText = `${gastoMax.toFixed(2).replace(".", ",")} R$`;
        }
        else {
            listaGastos.forEach(gasto => {
                const tr = document.createElement('tr');
    
                tr.innerHTML = `
                <td><b>${gasto.tipo}<b></td>
                <td><b>${gasto.valor.toFixed(2).replace(".", ",")}<b></td>
                <td><b>${gasto.pago == true ? 'Pago' : 'Pendente'}<b></td>
                <td><b>${gasto.dataMax = gasto.pago == true ? '--------------' : gasto.dataMax}<b></td>
                <td>
                    <button class="btn btn-primary btn-sm mr-2" data-toggle="modal" data-target="#exampleModal" style="background-color: #28a745; border-color: #28a745;" onclick="fillFieldsUpdate('${gasto.tipo}', ${gasto.valor}, ${gasto.pago}, '${gasto.dataMax}')"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm" data-toggle="modal" data-target="#confirmDeleteModal" onclick="fillFieldsDelete('${gasto.tipo}')"><i class="fas fa-trash-alt"></i></button>
                </td>
              `;
              tabelaBody.appendChild(tr);
            });

            var totalPagar = document.getElementById('total-pagar');
            totalPagar.innerText = `${total.toFixed(2).replace(".", ",")} R$`;

            var maximoGasto = document.getElementById('max-gastar');
            maximoGasto.innerText = `${gastoMax.toFixed(2).replace(".", ",")} R$`;
        }

        document.getElementById("loading-overlay").style.display = "none";
    } catch (error) {
        console.error('Erro ao obter a lista de gastos:', error);
        document.getElementById("loading-overlay").style.display = "none";
    }
}

function fillFieldsUpdate(descricao, valor, situacao, dataMax) {

    situacao = situacao == true ? 'Pago' : 'Pendente';

    if(dataMax == '--------------' || dataMax == null) {
        document.getElementById('textInput').value = descricao;
        document.getElementById('numberInput').value = valor;
        document.getElementById('selectInput').value = situacao;
        document.getElementById('dateInput').value = null;
    } else {
        var partes = dataMax.split('/');
        var dataFormatada = partes[2] + '-' + partes[1] + '-' + partes[0];
        dataMax = new Date(dataFormatada).toISOString().substring(0, 10);

        document.getElementById('textInput').value = descricao;
        document.getElementById('numberInput').value = valor;
        document.getElementById('selectInput').value = situacao;
        document.getElementById('dateInput').value = dataMax;
    }

}

function fillFieldsDelete(descricao) {

    document.getElementById('confirmDeleteModalLabel').textContent = `EXCLUIR ${descricao}`;
}

async function updateGasto() {

    try {
        document.getElementById('loading-overlay').style.display = 'block';

        var situacao = document.getElementById('selectInput').value;
        situacao = situacao == 'Pago' ? true : false;

        var data = document.getElementById('dateInput').value;
        var dataFormat = new Date(data);
        
        var updateGastoDto = {
            tipo: document.getElementById('textInput').value,
            valor: document.getElementById('numberInput').value,
            pago: situacao,
            dataMax: dataFormat
        };

        const endpoint = `${API_URL}/gasto`;
        await axios.put(endpoint, updateGastoDto);

    } catch(error) {
        console.log(error);

    } finally {
        document.getElementById('loading-overlay').style.display = 'none';
        redirectTo('lista-gastos.html');
    }

    
}

async function signIn() {
    
    try {

        document.getElementById("loading-overlay").style.display = "block";
        document.getElementById('error-message').style.display = 'none';

        var usuarioObjeto = {
            usuario: document.getElementById("username").value,
            senha: document.getElementById("password").value
        };

        console.log(usuarioObjeto);

        let endpoint = `${API_URL}/login/sign-in`;
        const response = await axios.post(endpoint, usuarioObjeto)

        .catch(function (error) { 
            if(error.response.status == 404) {
                document.getElementById('error-message').style.display = 'block';
            }
        });

        const sucesso = response.data.resposta;

        if(sucesso === true) {
            redirectTo("lista-gastos.html");
        }

    } catch(error) {
        console.log("erro");

    } finally {
        document.getElementById("loading-overlay").style.display = "none";
    }
}

async function signOff() {

    try {

        var endpoint = `${API_URL}/login/sign-off`;
        const response = await axios.post(endpoint, null);

        const sucesso = response.data.response;

        if(sucesso === true) {
            redirectTo("login.html");
        }

    } catch(error) {
        console.log(error);
    }
} 

async function signUp () {

    document.getElementById('error-message-exists').style.display = 'none';
    document.getElementById('error-message-password').style.display = 'none';
    document.getElementById('loading-overlay').style.display = 'block';

    var newUsuarioObjeto = {
        usuario: document.getElementById("username").value,
        senha: document.getElementById("password").value,
        confirmaSenha: document.getElementById("confirmPassword").value
    };

    var endpoint = `${API_URL}/login/sign-up`;
    const response = await axios.post(endpoint, newUsuarioObjeto)

    .catch(function (error) {
        const badRequest = 400;
        const conflict = 409
        
        if(error.response.status == badRequest) {
            document.getElementById('error-message-password').style.display = 'block';
            document.getElementById('loading-overlay').style.display = 'none';
        }

        if(error.response.status == conflict) {
            document.getElementById('error-message-exists').style.display = 'block';
            document.getElementById('loading-overlay').style.display = 'none';
        }
    });

    const sucesso = response.data.sucesso;

    if(sucesso === true) {
        var loginObjeto = {
            usuario: newUsuarioObjeto.usuario,
            senha: newUsuarioObjeto.senha
        };

        let endpoint = `${API_URL}/login/sign-in`;
        await axios.post(endpoint, loginObjeto);

        redirectTo("update-salario.html");
    }

    document.getElementById('loading-overlay').style.display = 'none';
}

async function updateSalario() {
    document.getElementById('loading-overlay').style.display = 'block';
    document.getElementById('update-successful').style.display = 'none';

    var salario = document.getElementById('salary').value;
    salario = parseFloat(salario.replace(",", "."));

    var endpoint = `${API_URL}/gasto/salario/${salario}`;
    const response = await axios.put(endpoint, null);

    if(response.data.sucesso === true) {
        document.getElementById('loading-overlay').style.display = 'none';

        document.getElementById('update-successful').style.display = 'block';
        setTimeout(function() {
            document.getElementById('update-successful').style.display = 'none';
            redirectTo('lista-gastos.html');
        }, 1200);
    } 
}

async function deleteGasto() {

    try {
        
        document.getElementById("loading-overlay").style.display = "block";

        var tituloModal = document.getElementById('confirmDeleteModalLabel').textContent;
        var tipo = tituloModal.replace('EXCLUIR ', '');

        var endpoint = `${API_URL}/gasto/${tipo}`;
        const response = await axios.delete(endpoint);

        if(response.data.sucesso === true) {
            redirectTo("lista-gastos.html");
        }
    } catch (error) {
        console.log(error);
    } finally {
        document.getElementById("loading-overlay").style.display = "none";
    }
} 

function redirectTo(page) {
    window.location.href = page;
}

function goBack() {
    window.history.back();
}