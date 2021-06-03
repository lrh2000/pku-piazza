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
import Header from "../../../src/ui/Header";
import useSWR from "swr";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";

import { getCourseName } from "../../../src/db/courses";
import { getDiscussionByDID } from "../../../src/db/discussion";

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
  const did = Number.parseInt(context.params.did);
  const discussion = await getDiscussionByDID(did);
  if (!discussion) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      courseId: id,
      courseName: name,
      discussionId: did,
    },
  };
}

function Discussion({ courseId, courseName, discussionId }) {
  const fetcher = (url, courseId, discussionId) =>
    fetch(url, {
      body: JSON.stringify({
        action: "content",
        payload: {
          courseId: courseId,
          discussionId: discussionId,
        },
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then((r) => r.json());
  const { data } = useSWR(["/api/discussion", courseId, discussionId], fetcher);
  const STATE_CLOSED = 0;
  const STATE_PREPARED = 1;
  const STATE_SUBMITTING = 2;
  const [state, setState] = useState(false);
  const [message, setMessage] = useState("\u200b");

  const D_STATE_CLOSED = 0;
  const D_STATE_PREPARED = 1;
  const D_STATE_DELETING = 2;
  const [dState, setDState] = useState(false);
  const [currentContent, setCurrentContent] = useState({
    discussionid: 0,
    postid: 0,
  });
  const prepareDelete = (discussionContent) => {
    if (
      discussionContent.discussionid !== currentContent.discussionid ||
      discussionContent.postid !== currentContent.postid
    ) {
      setCurrentContent({
        discussionid: discussionContent.discussionid,
        postid: discussionContent.postid,
      });
      setMessage("\u200b");
    }
    setDState(D_STATE_PREPARED);
  };
  const performDelete = () => {
    setDState(D_STATE_DELETING);
    setMessage("Processing...");
    fetch("/api/discussion", {
      body: JSON.stringify({
        action: "deleteContent",
        payload: {
          discussionId: currentContent.discussionid,
          postId: currentContent.postid,
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
          setMessage(res.msg ? res.msg : "Unknown error.");
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
        action: "submitContent",
        payload: {
          discussionId: discussionId,
          content: event.target.content.value,
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
          setMessage(res.msg ? res.msg : "Unknown error.");
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
  let discussionContentList;
  if (!data) {
    discussionContentList = (
      <Box display="flex" flexDirection="column" alignItems="center">
        <CircularProgress />
        <Box mt="10px">
          <Typography variant="h5"> Loading... </Typography>
        </Box>
      </Box>
    );
  } else if (data.content.length === 0) {
    discussionContentList = (
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box mt="10px">
          <Typography
            variant="h5"
            color="textSecondary"
            align="center"
            gutterBottom
          >
            {" "}
            No threads yet.{" "}
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
      const discussionContentItems = data.content.map(
        (discussionContent, i) => (
          <ListItem key={discussionContent.postid}>
            <Box width="100%">
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Thread {i + 1}
                  </Typography>
                  <Typography color="textSecondary">
                    Create User: {discussionContent.name}
                  </Typography>
                  <Typography color="textSecondary">
                    ID: {discussionContent.userid}
                  </Typography>
                  <Typography color="textSecondary">
                    Identity: {mapIdentity(discussionContent.identity)}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Create Date: {discussionContent.createdate}
                  </Typography>
                  <Typography>{discussionContent.content}</Typography>
                </CardContent>
                <CardActions>
                  <Box
                    display="flex"
                    component="span"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => prepareDelete(discussionContent)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            </Box>
          </ListItem>
        )
      );
      discussionContentList = <List>{discussionContentItems}</List>;
    } else {
      const discussionContentItems = data.content.map(
        (discussionContent, i) => (
          <ListItem key={discussionContent.postid}>
            <Box width="100%">
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Thread {i + 1}
                  </Typography>
                  <Typography color="textSecondary">
                    Create User: {discussionContent.name}
                  </Typography>
                  <Typography color="textSecondary">
                    Identity: {mapIdentity(discussionContent.identity)}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Create Date: {discussionContent.createdate}
                  </Typography>
                  <Typography>{discussionContent.content}</Typography>
                </CardContent>
              </Card>
            </Box>
          </ListItem>
        )
      );
      discussionContentList = <List>{discussionContentItems}</List>;
    }
  }

  return (
    <div>
      <Header title={`${courseName}: Threads`} data={data} />
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
              </Breadcrumbs>
            </Breadcrumbs>
            <Typography color="textPrimary">Threads</Typography>
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
          {discussionContentList}
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
            Create Thread
          </Button>
        </Box>
      </Container>
      <Dialog
        open={state > STATE_CLOSED}
        onClose={handleSubmissionClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Creating thread</DialogTitle>
        <form onSubmit={performSubmission}>
          <DialogContent>
            <DialogContentText>Please express your opinion: </DialogContentText>
            <TextField
              variant="outlined"
              rows="10"
              placeholder="Writing your opinion here..."
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
        <DialogTitle>Deleting this thread?</DialogTitle>
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
  discussionId: PropTypes.number.isRequired,
};

export default Discussion;
