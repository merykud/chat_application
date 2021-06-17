import React from "react"
import ReactDOM from "react-dom"
import Container from "react-bootstrap/Container"


function Footer(){

    const currentYear = new Date().getFullYear();

    return(
       <footer className="my-footer">
            
            <p>
                Copyright © {currentYear}
            <br/>
                Merjem Kudeimati
            </p>

       </footer>
       
    );
}

export default Footer;