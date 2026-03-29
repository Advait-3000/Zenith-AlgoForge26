import 'lucide-react-native';
import { StyleProp, ViewStyle } from 'react-native';

declare module 'lucide-react-native' {
  export interface LucideProps {
    color?: string;
    stroke?: string;
    fill?: string;
    strokeWidth?: number | string;
    size?: number | string;
    style?: StyleProp<ViewStyle>;
    absoluteStrokeWidth?: boolean;
    'data-testid'?: string;
  }
}
