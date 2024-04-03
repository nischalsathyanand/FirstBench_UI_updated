import React from "react";
import { useState } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
  MessageHeader,
} from "semantic-ui-react";
import { Navigate } from "react-router-dom";

const LoginForm = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, password, uId: userId }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Login failed:", errorResponse.message);
        throw new Error("Login failed");
      }

      // Handle successful login, e.g., redirect to dashboard

      const result = await response.json();

      setAuthenticated(true);
    } catch (error) {
      console.error("Error:", error.message);
      // Handle login error, e.g., display error message to user
      setAuthenticated(false);
      setShowErrorMessage(true);
    }
  };
  if (authenticated) {
    return <Navigate to="/home" state={{ userId }} />;
  }
  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="yellow" textAlign="center">
          Login
        </Header>
        <Form size="large" onSubmit={handleLogin}>
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="USER ID"
              type="text"
              id="userid"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="PASSWORD"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button color="yellow" fluid size="large" type="submit">
              Login
            </Button>
          </Segment>
        </Form>
        <Message>
          New User? <a href="/users/signup">Sign Up</a>
        </Message>
        {showErrorMessage && (
          <Message negative>
            <MessageHeader>Invalid login</MessageHeader>
            <p>We are sorry your credentials are incorrect</p>
          </Message>
        )}
      </Grid.Column>
    </Grid>
  );
};

export default LoginForm;
