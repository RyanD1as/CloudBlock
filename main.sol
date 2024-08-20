pragma solidity ^0.8; // SPDX-License-Identifier: MIT

contract Upload{
    struct acesso{
        address user;
        bool acess;
    }

    mapping(address=>string[]) value;                           //mapping para valores

    mapping(address=>mapping(address=>bool)) ownership;         /*este mapeamento aninhado rastreia quais usuarios tem permissao
                                                                 para acessar os arquivos de outro usuario.
                                                                 O primeiro endereco eh o proprietario dos arquivos, 
                                                                 e o segundo endereco eh o usuario que tem (ou nao) acesso.*/

    mapping(address=>acesso[]) acessList;                       /*este mapeamento associa um endereco de usuario a uma lista de objetos Access,
                                                                 rastreando quem tem acesso aos arquivos desse usuario.*/

    mapping(address=>mapping(address=>bool)) previousData;      /*este mapeamento aninhado rastreia se houve um historico de acesso entre
                                                                 dois usuarios. O primeiro endereco eh o proprietario dos arquivos, e o segundo endereco
                                                                 e  h o usuario que teve (ou nao) acesso anteriormente*/

    //esta funcao permite adicionar uma URL de arquivo a lista de arquivos de um usuario especifico.
    function add(address _user, string memory url) external{   
        value[_user].push(url);
    }

    //esta funcao concede permissao a um usuario para acessar os arquivos do remetente da mensagem (msg.sender).
    function allow(address _user) external{                     
        ownership[msg.sender][_user]=true;                  //concede acesso ao usuario.
        if(previousData[msg.sender][_user]){
            for(uint i = 0; i < acessList[msg.sender].length; i++){
                if(acessList[msg.sender][i].user == _user){
                    acessList[msg.sender][i].acess=true;
                }
            }
        }else{
            acessList[msg.sender].push(acesso(_user,true));
            previousData[msg.sender][_user]=true;
        }
    }// Verifica se ja houve um historico de acesso para esse usuario e atualiza o acesso na lista de accessList.

    //funcao para negar o acesso de um usuario aos arquivos
    function disallow(address _user) public{
        ownership[msg.sender][_user] = false;
        for(uint i = 0; i < acessList[msg.sender].length; i++){
            if(acessList[msg.sender][i].user == _user){
                acessList[msg.sender][i].acess = false;
            }
        }
    }

    //esta funcao retorna a lista de URLs de arquivos de um usuario especificado.
    function display(address _user) external view returns(string[] memory){
        require(_user == msg.sender || ownership[_user][msg.sender],"Voce nao tem acesso");
        return value[_user];
    }

    //essa funcao retorna a lista de acessos do remetente da mensagem
    function shareAcess() public view returns(acesso[] memory){
        return acessList[msg.sender];   
    }
}