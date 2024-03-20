import React, { useState } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Segment,
  Message,
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.status === 201) {
        setMessage(data.message);
        navigate("/users/login");
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error during signup:", error.message);
      setMessage("An error occurred during signup.");
    }
  };

  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="yellow" textAlign="center">
          SIGN UP TO YOUR ACCOUNT
        </Header>
        <Form size="large" onSubmit={handleSignup}>
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="Enter Your User Name"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Create your Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Confirm Your Password"
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button color="yellow" fluid size="large" type="submit">
              Submit
            </Button>
          </Segment>
        </Form>
        {message && (
          <Message negative>
            <Message.Header>Error</Message.Header>
            <p>{message}</p>
          </Message>
        )}
      </Grid.Column>
    </Grid>
  );
};

export default SignUp;
