import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Submission from '../types/Submission';
import Colors from '../constants/Colors';
import { formatDateFromString } from '../helpers/DateFormatter';
import SubmissionStatusView from './SubmissionStatusView';

export default function SubmissionTableItem({ submission, onPress }: { submission: Submission, onPress: () => void }) {
  const { title, status, doctor, created_at } = submission;

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <SubmissionStatusView status={status} />
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.doctor}>
            {doctor?.name ?? "No doctor assigned"}
          </Text>
          <Text style={styles.dateCreated}>
            {formatDateFromString(created_at)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    },
  title: {
    height: 24,
    fontWeight: "500",
    fontSize: 15,
    width: 210,
  },
  doctor: {
    fontWeight: "400",
    fontSize: 14,
    width: 210,
  },
  dateCreated: {
    fontWeight: "400",
    fontSize: 14,
    width: 80,
    textAlign: "center",
    color: Colors.TEXT_GRAY_2,
  },
});
