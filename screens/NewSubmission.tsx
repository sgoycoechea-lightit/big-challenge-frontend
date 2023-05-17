import React, { useContext, useState } from 'react';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";

import { instance as axiosInstance } from '../helpers/axiosConfig';
import getErrorMessage from '../helpers/getErrorMessage';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../Root';
import Colors from '../constants/Colors';


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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
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
        navigation.navigate('HomeStack');
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
          <Text style={styles.inputTitle} >Title</Text>
          <Controller
            control={control}
            name="title"
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={onChange}
                style={styles.inputBox}
                value={value}
                placeholder="Title"
              />
            )}
          />
          {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}
          <Text style={styles.inputTitle} >Symptoms</Text>
          <Controller
            control={control}
            name="symptoms"
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={onChange}
                multiline={true}
                style={[styles.inputBox, styles.h120]}
                value={value}
                placeholder="Symptoms"
              />
            )}
          />
          {errors.symptoms && <Text style={styles.error}>{errors.symptoms.message}</Text>}
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
  subtitle: {
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 24,
    textAlign: 'center',
  },
  title: {
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  inputTitle: {
    marginTop: 16,
    marginBottom: 6,
    color: Colors.TEXT_GRAY_2,
    fontWeight: '400',
    fontSize: 12,
  },
  inputBox: {
    backgroundColor: Colors.WHITE,
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
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
  mt22: {
    marginTop: 22,
  },
  mt20: {
    marginTop: 20,
  },
  w260: {
    width: 260,
  },
  h120: {
    height: 120,
  },
});
