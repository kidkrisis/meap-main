import React from "react"
import Artist from "./Artist"
import Audience from "./Audience"
import {COLORS} from "./Colors"
import Logo from "../Assets/MEAP_Logo.png"
import contractMeta from "../Build/meap.json"
import Web3 from 'web3'
import contract from 'truffle-contract'
import {create} from 'ipfs-http-client'
import Loader from "react-loader-spinner"
import SwitchSelector from "react-switch-selector"

class Login extends React.Component {

  constructor(props){
    super(props)
      this.web3 = new Web3(Web3.givenProvider || "http://localhost:7545")
      this.contract = contract(contractMeta)
      this.contract.setProvider(this.web3.currentProvider)
      this.state = { account : "", ipfs : "", username: "", type : "", choice : "1", }
    }

  componentDidMount(){
    this.loadBlockchain().then(() => console.log("Loaded Blockchain"))
    this.loadIPFS().then(() => console.log("Loaded IPFS"))
    this.loginUser().then(() => console.log("Login Successful"))
  }

  async loadBlockchain(){
    const accounts = await this.web3.eth.getAccounts()
    this.setState({account:accounts[0]})
  }

  async loadIPFS(){
    const conn = create({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })
    this.setState({ipfs:conn})
  }

  loginUser = async () => {
      let val = "0"
      const contractInstance = await this.contract.deployed()
      await contractInstance.checkUser({from:this.state.account}).then((x)=>{ val = x.toString()})
      this.setState({type: val})
  }
y
  registerUser = async () =>{
    const contractInstance = await this.contract.deployed()
    if (this.state.choice === "1")
      await contractInstance.addNewArtist(this.state.username,{from:this.state.account}).then(() => this.loginUser())
    if (this.state.choice === "2")
      await contractInstance.addNewAudience(this.state.username,{from:this.state.account}).then(() => this.loginUser())
  }

 /*render(){
      return (
        <div style = {styles.main}>
          <img style = {styles.img} alt="logo" src = {Logo}/>
          <div style = {styles.switch}> 
            <SwitchSelector
              onChange = {(val) => {this.setState({choice: val})}} 
              options = {[
                {label: "Artist 🎙", value: "1", selectedBackgroundColor: "#c71585",},
                {label: "Audience 🎧", value: "2", selectedBackgroundColor: "#c71585"}
              ]}
              wrapperBorderRadius = {50} 
              optionBorderRadius = {50}
              fontSize = {"20"} 
              fontColor={COLORS.white}
              backgroundColor={COLORS.black} />
          </div>
          <div style={styles.username}>
            <input  type="text" placeholder ="Username"  style = {styles.textInput} 
                  value={this.state.username} required
                  onChange={(x)=>{this.setState({username:x.target.value})}} />
          </div>
          <button style = {styles.button} onClick = {this.registerUser}> Register </button>
        </div>
      );
    }*/

  render(){


    if (this.state.type === "0" ){
      return (
        <div style = {styles.main}>
          <img style = {styles.img} alt="logo" src = {Logo}/>
          <div style = {styles.switch}> 
            <SwitchSelector
              onChange = {(val) => {this.setState({choice: val})}} 
              options = {[
                {label: "Artist 🎙", value: "1", selectedBackgroundColor: "#c71585",},
                {label: "Audience 🎧", value: "2", selectedBackgroundColor: "#c71585"}
              ]}
              wrapperBorderRadius = {50} 
              optionBorderRadius = {50}
              fontSize = {"20"} 
              fontColor={COLORS.white}
              backgroundColor={COLORS.black} />
          </div>
          <div style={styles.username}>
            <input  type="text" placeholder ="Username"  style = {styles.textInput} 
                  value={this.state.username} required
                  onChange={(x)=>{this.setState({username:x.target.value})}} />
          </div>
          <button style = {styles.button} onClick = {this.registerUser}> Register </button>
        </div>
      );
    }


    else if (this.state.type === "1"){
      return (
        <Artist 
          account = {this.state.account}
          contract = {this.contract}
          ipfs = {this.state.ipfs}
        />
      )
    }

    else if (this.state.type === "2"){
      return (
        <Audience
          account = {this.state.account}
          contract = {this.contract}
          ipfs = {this.state.ipfs}
        />
      )
    }

    else {
      return (
        <div style = {styles.main}>
          <Loader type = "Bars" color = {COLORS.black}/>
        </div>
      )
    }
  }
}

const styles = {
  main : {
    height:"100vh",
    display:"flex", 
    flexDirection:"column", 
    justifyContent: "space-around", 
    alignItems: "center", 
    background:COLORS.mediumslateblue
  },
  button : { 
    height: "7.5%",
    width : "15%", 
    fontSize: "1.2rem", 
    fontWeight: "500",  
    cursor:"pointer", 
    borderRadius:"50px",
    boxShadow: "2px 5px 2px #999",
    color: COLORS.white,
    background:COLORS.black,
  },
  img : {
    width:"32.5%",
    borderRadius:"100px", 
    boxShadow: "2px 5px 2px #999",
  },
  switch: {
    height: "7.5%",
    width: "25%",  
    fontSize: "1.2rem", 
    fontWeight: "500", 
  },
  form:{
    marginBottom :"5%",
    marginTop :"5%",
    padding :"5%",
    display:"flex", 
    flexDirection:"column",
    alignItems: "center", 
    borderRadius:"10px",
    border: "2px solid",
    overflow: "auto",
    gap : "20px",
    borderColor :COLORS.black,
    backgroundColor:COLORS.brown,
  },
  username:{
    height: "6%",
    width : "15%", 
    fontSize: "1.2rem",  
  },
  textInput : {
    height: "100%",
    borderRadius:"15px",
    padding: "3%",
    textAlign: "center",
   },
}

export default Login;