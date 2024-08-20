const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

async function uploadToIPFS(file) {
    try {
        const added = await ipfs.add(file);
        console.log("File added to IPFS with hash:", added.path);
        return added.path; // Retorna o hash do IPFS
    } catch (error) {
        console.error("IPFS upload failed:", error);
        throw error;
    }
}
