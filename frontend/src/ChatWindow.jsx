import React, {Component} from 'react';
import Header from './Header';
import Chat from './Chat';
import Container from 'react-bootstrap/container';
import Row from 'react-bootstrap/row';
import Col from 'react-bootstrap/col';

class ChatWindow extends Component{

    constructor(props){
        super(props);
        this.state = {
            email : props.location.state.email
        }
    }
   
    render(){
        return(
            <Container fluid>
                <Header email={this.state.email}/>
                <Row>
                    <Col xl={10}>
                        <Chat/>
                    </Col>
                </Row>
            </Container>
            

        );
    }
    
}export default ChatWindow;