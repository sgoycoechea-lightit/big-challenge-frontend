import React, { useContext, useState } from 'react';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useForm, type SubmitHandler, FieldValues } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";

import { instance as axiosInstance } from '../helpers/axiosConfig';
import getErrorMessage from '../helpers/getErrorMessage';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../Root';
import Colors from '../constants/Colors';
import { AuthContext } from '../context/AuthProvider';
import InputField from '../components/InputField';


const schema = z.object({
  phone_number: z
    .string()
    .min(1, { message: "Phone is required" })
    .regex(/^[0-9]+$/, { message: "Invalid phone number" }),
  weight: z
    .string()
    .min(1, { message: "Weight is required" })
    .regex(/^[0-9]+(.[0-9]+)?$/, { message: "Invalid weight" }),
  height: z
    .string()
    .min(1, { message: "Height is required" })
    .regex(/^[0-9]+(.[0-9]+)?$/, { message: "Invalid height" }),
  other_information: z
    .string()
    .max(1023, { message: "Other info is too long" })
});

type PatientInfoFormData = z.infer<typeof schema>;

export default function PatientInfoScreen({ navigation }: DrawerScreenProps<DrawerParamList, 'PatientInfo'>) {
  const { user, setUser, isUserInfoComplete } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
    
  } = useForm<PatientInfoFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<PatientInfoFormData> = (data) => {
    setIsLoading(true);
    axiosInstance
      .put('/update', data)
      .then(response => {
        setApiError(null);
        setUser({
          ...user,
          ...response.data.data,
        });
        navigation.navigate('HomeStack', { screen: 'Home' });
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
        {!isUserInfoComplete() && (<Text style={[styles.subtitle, styles.mt22]}>You need to complete your profile before adding a submission</Text>)}
        <View style={styles.mt20}>
          {apiError && <Text style={styles.error}>{apiError}</Text>}
          {errors.root && <Text style={styles.error}>{errors.root.message}</Text>}
          <InputField
            error = {errors.phone_number}
            control = {control}
            name = 'phone_number'
            placeholder = 'Phone number'
            inputTitle = 'Phone number'
            defaultValue={user?.phone_number?.toString() ?? ""}
          />
          <InputField
            error = {errors.weight}
            control = {control}
            name = 'weight'
            placeholder = 'Weight'
            inputTitle = 'Weight'
            defaultValue={user?.weight?.toString() ?? ""}
          />
          <InputField
            error = {errors.height}
            control = {control}
            name = 'height'
            placeholder = 'Height'
            inputTitle = 'Height'
            defaultValue={user?.height?.toString() ?? ""}
          />
          <InputField
            error = {errors.other_information}
            control = {control}
            name = 'other_information'
            placeholder = 'Other information'
            inputTitle = 'Other information'
            defaultValue={user?.other_information ?? ""}
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
          <Text style={styles.buttonText}>Update profile</Text>
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
});
