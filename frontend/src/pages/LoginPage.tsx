import {
  TextInput,
  PasswordInput,
  Button,
  Box,
  Title,
  Paper,
  Text,
  Group,
  Anchor,
  LoadingOverlay,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const { login, loading } = useAuth();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value: string) => (/^\S+@\S+$/.test(value) ? null : 'Email inválido'),
      password: (value: string) => (value.length >= 6 ? null : 'A senha deve ter pelo menos 6 caracteres'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    await login(values);
  };

  return (
    <Box style={{ maxWidth: 480, margin: 'auto', marginTop: 100 }}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <LoadingOverlay visible={loading} />
        <Title ta="center" order={2}>
          Bem-vindo de volta!
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Não tem uma conta ainda?{' '}
          <Anchor component={Link} to="/register" size="sm">
            Criar conta
          </Anchor>
        </Text>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder="seu@email.com"
            required
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Senha"
            placeholder="Sua senha"
            required
            mt="md"
            {...form.getInputProps('password')}
          />
          <Group justify="space-between" mt="lg">
            {/* <Checkbox label="Lembrar-me" /> */}
            <Anchor component="button" size="sm">
              Esqueceu a senha?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Entrar
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
