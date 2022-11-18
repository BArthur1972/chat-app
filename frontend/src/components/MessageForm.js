import React from "react";
import "./MessageForm.css";
import { useSelector } from "react-redux";
import { Button, Col, Form, Row } from "react-bootstrap";

function MessageForm() {
  function handleSubmit(e) {
    e.preventDefault();
  }
  const user = useSelector((state) => state.user);
  return (
    <>
      <div className="messages-output">
        {!user && <div className="alert alert-danger">Please login</div>}
      </div>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Your message"
                disabled={!user}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={1}>
            <Button
              variant="primary"
              type="submit"
              style={{ width: "100%", backgroundColor: "orange" }}
              disabled={!user}
            >
              <i className="fas fa-paper-plane"></i>
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default MessageForm;
