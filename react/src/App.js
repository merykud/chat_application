import React from 'react';
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Jumbotron from "react-bootstrap/Jumbotron"
import Button from "react-bootstrap/Button"
import Navbar from "react-bootstrap/Navbar"
import { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Header from "./Header"
import Footer from "./Footer"
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';

class App extends Component {

  state = {
    isLoggedIn: false,
    name: '',
    messages: [],
    room: "public",
    value: '',
  }

  client = new W3CWebSocket('ws://localhost:8000/ws/chat/' + this.state.room + '/');

  onButtonClicked = (e) => {
    this.client.send(JSON.stringify({
      type: "message",
      message: this.state.value,
      name: this.state.name,
      room: this.state.room
    }));
    this.state.value = ''
    e.preventDefault();
  }

  onEnterButtonClicked =() => {
    var Sentencer = require('sentencer');
    var randAdjective = Sentencer.make("{{adjective}}");
    var randNoun = Sentencer.make("{{noun}}");
    var userName = randAdjective + "_" + randNoun;
    this.setState({
      isLoggedIn: true,
      name: userName
    })

    
  }

  componentDidMount() {
    this.client.onopen = () => {
      // console.log('WS Client Connected');
      // this.client.send(JSON.stringify({'command':'fetch_messages'}))
    };
    this.client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      // console.log('reply ', dataFromServer.type);
      if (dataFromServer) {
        this.setState((state) =>
        ({
          messages: [...state.messages,
          {
            msg: dataFromServer.message,
            name: dataFromServer.name,
          }]
        })
        );
      }
    };
  }

  render() {

    return (
      <Container fluid className="main-container">
        {this.state.isLoggedIn ?

          <div>

            <Row>
              <Col className="col-6">
                <Navbar.Brand id="logo">Chat App</Navbar.Brand>
              </Col>
              <Col className="exit-button-col">

                <Button onClick={value =>
                  this.setState({ isLoggedIn: false, username: '' })
                }

                  id="exit-button" variant="primary">Exit</Button>

              </Col>
            </Row>
            <Row>
              <Col className="col-sm-12 message-row">
                <h2>Hello, {this.state.name} 👋🏼</h2>
              </Col>
            </Row>

            <Row className="message-rows">
              <Col>

                <Paper id="my-paper">
                  {this.state.messages.map(message => <>
                    <Card>
                      <CardHeader
                        avatar={
                          <Avatar>
                            👤
                          </Avatar>
                        }
                        title={message.name}
                        subheader={message.msg}
                      />
                    </Card>
                  </>)}
                </Paper>
              </Col>
            </Row>

            <form id="my-form" noValidate onSubmit={this.onButtonClicked}>

              <Row className="justify-content-space-between">
                <Col sm={10}>
                  <TextField
                    id="my-text-field"
                    label="Type your message here..."
                    defaultValue="Default Value"
                    // variant="outlined"
                    placeholder="Type your message here..."
                    value={this.state.value}
                    fullWidth
                    onChange={e => {
                      this.setState({ value: e.target.value });
                      this.value = this.state.value;
                    }}
                  />
                </Col>

                <Col sm={2}>
                  <Button
                    type="submit"
                    id="send-button"
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    Send Message
                  </Button>
                </Col>
              </Row>
            </form>

            <Footer />
          </div>
          :

          <div>
            <Header />
            <Row className="justify-content-center">
              <Col className="col-sm-8">
                <Jumbotron fluid id="jumbotron">
                  <Container >
                    <h1>Welcome 💬</h1>
                    <p>Connect with people worldwide.</p>

                    {/* <Button onClick={() => {
                      var Sentencer = require('sentencer');
                      var randAdjective = Sentencer.make("{{adjective}}");
                      var randNoun = Sentencer.make("{{noun}}");
                      var userName = randAdjective + "_" + randNoun;
                      this.setState({
                        isLoggedIn: true,
                        name: userName
                      })

                    }} */}
                    <Button onClick={this.onEnterButtonClicked}

                      id="enter-button" variant="primary"> Enter a chat room</Button>

                  </Container>
                </Jumbotron>
              </Col>
            </Row>
            <Footer />

          </div>
        }
      </Container>
    )

  }
}
export default (App)