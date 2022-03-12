import { Avatar, IconButton } from "@material-ui/core"
import { useRouter } from "next/router"
import { useAuthState } from "react-firebase-hooks/auth"
import styled from "styled-components"
import { auth, db } from "../firebase"
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import { useCollection } from "react-firebase-hooks/firestore"
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon"
import MicIcon from "@material-ui/icons/Mic"
import Message from "./Message"
import { useState } from "react"
import firebase from "firebase"
import getRecipientEmail from "../utils/getRecipientEmail"
import TimeAgo from "timeago-react"
import * as timeago from 'timeago.js';
import es from 'timeago.js/lib/lang/es';
import { useRef } from "react"

function ChatScreen({chat, messages}) {
    const[user]=useAuthState(auth);
    const[input, setInput] = useState("");
    const endOfMessageRef=useRef(null)
    const router = useRouter();
    const [messagesSnapshot] = useCollection(
        db
        .collection("chats")
        .doc(router.query.id)
        .collection("messages")
        .orderBy("timeStamp","asc")
       );
    const [recipientSnapshot]=useCollection(
        db.collection('users').where('email','==',getRecipientEmail(chat.users,user))
    )

    const showMessages = () => {  
        if(messagesSnapshot){ 
            return messagesSnapshot.docs.map( message => (         
                <Message 
                key={message.id} 
                user={message.data().user}
                message={{
                    ...message.data(),
                    timeStamp: message.data().timeStamp?.toDate().getTime() 
                }}
                />
            ))
        } else {
            return JSON.parse(messages).map(message =>{
                <Message key={message.id} user={message.data().user} message={message}/>
            })
        }
    }

    const ScrollToBottom = () =>{
        endOfMessageRef.current.scrollIntoView({
            behavior:'smooth',
            block:'start'
        })
    }

    const sendMessage = (e) =>{
        e.preventDefault();

        //Actualizar la ultima vez vista
        db.collection("users").doc(user.uid).set(
            {
                lastSeen: firebase.firestore.FieldValue.serverTimestamp()
            }, 
            { merge: true}
        );
    
        db.collection("chats").doc(router.query.id).collection("messages").add({
            timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user:user.email,
            photoURL: user.photoURL
        });

        setInput("");
        ScrollToBottom()
    }

    const recipient= recipientSnapshot?.docs?.[0]?.data() //datos del email receptor
    const recipientEmail = getRecipientEmail(chat.users,user)
    timeago.register('es', es);
    return (
        <Container>
            <Header>
                {recipient ? (
                    <Avatar src={recipient.photoURL}/>
                ) : (
                    <Avatar src={recipientEmail[0]}/>
                )  
                }
                

                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p>
                            Última vez conectado: {' '}
                            {recipient.lastSeen?.toDate() ?(
                                <TimeAgo datetime={recipient.lastSeen?.toDate()} locale='es'/>
                            ): ("No disponible")}
                            </p>
                            ): (
                            <p>Cargando datos...</p>
                    )}
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                {showMessages()}
                <EndOfMessage ref={endOfMessageRef}/> 
            </MessageContainer>

            <InputContainer>
                <InsertEmoticonIcon/>
                <Input value={input} onChange={ (e) => setInput(e.target.value)} />
                    <button hidden disabled={!input} type="submit" onClick={sendMessage}>
                        Enviar mensaje
                    </button>
                <MicIcon/>
            </InputContainer>
        </Container>
    )
}

export default ChatScreen;

const Container = styled.div ``;

const Input = styled.input `
    flex:1;
    outline:0;
    border:none;
    border-radius:10px;
    background-color: whitesmoke;
    padding:20px;
    margin-left:15px;
    margin-right: 15px;
`;

const InputContainer = styled.form `
    display:flex;
    align-items:center;
    padding:10px;
    position:sticky;
    bottom:0;
    background-color:white;
    z-index:100;
`;

const Header = styled.div `
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div `
    margin-left: 15px;
    flex: 1;

    > h3{
        margin-bottom:  3px;
    }

    > p {
        font-size:14px;
        color: gray;
    }
`;

const EndOfMessage = styled.div `
    margin-bottom: 50px;
`;

const HeaderIcons = styled.div ``;

const MessageContainer = styled.div `
    padding:30px;
    background-color:#e5dedB;
    min-height:90vh;
`;