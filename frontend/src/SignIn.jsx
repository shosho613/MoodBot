import React, {Component} from 'react';
import Form from 'react-bootstrap/form';
import Button from 'react-bootstrap/Button';
import { withRouter} from "react-router-dom";


class SignIn extends Component{

    constructor(props){
        super(props);
        this.state = {
            email : ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);



    }
    
    handleChange(event) {
        this.setState({email: event.target.value});
        console.log(this.state.email)
    }

    handleClick() {
        console.log(this.state.email)
        this.props.history.push({pathname: '/mood', state : {email : this.state.email}});
    }

    render(){
        return(
            <Form style={{"text-align" : "center","padding" : "5%", "margin-left" : "50%"}}>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control value={this.state.email} onChange={this.handleChange} type="text" placeholder="Enter email" />
                <Form.Text className="text-muted">
                We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={this.handleClick}>
                Submit
            </Button>
            </Form>
        )
    }
}export default withRouter(SignIn);
