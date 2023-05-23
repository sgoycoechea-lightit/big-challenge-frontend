import React, { useState } from 'react';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator, Text, View } from 'react-native';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from 'react-query';

import { instance as axiosInstance } from '../helpers/axiosConfig';
import getErrorMessage from '../helpers/getErrorMessage';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../Root';
import InputField from '../components/InputField';


//
// This screen is implemented using react-hook-form, zod, nativewind and react-query.
//

const schema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(255, { message: "Title is too long" }),
  symptoms: z
    .string() 
    .min(1, { message: "Symptoms are required" })
    .max(1023, { message: "Symptoms are too long" })
});

type NewSubmissionFormData = z.infer<typeof schema>;

export default function NewSubmissionScreen({ navigation }: DrawerScreenProps<DrawerParamList, 'NewSubmission'>) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    
  } = useForm<NewSubmissionFormData>({
    resolver: zodResolver(schema),
  });


  const createSubmission = (data: NewSubmissionFormData) => axiosInstance.post('/submissions', data);

  const { mutate: createSubmissionMutation, isLoading, error } = useMutation({
    mutationFn: createSubmission,
    onSuccess: () => {
      navigation.navigate('HomeStack', {
        screen: 'Home',
        params: { newSubmissionAdded: true },
      });
      reset();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onSubmit: SubmitHandler<NewSubmissionFormData> = (data) => {
    createSubmissionMutation(data);
  };

  return (
    <View className="flex-1 bg-white items-center pt-5">
      <View className="w-[260]">
        <View className="mt-5">
          {!!error && <Text className="text-red-500">Something went wrong</Text>}
          {errors.root && <Text className="text-red-500">{errors.root.message}</Text>}
          <InputField
            error = {errors.title}
            control = {control}
            name = 'title'
            placeholder = 'Title'
            inputTitle = 'Title'
          />
          <InputField
            error = {errors.symptoms}
            control = {control}
            name = 'symptoms'
            placeholder = 'Symptoms'
            inputTitle = 'Symptoms'
            multiline
            bigTextBox
          />
        </View>
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="flex-row gap-0 justify-center items-center rounded-lg bg-blue-600 p-3 mt-5"
        >
          {isLoading && (
            <ActivityIndicator
              className="mr-3 h-3 w-3"
              color="white"
            />
          )}
          <Text className="text-white">Send submission</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
