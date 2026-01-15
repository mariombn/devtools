import { useState } from 'react';
import {
  Box,
  Grid,
  Button,
  Paper,
  FormControlLabel,
  FormGroup,
  Checkbox,
  TextField,
  Typography,
  Stack,
} from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { PageTitle } from '../../components/Common/PageTitle';
import { GeneratorCard } from './GeneratorCard';
import { generateCPF } from '../../utils/generators/cpfGenerator';
import { generateCNPJ } from '../../utils/generators/cnpjGenerator';
import { generatePhone } from '../../utils/generators/phoneGenerator';
import type { PhoneType } from '../../utils/generators/phoneGenerator';
import { generateCEP } from '../../utils/generators/cepGenerator';
import { generateName } from '../../utils/generators/nameGenerator';
import { generateEmail } from '../../utils/generators/emailGenerator';
import { generatePassword } from '../../utils/generators/passwordGenerator';

export function DataGenerator() {
  const [cpf, setCpf] = useState('');
  const [cpfFormatted, setCpfFormatted] = useState(true);

  const [cnpj, setCnpj] = useState('');
  const [cnpjFormatted, setCnpjFormatted] = useState(true);

  const [phone, setPhone] = useState('');
  const [phoneType, setPhoneType] = useState<PhoneType>('mobile');
  const [phoneWithDDD, setPhoneWithDDD] = useState(true);
  const [phoneFormatted, setPhoneFormatted] = useState(true);

  const [cep, setCep] = useState('');
  const [cepFormatted, setCepFormatted] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(12);
  const [passwordOptions, setPasswordOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    special: true,
  });

  const handleGenerateCpf = () => setCpf(generateCPF(cpfFormatted));
  const handleGenerateCnpj = () => setCnpj(generateCNPJ(cnpjFormatted));
  const handleGeneratePhone = () =>
    setPhone(
      generatePhone({
        type: phoneType,
        withDDD: phoneWithDDD,
        formatted: phoneFormatted,
      })
    );
  const handleGenerateCep = () => setCep(generateCEP(cepFormatted));
  const handleGenerateName = () => {
    const newName = generateName();
    setName(newName);
    setEmail(generateEmail(newName));
  };
  const handleGenerateEmail = () => setEmail(generateEmail());
  const handleGeneratePassword = () =>
    setPassword(generatePassword({ length: passwordLength, ...passwordOptions }));

  const handleGenerateAll = () => {
    handleGenerateCpf();
    handleGenerateCnpj();
    handleGeneratePhone();
    handleGenerateCep();
    handleGenerateName();
    handleGeneratePassword();
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <PageTitle>Data Generator</PageTitle>
        <Button variant="contained" size="large" onClick={handleGenerateAll}>
          Generate All
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {/* CPF */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={cpfFormatted}
                  onChange={(e) => setCpfFormatted(e.target.checked)}
                />
              }
              label="Formatted"
            />
          </Paper>
          <GeneratorCard title="CPF" value={cpf} onGenerate={handleGenerateCpf} icon={<BadgeIcon />} />
        </Grid>

        {/* CNPJ */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={cnpjFormatted}
                  onChange={(e) => setCnpjFormatted(e.target.checked)}
                />
              }
              label="Formatted"
            />
          </Paper>
          <GeneratorCard
            title="CNPJ"
            value={cnpj}
            onGenerate={handleGenerateCnpj}
            icon={<BusinessIcon />}
          />
        </Grid>

        {/* Phone */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={phoneType === 'mobile'}
                    onChange={(e) => setPhoneType(e.target.checked ? 'mobile' : 'landline')}
                  />
                }
                label="Mobile"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={phoneWithDDD}
                    onChange={(e) => setPhoneWithDDD(e.target.checked)}
                  />
                }
                label="With DDD"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={phoneFormatted}
                    onChange={(e) => setPhoneFormatted(e.target.checked)}
                  />
                }
                label="Formatted"
              />
            </FormGroup>
          </Paper>
          <GeneratorCard
            title="Phone"
            value={phone}
            onGenerate={handleGeneratePhone}
            icon={<PhoneIcon />}
          />
        </Grid>

        {/* CEP */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={cepFormatted}
                  onChange={(e) => setCepFormatted(e.target.checked)}
                />
              }
              label="Formatted"
            />
          </Paper>
          <GeneratorCard
            title="CEP"
            value={cep}
            onGenerate={handleGenerateCep}
            icon={<LocationOnIcon />}
          />
        </Grid>

        {/* Name */}
        <Grid size={{ xs: 12, md: 6 }}>
          <GeneratorCard
            title="Name"
            value={name}
            onGenerate={handleGenerateName}
            icon={<PersonIcon />}
          />
        </Grid>

        {/* Email */}
        <Grid size={{ xs: 12, md: 6 }}>
          <GeneratorCard
            title="Email"
            value={email}
            onGenerate={handleGenerateEmail}
            icon={<EmailIcon />}
          />
        </Grid>

        {/* Password */}
        <Grid size={{ xs: 12 }}>
          <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Password Options
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                label="Length"
                type="number"
                value={passwordLength}
                onChange={(e) => setPasswordLength(Number(e.target.value))}
                size="small"
                sx={{ width: 100 }}
                inputProps={{ min: 4, max: 64 }}
              />
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={passwordOptions.uppercase}
                      onChange={(e) =>
                        setPasswordOptions({ ...passwordOptions, uppercase: e.target.checked })
                      }
                    />
                  }
                  label="A-Z"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={passwordOptions.lowercase}
                      onChange={(e) =>
                        setPasswordOptions({ ...passwordOptions, lowercase: e.target.checked })
                      }
                    />
                  }
                  label="a-z"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={passwordOptions.numbers}
                      onChange={(e) =>
                        setPasswordOptions({ ...passwordOptions, numbers: e.target.checked })
                      }
                    />
                  }
                  label="0-9"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={passwordOptions.special}
                      onChange={(e) =>
                        setPasswordOptions({ ...passwordOptions, special: e.target.checked })
                      }
                    />
                  }
                  label="!@#$"
                />
              </FormGroup>
            </Stack>
          </Paper>
          <GeneratorCard
            title="Password"
            value={password}
            onGenerate={handleGeneratePassword}
            icon={<LockIcon />}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
