import { useState, useRef } from "react";
import styled from "styled-components";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { IconButton } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import Message from "./Message";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import firebase from "firebase";
import getReceipentEmail from "../utils/getReceipentEmail";
import TimeAgo from "timeago-react";

function ChatScreen({ chat, messages }) {
  const ref = useRef(null);
  const [input, setInput] = useState("");
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const ShowMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    }
    return JSON.parse(messages).map((message) => (
      <Message key={message.id} user={message.user} message={message} />
    ));
  };

  const scrollToBottom = () => {
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = (event) => {
    event.preventDefault();
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });
    setInput("");
    scrollToBottom();
  };
  const other_user_email = getReceipentEmail(chat.users, user);

  const [receipentSnapShot] = useCollection(
    db.collection("users").where("email", "==", other_user_email)
  );
  const receipent = receipentSnapShot?.docs?.[0]?.data();
  return (
    <Container>
      <Header>
        {receipent ? (
          <Avatar src={receipent?.photoUrl} />
        ) : (
          <Avatar>{other_user_email[0]}</Avatar>
        )}
        <HeaderInformation>
          <h3>{other_user_email}</h3>
          <p>
            last active:{" "}
            {receipent ? (
              <>
                {receipent?.lastSeen?.toDate() ? (
                  <TimeAgo datetime={receipent?.lastSeen?.toDate()} />
                ) : (
                  "unavailable"
                )}
              </>
            ) : (
              "unavailable"
            )}
          </p>
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        <ShowMessages />
        <EndOfMessage ref={ref} />
      </MessageContainer>
      <InputContainer>
        <InsertEmoticonIcon />
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button hidden type="submit" disabled={!input} onClick={sendMessage}>
          send message
        </button>
        <MicIcon />
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div``;

const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: white;
  padding: 11px;
  height: 80px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;
  > h3 {
    margin-bottom: 3px;
  }
  > p {
    font-size: 14px;
    color: gray;
  }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;

const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  position: sticky;
  bottom: 0;
  z-index: 100;
  background-color: white;
`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 20px;
  margin-left: 15px;
  margin-right: 15px;
`;
