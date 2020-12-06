import { transferPromiseness } from 'chai-as-promised';
import React, { Component } from 'react'; 
import Web3 from 'web3';
import Dai from '../abis/Dai.json'
import logo from '../logo.png';
import './App.css';


class App extends Component {
  async componentWillMount(){
    await this.loadWeb3();
    await this.loadBlockchain();
  }
  async loadWeb3(){
    if(window.ethereum){
      window.web3=new Web3(window.ethereum)
      await window.ethereum.enable()
    }else if(window.web3){
      window.web3=new Web3(window.web3.currentProvider)
    }else{
      window.alert('Non-ethereum based broswer detected. You should consider downloading Metamask')
    }
  }
  async loadBlockchain(){
    const web3 = window.web3 
    const accounts = await web3.eth.getAccounts();
    this.setState({account: accounts[0]});
    const networkId = await web3.eth.net.getId();
    const daiData = Dai.networks[networkId];
    const dai = new web3.eth.Contract(Dai.abi, daiData.address);
    this.setState({ dai: dai });
    const balance = await dai.methods.balanceOf(this.state.account).call();
    this.setState({balance: web3.utils.fromWei(balance.toString())});
    const transactions = await dai.getPastEvents('Transfer', {fromBlock:0, toBlock:'latest', filter:{from:this.state.account}});
    this.setState({transactions: transactions});
    console.log(transactions);
    console.log(this.state.account);
    console.log(this.state.dai);
    console.log(this.state.balance);
  }
  transfer(recipient,amount){
    this.state.dai.methods.transfer(recipient,amount).send({from: this.state.account});
  }
  constructor(props){
    super(props)
    this.state={
      account:'',
      dai: null,
      balance:'',
      transactions:[]
    }
    this.transfer=this.transfer.bind(this);
  }
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Energy 🔋 Wallet
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto" style={{width:"450px"}}>
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} width="75" />
                </a>
                  <h1>DAI Balance:  {this.state.balance}</h1>
                <form onSubmit={(event)=>{
                      event.preventDefault();
                      const recipient = this.recipient.value;
                      const amount = window.web3.utils.toWei(this.amount.value, 'Ether');
                      this.transfer(recipient,amount);
                      console.log(recipient, amount);
                }}>
                  <div className="form-group mr-sm-2">
                    <input id="recipient" type="text" ref={(input)=>{this.recipient=input}}
                    className="form-control" placeholder="Recipient Address" required />
                  </div>
                  <div className="form-group mr-sm-2">
                    <input id="amount" type="text" ref={(input)=>{this.amount=input}}
                    className="form-control" placeholder="Amount" required />
                  </div>
                <button type="submit" className="btn btn-primary btn-block">Send</button>
                </form>
                <table className="table" style={{width:"450px"}}>
                  <thead>
                    <tr>
                      <th>Recipient:</th>
                      <th>Amount:</th>
                    </tr>
                  </thead>
                  {this.state.transactions.map((tx,index)=>{
                    return(
                      <tr key={index}>
                        <td>{tx.returnValues.to}</td>
                        <td>{window.web3.utils.fromWei(tx.returnValues.value.toString())}</td>
                      </tr>
                    )
                  })}

                </table>
              
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
