import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Header from "../../../src/ui/Header";
import useSWR from "swr";

import { getCourseName } from "../../../src/db/courses";
import { getHomework } from "../../../src/db/homework";

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
  const hid = Number.parseInt(context.params.hid);
  const homework = await getHomework(id, hid);
  if (!homework) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      courseId: id,
      courseName: name,
      homeworkId: hid,
    },
  };
}

function Homework({ courseId, courseName, homeworkId }) {
  const { data } = useSWR(
    "/api/homework?action=submissionList" +
      `&cid=${courseId}` +
      `&hid=${homeworkId}`,
    fetcher
  );
  let submissionList;
  if (!data) {
    submissionList = (
      <Box display="flex" flexDirection="column" alignItems="center">
        <CircularProgress />
        <Box mt="10px">
          <Typography variant="h5"> Loading... </Typography>
        </Box>
      </Box>
    );
  } else if (
    data.submissions.length === 0 &&
    data.user &&
    data.user.identity === 1
  ) {
    submissionList = (
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box mt="10px">
          <Typography
            variant="h5"
            color="textSecondary"
            align="center"
            gutterBottom
          >
            {" "}
            No submissions yet.{" "}
          </Typography>
          <Typography variant="h5" color="textSecondary" align="center">
            <Link
              onClick={(e) => {
                e.preventDefault();
                window.history.back();
              }}
              href="#"
            >
              Go back
            </Link>{" "}
            to the previous page.{" "}
          </Typography>
        </Box>
      </Box>
    );
  } else if (data.submissions.length > 0) {
    const submissionItems = data.submissions.map((submission, i) => (
      <ListItem key={submission.userid}>
        <Box width="100%">
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Submission {i + 1}
              </Typography>
              <Typography color="textSecondary">
                Submit User: {submission.name}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                ID: {submission.userid}
              </Typography>
              <Typography>{submission.content}</Typography>
            </CardContent>
          </Card>
        </Box>
      </ListItem>
    ));
    submissionList = <List>{submissionItems}</List>;
  } else {
    submissionList = null;
    if (data.user) {
      window.location.href = "/courses";
    }
  }

  return (
    <div>
      <Header title={`${courseName}: Submissions`} data={data} />
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
                <Link color="inherit" href={`/homework/${courseId}`}>
                  Homework
                </Link>
              </Breadcrumbs>
            </Breadcrumbs>
            <Typography color="textPrimary">Submissions</Typography>
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
          {submissionList}
        </Box>
      </Container>
    </div>
  );
}

Homework.propTypes = {
  courseId: PropTypes.number.isRequired,
  courseName: PropTypes.string.isRequired,
  homeworkId: PropTypes.number.isRequired,
};

export default Homework;
