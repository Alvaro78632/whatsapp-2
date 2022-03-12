import {Avatar,IconButton, Button} from "@material-ui/core"
import styled from "styled-components"
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search'
import * as EmailValidator from 'email-validator'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import { auth, db } from "../firebase";
import Chat from '../components/chat';


function Sidebar() {
    const[user]=useAuthState(auth)
    const useChatRef=db
    .collection('chats')
    .where('users','array-contains' , user.email)
    const [chatsSnapshot]= useCollection(useChatRef)

    const createChat = () => {
        const input = prompt(
            'Introduce el email para chatear'
            )

        if(!input) return null

        if(
        EmailValidator.validate(input) && 
        !chatAlreadyExists(input) && 
        input!==user.email
        ){
            // Añadir el chat a la bdd
            db.collection('chats').add({
                users: [user.email,input],
            })
        }
    }

    const chatAlreadyExists= (recipientEmail) =>
        !!chatsSnapshot?.docs.find(
            chat => 
            chat.data().users.find(user => user === recipientEmail)?.length>0)


    return (
        <Container>
            <Header>
             <UserAvatar src={user.photoURL} onClick={()=> auth.signOut()} />
             
             <IconsContainer>
                <IconButton>
                    <ChatIcon/>
                </IconButton>
                <IconButton>
                    <MoreVertIcon/>
                </IconButton>   
             </IconsContainer>
            </Header>

            <Search>
                <SearchIcon/>
                <SearchInput placeholder="Buscar en los chats"/>
            </Search>

            <SidebarButton onClick={createChat}>Abre un chat</SidebarButton>

            {/* Aquí van los chats*/ }
            {chatsSnapshot?.docs.map(chat => (
                <Chat key={chat.id} id={chat.id} users={chat.data().users}/>       
            ))}
        </Container>
    )
}

export default Sidebar

const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid whitesmoke;
    height:100vh;
    min-width:300px;
    max-width: 350px;
    overflow-y: scroll;

    ::-webkit-scrollbar{
        display:none;
    }

    -ms-size-overflow-style:none; //para IE y Edge
    scrollbar-width: none; // para Firefox
`;

const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius:2px;
`;

const SidebarButton = styled(Button)`
    width: 100%;
    &&&{
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }   
`;

const SearchInput = styled.input`
    outline-width: 0;
    border:none;
    flex:1;
`;

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`;

const UserAvatar=styled(Avatar)`
    cursor: pointer;

    :hover{
        opacity: 0.8;
    }
`;

const IconsContainer= styled.div``;