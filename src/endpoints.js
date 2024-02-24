const API_URL = "http://localhost:5213/api";

 
async function getListaGastos() {
    
    try {
        document.getElementById("loading-overlay").style.display = "block";

        let endpoint = `${API_URL}/gasto`;
        const response = await axios.get(endpoint);
        console.log(response)
        
        const listaGastos = response.data.resposta.gastos;
        console.log(listaGastos);
        const tabelaBody = document.querySelector('#tabela tbody');
        const tabelaContainer = document.querySelector('.container');

        tabelaBody.innerHTML = '';

        if(response.data.resposta.length === 0) {
            tabelaBody.innerHTML = '';

            const msg = document.createElement('h1');
            msg.classList.add('text-center', 'mt-5');
            msg.textContent = 'Nenhum despesa registrada no sistema';
            tabelaContainer.appendChild(msg);
        }
        else {
            listaGastos.forEach(gasto => {
                const tr = document.createElement('tr');
    
                tr.innerHTML = `
                <td><b>${gasto.tipo}<b></td>
                <td><b>${gasto.valor.toLocaleString('pt-BR')}<b></td>
                <td><b>${gasto.pago == true ? 'Pago' : 'Pendente'}<b></td>
                <td><b>${gasto.dataMax = gasto.pago == true ? '--------------' : gasto.dataMax}<b></td>
              `;
              tabelaBody.appendChild(tr);
            });
        }

        document.getElementById("loading-overlay").style.display = "none";
    } catch (error) {
        console.error('Erro ao obter a lista de gastos:', error);
        document.getElementById("loading-overlay").style.display = "none";
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
            redirectToLogin("login.html");
        }

    } catch(error) {
        console.log(error);
    }
} 

function redirectTo(page) {
    window.location.href = page;
}