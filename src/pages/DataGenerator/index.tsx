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
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>CPF</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={cpfFormatted}
                    onChange={(e) => setCpfFormatted(e.target.checked)}
                  />
                }
                label="Formatted"
              />
            </Box>
            <GeneratorCard title="" value={cpf} onGenerate={handleGenerateCpf} icon={<BadgeIcon />} />
          </Stack>
        </Grid>

        {/* CNPJ */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>CNPJ</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={cnpjFormatted}
                    onChange={(e) => setCnpjFormatted(e.target.checked)}
                  />
                }
                label="Formatted"
              />
            </Box>
            <GeneratorCard
              title=""
              value={cnpj}
              onGenerate={handleGenerateCnpj}
              icon={<BusinessIcon />}
            />
          </Stack>
        </Grid>

        {/* Phone */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>Phone</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={phoneType === 'mobile'}
                    onChange={(e) => setPhoneType(e.target.checked ? 'mobile' : 'landline')}
                  />
                }
                label="Mobile"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={phoneWithDDD}
                    onChange={(e) => setPhoneWithDDD(e.target.checked)}
                  />
                }
                label="DDD"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={phoneFormatted}
                    onChange={(e) => setPhoneFormatted(e.target.checked)}
                  />
                }
                label="Format"
              />
            </Box>
            <GeneratorCard
              title=""
              value={phone}
              onGenerate={handleGeneratePhone}
              icon={<PhoneIcon />}
            />
          </Stack>
        </Grid>

        {/* CEP */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>CEP</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={cepFormatted}
                    onChange={(e) => setCepFormatted(e.target.checked)}
                  />
                }
                label="Formatted"
              />
            </Box>
            <GeneratorCard
              title=""
              value={cep}
              onGenerate={handleGenerateCep}
              icon={<LocationOnIcon />}
            />
          </Stack>
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
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="subtitle2" sx={{ mr: 2 }}>Password</Typography>
              <TextField
                label="Length"
                type="number"
                value={passwordLength}
                onChange={(e) => setPasswordLength(Number(e.target.value))}
                size="small"
                sx={{ width: 90 }}
                inputProps={{ min: 4, max: 64 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
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
                    size="small"
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
                    size="small"
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
                    size="small"
                    checked={passwordOptions.special}
                    onChange={(e) =>
                      setPasswordOptions({ ...passwordOptions, special: e.target.checked })
                    }
                  />
                }
                label="!@#$"
              />
            </Box>
            <GeneratorCard
              title=""
              value={password}
              onGenerate={handleGeneratePassword}
              icon={<LockIcon />}
            />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
