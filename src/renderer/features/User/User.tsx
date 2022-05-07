import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  VStack,
} from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import { postUsername } from './userSlice';

export const User = (): ReactElement => {
  const rUsername = useSelector((state: RootState) => state.user.username);
  const error = useSelector((state: RootState) => state.user.error);
  const dispatch = useDispatch<AppDispatch>();

  const [username, setUsername] = React.useState('');

  return (
    <Box h="100vh" w="100vw">
      <Heading m="4" textAlign="center">
        SpySlayer
      </Heading>
      <Center h="100%" w="100%">
        <VStack>
          <FormControl isInvalid={error !== undefined}>
            <FormLabel>Username</FormLabel>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
          </FormControl>
          <Button onClick={() => dispatch(postUsername(username))}>
            Submit
          </Button>
        </VStack>
      </Center>
    </Box>
  );
};
