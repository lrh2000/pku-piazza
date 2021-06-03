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
import Header from "../../src/ui/Header";
import useSWR from "swr";

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

function Discussion({ courseId, courseName }) {
  const { data } = useSWR(`/api/discussion/${courseId}`, fetcher);

  const STATE_CLOSED = 0;
  const STATE_PREPARED = 1;
  const STATE_SUBMITTING = 2;
  const [state, setState] = useState(false);
  const [message, setMessage] = useState("\u200b");

  const D_STATE_CLOSED = 0;
  const D_STATE_PREPARED = 1;
  const D_STATE_DELETING = 2;
  const [dState, setDState] = useState(false);
  const [currentDiscussion, setCurrentDiscussion] = useState({
    courseid: 0,
    discussionid: 0,
  });
  const prepareDelete = (discussion) => {
    if (
      discussion.discussionid !== currentDiscussion.discussionid ||
      discussion.courseid !== currentDiscussion.courseid
    ) {
      setCurrentDiscussion({
        courseid: discussion.courseid,
        discussionid: discussion.discussionid,
      });
      setMessage("");
    }
    setDState(D_STATE_PREPARED);
  };
  const performDelete = () => {
    setDState(D_STATE_DELETING);
    setMessage("Processing...");
    fetch("/api/discussion", {
      body: JSON.stringify({
        action: "deleteDiscussion",
        payload: {
          courseId: currentDiscussion.courseid,
          discussionId: currentDiscussion.discussionid,
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
      .then((x) => x.json())
      .then((res) => {
        if (res.ok) {
          window.location.reload();
        } else {
          setMessage(res.msg);
        }
        setDState(D_STATE_PREPARED);
      });
  };

  const handleDeleteClose = () => {
    if (dState === D_STATE_PREPARED) {
      setDState(D_STATE_CLOSED);
    }
  };

  const prepareSubmission = () => {
    setState(STATE_PREPARED);
  };
  const performSubmission = (event) => {
    event.preventDefault();
    setState(STATE_SUBMITTING);
    setMessage("Processing...");
    fetch("/api/discussion", {
      body: JSON.stringify({
        action: "submitDiscussion",
        payload: {
          courseId: courseId,
          theme: event.target.content.value,
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
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
  const handleSubmissionClose = () => {
    if (state === STATE_PREPARED) {
      setState(STATE_CLOSED);
    }
  };
  const mapIdentity = (identity) => {
    if (identity === 0) {
      return "Student";
    }
    if (identity === 1) {
      return "Faculty";
    }
  };
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
  } else if (data.discussion.length === 0) {
    discussionList = (
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box mt="10px">
          <Typography
            variant="h5"
            color="textSecondary"
            align="center"
            gutterBottom
          >
            {" "}
            No discussions yet.{" "}
          </Typography>
          <Typography variant="h5" color="textSecondary" align="center">
            {" "}
            But you can{" "}
            <Link
              onClick={(e) => {
                e.preventDefault();
                prepareSubmission();
              }}
              href="#"
            >
              create one
            </Link>
            .{" "}
          </Typography>
        </Box>
      </Box>
    );
  } else {
    if (data.user.identity === 1) {
      const discussionItems = data.discussion.map((discussion, i) => (
        <ListItem key={discussion.discussionid}>
          <Box width="100%">
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Discussion {i + 1}
                </Typography>
                <Typography color="textSecondary">
                  Create User: {discussion.name}
                </Typography>
                <Typography color="textSecondary">
                  ID: {discussion.userid}
                </Typography>
                <Typography color="textSecondary">
                  Identity: {mapIdentity(discussion.identity)}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Create Date: {discussion.createdate}
                </Typography>
                <Typography>{discussion.theme}</Typography>
              </CardContent>
              <CardActions>
                <Box
                  display="flex"
                  component="span"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Button size="small" color="primary">
                    <Link
                      href={`/discussion/${courseId}/${discussion.discussionid}`}
                    >
                      Enter
                    </Link>
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => prepareDelete(discussion)}
                  >
                    Delete
                  </Button>
                </Box>
              </CardActions>
            </Card>
          </Box>
        </ListItem>
      ));

      discussionList = <List>{discussionItems}</List>;
    } else {
      const discussionItems = data.discussion.map((discussion, i) => (
        <ListItem key={discussion.discussionid}>
          <Box width="100%">
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Discussion {i + 1}
                </Typography>
                <Typography color="textSecondary">
                  Create User: {discussion.name}
                </Typography>
                <Typography color="textSecondary">
                  Identity: {mapIdentity(discussion.identity)}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Create Date: {discussion.createdate}
                </Typography>
                <Typography>{discussion.theme}</Typography>
              </CardContent>
              <CardActions>
                <Box
                  display="flex"
                  component="span"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Button size="small" color="primary">
                    <Link
                      href={`/discussion/${courseId}/${discussion.discussionid}`}
                    >
                      Enter
                    </Link>
                  </Button>
                </Box>
              </CardActions>
            </Card>
          </Box>
        </ListItem>
      ));

      discussionList = <List>{discussionItems}</List>;
    }
  }

  return (
    <div>
      <Header title={`${courseName}: Discussion`} data={data} />
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
        <Box
          mx="10px"
          px="10px"
          pt="10px"
          mt="10px"
          display="flex"
          component="span"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={prepareSubmission}
          >
            Create Discussion
          </Button>
        </Box>
      </Container>
      <Dialog
        open={state > STATE_CLOSED}
        onClose={handleSubmissionClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Creating discussion</DialogTitle>
        <form onSubmit={performSubmission}>
          <DialogContent>
            <DialogContentText>
              The theme of this new dicussion is:{" "}
            </DialogContentText>
            <TextField
              variant="outlined"
              rows="10"
              placeholder="Writing your theme here..."
              name="content"
              autoFocus
              multiline
              fullWidth
              required
            ></TextField>
            <DialogContentText color="secondary">{message}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              disabled={state !== STATE_PREPARED}
              type="submit"
            >
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        open={dState > D_STATE_CLOSED}
        onClose={handleDeleteClose}
        maxWidth="lg"
      >
        <DialogTitle>Deleting this discussion?</DialogTitle>
        <DialogContent>
          <DialogContentText color="secondary">{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            disabled={dState !== D_STATE_PREPARED}
            onClick={performDelete}
          >
            Yes
          </Button>
          <Button
            color="primary"
            disabled={dState !== D_STATE_PREPARED}
            onClick={handleDeleteClose}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

Discussion.propTypes = {
  courseId: PropTypes.number.isRequired,
  courseName: PropTypes.string.isRequired,
};

export default Discussion;
