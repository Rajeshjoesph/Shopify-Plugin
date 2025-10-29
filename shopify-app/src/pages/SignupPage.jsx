import React, { useState } from "react";
import {
  Page,
  Layout,
  Card,
  FormLayout,
  TextField,
  Button,
  Text,
  InlineError,
  Spinner,
  Select,
} from "@shopify/polaris";

const SignupPage = () => {
  const [form, setForm] = useState({
    emailId: "",
    password: "",
    shopify_domain: "",
    plan: "Free",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!form.shopify_domain || !form.password) {
      setError("Shopify domain and access token are required.");
      return;
    }

    setLoading(true);
    try {
        console.log("form",form);
        
    //   const res = await fetch("http://localhost:5000/api/shops/signup", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(form),
    //   });

    //   const data = await res.json();
    //   if (res.ok) {
    //     setSuccess(data.message);
    //     setForm({ shopify_domain: "", access_token: "", plan: "Free" });
    //   } else {
    //     setError(data.message);
    //   }
    } catch (err) {
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Shopify App Signup" narrowWidth>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <div className="flex flex-col items-center text-center mb-4">
              <Text as="h2" variant="headingLg">
                Register Your Shopify Store 🏪
              </Text>
              <Text variant="bodyMd" tone="subdued">
                Create a new merchant account for your social icon manager
              </Text>
            </div>

            <FormLayout>
                <TextField
                label="Enter Email"
                value={form.emailId}
                onChange={(value) => handleChange("emailId", value)}
                placeholder="e.g., user@example.com"
              />
              <TextField
                label="Shopify Domain"
                value={form.shopify_domain}
                onChange={(value) => handleChange("shopify_domain", value)}
                placeholder="e.g., mystore.myshopify.com"
              />

              <TextField
                label="Password"
                value={form.password}
                onChange={(value) => handleChange("password", value)}
                type="password"
              />

              <Select
                label="Plan"
                options={[
                  { label: "Free", value: "Free" },
                  { label: "Pro", value: "Pro" },
                ]}
                onChange={(value) => handleChange("plan", value)}
                value={form.plan}
              />

              {error && <InlineError message={error} />}
              {success && (
                <Text tone="success" variant="bodyMd">
                  {success}
                </Text>
              )}

              <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <Button
                  primary
                  onClick={handleSubmit}
                  disabled={loading}
                  fullWidth
                >
                  {loading ? <Spinner size="small" /> : "Sign Up"}
                </Button>
              </div>
            </FormLayout>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default SignupPage;
