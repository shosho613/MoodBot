import React, {Component} from 'react';
import Form from 'react-bootstrap/form';
import Container from 'react-bootstrap/container';
import Mood from './Mood';
import Header from './Header';
import Card from 'react-bootstrap/card';
import Button from 'react-bootstrap/button';
import {withRouter} from 'react-router-dom';

class MoodSelection extends Component{

    constructor(props){
        super(props);
        this.getRadioVal = this.getRadioVal.bind(this)
        this.constructSelectionDict = this.constructSelectionDict.bind(this)
        this.sendSelections = this.sendSelections.bind(this)
        this.state = {
            email : this.props.location.state.email
        }


    }
    getRadioVal(elements) {
        var val;
        // get list of radio buttons with specified name        
        // loop through list of radio buttons
        for (var i=0, len=elements.length; i<len; i++) {
            if ( elements[i].checked ) { // radio checked?
                val = i+1; // if so, hold its value in val
                break; // and break out of for loop
            }
        }
        return val; // return value of checked radio or undefined if none checked*/
    }

    constructSelectionDict(moods){
        var data = new FormData();
        for(var mood in moods){
            var moodString = moods[mood] + "Answer";
            var result = this.getRadioVal(document.getElementsByName(moodString));
            if (result === undefined){
                alert("Please fill in a selection for each mood and resubmit!");
                return undefined;
            }
            data.append(moods[mood], result);            
        }
        for (var pair of data.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }
        return data;
    }

    async sendSelections(moods){
        var data = this.constructSelectionDict(moods);
        if (data === undefined){
            return;
        }
        data.append("email", this.state.email);
        let response = await fetch('http://127.0.0.1:5000/uploadMoods', {
            method: 'POST',
            body: data,
            headers:{
            "Access-Control-Allow-Origin" : "*", 
            "Access-Control-Allow-Credentials" : true,
            }
        });
        let jsonResponse = await response.json();
        console.log(jsonResponse);
        if (response.ok){
            this.props.history.push({pathname : "/chat", state : {messages : [jsonResponse.value], moods : jsonResponse.moods, email : this.state.email}});
        }
    }
    render(){
        const moods = [
            "Lively", "Happy", "Sad", "Tired", "Caring", "Content", "Gloomy", "Jittery", "Drowsy",
            "Grouchy", "Peppy", "Nervous", "Calm", "Loving", "Fed Up", "Active"];
        const MoodList = moods.map((moodString) =>
        <li style={{"display" : "table", "margin-left" : "auto", "margin-right" : "auto"}} key={moodString}><Mood mood={moodString}/></li>
        )
        return(
            <Container fluid>
                <Header email={this.state.email}/>
                <Card>
                    <Card.Header style={{"margin-left" : "auto", "margin-right" : "auto"}}>
                    Hi! Please mark the response on the scale below that indicates how well each adjective represents your mood.<br/> 1 = definitely do not feel, 2= do not feel, 3 = slightly feel, 4 = definitely feel.
                    </Card.Header>
                <Form id="form">   
                <ul style={{"listStyleType": "none", "display" : "table", "margin-left" : "auto", "margin-right" : "auto"}}>{MoodList}</ul>
                </Form>
                <Button type="submit" variant="primary" onClick={() => this.sendSelections(moods)}>Submit</Button>
                </Card>

            </Container>
        )
    }
}export default withRouter(MoodSelection);