import React, {Component} from 'react'
import Container from 'react-bootstrap/container';
import Row from 'react-bootstrap/container';
import Col from 'react-bootstrap/container';
import Header from './Header';
import HistoricalChat from './HistoricalChat'
class History extends Component{

    constructor(props){
        super(props)
        this.state = {
            email : props.location.state.email,
            content : []
        }
        console.log(this.state.email)
    }

    async componentDidMount(){
        var data = new FormData();
        data.append("email", this.state.email.toString())
        var response = await fetch('http://127.0.0.1:5000/getHistory', {
            method: 'POST',
            body : data,
            headers:{
            "Access-Control-Allow-Origin" : "*", 
            "Access-Control-Allow-Credentials" : true,
            }
        });
        var jsonResponse = await response.json();
        console.log(jsonResponse)
        this.setState({content : jsonResponse.content})

    }
    render(){
        const ChatList = this.state.content.map((entry,index) => (
            <li key={index} style={{"display": "inline-block", "width": "50%"}}><HistoricalChat messages={entry[2]} mood={entry[0]} date={entry[1]}/></li>
        ));
        return(
            <Container fluid>
                <Header/>
                <Row>
                <ul style={{"listStyleType": "none", "padding" : "0", "margin" : "0", "display" : "inline"}}>{ChatList}</ul>
                </Row>
            </Container>
            
        )
    }
}export default History;