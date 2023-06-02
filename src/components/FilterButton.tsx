import { TouchableOpacity } from "react-native"
import { Ionicons } from '@expo/vector-icons'; 
import Colors from "../constants/Colors";

const FilterButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity className="pr-4" onPress={onPress}>
      <Ionicons name="filter" size={24} color={Colors.ALMOST_WHITE} />
    </TouchableOpacity>
  )
}

export default FilterButton;
