import React, { useState } from "react";
import Head from "next/head";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

export default function Login() {
  const [state, setState] = useState({
    message: "\u200b",
    disabled: false,
  });
  const [identity, setIdentity] = useState("");

  const handleChange = (event) => {
    setIdentity(event.target.value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setState({
      message: "Processing...",
      disabled: true,
    });

    const result = await fetch("/api/users", {
      body: JSON.stringify({
        action: "signup",
        payload: {
          username: event.target.username.value,
          password: event.target.password.value,
          identity: identity,
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then((x) => x.json());

    if (result.ok) {
      window.location.href = "/courses";
    } else {
      setState({
        message: result.msg ? result.msg : "Unknown error.",
        disabled: false,
      });
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Head>
        <title> Signup - PKU Piazza </title>
      </Head>
      <Box
        border={1}
        borderRadius="borderRadius"
        borderColor="grey.500"
        px={5}
        pt={6}
        pb={12}
        width="30rem"
      >
        <form onSubmit={onSubmit}>
          <Grid
            container
            alignItems="center"
            justify="center"
            direction="row"
            spacing={3}
          >
            <Grid item xs={12}>
              <Typography variant="h6" align="center">
                PKU Piazza
              </Typography>
              <Typography variant="subtitle1" align="center">
                Sign Up
              </Typography>
            </Grid>
            <Grid item xs={12} container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  id="username"
                  label="Username"
                  fullWidth
                  type="text"
                  required
                  inputProps={{ minLength: 5, maxLength: 30 }}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="password"
                  label="Password"
                  fullWidth
                  type="password"
                  required
                  inputProps={{ minLength: 5, maxLength: 30 }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl required fullWidth>
                  <InputLabel id="identity">Identity</InputLabel>
                  <Select
                    labelId="identity"
                    id="Identity"
                    value={identity}
                    onChange={handleChange}
                    autoWidth
                  >
                    <MenuItem value={0}>Student</MenuItem>
                    <MenuItem value={1}>Faculty</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}></Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography color="secondary">{state.message}</Typography>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={6} container justify="flex-start">
                <Link href="/login">Login</Link>
              </Grid>
              <Grid item xs={6} container justify="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={state.disabled}
                >
                  signup
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
}
