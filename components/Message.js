import styled from 'styled-components';
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth} from '../firebase';
import moment from 'moment';

function Message({user, message}) {
    const [loggedUser] = useAuthState(auth);
    const TypeofMessage = loggedUser.email === user ? Sender : Receiver; 
    return (
      <Container>
        <TypeofMessage>
            {message.message}
            <Timestamp>
              {message.timestamp ? moment(message.timestamp).format('LT') : '...'}  
            </Timestamp>
        </TypeofMessage>
      </Container>
    );
}

export default Message;

const Container = styled.div`
    
`;

const MessageElement = styled.p`
  width: fit-content;
  padding: 15px;
  border-radius: 8px;
  margin: 10px;
  min-width: 60px;
  padding-bottom: 26px;
  position: relative;
  text-align: right;
`;

const Sender = styled(MessageElement)`
    margin-left: auto;
    background: #dcf8c6;
`;

const Receiver = styled(MessageElement)`
    background-color: whitesmoke;
    text-align: left;
`;

const Timestamp = styled.div`
    color: gray;
    padding: 10px;
    font-size: 9px;
    position: absolute;
    bottom: 0;
    text-align: right;
    right: 0;
`;