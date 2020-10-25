import React, {Component} from 'react';
import Card from 'react-bootstrap/card';
import Col from 'react-bootstrap/col';
import Row from 'react-bootstrap/row';
import InputGroup from 'react-bootstrap/inputgroup';
import Button from 'react-bootstrap/button';
import FormControl from 'react-bootstrap/formcontrol';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons'
import {withRouter} from 'react-router-dom';

import './Chat.css';
class Chat extends Component{

    constructor(props){
        super(props);
        this.sendMessage = this.sendMessage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.sendRecap = this.sendRecap.bind(this);
        console.log(props.location)
        this.state = {
            messages: props.location.state.messages,
            value : "" ,
            moods : props.location.state.moods,
            email : props.location.state.email,
            isFinished : "false"
        }
        console.log(this.state.messages);
    }

    async sendMessage(){
        this.state.messages.push(this.state.value)
        var form = new FormData();
        form.append("message", this.state.value)
        form.append("moods", JSON.stringify(this.state.moods))
        var isFinal = this.state.messages.length >= 4 ? true : false
        form.append("isFinal", JSON.stringify(isFinal))
        form.append("email", this.state.email)
        for (var pair of form.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }
        let response = await fetch('http://127.0.0.1:5000/sendMessage', {
            method: 'POST',
            body: form,
            headers:{
            "Access-Control-Allow-Origin" : "*", 
            "Access-Control-Allow-Credentials" : true,
            }
        });
        let jsonResponse = await response.json();
        console.log(jsonResponse.value);
        this.state.messages.push(jsonResponse.value);

        this.state.isFinished = jsonResponse.finished
        if (response.ok){
            this.props.history.push({pathname : "/chat", state : {messages : this.state.messages, moods : this.state.moods}});
        }
        if (this.state.isFinished === "true"){
            await this.sendRecap();
        }
    }

    async sendRecap(){
        var form = new FormData();
        form.append("moods", JSON.stringify(this.state.moods))
        form.append("messages", JSON.stringify(this.state.messages))
        form.append("email", this.state.email)
        form.append("date", JSON.stringify(new Date()))
        await fetch('http://127.0.0.1:5000/sendRecap', {
            method: 'POST',
            body: form,
            headers:{
            "Access-Control-Allow-Origin" : "*", 
            "Access-Control-Allow-Credentials" : true,
            }
        });

    }

    handleChange(event) {
        this.setState({value: event.target.value});
        console.log(this.state.value)
      }

    render(){
        const messageList = this.state.messages.map((message, index) => {

            if(index % 2 === 0){ //construct AI message
                return(
                <li key={index}>
                <Row className="msg_container base_receive">
                    <Col xs={10}>
                        <Card.Text className="messages">
                            {message}
                        </Card.Text>     
                    </Col>
                </Row>
                </li>
                );
            }else{ //construct user message
                return(
                <li key={index}>
                <Row className="msg_container base_sent">
                    <Col xs={10}>
                        <Card.Text className="messages">
                            {message}
                        </Card.Text>     
                    </Col>
                </Row>
                </li>
                );
            }
        }
        );
        return(
            <Card style={{"background-color": "#c6dbe4","padding" : "8%", "margin-left" : "25%"}}>
            <Card.Header>Chat Window</Card.Header>
            <Card.Body className="msg_container_base">
                <ul style={{"listStyleType": "none", "padding" : "4px", "margin" : "0"}}>{messageList}</ul>
            </Card.Body>
            <Card.Footer>
            <InputGroup className="mb-3">
                <FormControl type="text"
                name="message"
                placeholder="Type your message here"
                aria-label="Type your message here"
                aria-describedby="basic-addon2"
                value={this.state.value} onChange={this.handleChange}
                />
                <InputGroup.Append>
                <Button type="submit" onClick={() => this.sendMessage()} id="btn-chat"><FontAwesomeIcon icon={faLocationArrow}/></Button>
                </InputGroup.Append>
            </InputGroup>
            </Card.Footer>
            </Card>
        );
    }
}export default withRouter(Chat);