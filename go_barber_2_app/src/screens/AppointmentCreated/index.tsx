import * as React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { StackNavigationProp } from '@react-navigation/stack';

import { AppStackParams } from '../../routes/app.routes';
import { upperCaseFirstLetter } from '../../utils/upperCaseFirstLetter';

import { Container, Title, Description, OkButton } from './styles';

const AppointmentCreated: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParams, 'AppointmentCreated'>>();
  const navigation =
    useNavigation<StackNavigationProp<AppStackParams, 'AppointmentCreated'>>();
  const { date, provider } = route.params;

  const formattedDate = React.useMemo(() => {
    return upperCaseFirstLetter(
      format(date, "EEEE', dia' dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'", {
        locale: ptBR,
      }),
    );
  }, [date]);

  const handleOk = React.useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Dashboard',
        },
      ],
    });
  }, [navigation]);

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />

      <Title bold>Agendamento concluído</Title>
      <Description>{`${formattedDate} com ${provider?.name}`}</Description>

      <OkButton onPress={handleOk}>Ok</OkButton>
    </Container>
  );
};

export default AppointmentCreated;
