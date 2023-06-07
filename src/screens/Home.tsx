import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { instance as axiosInstance } from '../helpers/axiosConfig';
import { StackScreenProps } from '@react-navigation/stack';
import { HomeStackParamList } from '../Root';
import Submission from '../types/Submission';
import PaginationData from '../types/PaginationData';

import FilterModal, { FilterOption } from '../components/FilterModal';
import FilterButton from '../components/FilterButton';
import SubmissionList from '../components/SubmissionList';

type GetSubmissionsResponse = {
  data: Submission[],
  pagination: PaginationData,
}

export default function HomeScreen({ route, navigation }: StackScreenProps<HomeStackParamList, 'Home'>) {
  const [data, setData] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [didFetchAllPages, setDidFetchAllPages] = useState(false);
  const [page, setPage] = useState(1);
  const [isModalVisible, setModalVisible] = useState(false);
  const [filterOption, setFilterOption] = useState(FilterOption.All);

  useEffect(() => {
    fetchSubmissions();
  }, [page, filterOption]);

  useEffect(() => {
    if (route.params?.newSubmissionAdded) {
      setData([]);
      setIsLoading(true);
      handleRefresh();
      navigation.setParams({ newSubmissionAdded: false });
    }
  }, [route.params?.newSubmissionAdded]);

  useEffect(() => {
    const parentNavigator = navigation.getParent();

    const onFocus = () => {
      parentNavigator?.setOptions({
        headerRight: () => FilterButton({ onPress: handleFilterPress }),
      });
    };
  
    const onBlur = () => {
      parentNavigator?.setOptions({
        headerRight: undefined,
      });
    };
  
    const unsubscribeFocus = navigation.addListener('focus', onFocus);
    const unsubscribeBlur = navigation.addListener('blur', onBlur);
  
    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  function fetchSubmissions() {
    if (isFetching) { return; }
    setIsFetching(true)

    let url = '/submissions?page=' + page;
    if (filterOption !== FilterOption.All) url += '&status=' + filterOption;

    axiosInstance
      .get<GetSubmissionsResponse>(url)
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

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleFilterChange = (option: FilterOption) => {
    handleModalClose();
    if (option !== filterOption) {
      setData([]);
      setIsLoading(true);
      setFilterOption(option);
    }
  };

  const handleFilterPress = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <FilterModal
        isModalVisible={isModalVisible}
        filterOption={filterOption}
        handleFilterChange={handleFilterChange}
        handleModalClose={handleModalClose}
      />
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
  mt8: {
    marginTop: 8,
  },
});
