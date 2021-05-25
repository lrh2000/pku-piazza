import React from "react";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

export default function Login() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Box
        border={1}
        borderRadius="borderRadius"
        borderColor="grey.500"
        px={5}
        pt={6}
        pb={12}
        width="30rem"
      >
        <form>
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
                Login
              </Typography>
            </Grid>
            <Grid item xs={12} container spacing={2}>
              <Grid item xs={12}>
                <TextField id="username" label="Username" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField id="password" label="Password" fullWidth />
              </Grid>
            </Grid>
            <Grid item xs={12} container>
              <Grid item xs={6} container justify="flex-start">
                <Link href="/signup">Sign up</Link>
              </Grid>
              <Grid item xs={6} container justify="flex-end">
                <Button variant="contained" color="primary">
                  Login
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
}
