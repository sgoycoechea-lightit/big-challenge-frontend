import { View, Text, StyleSheet } from "react-native";
import SubmissionStatus from "../types/SubmissionStatus";
import Colors from "../constants/Colors";

export default function SubmissionStatusView({ status }: { status: SubmissionStatus }) {
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
        <View style={[styles.status, statusStyles[status]]}>
            <Text style={statusTextStyles[status]}>
                {statusNames[status]}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
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
});