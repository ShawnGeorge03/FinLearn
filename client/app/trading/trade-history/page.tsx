'use client';
import styles from '@/styles/pages/Dashboard.module.scss';
import {
  Heading,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { Portfolio } from '../../../../server/src/types/trading';

const USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const TradeHistoryPage = () => {
  const [userPortfolio, setUserPortfolio] = useState<Portfolio | null>(null);
  const { userId } = useAuth();
  const [loaded, setLoaded] = useState(false);

  const getUserPortfolio = async () => {
    if (!userId) return;
    const url = `http://localhost:4000/trading/portfolio?userID=${userId}`;
    const response = await fetch(url);
    if (response.ok) {
      const portfolio = await response.json();
      setUserPortfolio(portfolio);
    }
    setLoaded(true);
  };

  useEffect(() => {
    getUserPortfolio();
  }, [userId]);

  if (!loaded)
    return (
      <div className={styles.center}>
        <Spinner
          color="blue.500"
          emptyColor="gray.200"
          m={'auto'}
          size="xl"
          speed="0.65s"
          thickness="4px"
        />
      </div>
    );

  if (userPortfolio === null) return <div>user has no Trade History</div>;

  return (
    <div>
      <Heading margin="5">Trade History</Heading>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Symbol</Th>
              <Th>Price</Th>
              <Th>Quantity</Th>
              <Th>Type</Th>
            </Tr>
          </Thead>
          <Tbody>
            {userPortfolio.history.equity.map(
              ({ symbol, price, quantity, action }, idx) => {
                return (
                  <Tr key={idx}>
                    <Td>{symbol}</Td>
                    <Td>{USDollar.format(price)}</Td>
                    <Td>{quantity}</Td>
                    <Td>{action.charAt(0).toUpperCase() + action.slice(1)}</Td>
                  </Tr>
                );
              },
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TradeHistoryPage;
