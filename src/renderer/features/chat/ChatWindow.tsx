import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { gotMessage, sendMessage } from './chatSlice';

export const ChatWindow = (): ReactElement => {
  const chatUser = useSelector((state: RootState) => state.chat.currUser);

  const msgs = useSelector((state: RootState) => state.chat.chatHistory);

  const keyRecieved = useSelector(
    (state: RootState) => state.chat.keyRecieved[chatUser as string]
  );

  const [currMsg, setCurrMsg] = React.useState('');

  const dispatch = useDispatch();

  if (!chatUser) {
    return <Box />;
  }
  return (
    <Box h="100%" w="100%">
      <VStack h="100%">
        <VStack w="100%" flex="1" spacing="2">
          {msgs.map((msg) => (
            <Box w="100%" key={msg} bgColor="green.100" p="4" borderRadius="sm">
              <Text color="black">{msg}</Text>
            </Box>
          ))}
        </VStack>
        <InputGroup>
          <Input
            placeholder="Type a message..."
            onChange={(e) => setCurrMsg(e.target.value)}
            value={currMsg}
            disabled={!keyRecieved}
          />
          <InputRightElement>
            <Button
              colorScheme="blue"
              onClick={() => {
                dispatch(sendMessage(currMsg));
                setCurrMsg('');
              }}
              isDisabled={!keyRecieved}
            />
          </InputRightElement>
        </InputGroup>
      </VStack>
    </Box>
  );
};
