import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import Submission from "../types/Submission";
import SubmissionTableItem from './SubmissionTableItem';

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

const styles = StyleSheet.create({
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
});

export default SubmissionList;
