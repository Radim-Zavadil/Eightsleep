
import Colors from '@/constants/Colors';

export function useThemeColor(
  props: { dark?: string },
  colorName: keyof typeof Colors
) {
  const colorFromProps = props.dark;
  return colorFromProps || Colors[colorName];
}
