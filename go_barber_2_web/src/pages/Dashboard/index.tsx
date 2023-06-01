import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { isToday, format, parseISO, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FiPower, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { DayPicker, DayModifiers } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import logoImage from '../../assets/logo.svg';
import Avatar from '../../components/Avatar';

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Calendar,
} from './styles';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  hourFormatted: string;
  user: {
    name: string;
    avatar_url: string;
  };
  past: boolean;
}

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setSelectedMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const { signOut, user } = useAuth();

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Dia' dd 'de' MMMM", { locale: ptBR });
  }, [selectedDate]);

  const selectedWeekDayAsText = useMemo(() => {
    return format(selectedDate, 'cccc', { locale: ptBR });
  }, [selectedDate]);

  const disabledDays = useMemo(() => {
    return monthAvailability
      .filter(monthDay => !monthDay.available)
      .map(monthDay => {
        return new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth(),
          monthDay.day,
        );
      });
  }, [monthAvailability, currentMonth]);

  const morningAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() < 12;
    });
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12;
    });
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    return appointments.find(appointment => {
      const appointmentDate = parseISO(appointment.date);
      console.log({
        appointmentDate,
        newDate: new Date(),
        after: isAfter(parseISO(appointment.date), new Date()),
      });
      return isAfter(parseISO(appointment.date), new Date());
    });
  }, [appointments]);

  console.log({ nextAppointment });

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setSelectedMonth(month);
  }, []);

  useEffect(() => {
    api
      .get(`providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then(response => {
        setMonthAvailability(response.data);
      });
  }, [currentMonth, user.id]);

  useEffect(() => {
    api
      .get<Appointment[]>('appointments/me', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        const appointmentsFormatted = response.data.map(appointment => {
          return {
            ...appointment,
            hourFormatted: format(parseISO(appointment.date), 'HH:mm'),
          };
        });
        setAppointments(appointmentsFormatted);
      });
  }, [selectedDate]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImage} alt="Go Barber" />
          <Profile>
            <Avatar src={user.avatar_url} name={user.name} />
            <div>
              <span>Bem-vindo</span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários agendados</h1>
          <p>
            {isToday(selectedDate) && <span>Hoje</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDayAsText}</span>
          </p>

          {nextAppointment && (
            // {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Agendamento a seguir</strong>
              <div>
                <Avatar
                  size={80}
                  src={nextAppointment.user.avatar_url}
                  name={nextAppointment.user.name}
                />
                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment.hourFormatted}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>Manhã</strong>
            {!morningAppointments.length && (
              <p>Nenhum agendamento neste período</p>
            )}
            {morningAppointments.map(appointment => (
              <Appointment key={appointment.id} past={appointment.past}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>
                <div>
                  <Avatar
                    size={56}
                    name={appointment.user.name}
                    src={appointment.user.avatar_url}
                  />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
          <Section>
            <strong>Tarde</strong>
            {!afternoonAppointments.length && (
              <p>Nenhum agendamento neste período</p>
            )}
            {afternoonAppointments.map(appointment => (
              <Appointment key={appointment.id} past={appointment.past}>
                <span>
                  <FiClock />
                  {appointment.hourFormatted}
                </span>
                <div>
                  <Avatar
                    size={56}
                    name={appointment.user.name}
                    src={appointment.user.avatar_url}
                  />
                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            // weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            selected={selectedDate}
            // months={[
            //   'Janeiro',
            //   'Fevereiro',
            //   'Março',
            //   'Abril',
            //   'Maio',
            //   'Junho',
            //   'Julho',
            //   'Agosto',
            //   'Setembro',
            //   'Outubro',
            //   'Novembro',
            //   'Dezembro'
            // ]}
            onMonthChange={handleMonthChange}
            fromMonth={new Date()}
            disabled={[{ dayOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{ available: { dayOfWeek: [1, 2, 3, 4, 5] } }}
            onDayClick={handleDateChange}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
