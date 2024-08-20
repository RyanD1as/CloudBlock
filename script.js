let web3;
let contract;
const contractAddress = 'YOUR_CONTRACT_ADDRESS_HERE'; // Substitua pelo endereço do seu contrato
const contractABI = [ /* COLE SEU ABI AQUI */ ]; // Cole o ABI do seu contrato aqui

//Verifica se usuário está conectado a MetaMask
window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.enable();
            contract = new web3.eth.Contract(contractABI, contractAddress);
        } catch (error) {
            console.log("Conta sem acesso", error);
        }
    } else {
        alert("Conecte com MetaMask!");
    }
});

async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Escolha um arquivo para realizar o upload!');
        return;
    }
    
    const ipfsHash = await uploadToIPFS(file);
    const accounts = await web3.eth.getAccounts();

    try {
        await contract.methods.add(accounts[0], ipfsHash).send({ from: accounts[0] });
        alert('Upload do arquivo realizado com sucesso!');
    } catch (error) {
        console.error("Falha ao realizar o upload:", error);
    }
}

async function displayFiles() {
    const accounts = await web3.eth.getAccounts();
    try {
        const files = await contract.methods.display(accounts[0]).call();
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = ''; // Clear the list
        files.forEach(file => {
            const li = document.createElement('li');
            li.textContent = file;
            fileList.appendChild(li);
        });
    } catch (error) {
        console.error("Falha ao acarregar arquivos:", error);
    }
}

async function shareAccess() {
    const shareAddress = document.getElementById('shareAddress').value;
    const accounts = await web3.eth.getAccounts();

    try {
        await contract.methods.allow(shareAddress).send({ from: accounts[0] });
        alert('Acesso compartilhado');
    } catch (error) {
        console.error("Falha ao compartilhar acesso:", error);
    }
}

async function displayAccessList() {
    const accounts = await web3.eth.getAccounts();
    try {
        const accessList = await contract.methods.shareAcess().call({ from: accounts[0] });
        const accessListElement = document.getElementById('accessList');
        accessListElement.innerHTML = ''; // Clear the list
        accessList.forEach(access => {
            const li = document.createElement('li');
            li.textContent = `User: ${access.user} - Access: ${access.acess}`;
            accessListElement.appendChild(li);
        });
    } catch (error) {
        console.error("Falha ao carregar lista de acesso:", error);
    }
}
