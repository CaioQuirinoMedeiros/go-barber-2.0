/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable import/no-duplicates */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { RefreshControl } from 'react-native';

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

const AppointmentDatePicker: React.FC = () => {
  const { user } = useAuth();
  const route = useRoute<RouteProp<AppStackParams, 'AppointmentDatePicker'>>();
  const navigation = useNavigation();
  const { providerId } = route.params;

  const [selectedProvider, setSelectedProvider] = useState<string>(providerId);
  const [calendarDate, setCalendarDate] = useState(new Date());

  const [fetchingMonthAvailability, setFetchingMonthAvailability] = useState(
    false
  );
  const [, setFetchingDayAvailability] = useState(false);

  const calendarMonthText = useMemo(() => {
    return upperCaseFirstLetter(
      format(calendarDate, 'MMMM yyyy', { locale: ptBR })
    );
  }, [calendarDate]);

  const calendar = useMemo(() => {
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

  const minimumDate = useMemo(() => {
    const today = new Date();

    if (getHours(today) >= 17) {
      return addDays(today, 1);
    }

    return today;
  }, []);

  const [selectedDate, setSelectedDate] = useState(minimumDate);
  const [selectedHour, setSelectedHour] = useState(0);

  const [fetchingProviders, setFetchingProviders] = useState(false);

  const [providers, setProviders] = useState<Provider[]>([]);
  const [dayAvailability, setDayAvailability] = useState<DayAvailabilityItem[]>(
    []
  );
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);

  const selectedDateCalendarDateDifference = useMemo(() => {
    return isSameMonth(calendarDate, selectedDate)
      ? 0
      : differenceInDays(calendarDate, selectedDate);
  }, [calendarDate, selectedDate]);

  const getProviders = useCallback(async () => {
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

  const getProviderMonthAvailability = useCallback(async () => {
    try {
      setFetchingMonthAvailability(true);
      const { data } = await api.getProviderMonthAvailability({
        providerId: selectedProvider,
        year: getYear(calendarDate),
        month: getMonth(calendarDate) + 1,
      });
      setMonthAvailability(data);
    } catch {
      alert({ title: 'Erro', message: 'Erro ao buscar dias disponíveis' });
    } finally {
      setFetchingMonthAvailability(false);
    }
  }, [calendarDate, selectedProvider]);

  const getProviderDayAvailability = useCallback(async () => {
    try {
      setFetchingDayAvailability(true);
      const { data } = await api.getProviderDayAvailability({
        providerId: selectedProvider,
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
  }, [selectedDate, selectedProvider]);

  useEffect(() => {
    getProviders();
  }, [getProviders]);

  useEffect(() => {
    getProviderMonthAvailability();
  }, [getProviderMonthAvailability]);

  useEffect(() => {
    getProviderDayAvailability();
  }, [getProviderDayAvailability]);

  const handleSelectProvider = useCallback((provider: Provider) => {
    setSelectedProvider(provider.id);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);

      date.setHours(selectedHour);
      date.setMinutes(0);

      await api.createAppointment({
        provider_id: selectedProvider,
        date,
      });

      navigation.navigate('AppointmentCreated', { date: date.getTime() });
    } catch (err) {
      alert({
        title: 'Erro ao criar agendamento',
        message:
          'Ocorreu um erro ao tentar criar o agendamento, tente novamente!',
      });
    }
  }, [selectedProvider, selectedDate, selectedHour, navigation]);

  const morningAvailability = useMemo(() => {
    return dayAvailability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => ({
        hour,
        hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        available,
      }));
  }, [dayAvailability]);

  const afternoonAvailability = useMemo(() => {
    return dayAvailability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => ({
        hour,
        hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        available,
      }));
  }, [dayAvailability]);

  return (
    <Container
      safe
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
      }
    >
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
          data={providers}
          keyExtractor={provider => provider.id}
          renderItem={({ item: provider }) => (
            <ProviderContainer
              selected={provider.id === selectedProvider}
              onPress={() => {
                handleSelectProvider(provider);
              }}
            >
              <ProviderAvatar
                size={32}
                nome={provider.name}
                source={{ uri: provider.avatar_url || undefined }}
              />
              <ProviderName bold selected={provider.id === selectedProvider}>
                {provider.name}
              </ProviderName>
            </ProviderContainer>
          )}
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
                          active={isSameDay(date, selectedDate)}
                        >
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
                key={hourFormatted}
              >
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
                key={hourFormatted}
              >
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
        enabled={!!selectedDate && !!selectedProvider && !!selectedHour}
      >
        Agendar
      </CreateAppointmentButton>
    </Container>
  );
};

export default AppointmentDatePicker;
