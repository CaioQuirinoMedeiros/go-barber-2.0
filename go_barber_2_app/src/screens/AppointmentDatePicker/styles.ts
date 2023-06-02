import styled from 'styled-components/native';
import { Dimensions, FlatList } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import {
  Provider,
  HourTextProps,
  HourProps,
  ProviderNameProps,
  ProviderContainerProps,
  WeekLetterProps,
  DateItemProps,
  CalendarIconProps,
} from './types';

import MyScreen from '../../components/Screen';
import MyText from '../../components/Text';
import MyButtonContainer from '../../components/ButtonContainer';
import MyAvatar from '../../components/Avatar';
import MyButton from '../../components/Button';
import MyIconButton from '../../components/IconButton';

const { width: screenWidth } = Dimensions.get('window');

const marginBetweenitems = 10;
const calendarContentPadding = 8;
const calendarContainerMargin = 16;
const itemSize =
  (screenWidth -
    2 * calendarContainerMargin -
    2 * calendarContentPadding -
    6 * marginBetweenitems) /
  7;

export const Container = styled(MyScreen)``;

export const Header = styled.View`
  padding: 24px;
  background: #28262e;

  flex-direction: row;
  align-items: center;
`;

export const BackButton = styled.TouchableOpacity`
  padding: 16px 16px 16px 24px;
  margin-left: -24px;
`;

export const HeaderTitle = styled(MyText)`
  color: #f4ede8;
  font-size: 20px;
  line-height: 28px;
`;

export const UserAvatar = styled(MyAvatar)`
  margin-left: auto;
`;

export const ProvidersListContainer = styled.View`
  height: 112px;
`;

export const ProvidersList = styled(FlatList<Provider>).attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
})``;

export const ProviderContainer = styled(
  MyButtonContainer,
)<ProviderContainerProps>`
  flex-direction: row;
  align-items: center;
  padding: 8px 12px;
  margin-right: 16px;

  background: ${props => (props.selected ? '#FF9000' : '#3e3b47')};
  border-radius: 10px;
`;

export const ProviderAvatar = styled(MyAvatar)``;

export const ProviderName = styled(MyText)<ProviderNameProps>`
  font-size: 16px;
  margin-left: 8px;
  color: ${props => (props.selected ? '#232129' : '#f4ede8')};
`;

export const Calendar = styled.View``;

export const Title = styled(MyText)`
  color: #f4ede8;
  font-size: 24px;
  margin: 0 24px 24px;
`;

export const Schedule = styled.View`
  padding: 24px 0 16px;
`;

export const Section = styled.View`
  margin-bottom: 24px;
`;

export const SectionTitle = styled(MyText)`
  font-size: 18px;
  color: #999591;
  margin: 0 24px 12px;
`;

export const SectionContent = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    paddingHorizontal: 24,
  },
})``;

export const Hour = styled(RectButton).attrs((props: HourProps) => ({
  enabled: props.available,
}))<HourProps>`
  padding: 12px;
  background: ${props => (props.selected ? '#FF9000' : '#3e3b47')};
  border-radius: 10px;
  margin-right: 8px;

  opacity: ${props => (props.available ? 1 : 0.3)};
`;

export const HourText = styled(MyText)<HourTextProps>`
  color: ${props => (props.selected ? '#232129' : '#f4ede8')};
  font-size: 18px;
`;

export const CreateAppointmentButton = styled(MyButton)`
  margin: 0 24px 24px;
`;

export const CalendarContainer = styled.View`
  border-radius: 10px;
  background: #28262e;
  overflow: hidden;
  margin: 0 ${calendarContainerMargin}px;
`;

export const CalendarHeader = styled.View`
  flex-direction: row;
  background: #3e3b47;
  align-items: center;
  justify-content: space-between;
  height: 50px;
`;

export const CalendarIconButton = styled(MyIconButton).attrs(
  ({ highlight }: CalendarIconProps) => ({
    color: highlight ? '#ff9000' : undefined,
  }),
)`
  align-self: stretch;
  padding: 0 16px;
`;

export const CalendarMonth = styled(MyText)`
  color: #f4ede8;
`;

export const CalendarContent = styled.View`
  flex-direction: row;
  padding: ${calendarContentPadding}px;
  position: relative;
`;

export const CalendarColumn = styled.View`
  flex: 1;
  align-items: center;
`;

export const CalendarWeekLetter = styled(MyText)`
  color: ${({ active }: WeekLetterProps) => (active ? '#FF9000' : '#666360')};
  font-size: 16px;
  margin-bottom: 18px;
`;

export const CalendarDateItem = styled(MyButton).attrs(
  ({ disabled, active }: DateItemProps) => ({
    textProps: {
      style: { color: active ? '#232129' : '#F4EDE8', fontSize: 16 },
      bold: false,
    },
    enabled: !disabled,
  }),
)`
  width: ${itemSize}px;
  height: ${itemSize}px;
  padding: 0;
  margin-bottom: ${marginBetweenitems}px;
  background: ${({ disabled, active }: DateItemProps) =>
    disabled ? 'transparent' : active ? '#ff9000' : '#3E3B47'};
`;

export const EmptyCalendarItem = styled.View`
  width: ${itemSize}px;
  height: ${itemSize}px;
  margin-bottom: ${marginBetweenitems}px;
`;

export const LoadingCalendar = styled.ActivityIndicator.attrs({
  size: 50,
  color: '#ff9000',
})`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-17px);
`;
