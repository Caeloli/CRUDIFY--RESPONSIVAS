import React from "react";
import { Card, CardBody, CardHeader, CardText, CardTitle, Col, Row } from "react-bootstrap";
import "./CardsHome.scss";
export function CardsHomeView({ cards }) {
  return (
    cards && (
      <Row >
        {cards.map((card, index) => {
          return (
            <Col key={index} className="mt-3"  xs={12} md={12 / cards.length}>
              <Card className="card">
                <CardBody className="card-body">
                  <CardTitle className="card-title">
                    {card.title}
                  </CardTitle>
                  <CardText className="card-text">
                    {card.content}
                  </CardText>
                  </CardBody>
              </Card>
            </Col>
          );
        })}
      </Row>
    )
  );
}
