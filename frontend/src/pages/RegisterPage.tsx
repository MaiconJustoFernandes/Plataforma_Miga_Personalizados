import { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Button,
  Box,
  Title,
  Paper,
  Text,
  Anchor,
  Progress,
  Center,
  Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
    return (
      <Text component="div" c={meets ? 'teal' : 'red'} mt={5} size="sm">
        <Center inline>
          <Text size="sm">{meets ? '✓' : '✗'}</Text>
          <Box ml={10}>{label}</Box>
        </Center>
      </Text>
    );
  }
  
  const requirements = [
    { re: /[0-9]/, label: 'Inclui um número' },
    { re: /[a-z]/, label: 'Inclui letra minúscula' },
    { re: /[A-Z]/, label: 'Inclui letra maiúscula' },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Inclui um símbolo especial' },
  ];

function getStrength(password: string) {
    let multiplier = password.length > 7 ? 0 : 1;
  
    requirements.forEach((requirement) => {
      if (!requirement.re.test(password)) {
        multiplier += 1;
      }
    });
  
    return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
  }

export function RegisterPage() {
  const { register, loading } = useAuth();
  const [password, setPassword] = useState('');
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(password)} />
  ));
  const strength = getStrength(password);
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';


  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      profile_type: 'OPERACIONAL', // Default value
    },
    validate: {
      name: (value) => (value.length < 2 ? 'O nome deve ter pelo menos 2 caracteres' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email inválido'),
      password: (value) => (getStrength(value) === 100 ? null : 'A senha não atende aos requisitos'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    await register(values);
  };

  return (
    <Box style={{ maxWidth: 480, margin: 'auto', marginTop: 100 }}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Stack>
            <Title ta="center" order={2}>
            Criar Nova Conta
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
            Já tem uma conta?{' '}
            <Anchor component={Link} to="/login" size="sm">
                Fazer login
            </Anchor>
            </Text>
        </Stack>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Nome"
            placeholder="Seu nome"
            required
            {...form.getInputProps('name')}
          />
          <TextInput
            label="Email"
            placeholder="seu@email.com"
            required
            mt="md"
            {...form.getInputProps('email')}
          />
          
          <PasswordInput
            value={password}
            onChange={(event) => {
                const newPassword = event.currentTarget.value;
                setPassword(newPassword);
                form.setFieldValue('password', newPassword);
            }}
            placeholder="Sua senha"
            label="Senha"
            required
            mt="md"
          />

            <Progress color={color} value={strength} size={5} style={{ width: '100%', marginTop: 10 }} />
            {checks}


          <Button fullWidth mt="xl" type="submit" loading={loading} disabled={strength < 100}>
            Registrar
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
