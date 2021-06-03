import React from "react";
import Head from "next/head";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

function Header({ title, data }) {
  const handleLogout = async (event) => {
    event.preventDefault();

    const result = await fetch("/api/users", {
      body: JSON.stringify({
        action: "logout",
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then((x) => x.json());

    if (result.ok) {
      window.location.href = "/login";
    }
  };

  let greetUser = null;
  if (data && data.user) {
    let greeting;
    const now = new Date().getHours();
    if (now < 12) {
      greeting = "Good morning";
    } else if (now < 18) {
      greeting = "Good afternoon";
    } else {
      greeting = "Good evening";
    }

    greetUser = (
      <Typography variant="h6" align="right">
        <Box display="inline-block" mr="20px">
          {greeting}, {data.user.name}.
        </Box>
        <Link href="#" onClick={handleLogout}>
          Logout
        </Link>
      </Typography>
    );
  } else if (data && !data.user) {
    window.location.href = "/login";
    greetUser = null;
  }

  return (
    <AppBar position="static" color="transparent">
      <Head>
        <title> {title} - PKU Piazza </title>
      </Head>
      <Toolbar>
        <Grid container alignItems="center">
          <Grid item xs={4}>
            <Typography variant="h3" align="left">
              PKU Piazza
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" align="center">
              {title}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            {greetUser}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.object,
};

export default Header;
