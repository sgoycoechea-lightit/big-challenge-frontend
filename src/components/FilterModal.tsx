import { Modal, View } from "react-native"
import ModalOption from "./ModalOption";

export enum FilterOption {
  All = 'ALL',
  Pending = 'PENDING',
  InProgress = 'IN_PROGRESS',
  Done = 'DONE',
}

const FilterModal = ({
  isModalVisible,
  filterOption,
  handleFilterChange,
  handleModalClose,
}: {
  isModalVisible: boolean,
  filterOption: FilterOption,
  handleFilterChange: (option: FilterOption) => void,
  handleModalClose: () => void,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
    >
      <View className="flex-1 justify-end items-center px-6 pb-12">
        <View className="m-5 bg-gray-50 items-center w-full justify-center rounded-lg border border-gray-400 shadow-2xl">
          <ModalOption
            text="All submissions"
            selected={filterOption == FilterOption.All}
            onPress={() => handleFilterChange(FilterOption.All)}
            borderBottom
          />
          <ModalOption
            text="Pending"
            selected={filterOption == FilterOption.Pending}
            onPress={() => handleFilterChange(FilterOption.Pending)}
            borderBottom
          />
          <ModalOption
            text="In Progress"
            selected={filterOption == FilterOption.InProgress}
            onPress={() => handleFilterChange(FilterOption.InProgress)}
            borderBottom
          />
          <ModalOption
            text="Done"
            selected={filterOption == FilterOption.Done}
            onPress={() => handleFilterChange(FilterOption.Done)}
          />
        </View>
        <View className=" bg-gray-50 items-center w-full justify-center rounded-lg border border-gray-400 shadow-2xl">
          <ModalOption text="Close" selected={false} onPress={handleModalClose} />
        </View>
      </View>
    </Modal>
  )
}

export default FilterModal;
