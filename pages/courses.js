import React from "react";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import CircularProgress from "@material-ui/core/CircularProgress";
import useSWR from "swr";
import Header from "../src/ui/Header";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Courses() {
  const { data } = useSWR("/api/courses", fetcher);

  let courseList;
  if (!data) {
    courseList = (
      <Box display="flex" flexDirection="column" alignItems="center">
        <CircularProgress />
        <Box mt="10px">
          <Typography variant="h5"> Loading... </Typography>
        </Box>
      </Box>
    );
  } else {
    const courseItems = data.courses.map((course) => (
      <React.Fragment key={course.id}>
        <ListItem>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6">{course.name}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Box display="inline-block" width="20%">
                <Link href={`/homework/${course.id}`}>Homework</Link>
              </Box>
              <Box display="inline-block" width="20%">
                <Link href={`/discussion/${course.id}`}>Discussion</Link>
              </Box>
            </Grid>
          </Grid>
        </ListItem>
        <Divider />
      </React.Fragment>
    ));
    courseList = (
      <List>
        <Divider />
        {courseItems}
      </List>
    );
  }

  return (
    <div>
      <Header title="Course List" data={data} />
      <Container>
        <Box mx="10px" px="10px" pt="10px" mt="10px">
          <Breadcrumbs separator=">" aria-label="breadcrumb">
            <Typography> </Typography>
            <Typography color="textPrimary">Course List</Typography>
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
          {courseList}
        </Box>
      </Container>
    </div>
  );
}
