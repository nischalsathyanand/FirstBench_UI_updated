import React from "react";
import { useState } from "react";
import Order from "./Order";
import Position from "./Position";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "/images/fb2.png";
import { useLocation } from "react-router-dom";

import {
  Container,
  Divider,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment,
  Step,
  StepTitle,
  StepGroup,
  StepDescription,
  StepContent,
  Icon,
  Button,
} from "semantic-ui-react";

function Home() {
  const location = useLocation();
  const { userId } = location.state || {};
  const [activeStep, setActiveStep] = useState(0);

  const handleStepClick = (index) => {
    setActiveStep(index);
  };
  const navigate = useNavigate();
  const handleSignOut = () => {
    console.log("working");
    navigate("/login");
  };
  const menuStyle = {
    backgroundColor: "#303846",
  };

  return (
    <div>
      <Menu fixed="top" style={menuStyle} inverted>
        <Container>
          <Menu.Item as="a">
            <Header
              as="h4"
              style={{
                marginRight: "2.0em",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)", // Adding drop shadow
                fontFamily: "Arial, sans-serif", // Setting font family
                fontWeight: "bold", // Making text bold
                color: "#ffffff", // Setting text color
                marginTop: "5px", // Adjusting margin top for better alignment
              }}
            >
              <Image
                src={logoImage}
                size="mini"
                alt="Logo"
                style={{ marginRight: "2.0em" }}
              />
              First Bench
            </Header>
          </Menu.Item>

          <Menu.Item as="b" position="right">
            <Icon name="user" />
            {userId}
          </Menu.Item>
          <Menu.Item as="c">
            <Icon name="sign-out" />
            <Link to="/users/signout" onClick={handleSignOut}>
              Signout
            </Link>
          </Menu.Item>
        </Container>
      </Menu>

      <Container style={{ maxWidth: "100%", marginTop: "6em" }}>
        <StepGroup size="mini">
          <Step
            active={activeStep === 0}
            onClick={() => handleStepClick(0)}
            style={{
              backgroundColor: activeStep === 0 ? "#FFC107" : "white",
            }}
          >
            <Icon name="home" />
            <StepContent>
              <StepTitle>Home</StepTitle>
              <StepDescription>List the Product</StepDescription>
            </StepContent>
          </Step>

          <Step
            active={activeStep === 1}
            onClick={() => handleStepClick(1)}
            style={{
              backgroundColor: activeStep === 1 ? "#FFC107" : "white",
            }}
          >
            <Icon name="add circle" />
            <StepContent>
              <StepTitle>Add</StepTitle>
              <StepDescription>Add Your items</StepDescription>
            </StepContent>
          </Step>
        </StepGroup>
        {activeStep === 0 && (
          <Segment>
            <Order />
          </Segment>
        )}
        {activeStep === 1 && (
          <Segment>
            <Position handleStepClick={handleStepClick} />
          </Segment>
        )}
      </Container>
    </div>
  );
}

export default Home;
