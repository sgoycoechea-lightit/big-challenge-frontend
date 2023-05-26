import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 


import { instance as axiosInstance } from '../helpers/axiosConfig';
import { StackScreenProps } from '@react-navigation/stack';
import { HomeStackParamList } from '../Root';
import Submission from '../types/Submission';
import PaginationData from '../types/PaginationData';
import SubmissionTableItem from '../components/SubmissionTableItem';
import Colors from '../constants/Colors';

type GetSubmissionsResponse = {
  data: Submission[],
  pagination: PaginationData,
}

enum FilterOption {
  All = 'ALL',
  Pending = 'PENDING',
  InProgress = 'IN_PROGRESS',
  Done = 'DONE',
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

const FilterButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity className="pr-4" onPress={onPress}>
      <Ionicons name="filter" size={24} color={Colors.ALMOST_WHITE} />
    </TouchableOpacity>
  )
}

const ModalOption = ({
  text,
  selected,
  borderBottom,
  onPress
}: {
  text: string,
  selected: boolean,
  borderBottom?: boolean,
  onPress: () => void
}) => {
  return (
    <>
      <TouchableOpacity className="h-12 w-full items-center justify-center flex-row" onPress={onPress}>
        <Text>{text}</Text>
        {selected && 
          <View className="absolute right-7">
            <Ionicons name="checkmark" size={24} color="black" />
          </View>
        }
      </TouchableOpacity>
      {borderBottom && <View className="w-11/12 border-b border-gray-300"/>}
    </>
  )
}

const FilterModal = ({
  isModalVisible,
  filterOption,
  handleFilterChange,
  handleModalClose,
}: {
  isModalVisible: boolean,
  filterOption: FilterOption,
  handleFilterChange: (option: FilterOption) => void,
  handleModalClose: () => void,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
    >
      <View className="flex-1 justify-end items-center px-6 pb-12">
        <View className="m-5 bg-gray-50 items-center w-full justify-center rounded-lg border border-gray-400 shadow-2xl">
          <ModalOption
            text="All submissions"
            selected={filterOption == FilterOption.All}
            onPress={() => handleFilterChange(FilterOption.All)}
            borderBottom
          />
          <ModalOption
            text="Pending"
            selected={filterOption == FilterOption.Pending}
            onPress={() => handleFilterChange(FilterOption.Pending)}
            borderBottom
          />
          <ModalOption
            text="In Progress"
            selected={filterOption == FilterOption.InProgress}
            onPress={() => handleFilterChange(FilterOption.InProgress)}
            borderBottom
          />
          <ModalOption
            text="Done"
            selected={filterOption == FilterOption.Done}
            onPress={() => handleFilterChange(FilterOption.Done)}
          />
        </View>
        <View className=" bg-gray-50 items-center w-full justify-center rounded-lg border border-gray-400 shadow-2xl">
          <ModalOption text="Close" selected={false} onPress={handleModalClose} />
        </View>
      </View>
    </Modal>
  )
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
