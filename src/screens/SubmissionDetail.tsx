import React, { useEffect, useLayoutEffect } from 'react';

import { View, Text, Button, ScrollView } from 'react-native';
import { useQuery } from 'react-query';
import { AntDesign } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';

import { instance as axiosInstance } from '../helpers/axiosConfig';
import { HomeStackParamList } from '../Root';
import Colors from '../constants/Colors';
import Submission from '../types/Submission';
import SubmissionStatusView from '../components/SubmissionStatusView';
import { formatDateFromString } from '../helpers/DateFormatter';

//
// This screen is implemented using react-hook-form, zod, nativewind and react-query.
//

const BackButon = ({ onPress }: { onPress: () => void }) => {
  return (
    <Button
      onPress={onPress}
      title=" Back"
      color={Colors.ALMOST_WHITE}
    />
  )
}

const FieldTitle = ({ title }: {title: string}) => {
  return <Text className="font-medium text-sm text-gray-500 mb-1">{title}</Text>
}

const FieldValue = ({ value }: {value: string}) => {
  return <Text className="font-normal text-sm	text-gray-900">{value}</Text>
}

export default function SubmissionDetailScreen({ navigation, route }: StackScreenProps<HomeStackParamList, 'SubmissionDetail'>) {
  const { submissionId } = route.params;

  useEffect(() => {
    const parentNavigator = navigation.getParent();
  
    const onFocus = () => {
      parentNavigator?.setOptions({
        headerLeft: () => BackButon({ onPress: () => navigation.goBack() }),
        title: "Submission Detail"
      });
    };
  
    const onBlur = () => {
      parentNavigator?.setOptions({
        headerLeft: undefined,
        title: "Home"
      });
    };
  
    const unsubscribeFocus = navigation.addListener('focus', onFocus);
    const unsubscribeBlur = navigation.addListener('blur', onBlur);
  
    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  const getSubmission = () => axiosInstance.get(`/submissions/${submissionId}`);
  const { data: submissionResponse } = useQuery({
    queryFn: getSubmission,
    onError: (error) => {
      console.log(error);
    },
  });

  const submission: Submission = submissionResponse?.data.data;

  return (
    <View className="flex-1 bg-white pt-5 px-6 gap-2">
      <View className="flex-row items-center justify-between">
        <Text numberOfLines={1} className="mr-4 font-medium text-base shrink-[3]">{submission?.title}</Text>
        <SubmissionStatusView status={submission?.status} />
      </View>
      <Text className="text-sm font-normal w-20 text-gray-500">{formatDateFromString(submission?.created_at)}</Text>
      <View className="border border-gray-200" />
      <View className="flex-1 gap-y-5 px-2">
        <View className="flex-row justify-between">
          <View>
            <FieldTitle title="Email" />
            <FieldValue value={submission?.patient?.email ?? "-"} />
          </View>
          <View>
            <FieldTitle title="Phone" />
            <FieldValue value={submission?.patient?.phone_number ?? "-"} />
          </View>
        </View>
        {submission?.patient?.other_information &&
          <View>
            <FieldTitle title="Other info" />
            <FieldValue value={submission?.patient?.other_information} />
          </View>
        }
        <View>
          <FieldTitle title="Symptoms" />
          <ScrollView className="h-40 pr-1">
            <Text className="font-normal text-sm text-gray-900">
              {submission?.symptoms}
            </Text>
          </ScrollView>
        </View>
        <View>
          <FieldTitle title="Prescriptions" />
          <View className="flex-row items-center bg-gray-200 p-2 rounded-md mt-2">
            <AntDesign name="close" size={24} color="black" />
            <Text className="ml-2">No prescriptions have been added yet</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
