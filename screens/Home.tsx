import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native';


import { instance as axiosInstance } from '../helpers/axiosConfig';
import { StackScreenProps } from '@react-navigation/stack';
import { HomeStackParamList } from '../Root';
import Submission from '../types/Submission';
import PaginationData from '../types/PaginationData';
import SubmissionTableItem from '../components/SubmissionTableItem';

type GetSubmissionsResponse = {
  data: Submission[],
  pagination: PaginationData,
}

export default function HomeScreen({ route, navigation }: StackScreenProps<HomeStackParamList, 'Home'>) {
  const [data, setData] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [didFetchAllPages, setDidFetchAllPages] = useState<boolean>(false);

  useEffect(() => {
    fetchSubmissions();
  }, [page]);

  useEffect(() => {
    if (route.params?.newSubmissionAdded) {
      setData([]);
      setIsLoading(true);
      handleRefresh();
      navigation.setParams({ newSubmissionAdded: false });
    }
  }, [route.params?.newSubmissionAdded]);

  function fetchSubmissions() {
    if (isFetching) { return; }
    setIsFetching(true)

    axiosInstance
      .get<GetSubmissionsResponse>(`/submissions?page=${page}`)
      .then(response => {
          setData(page === 1 ? response.data.data : [...data, ...response.data.data]);
          if (response.data.pagination.currentPage >= response.data.pagination.totalPages) {
            setDidFetchAllPages(true);
          }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsFetching(false);
      });
  }

  function handleRefresh() {
    setDidFetchAllPages(false);
    setIsRefreshing(true);
    if (page === 1) {
      fetchSubmissions();
    } else {
      setPage(1);
    }
  }

  function handleEnd() {
    if (!didFetchAllPages && !isFetching && !isLoading && data.length > 0) {
      setPage(page + 1);
    }
  }

  const RenderSeparator = () => (
    <View style={styles.separator}></View>
  )

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator style={styles.mt8} size="large" color="gray" />
      ) : (
        data.length === 0 ? (
          <View style={styles.alignCenter}>
            <Text style={styles.emptyText}>Please create a new submission to start using the app!</Text>
          </View>
        ) : (
        <FlatList
          data={data}
          renderItem={props => <SubmissionTableItem {...props} />}
          keyExtractor={item => item.id.toString()}
          ItemSeparatorComponent={RenderSeparator}
          ListFooterComponent={() =>
            (didFetchAllPages || page === 1)
             ? <RenderSeparator/>
             : <ActivityIndicator size="large" color="gray" />
          }
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          onEndReached={handleEnd}
          onEndReachedThreshold={0}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  alignCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 60,
  },
  emptyText: {
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
  },
  mt8: {
    marginTop: 8,
  },
});
