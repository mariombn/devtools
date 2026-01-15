import { useState } from 'react';
import { Container, Typography, Button, Stack, Paper, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';

function App() {
  const [count, setCount] = useState(0);

  return (
    // Container centraliza o conteúdo e dá margem lateral
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      
      {/* Paper cria um fundo branco com leve sombra (estilo cartão) */}
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          Olá, Material UI!
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          Este é um exemplo simples rodando React + TS + MUI.
          <br />
          Contador atual: <strong>{count}</strong>
        </Typography>

        {/* Stack organiza elementos em linha ou coluna com espaçamento (gap) */}
        <Box display="flex" justifyContent="center">
            <Stack direction="row" spacing={2}>
            <Button 
                variant="contained" 
                color="success" 
                startIcon={<SendIcon />}
                onClick={() => setCount((c) => c + 1)}
            >
                Aumentar
            </Button>

            <Button 
                variant="outlined" 
                color="error" 
                startIcon={<DeleteIcon />}
                onClick={() => setCount(0)}
            >
                Zerar
            </Button>
            </Stack>
        </Box>
        
      </Paper>
    </Container>
  );
}

export default App;