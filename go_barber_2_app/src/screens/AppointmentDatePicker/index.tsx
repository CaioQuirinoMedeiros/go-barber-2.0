import * as React from 'react';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  getWeekOfMonth,
  startOfMonth,
  getMonth,
  getDate,
  getYear,
  isSameDay,
  subMonths,
  addMonths,
  getHours,
  addDays,
  isSameMonth,
  differenceInDays,
} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { StackNavigationProp } from '@react-navigation/stack';
import { RefreshControl, ListRenderItemInfo } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';

import { upperCaseFirstLetter } from '../../utils/upperCaseFirstLetter';
import api from '../../services/api';
import alert from '../../utils/alert';
import { useAuth } from '../../hooks/auth';
import { AppStackParams } from '../../routes/app.routes';

import { DayAvailabilityItem, MonthAvailabilityItem, Provider } from './types';
import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CalendarContainer,
  CalendarHeader,
  CalendarIconButton,
  CalendarMonth,
  CalendarColumn,
  CalendarContent,
  CalendarWeekLetter,
  CalendarDateItem,
  EmptyCalendarItem,
  LoadingCalendar,
} from './styles';

const minimumDate = () => {
  const today = new Date();

  if (getHours(today) >= 17) {
    return addDays(today, 1);
  }

  return today;
};

const AppointmentDatePicker: React.FC = () => {
  const { user } = useAuth();
  const route = useRoute<RouteProp<AppStackParams, 'AppointmentDatePicker'>>();
  const navigation =
    useNavigation<
      StackNavigationProp<AppStackParams, 'AppointmentDatePicker'>
    >();
  const { providerId } = route.params;

  const [selectedProviderId, setSelectedProviderId] =
    React.useState<string>(providerId);
  const [calendarDate, setCalendarDate] = React.useState(new Date());

  const [fetchingMonthAvailability, setFetchingMonthAvailability] =
    React.useState(false);
  const [, setFetchingDayAvailability] = React.useState(false);

  const [selectedDate, setSelectedDate] = React.useState(minimumDate());
  const [selectedHour, setSelectedHour] = React.useState(0);

  const [fetchingProviders, setFetchingProviders] = React.useState(false);

  const [providers, setProviders] = React.useState<Provider[]>([]);
  const [dayAvailability, setDayAvailability] = React.useState<
    DayAvailabilityItem[]
  >([]);
  const [monthAvailability, setMonthAvailability] = React.useState<
    MonthAvailabilityItem[]
  >([]);

  const selectedProvider = React.useMemo(() => {
    return providers.find(provider => provider.id === selectedProviderId);
  }, [providers, selectedProviderId]);

  const calendarMonthText = React.useMemo(() => {
    return upperCaseFirstLetter(
      format(calendarDate, 'MMMM yyyy', { locale: ptBR }),
    );
  }, [calendarDate]);

  const calendar = React.useMemo(() => {
    const daysOfMonth = eachDayOfInterval({
      start: startOfMonth(calendarDate),
      end: endOfMonth(calendarDate),
    });

    const calendarObject = daysOfMonth.reduce((acc, dayOfMonth) => {
      const weekDay = getDay(dayOfMonth);
      const weekOfMonth = getWeekOfMonth(dayOfMonth);

      return {
        ...acc,
        [weekDay]: {
          0: null,
          ...acc[weekDay],
          [weekOfMonth - 1]: dayOfMonth,
        },
      };
    }, {} as { [weekDayKey: number]: { [weekKey: number]: Date | null } });

    return Object.keys(calendarObject).map(weekDay => {
      const weekDayObject = calendarObject[Number(weekDay)];
      const weekDayArray = Object.keys(weekDayObject);

      const days = weekDayArray.map(week => {
        return weekDayObject[Number(week)];
      });

      return days;
    });
  }, [calendarDate]);

  const selectedDateCalendarDateDifference = React.useMemo(() => {
    return isSameMonth(calendarDate, selectedDate)
      ? 0
      : differenceInDays(calendarDate, selectedDate);
  }, [calendarDate, selectedDate]);

  const getProviders = React.useCallback(async () => {
    try {
      setFetchingProviders(true);
      const { data } = await api.getProviders();
      setProviders(data);
    } catch {
      alert({ title: 'Erro', message: 'Erro ao buscar lista de provedores' });
    } finally {
      setFetchingProviders(false);
    }
  }, []);

  const getProviderMonthAvailability = React.useCallback(async () => {
    try {
      setFetchingMonthAvailability(true);
      const { data } = await api.getProviderMonthAvailability({
        providerId: selectedProviderId,
        year: getYear(calendarDate),
        month: getMonth(calendarDate) + 1,
      });
      setMonthAvailability(data);
    } catch {
      alert({ title: 'Erro', message: 'Erro ao buscar dias disponíveis' });
    } finally {
      setFetchingMonthAvailability(false);
    }
  }, [calendarDate, selectedProviderId]);

  const getProviderDayAvailability = React.useCallback(async () => {
    try {
      setFetchingDayAvailability(true);
      const { data } = await api.getProviderDayAvailability({
        providerId: selectedProviderId,
        year: getYear(selectedDate),
        month: getMonth(selectedDate) + 1,
        day: getDate(selectedDate),
      });
      setDayAvailability(data);
      setSelectedHour(0);
    } catch {
      alert({ title: 'Erro', message: 'Erro ao buscar dias disponíveis' });
    } finally {
      setFetchingDayAvailability(false);
    }
  }, [selectedDate, selectedProviderId]);

  React.useEffect(() => {
    getProviders();
  }, [getProviders]);

  React.useEffect(() => {
    getProviderMonthAvailability();
  }, [getProviderMonthAvailability]);

  React.useEffect(() => {
    getProviderDayAvailability();
  }, [getProviderDayAvailability]);

  const handleSelectProvider = React.useCallback((provider: Provider) => {
    setSelectedProviderId(provider.id);
  }, []);

  const handleCreateAppointment = React.useCallback(async () => {
    try {
      const appointmentDate = new Date(selectedDate);

      appointmentDate.setHours(selectedHour);
      appointmentDate.setMinutes(0);

      await api.createAppointment({
        provider_id: selectedProviderId,
        date: appointmentDate,
      });

      navigation.navigate('AppointmentCreated', {
        date: appointmentDate.getTime(),
        provider: selectedProvider,
      });
    } catch (err) {
      alert({
        title: 'Erro ao criar agendamento',
        message:
          'Ocorreu um erro ao tentar criar o agendamento, tente novamente!',
      });
    }
  }, [
    selectedDate,
    selectedHour,
    selectedProviderId,
    navigation,
    selectedProvider,
  ]);

  const morningAvailability = React.useMemo(() => {
    return dayAvailability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => ({
        hour,
        hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        available,
      }));
  }, [dayAvailability]);

  const afternoonAvailability = React.useMemo(() => {
    return dayAvailability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => ({
        hour,
        hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        available,
      }));
  }, [dayAvailability]);

  const renderProvider = React.useCallback(
    (info: ListRenderItemInfo<Provider>) => {
      const { item: provider } = info;

      return (
        <ProviderContainer
          selected={provider.id === selectedProviderId}
          onPress={() => {
            handleSelectProvider(provider);
          }}>
          <ProviderAvatar
            size={32}
            nome={provider.name}
            source={{ uri: provider.avatar_url || undefined }}
          />
          <ProviderName bold selected={provider.id === selectedProviderId}>
            {provider.name}
          </ProviderName>
        </ProviderContainer>
      );
    },
    [handleSelectProvider, selectedProviderId],
  );

  return (
    <Container
      safeTop
      scroll
      statusBarProps={{ backgroundColor: '#28262e' }}
      refreshControl={
        <RefreshControl
          title="Carregando"
          refreshing={fetchingProviders}
          onRefresh={() => {
            getProviders();
            getProviderMonthAvailability();
            getProviderDayAvailability();
          }}
        />
      }>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <FeatherIcon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle bold>Cabelereiros</HeaderTitle>

        <UserAvatar
          size={56}
          nome={user.name}
          source={{ uri: user.avatar_url || undefined }}
        />
      </Header>
      <ProvidersListContainer>
        <ProvidersList
          data={providers as Provider[]}
          keyExtractor={provider => provider.id}
          renderItem={renderProvider}
        />
      </ProvidersListContainer>

      <Calendar>
        <Title bold>Escolha a data</Title>

        <CalendarContainer>
          <CalendarHeader>
            <CalendarIconButton
              // @ts-ignore
              highlight={selectedDateCalendarDateDifference > 0}
              name="arrow-left"
              onPress={() => {
                setFetchingMonthAvailability(true);
                setCalendarDate(subMonths(calendarDate, 1));
              }}
            />
            <CalendarMonth bold>{calendarMonthText}</CalendarMonth>
            <CalendarIconButton
              // @ts-ignore
              highlight={selectedDateCalendarDateDifference < 0}
              name="arrow-right"
              onPress={() => {
                setFetchingMonthAvailability(true);
                setCalendarDate(addMonths(calendarDate, 1));
              }}
            />
          </CalendarHeader>

          <CalendarContent>
            {fetchingMonthAvailability && <LoadingCalendar />}
            {calendar.map((week, index) => {
              const selectedWeekDay = getDay(selectedDate);
              const selectedMonth = getMonth(selectedDate);
              const weekDayLetter = week[1]
                ? format(week[1], 'E', { locale: ptBR })[0].toUpperCase()
                : '';

              const activeWeekLetter =
                selectedWeekDay === Number(index) &&
                selectedMonth === getMonth(calendarDate);

              return (
                <CalendarColumn key={index}>
                  <CalendarWeekLetter active={activeWeekLetter}>
                    {weekDayLetter}
                  </CalendarWeekLetter>
                  {week.map((date, i) => {
                    if (date && !fetchingMonthAvailability) {
                      const day = getDate(date);
                      const disabled = !monthAvailability.find(monthItem => {
                        return monthItem.day === day;
                      })?.available;

                      return (
                        <CalendarDateItem
                          key={date.toString()}
                          disabled={disabled || fetchingMonthAvailability}
                          onPress={() => {
                            setSelectedDate(date);
                          }}
                          active={isSameDay(date, selectedDate)}>
                          {day}
                        </CalendarDateItem>
                      );
                    }
                    return <EmptyCalendarItem key={i} />;
                  })}
                </CalendarColumn>
              );
            })}
          </CalendarContent>
        </CalendarContainer>
      </Calendar>

      <Schedule>
        <Title>Escolha o horário</Title>

        <Section>
          <SectionTitle>Manhã</SectionTitle>

          <SectionContent>
            {morningAvailability.map(({ hourFormatted, hour, available }) => (
              <Hour
                available={available}
                selected={hour === selectedHour}
                onPress={() => setSelectedHour(hour)}
                key={hourFormatted}>
                <HourText selected={hour === selectedHour}>
                  {hourFormatted}
                </HourText>
              </Hour>
            ))}
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>Tarde</SectionTitle>

          <SectionContent>
            {afternoonAvailability.map(({ hourFormatted, hour, available }) => (
              <Hour
                available={available}
                selected={hour === selectedHour}
                onPress={() => setSelectedHour(hour)}
                key={hourFormatted}>
                <HourText selected={hour === selectedHour}>
                  {hourFormatted}
                </HourText>
              </Hour>
            ))}
          </SectionContent>
        </Section>
      </Schedule>

      <CreateAppointmentButton
        onPress={handleCreateAppointment}
        enabled={!!selectedDate && !!selectedProviderId && !!selectedHour}>
        Agendar
      </CreateAppointmentButton>
    </Container>
  );
};

export default AppointmentDatePicker;
