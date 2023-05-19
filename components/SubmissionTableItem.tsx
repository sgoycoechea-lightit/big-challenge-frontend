import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import Submission from '../types/Submission';
import SubmissionStatus from '../types/SubmissionStatus';
import Colors from '../constants/Colors';
import { formatDateFromString } from '../helpers/DateFormatter';

export default function SubmissionTableItem({ item: submission }: { item: Submission }) {
  const statusStyles = {
    [SubmissionStatus.Pending]: styles.pending,
    [SubmissionStatus.InProgress]: styles.inProgress,
    [SubmissionStatus.Done]: styles.done,
  };
  
  const statusTextStyles = {
    [SubmissionStatus.Pending]: styles.pendingText,
    [SubmissionStatus.InProgress]: styles.inProgressText,
    [SubmissionStatus.Done]: styles.doneText,
  }
  
  const statusNames = {
    [SubmissionStatus.Pending]: 'Pending',
    [SubmissionStatus.InProgress]: 'In Progress',
    [SubmissionStatus.Done]: 'Done',
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {submission.title}
        </Text>
        <View style={[styles.status, statusStyles[submission.status]]}>
          <Text style={statusTextStyles[submission.status]}>
            {statusNames[submission.status]}
          </Text>
        </View>
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.doctor}>
          {submission.doctor?.name ?? "No doctor assigned"}
        </Text>
        <Text style={styles.dateCreated}>
          {formatDateFromString(submission.created_at)}
        </Text>
      </View>
    </View>
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
  status: {
    height: 24,
    width: 95,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  pending: {
    backgroundColor: Colors.LIGHT_BLUE,
  },
  inProgress: {
    backgroundColor: Colors.LIGHT_GREEN,
  },
  done: {
    backgroundColor: Colors.BACKGROUND_GRAY,
  },
  pendingText : {
    color: Colors.TEXT_BLUE,
  },
  inProgressText : {
    color: Colors.TEXT_GREEN,
  },
  doneText : {
    color: Colors.TEXT_GRAY_2,
  },
  dateCreated: {
    fontWeight: "400",
    fontSize: 14,
    width: 80,
    textAlign: "center",
    color: Colors.TEXT_GRAY_2,
  },
});
