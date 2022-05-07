import { VStack, Heading, Button, HStack, Box } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { userSelected } from './chatSlice';

export const ActiveUsers = (): ReactElement => {
  const username = useSelector((state: RootState) => state.user.username);
  const userList = useSelector((state: RootState) => state.chat.userList);
  const dispatch = useDispatch();

  return (
    <VStack w="10vw" spacing="8" m="4">
      <Heading size="md">Hello {username}</Heading>
      <Heading size="sm" mt="8">
        Currently Active: {userList.length}
      </Heading>
      <VStack w="100%" spacing="4">
        {userList.map((user) => (
          <Button
            w="100%"
            py="8"
            px="2"
            key={user}
            onClick={() => dispatch(userSelected(user))}
          >
            <HStack>
              <Heading size="sm">{user}</Heading>
              <Box bgColor="green" borderRadius="50%" h="16px" w="16px" />
            </HStack>
          </Button>
        ))}
      </VStack>
    </VStack>
  );
};
