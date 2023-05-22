import React from 'react';
import { Text, TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { Control, Controller, FieldError } from 'react-hook-form';
import Colors from '../constants/Colors';


type InputFieldProps = {
  error?: FieldError;
  control: Control<any, any>;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  bigTextBox?: boolean;
  inputTitle?: string;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  keyboardType?: TextInputProps['keyboardType'];
};

export default function InputField({
  error,
  control,
  name,
  defaultValue = '',
  placeholder = '',
  secureTextEntry = false,
  multiline = false,
  bigTextBox = false,
  inputTitle = undefined,
  autoCapitalize = undefined,
  keyboardType = undefined,
}: InputFieldProps) {


  const textInputStyle = [
    styles.inputBox,
    bigTextBox && styles.h120,
    inputTitle == undefined && styles.mt16]
    .filter(Boolean)

  return (
    <>
      {(inputTitle != undefined) && <Text style={styles.inputTitle} >{inputTitle}</Text>}
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              onChangeText={onChange}
              style={textInputStyle}
              value={value}
              placeholder={placeholder}
              secureTextEntry={secureTextEntry}
              autoCapitalize={autoCapitalize}
              multiline={multiline}
              keyboardType={keyboardType}
            />
            {error && <Text style={styles.error}>{error.message}</Text>}
          </>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  inputBox: {
    backgroundColor: Colors.WHITE,
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
  error: {
    color: 'red',
  },
  inputTitle: {
    marginTop: 16,
    marginBottom: 6,
    color: Colors.TEXT_GRAY_2,
    fontWeight: '400',
    fontSize: 12,
  },
  h120: {
    height: 120,
  },
  mt16: {
    marginTop: 16,
  },
});
  