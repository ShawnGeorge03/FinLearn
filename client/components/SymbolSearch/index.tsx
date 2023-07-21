import { Spinner, Text, useOutsideClick } from '@chakra-ui/react';
import { IoClose } from '@react-icons/all-files/io5/IoClose';
import { IoSearch } from '@react-icons/all-files/io5/IoSearch';
import { AnimatePresence, motion } from 'framer-motion';
import { ChangeEvent, useRef, useState } from 'react';
import { Scrollbar } from 'react-scrollbars-custom';

import { useDebounce } from '@/hooks/useDebounce';
import SymbolCard from './SymbolCard';

import styles from '@/styles/components/SymbolSearch.module.scss';

const containerVariants = {
  expanded: {
    height: '30em',
  },
  collapsed: {
    height: '3.8em',
  },
};

const containerTransition = { type: 'spring', damping: 22, stiffness: 150 };

type SymbolSearchResults = {
  symbol: string;
  name: string;
};

type SymbolSearchProps = {
  callback: (symbol: string) => void;
};

const SymbolSearch = ({ callback }: SymbolSearchProps) => {
  const {
    container,
    inputContainer,
    input,
    searchIcon,
    closeIcon,
    separator,
    content,
    loading,
    warning,
  } = styles;

  const [isExpanded, setExpanded] = useState(false);

  const resetSearchBar = () => {
    setExpanded(false);
    setSearchQuery('');
    setLoading(false);
    errorHandler('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const containerRef = useRef(null);

  useOutsideClick({
    ref: containerRef,
    handler: () => resetSearchBar(),
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [results, setResults] = useState<SymbolSearchResults[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
    if (e.target.value.length === 0) {
      e.currentTarget.blur(); // Removes Focus from the input
      resetSearchBar();
    }
  };

  const errorHandler = (errorMsg = 'Unable to Retrieve Symbols') => {
    setErrorMsg(errorMsg);
    setResults([]);
  };

  const searchSymbols = async () => {
    const validSymbolRegex = /^[A-Za-z]+/;
    if (
      !searchQuery ||
      searchQuery.trim() === '' ||
      !validSymbolRegex.test(searchQuery)
    ) {
      errorHandler('Invalid Search Terms');
      return;
    }

    setLoading(true);

    try {
      const response: Response = await fetch(
        `http://localhost:4000/symbolSearch?searchText=${searchQuery}`,
      );

      if (response.ok) {
        const data: SymbolSearchResults[] = await response.json();
        if (!data) errorHandler();
        else if (data.length === 0)
          errorHandler(`No Symbol found for ${searchQuery}`);
        else setResults(data);
      } else errorHandler();
    } catch (error) {
      errorHandler();
    }

    setLoading(false);
  };

  // Waits for user to finish typing and then sends a request to get symbols
  useDebounce({
    value: searchQuery,
    timeout: 250,
    callback: searchSymbols,
  });

  const isEmpty = !results || results.length === 0;

  return (
    <>
      <motion.div
        animate={isExpanded ? 'expanded' : 'collapsed'}
        className={container}
        ref={containerRef}
        transition={containerTransition}
        variants={containerVariants}>
        <div className={inputContainer}>
          <span className={searchIcon}>
            <IoSearch />
          </span>
          <input
            className={input}
            onChange={changeHandler}
            onFocus={() => setExpanded(true)}
            placeholder="Search Symbol"
            ref={inputRef}
            value={searchQuery}
          />
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                animate={{ opacity: 1 }}
                className={closeIcon}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key="close-icon"
                onClick={resetSearchBar}
                transition={{ duration: 1 }}>
                <IoClose />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {isExpanded && <span className={separator} />}
        {isExpanded && (
          <div className={content}>
            {isLoading && (
              <div className={loading}>
                <Spinner
                  color="blue.500"
                  emptyColor="gray.200"
                  size="xl"
                  speed="0.65s"
                  thickness="4px"
                />
                <Text>Looking for Symbols</Text>
              </div>
            )}
            {!isLoading && isEmpty && errorMsg.length === 0 && (
              <Text className={loading}>Start typing to search</Text>
            )}
            {!isLoading && isEmpty && errorMsg.length !== 0 && (
              <Text className={warning}>{errorMsg}</Text>
            )}
            {!isLoading && !isEmpty && (
              <Scrollbar>
                {results.map(({ name, symbol }, key) => (
                  <SymbolCard
                    callback={(symbol: string) => callback(symbol)}
                    key={key}
                    name={name}
                    symbol={symbol}
                  />
                ))}
              </Scrollbar>
            )}
          </div>
        )}
      </motion.div>
    </>
  );
};

export default SymbolSearch;
