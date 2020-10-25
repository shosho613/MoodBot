import React, {Component} from 'react';
import Card from 'react-bootstrap/card';
import Col from 'react-bootstrap/col';
import Row from 'react-bootstrap/row';

import './Chat.css';
class HistoricalChat extends Component{


    constructor(props){
        super(props);
        console.log(props)
    }

    render(){
        const messageList = this.props.messages.map((message, index) => {
            if(index % 2 === 0){ //construct AI message
                return(
                <li style={{"display" : "inline-block"}}>
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
                <li>
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
            <Card>
            <Card.Header>{"Chat from: " + new Date (this.props.date).toLocaleDateString()}</Card.Header>
            <Card.Body style ={
                this.props.mood === "positive & aroused" ?
                {"background" : "#ffcfc4","margin" : "0", "padding": "0 10px 10px", "max-height": "300px", "overflow-x":"hidden"} :
                this.props.mood === "positive & calm" ?
                {"background" : "#fff0c4","margin" : "0", "padding": "0 10px 10px", "max-height": "300px", "overflow-x":"hidden"} :
                this.props.mood === "neutral & aroused" ?
                {"background" : "#dbffe1","margin" : "0", "padding": "0 10px 10px", "max-height": "300px", "overflow-x":"hidden"} :
                this.props.mood === "neutral & calm" ?
                {"background" : "#c4fff4","margin" : "0", "padding": "0 10px 10px", "max-height": "300px", "overflow-x":"hidden"} :
                this.props.mood === "negative & aroused" ?
                {"background" : "#c6bcd1","margin" : "0", "padding": "0 10px 10px", "max-height": "300px", "overflow-x":"hidden"} :
                this.props.mood === "negative & calm" ?
                {"background" : "#adadad","margin" : "0", "padding": "0 10px 10px", "max-height": "300px", "overflow-x":"hidden"} :
                {}
                }>
                <ul style={{"display" : "inline-block","listStyleType": "none", "padding" : "10px", "margin" : "0"}}>{messageList}</ul>
            </Card.Body>
            <Card.Footer>{"Deduced mood: " + this.props.mood}</Card.Footer>
            </Card>
        );
    }
}export default HistoricalChat;