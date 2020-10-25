import React, {Component} from 'react';
import Navbar from 'react-bootstrap/navbar';
import Button from 'react-bootstrap/button';
import Form from 'react-bootstrap/form';
import {withRouter} from 'react-router-dom';

class Header extends Component{

    constructor(props){
        super(props)
        this.state = {
            email : props.email
        }

    }
    render(){
        const HistoryButton = () => {
                return(
                    <Button variant="outline-success" onClick={() =>  this.props.history.push({pathname : "/history", state : {email : this.state.email}})}>History</Button>
                );
            
        }
        return(
            <Navbar bg="light" expand="lg">
                <Navbar.Brand style={{"margin-left" : "auto", "margin-right" : "auto"}}>Mood Bot</Navbar.Brand>
                <Form inline>
                <HistoryButton/>
                </Form>
            </Navbar>
        );
    }
}export default withRouter(Header);