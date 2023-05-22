import React, { useState } from 'react';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";

import { instance as axiosInstance } from '../helpers/axiosConfig';
import getErrorMessage from '../helpers/getErrorMessage';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../Root';
import Colors from '../constants/Colors';
import InputField from '../components/InputField';


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
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    
  } = useForm<NewSubmissionFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<NewSubmissionFormData> = (data) => {
    setIsLoading(true);
    axiosInstance
      .post('/submissions', data)
      .then(response => {
        setApiError(null);
        navigation.navigate('HomeStack', {
          screen: 'Home',
          params: { newSubmissionAdded: true },
        });
        reset();
      })
      .catch(error => {
        console.log(error.response);
        const message = getErrorMessage(error);
        setApiError(message);
      }).finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.w260}>        
        <View style={styles.mt20}>
          {apiError && <Text style={styles.error}>{apiError}</Text>}
          {errors.root && <Text style={styles.error}>{errors.root.message}</Text>}
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
          style={[styles.button, styles.mt16]}
        >
          {isLoading && (
            <ActivityIndicator
              style={styles.activityIndicator}
              color="white"
            />
          )}
          <Text style={styles.buttonText}>Send submission</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    paddingTop: 15,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: Colors.WHITE,
  },
  activityIndicator: {
    marginRight: 18,
    height: 10,
    width: 10,
  },
  error: {
    color: 'red',
  },
  mt16: {
    marginTop: 16,
  },
  mt20: {
    marginTop: 20,
  },
  w260: {
    width: 260,
  },
});
