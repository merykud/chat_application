import React from "react"

import Navbar from "react-bootstrap/Navbar"

import Col from "react-bootstrap/esm/Col"
import Row from "react-bootstrap/Row"


function Header(){
    return(

        <Row>
            <Col>
                <Navbar expand="lg" id="my-navbar">
               
                    <Navbar.Brand id="logo">Chat App</Navbar.Brand>
               
                </Navbar>
            </Col>
        </Row>
            
         
    );
}

export default Header;