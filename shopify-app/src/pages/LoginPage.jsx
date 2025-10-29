import React, { useState } from "react";
import {
  Page,
  Layout,
  Card,
  TextField,
  Button,
  FormLayout,
  Text,
  InlineError,
  Spinner,
} from "@shopify/polaris";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      // Example: call backend authentication API
    //   const response = await fetch("/api/login", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ email, password }),
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     console.log("Login successful:", data);
    //     // Redirect to dashboard or save token
    //     window.location.href = "/dashboard";
    //   } else {
    //     setError(data.message || "Invalid credentials.");
    //   }
        window.location.href = "/createPlugin";

    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Login" narrowWidth>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <div className="flex flex-col items-center text-center mb-4">
              <Text as="h2" variant="headingLg">
                Welcome Back 👋
              </Text>
              <Text variant="bodyMd" tone="subdued">
                Log in to your Shopify social icon manager
              </Text>
            </div>

            <FormLayout>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                autoComplete="email"
              />

              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
              />

              {error && (
                <InlineError message={error} fieldID="login-error" />
              )}

              <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <Button
                  primary
                  onClick={handleSubmit}
                  disabled={loading}
                  fullWidth
                >
                  {loading ? <Spinner size="small" /> : "Login"}
                </Button>
              </div>
              <div class="">
                <Text variant="bodyMd">
                  Don't have an account?{" "}
                  <a
                    href="/Signup"
                    style={{ color: "#5c6ac4", textDecoration: "underline" }}
                  >
                    Sign Up
                  </a>
                </Text>
              </div>
            </FormLayout>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default LoginPage;
