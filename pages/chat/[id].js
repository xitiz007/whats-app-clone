import styled from 'styled-components';
import Head from 'next/head';
import SideBar from '../../components/SideBar';
import ChatScreen from "../../components/ChatScreen";
import {db, auth} from '../../firebase';
import getReceipentEmail from '../../utils/getReceipentEmail';
import {useAuthState} from 'react-firebase-hooks/auth';

function Chat({chat, messages}) {
    const [user] = useAuthState(auth);
    const users = chat.users;

    return (
        <Container>
            <Head>
                <title>Chat with {getReceipentEmail(users, user)}</title>
            </Head>
            <SideBar />
            <ChatContainer>
                <ChatScreen chat={chat} messages= {messages} />
            </ChatContainer>
        </Container>
    )
}

export default Chat;

export async function getServerSideProps(context)
{
    const ref = db.collection('chats').doc(context.query.id);
    const messagesRes = await ref
    .collection('messages')
    .orderBy('timestamp', 'asc')
    .get();

    const messages = messagesRes.docs.map(doc => (
        {
            id: doc.id,
            ...doc.data()
        }
    )).map(messages => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime()
    }))

    const chatRes = await ref.get();
    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    }
    // console.log(chat, messages)
    return {
        props: {
            messages: JSON.stringify(messages),
            chat
        }
    }
}

const Container = styled.div`
    display: flex;
`;

const ChatContainer = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;
    ::-webkit-scrollbar{
        display: none;
    }
    --ms-overflow-style: none;
    scrollbar-width: none;
`;
