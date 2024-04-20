import React from "react"
import {COLORS} from "./Colors"
import SongCard from "./SongCard"
import Loader from "react-loader-spinner"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone, faHeadphones } from '@fortawesome/free-solid-svg-icons'

class Artist extends React.Component {

    constructor(props){
      super(props);
      this.state = {name: "", artistID: "", popularity: 0, songIDs: [], songs: [], form : false}
      this.openForm = this.openForm.bind(this)
      this.closeForm = this.closeForm.bind(this)
    }
  
    componentDidMount(){
        this.loadArtistDetails().then(() =>{ console.log("Loaded Artist's Details")
            this.loadSongDetails().then(() =>{ console.log("Loaded Artist's Songs")})
        })
    }

    async loadArtistDetails(){
        const contractInstance = await this.props.contract.deployed()
        const artistDetails = await contractInstance.getArtistDetails({from:this.props.account})
        let songList = []
        for (let i = 0; i < artistDetails[2].length; i++){
            songList.push(artistDetails[2][i].toString())
        }
        this.setState({
            name:artistDetails[0].toString(),
            artistID:artistDetails[1].toString(),
            songIDs:songList
        })   
    }

    async loadSongDetails(){
        const contractInstance = await this.props.contract.deployed();
        let songInfoList = []
        for(let i = 0; i < this.state.songIDs.length; i++){
            let songDetails = await contractInstance.getSongDetails(this.state.songIDs[i], {from:this.props.account});
            songInfoList.push({
                'name': songDetails[0],
                'genre': songDetails[2],
                'hash': songDetails[3],
                'cost': songDetails[4].toString(),
                'timesPurchased': songDetails[5].toString()
            });
            this.state.popularity += parseInt(songDetails[5].toString());
        }
        console.log(songInfoList);
        this.setState({songs:songInfoList})
    }

    openForm(){
        this.setState({form : true})
    }

    closeForm(){
        this.setState({form : false})
    }

    onSubmitClick2 = async (event)=>{
        console.log("Here!")
        event.preventDefault()
        let filepath = this.state.filepath
        //let myAudioFile
        console.log(filepath)
        const AWS = require('aws-sdk');

        const s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        accessKeyId: '5ADB72F977682CD75308',
        secretAccessKey: '71LEPi6q7jpGaDahpmDtEofNE0IDbKtK8WkiCuta',
        endpoint: 'https://s3.filebase.com',
        region: 'us-east-1',
        s3ForcePathStyle: true
        });

        const params = {
        Bucket: 'meap',
        Key: '../Assets/Break.mp3',
        ContentType: 'audio/mp3',
        Body: 'myAudioFile',
        ACL: 'public-read',
        };

        const request = s3.putObject(params);
        request.send();
        //console.log("Submitted")
      } 

    render(){
        
        if (this.state.artistID === ""){
            return (
                <div style = {styles.main}>
                  <Loader type = "Bars" color = {COLORS.black}/>
                </div>
            )
        }

        else{
            return (
                <div style = {styles.main}>
                    <div style = {styles.info}>
                        <h1><FontAwesomeIcon icon={faMicrophone}/> {this.state.name}  </h1>
                        <h3> Artist ID : {this.state.artistID} </h3>
                        <h3> Popularity : {this.state.popularity} </h3>
                    </div>
                    <div style = {styles.box}>
                        {this.state.songs.map((item,i)=> (
                        <SongCard 
                            type = {"artist"}
                            name = {item.name}
                            genre = {item.genre}
                            cost = {item.cost}
                            likes = {item.timesPurchased}
                            hash = {item.hash}
                            key = {i}
                        />))}
                    </div>
                    <form>
                    <div style = {styles.form}>
                      <h3 style = {{textAlign:"center"}}> <FontAwesomeIcon icon={faHeadphones}/> Upload Song</h3>
                      <input  type="text" placeholder ="File path"  style = {styles.textInput} 
                          value={this.state.filepath} required
                          onChange={(x)=>{this.setState({filepath:x.target.value})}} />      
                      <input type="submit"  onClick={this.onSubmitClick2} style = {styles.button} value="Upload" />
                    </div>
                  </form>
                </div>
            )
        }
    }
}
  
const styles = {
    main : {
        display:"flex", 
        flexDirection:"column", 
        justifyContent: "center", 
        alignItems: "center", 
        height:"100vh",
        gap :"5%",
        background:COLORS.mediumslateblue,
        },
    info : {
        display:"flex", 
        flexDirection:"column", 
        alignItems: "center", 
        },
    box : {
        height :"50%",
        width :"60%",
        padding :"2%",
        display:"flex", 
        flexDirection:"column",
        borderRadius:"30px",
        border: "3px solid",
        overflow: "auto",
        gap :"2%",
        boxShadow: "2px 5px 2px #191919",
        borderColor :COLORS.black,
        backgroundColor:COLORS.mediumvioletred,
    },
}
  
export default Artist;