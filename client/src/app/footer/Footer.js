import React from "react";
import { Link } from "react-router-dom";

import "./Footer.css";

export default function Footer() {
  return (
    <>
      <div className="">
        2021 ©{" "}
        <a href="https://www.linkedin.com/in/carlos-manuel-hern%C3%A1ndez-consuegra-42975a189/" rel="noreferrer" target="_blank" className="link">
          Carlos Hernández{" "}
        </a>
      </div>

      <nav className="" role="navigation">
        <ul className="list">
          <li className="footer-item">
            <Link to="/" className="link">
              Apoyo
            </Link>
          </li>
          <li className="footer-item">
            <Link to="/" className="link">
              Contáctanos
            </Link>
          </li>
          <li className="footer-item">
            <Link to="/" className="link">
              Sugerencias
            </Link>
          </li>
          <li>
            <Link to="/" className="link">
              Añadir más
            </Link>
          </li>
        </ul>
      </nav>

      <div>
        <div className="">
          <a
            href="facebook.com"
            rel="noreferrer"
            target="_blank"
            title="Facebook"
            className="socials-item"
          >
            <i className="fa fa-facebook-f facebook"></i>
          </a>
          <a
            href="twitter.com"
            rel="noreferrer"
            target="_blank"
            title="Twitter"
            className="socials-item"
          >
            <i className="fa fa-twitter twitter"></i>
          </a>
          <a
            href="instagram.com"
            rel="noreferrer"
            target="_blank"
            title="Instagram"
            className="socials-item"
          >
            <i className="fa fa-instagram instagram"></i>
          </a>
          <a
            href="youtube.com"
            rel="noreferrer"
            target="_blank"
            title="YouTube"
            className="socials-item"
          >
            <i className="fa fa-youtube youtube"></i>
          </a>
          <a
            href="telegram.org"
            target="_blank"
            title="Telegram"
            rel="noreferrer"
            className="socials-item"
          >
            <i className="fa fa-telegram telegram"></i>
          </a>
        </div>
      </div>
    </>
  );
}
