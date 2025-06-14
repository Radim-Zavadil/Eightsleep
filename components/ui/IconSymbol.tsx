import { MaterialIcons } from '@expo/vector-icons';
import { StyleProp, ViewStyle } from 'react-native';

type Props = {
  name: string;
  size: number;
  color: string;
  style?: StyleProp<ViewStyle>;
};

export function IconSymbol({ name, size, color, style }: Props) {
  return <MaterialIcons name={name as any} size={size} color={color} style={style} />;
}