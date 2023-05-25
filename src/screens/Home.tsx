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

const RenderSeparator = () => <View style={styles.separator}></View>

const FooterComponent = (page: number, didFetchAllPages: boolean) => 
  (didFetchAllPages || page === 1)
    ? <RenderSeparator/>
    : <ActivityIndicator size="large" color="gray" />

const ListEmptyComponent = () => (
  <View style={styles.alignCenter}>
    <Text style={styles.emptyText}>Please create a new submission to start using the app!</Text>
  </View>
)

const SubmissionList = ({
  data,
  handleItemPress,
  didFetchAllPages,
  page,
  isRefreshing,
  handleRefresh,
  handleEnd
}: {
  data: Submission[];
  handleItemPress: (submissionId: number) => void;
  didFetchAllPages: boolean;
  page: number;
  isRefreshing: boolean;
  handleRefresh: () => void;
  handleEnd: () => void;
}) => {
  return (
    data.length === 0 ? (
      <ListEmptyComponent />
    ) : (
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <SubmissionTableItem
            submission={item}
            onPress={() => handleItemPress(item.id)}
          />
        )}
        keyExtractor={item => item.id.toString()}
        ItemSeparatorComponent={RenderSeparator}
        ListFooterComponent={() => FooterComponent(page, didFetchAllPages)}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        onEndReached={handleEnd}
        onEndReachedThreshold={0}
      />
    )
  );
};

export default function HomeScreen({ route, navigation }: StackScreenProps<HomeStackParamList, 'Home'>) {
  const [data, setData] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [didFetchAllPages, setDidFetchAllPages] = useState(false);
  const [page, setPage] = useState(1);

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

  function gotoSubmissionDetail(submissionId: number) {
    navigation.navigate('SubmissionDetail', {
      submissionId: submissionId,
    });
  }

  return (
    <View style={styles.container}>
      {isLoading
        ? <ActivityIndicator style={styles.mt8} size="large" color="gray" />
        : <SubmissionList
            data={data}
            handleItemPress={gotoSubmissionDetail}
            didFetchAllPages={didFetchAllPages}
            page={page}
            isRefreshing={isRefreshing}
            handleRefresh={handleRefresh}
            handleEnd={handleEnd}
          /> 
      }
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
