import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import getReceipentEmail from "../utils/getReceipentEmail";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from 'next/router';

function Chat({ id, users }) {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const getEmail = getReceipentEmail(users, user);
  const [userSnapShot] = useCollection(
    db.collection("users").where("email", "==", getEmail)
  );
  const other_user = userSnapShot?.docs?.[0]?.data();

  const onClickHandler = () => {
    router.push(`/chat/${id}`);
  }

  return (
    <Container onClick={onClickHandler}>
      {other_user ? (
        <UserAvatar src={other_user?.photoUrl} />
      ) : (
        <UserAvatar>{getEmail[0]}</UserAvatar>
      )}

      <p>{getEmail}</p>
    </Container>
  );
}

export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;
  :hover {
    background-color: #e9eaeb;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
