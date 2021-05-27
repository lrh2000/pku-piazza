import React, { useState } from "react";
import PropTypes from "prop-types";
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
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import useSWR from "swr";
import Header from "../../src/ui/Header";

import { getCourseName } from "../../src/db/courses";

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

function Homework({ courseId, courseName }) {
  const { data } = useSWR(
    `/api/homework?action=list&cid=${encodeURIComponent(courseId)}`,
    fetcher
  );

  const STATE_CLOSED = 0;
  const STATE_LOADING = 1;
  const STATE_PREPARED = 2;
  const STATE_SUBMITTING = 3;

  const [state, setState] = useState(false);
  const [message, setMessage] = useState("\u200b");
  const [currentHomework, setCurrentHomework] = useState({
    id: 0,
    description: "",
  });
  const [submissionContent, setSubmissionContent] = useState("");

  const prepareSubmission = (homework) => {
    if (homework.homeworkid !== currentHomework.id) {
      setCurrentHomework({
        id: homework.homeworkid,
        description: homework.content,
      });
      setMessage("\u200b");
      if (homework.submitted) {
        setState(STATE_LOADING);
        fetch(
          "/api/homework?action=review" +
            `&cid=${encodeURIComponent(courseId)}` +
            `&hid=${encodeURIComponent(homework.homeworkid)}`
        )
          .then((x) => x.json())
          .then((res) => {
            setSubmissionContent(res.content);
            setState(STATE_PREPARED);
          });
      } else {
        setSubmissionContent("");
        setState(STATE_PREPARED);
      }
    } else {
      setState(STATE_PREPARED);
    }
  };

  const performSubmission = () => {
    setState(STATE_SUBMITTING);
    setMessage("Processing...");
    fetch(
      "/api/homework?action=submit" +
        `&cid=${encodeURIComponent(courseId)}` +
        `&hid=${encodeURIComponent(currentHomework.id)}`,
      {
        body: submissionContent,
        method: "POST",
      }
    )
      .then((x) => x.json())
      .then((res) => {
        if (res.ok) {
          window.location.reload();
        } else {
          setMessage(res.msg);
        }
        setState(STATE_PREPARED);
      });
  };

  const handleClose = () => {
    if (state === STATE_PREPARED) {
      setState(STATE_CLOSED);
    }
  };

  let homeworkList;
  if (!data) {
    homeworkList = (
      <Box display="flex" flexDirection="column" alignItems="center">
        <CircularProgress />
        <Box mt="10px">
          <Typography variant="h5"> Loading... </Typography>
        </Box>
      </Box>
    );
  } else {
    const homeworkItems = data.homework.map((homework) => (
      <ListItem key={homework.homeworkid}>
        <Box width="100%">
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Homework {homework.homeworkid}
              </Typography>
              <Typography color="textSecondary">
                Assign Date: {homework.assign}
              </Typography>
              <Typography color="textSecondary">
                Due Date: {homework.due}
              </Typography>
              <Typography>{homework.content}</Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                onClick={() => prepareSubmission(homework)}
              >
                {homework.submitted ? "Edit Submission" : "New Submission"}
              </Button>
            </CardActions>
          </Card>
        </Box>
      </ListItem>
    ));

    homeworkList = <List>{homeworkItems}</List>;
  }

  let dialogContent;
  if (state === STATE_LOADING) {
    dialogContent = (
      <Box display="flex" flexDirection="column" alignItems="center">
        <CircularProgress />
        <Box mt="10px">
          <Typography variant="h5"> Loading... </Typography>
        </Box>
      </Box>
    );
  } else {
    dialogContent = (
      <React.Fragment>
        <DialogContentText>{currentHomework.description}</DialogContentText>
        <TextField
          variant="outlined"
          rows="10"
          placeholder="Writing your submission here..."
          value={submissionContent}
          onChange={(e) => setSubmissionContent(e.target.value)}
          autoFocus
          multiline
          fullWidth
        ></TextField>
        <DialogContentText color="secondary">{message}</DialogContentText>
      </React.Fragment>
    );
  }

  return (
    <div>
      <Header title={`${courseName}: Homework`} data={data} />
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
                <Link color="inherit" href={`/discussion/${courseId}`}>
                  Discussion
                </Link>
                <Typography color="textPrimary">Homework</Typography>
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
          {homeworkList}
        </Box>
      </Container>
      <Dialog
        open={state > STATE_CLOSED}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Submitting homework {currentHomework.id}</DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions>
          <Button
            color="primary"
            disabled={state !== STATE_PREPARED}
            onClick={performSubmission}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

Homework.propTypes = {
  courseId: PropTypes.number.isRequired,
  courseName: PropTypes.string.isRequired,
};

export default Homework;
