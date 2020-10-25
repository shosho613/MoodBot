import React, {Component} from 'react';
import Header from './Header';
import SignIn from './SignIn';
import Col from 'react-bootstrap/col';
import Row from 'react-bootstrap/row';
import Container from 'react-bootstrap/container';
import Navbar from 'react-bootstrap/navbar';
import logo from './Logo.png';

class Home extends Component{

    render(){
        return(
            <Container fluid>
                <Navbar bg="light" expand="lg">
                <Navbar.Brand  style={{"margin-left" : "auto", "margin-right" : "auto"}} >Welcome to Mood Bot: An AI Chatbot that helps you keep track of your mental health!</Navbar.Brand>
            </Navbar>
                <Row>
                    <Col xl={8}>
                        <SignIn/>
                    </Col>
                </Row>
                <Row>
                    <img src={logo} style={{"width" : "23%", "margin-left" : "auto", "margin-right" : "auto"}} alt="Logo"/>
                </Row>
            </Container>
            
        );
    }
}export default Home;