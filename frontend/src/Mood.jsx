import React, {Component} from 'react';
import Col from 'react-bootstrap/col';
import Form from 'react-bootstrap/form';


class Mood extends Component{

    

    render(){
        var name = this.props.mood + "Answer";
        return(
            <Form.Row className="align-items-center">
                    <Col xs="auto">
                        <Form.Label>
                            {this.props.mood}
                        </Form.Label>
                    </Col>
                    <Col xs="auto">
                    <Form.Check inline label="1" type="radio" name={name} />
                    <Form.Check inline label="2" type="radio" name={name}  />
                    <Form.Check inline label="3" type="radio" name={name}  />
                    <Form.Check inline label="4" type="radio"name={name}  />
                    </Col>
                    </Form.Row>
        )
    }
}export default Mood;