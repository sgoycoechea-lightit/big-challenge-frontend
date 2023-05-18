import React, { useContext, useState } from 'react';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";

import { instance as axiosInstance } from '../helpers/axiosConfig';
import getErrorMessage from '../helpers/getErrorMessage';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../Root';
import Colors from '../constants/Colors';
import { AuthContext, AuthContextType } from '../context/AuthProvider';


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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { user, setUser, isUserInfoComplete } = useContext<AuthContextType>(AuthContext);
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
          <Text style={styles.inputTitle} >Phone number</Text>
          <Controller
            control={control}
            name="phone_number"
            defaultValue={user?.phone_number?.toString() ?? ""}
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={onChange}
                style={styles.inputBox}
                value={value}
                placeholder="Phone number"
              />
            )}
          />
          {errors.phone_number && <Text style={styles.error}>{errors.phone_number.message}</Text>}
          <Text style={styles.inputTitle} >Weight</Text>
          <Controller
            control={control}
            name="weight"
            defaultValue={user?.weight?.toString() ?? ""}
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={onChange}
                style={styles.inputBox}
                value={value.toString()}
                placeholder="Weight"
              />
            )}
          />
          {errors.weight && <Text style={styles.error}>{errors.weight.message}</Text>}
          <Text style={styles.inputTitle} >Height</Text>
          <Controller
            control={control}
            name="height"
            defaultValue={user?.height?.toString() ?? ""}
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={onChange}
                style={styles.inputBox}
                value={value.toString()}
                placeholder="Height"
              />
            )}
          />
          {errors.height && <Text style={styles.error}>{errors.height.message}</Text>}
          <Text style={styles.inputTitle} >Other information</Text>
          <Controller
            control={control}
            name="other_information"
            defaultValue={user?.other_information ?? ""}
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={onChange}
                multiline={true}
                style={[styles.inputBox, styles.h120]}
                value={value}
                placeholder="Other info"
              />
            )}
          />
          {errors.other_information && <Text style={styles.error}>{errors.other_information.message}</Text>}
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
  mr18: {
    marginRight: 18,
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
