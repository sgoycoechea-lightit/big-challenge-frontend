import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import moment from 'moment';

import Submission from '../types/Submission';
import SubmissionStatus from '../types/SubmissionStatus';
import Colors from '../constants/Colors';


function getStatusStyle(status: SubmissionStatus) {
  switch (status) {
    case SubmissionStatus.Pending:
      return styles.pending;
    case SubmissionStatus.InProgress:
      return styles.inProgress;
    case SubmissionStatus.Done:
      return styles.done;
  }
}

function getStatusName(status: SubmissionStatus) {
  switch (status) {
    case SubmissionStatus.Pending:
      return 'Pending';
    case SubmissionStatus.InProgress:
      return 'In Progress';
    case SubmissionStatus.Done:
      return 'Done';
  }
}

function getStatusTextStyle(status: SubmissionStatus) {
  switch (status) {
    case SubmissionStatus.Pending:
      return styles.pendingText;
    case SubmissionStatus.InProgress:
      return styles.inProgressText;
    case SubmissionStatus.Done:
      return styles.doneText;
  }
}

export default function SubmissionTableItem({ item: submission }: { item: Submission }) {
  const statusStyle = getStatusStyle(submission.status);
  const statusTextStyle = getStatusTextStyle(submission.status);
  const statusName = getStatusName(submission.status);
  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {submission.title}
        </Text>
        <View style={[styles.status, statusStyle]}>
          <Text style={statusTextStyle}>{statusName}</Text>
        </View>
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.doctor}>
          {submission.doctor?.name ?? "No doctor assigned"}
        </Text>
        <Text style={styles.dateCreated}>
          {moment(submission.created_at).format('M/D/YY')}
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
