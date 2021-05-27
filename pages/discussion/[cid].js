import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import useSWR from "swr";
import { List, ListItem } from "@material-ui/core";
import { getCourseName } from "../../src/db/courses.js";

const fetcher = (url) => fetch(url).then((r) => r.json());
export function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {
  const id = Number.parseInt(context.params.cid);
  const name = await getCourseName(id);
  if (!name) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      courseId: id,
      courseName: name,
    },
  };
}

function Discussion({ courseId, courseName }) {
  const { data } = useSWR(`/api/discussion/${courseId}`, fetcher);

  let discussionList;
  if (!data) {
    discussionList = (
      <Box display="flex" flexDirection="column" alignItems="center">
        <CircularProgress />
        <Box mt="10px">
          <Typography variant="h5"> Loading... </Typography>
        </Box>
      </Box>
    );
  } else {
    const discussionItems = data.map((discussion) => (
      <ListItem key={discussion.discussionid}>
        <Box width="100%">
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Discussion {discussion.discussionid}
              </Typography>
              <Typography color="textSecondary">
                Create User: {discussion.userid}
              </Typography>
              <Typography color="textSecondary">
                Create Date: {discussion.createdate}
              </Typography>
              <Typography>{discussion.theme}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">
                <Link
                  href={`/discussion/${courseId}/${discussion.discussionid}`}
                >
                  Enter
                </Link>
              </Button>
            </CardActions>
          </Card>
        </Box>
      </ListItem>
    ));

    discussionList = <List>{discussionItems}</List>;
  }

  return (
    <div>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Grid container alignItems="center">
            <Grid item xs={4}>
              <Typography variant="h3" align="left">
                PKU Piazza
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6" align="center">
                {courseName}: Discussion
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Container>
        <Box mx="10px" px="10px" pt="10px" mt="10px">
          <Breadcrumbs separator=">" aria-label="breadcrumb">
            <Typography></Typography>
            <Link color="inherit" href="/courses">
              Course List
            </Link>
            <Breadcrumbs separator=":" aria-label="breadcrumb">
              <Typography color="textPrimary">{courseName}</Typography>
              <Breadcrumbs separator="/" aria-label="breadcrumb">
                <Typography color="textPrimary">Discussion</Typography>
                <Link color="inherit" href={`/homework/${courseId}`}>
                  Homework
                </Link>
              </Breadcrumbs>
            </Breadcrumbs>
          </Breadcrumbs>
        </Box>
        <Box
          border={1}
          borderRadius="borderRadius"
          borderColor="grey.500"
          m="10px"
          p="10px"
          minHeight="500px"
        >
          {discussionList}
        </Box>
      </Container>
    </div>
  );
}

Discussion.propTypes = {
  courseId: PropTypes.number.isRequired,
  courseName: PropTypes.string.isRequired,
};

export default Discussion;
