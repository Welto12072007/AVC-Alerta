-- Schema SQL para o banco de dados AVC Alerta
-- Execute este script no Supabase SQL Editor

-- Tabela de perfis dos usuários
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de registros de saúde
CREATE TABLE IF NOT EXISTS health_readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('bp', 'heartRate', 'weight')),
  value TEXT NOT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de contatos de emergência
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('personal', 'medical', 'emergency')),
  relation TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_health_readings_user_id ON health_readings(user_id);
CREATE INDEX IF NOT EXISTS idx_health_readings_type ON health_readings(type);
CREATE INDEX IF NOT EXISTS idx_health_readings_created_at ON health_readings(created_at);

CREATE INDEX IF NOT EXISTS idx_emergency_contacts_user_id ON emergency_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_type ON emergency_contacts(type);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- RLS (Row Level Security) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Policies para a tabela profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies para a tabela health_readings
CREATE POLICY "Users can view their own health readings" ON health_readings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health readings" ON health_readings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health readings" ON health_readings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health readings" ON health_readings
  FOR DELETE USING (auth.uid() = user_id);

-- Policies para a tabela emergency_contacts
CREATE POLICY "Users can view their own emergency contacts" ON emergency_contacts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own emergency contacts" ON emergency_contacts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own emergency contacts" ON emergency_contacts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own emergency contacts" ON emergency_contacts
  FOR DELETE USING (auth.uid() = user_id);

-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_readings_updated_at 
  BEFORE UPDATE ON health_readings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emergency_contacts_updated_at 
  BEFORE UPDATE ON emergency_contacts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados de exemplo (opcional)
-- Uncomment as linhas abaixo se quiser dados de exemplo

-- INSERT INTO profiles (id, name, email) VALUES 
-- ('550e8400-e29b-41d4-a716-446655440000', 'João Silva', 'joao@exemplo.com');

-- INSERT INTO health_readings (user_id, type, value, notes) VALUES 
-- ('550e8400-e29b-41d4-a716-446655440000', 'bp', '120/80', 'Pressão normal'),
-- ('550e8400-e29b-41d4-a716-446655440000', 'heartRate', '72', 'Frequência cardíaca em repouso');

-- INSERT INTO emergency_contacts (user_id, name, phone, type, relation) VALUES 
-- ('550e8400-e29b-41d4-a716-446655440000', 'Maria Silva', '(11) 99999-9999', 'personal', 'Esposa'),
-- ('550e8400-e29b-41d4-a716-446655440000', 'Dr. Carlos', '(11) 88888-8888', 'medical', 'Médico cardiologista');
