import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from '@expo/vector-icons'; 

const ModalOption = ({
  text,
  selected,
  borderBottom,
  onPress
}: {
  text: string,
  selected: boolean,
  borderBottom?: boolean,
  onPress: () => void
}) => {
  return (
    <>
      <TouchableOpacity className="h-12 w-full items-center justify-center flex-row" onPress={onPress}>
        <Text>{text}</Text>
        {selected && 
          <View className="absolute right-7">
            <Ionicons name="checkmark" size={24} color="black" />
          </View>
        }
      </TouchableOpacity>
      {borderBottom && <View className="w-11/12 border-b border-gray-300"/>}
    </>
  )
}

export default ModalOption;