import styled from "styled-components"
import Head from 'next/head'
import Sidebar from "../../components/Sidebar"
import ChatScreen from "../../components/ChatScreen"
import { auth, db } from "../../firebase"
import getRecipientEmail from "../../utils/getRecipientEmail"
import { useAuthState } from "react-firebase-hooks/auth"

function Chat({chat,messages}) {
    const[user] = useAuthState(auth);

    return (
    <Container>
            <Head>
               <title>Chat con {getRecipientEmail(chat.users,user)}</title> 
            </Head>
            <Sidebar/>
            <ChatContainer>
                <ChatScreen chat={chat} messages={messages} />
            </ChatContainer>
    </Container>
    )
}

export default Chat

export async function getServerSideProps(context){
    const ref = db.collection("chats").doc(context.query.id)

    //Preparar mensajes en el servidor
    const messagesRes = await ref
    .collection('messages') 
    .orderBy('timestamp','asc')
    .get()

    const messages = messagesRes.docs.map(doc =>({ 
        id: doc.id,
        ...doc.data()
    // })).map(messages.timestamp.toDate().getTime()
    })).map(messages => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime()
    }))

    // Preparar los chats
    const chatRes = await ref.get()
    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    }

    console.log(chat,messages)

    return {
        props:{
            messages:JSON.stringify(messages),
            chat: chat,
            prueba:'ey'
        }
    }
}

const Container = styled.div`
  display:flex;
`

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  //Quitar las barras en los 3 navegadores
  ::-webkit-scrollbar{
      display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`