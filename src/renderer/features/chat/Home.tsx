import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  InputGroup,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import React, { ReactElement, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import { ActiveUsers } from './ActiveUsers';
import { ChatWindow } from './ChatWindow';

export const Home = (): ReactElement => {
  const username = useSelector((state: RootState) => state.user.username);

  return (
    <HStack p={4} h="100vh" alignItems="flex-start">
      <ActiveUsers />
      <Divider orientation="vertical" />
      <Box flex="1">
        <ChatWindow />
      </Box>
    </HStack>
  );
};
