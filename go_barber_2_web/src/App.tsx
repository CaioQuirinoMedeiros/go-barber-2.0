import AppProvider from './hooks';
import GlobalStyle from './styles/global';
import { RootRouter } from './routes';

function App() {
  return (
    <AppProvider>
      <RootRouter /> <GlobalStyle />
    </AppProvider>
  );
}

export default App;
