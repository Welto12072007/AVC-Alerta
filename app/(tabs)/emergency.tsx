import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform, TextInput, Linking, Alert, Modal, ActivityIndicator } from 'react-native';
import { Phone, Plus, CreditCard as Edit2, Trash2, CircleAlert as AlertCircle, X } from 'lucide-react-native';
import emergencyContactsService, { EmergencyContact } from '@/services/emergencyContacts';

type ContactType = 'emergency' | 'medical' | 'personal';

interface Contact {
  id: number | string;
  name: string;
  number: string;
  type: ContactType;
  relation?: string;
  fixed?: boolean;
}

export default function EmergencyScreen() {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: 'SAMU', number: '192', type: 'emergency', fixed: true },
    { id: 2, name: 'Bombeiros', number: '193', type: 'emergency', fixed: true },
    { id: 3, name: 'Polícia', number: '190', type: 'emergency', fixed: true },
  ]);
  
  const [personalContacts, setPersonalContacts] = useState<Contact[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [newContact, setNewContact] = useState<Omit<Contact, 'id'>>({ name: '', number: '', relation: '', type: 'personal' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const handleAddContact = async () => {
    if (newContact.name.trim() === '' || newContact.number.trim() === '') {
      Alert.alert('Campos obrigatórios', 'Nome e número são obrigatórios');
      return;
    }
    
    setSaving(true);
    
    try {
      if (editingContact) {
        // Atualizar contato existente
        const updated = await emergencyContactsService.updateContact(
          editingContact.id as string,
          {
            name: newContact.name,
            phone_number: newContact.number,
            relation: newContact.relation,
            contact_type: newContact.type as 'personal' | 'medical',
          }
        );
        
        if (updated) {
          // Atualizar localmente
          setPersonalContacts(personalContacts.map(contact => 
            contact.id === editingContact.id 
              ? { ...newContact, id: contact.id, number: newContact.number } 
              : contact
          ));
          Alert.alert('Sucesso', 'Contato atualizado com sucesso!');
        } else {
          Alert.alert('Erro', 'Não foi possível atualizar o contato');
        }
        setEditingContact(null);
      } else {
        // Criar novo contato
        const created = await emergencyContactsService.createContact({
          name: newContact.name,
          phone_number: newContact.number,
          relation: newContact.relation,
          contact_type: newContact.type as 'personal' | 'medical',
        });
        
        if (created) {
          // Adicionar localmente
          setPersonalContacts([...personalContacts, {
            id: created.id!,
            name: created.name,
            number: created.phone_number,
            relation: created.relation,
            type: created.contact_type,
          }]);
          Alert.alert('Sucesso', 'Contato adicionado com sucesso!');
        } else {
          Alert.alert('Erro', 'Não foi possível adicionar o contato');
        }
      }
      
      setNewContact({ name: '', number: '', relation: '', type: 'personal' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Erro ao salvar contato:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao salvar o contato');
    } finally {
      setSaving(false);
    }
  };
  
  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setNewContact({
      name: contact.name,
      number: contact.number,
      relation: contact.relation || '',
      type: contact.type
    });
    setShowAddForm(true);
  };
  
  const handleDeleteContact = async (id: number | string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este contato?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await emergencyContactsService.deleteContact(id as string);
              if (success) {
                setPersonalContacts(personalContacts.filter(contact => contact.id !== id));
                Alert.alert('Sucesso', 'Contato excluído com sucesso!');
              } else {
                Alert.alert('Erro', 'Não foi possível excluir o contato');
              }
            } catch (error) {
              console.error('Erro ao excluir contato:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao excluir o contato');
            }
          },
        },
      ]
    );
  };
  
  const handleCallEmergency = async (number: string) => {
    // Remove caracteres não numéricos, mas mantém o + se existir no início
    const phoneNumber = number.replace(/[^\d+]/g, '');
    
    // No web, mostra alerta
    if (Platform.OS === 'web') {
      Alert.alert('📱 Ligar', `Número: ${phoneNumber}\n\nFuncionalidade disponível apenas em dispositivos móveis.`);
      return;
    }
    
    // Tenta abrir diretamente sem verificar primeiro (mais compatível com Expo Go)
    const url = `tel:${phoneNumber}`;
    
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Erro ao fazer ligação:', error);
      // Se falhar, tenta verificar o suporte
      try {
        const canOpen = await Linking.canOpenURL(url);
        if (!canOpen) {
          Alert.alert(
            'Não disponível', 
            `Não foi possível abrir o discador.\n\nNúmero: ${phoneNumber}\n\nTente discar manualmente.`,
            [{ text: 'OK' }]
          );
        }
      } catch (err) {
        Alert.alert(
          'Erro', 
          `Erro ao tentar abrir o discador.\n\nNúmero: ${phoneNumber}\n\nDisque manualmente este número.`,
          [{ text: 'OK' }]
        );
      }
    }
  };
  
  const handleCancel = () => {
    setShowAddForm(false);
    setEditingContact(null);
    setNewContact({ name: '', number: '', relation: '', type: 'personal' });
  };
  
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const contacts = await emergencyContactsService.getAllContacts();
      
      // Converter formato do Supabase para o formato local
      const formattedContacts: Contact[] = contacts.map(contact => ({
        id: contact.id!,
        name: contact.name,
        number: contact.phone_number,
        relation: contact.relation,
        type: contact.contact_type,
      }));
      
      setPersonalContacts(formattedContacts);
    } catch (error) {
      console.error('Erro ao carregar contatos:', error);
      Alert.alert('Erro', 'Não foi possível carregar seus contatos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.emergencyHeader}>
        <AlertCircle color="#FFFFFF" size={24} />
        <Text style={styles.emergencyHeaderText}>
          Em caso de suspeita de AVC, ligue imediatamente para o SAMU (192)
        </Text>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Carregando contatos...</Text>
        </View>
      ) : null}
      
      <Text style={styles.sectionTitle}>Serviços de Emergência</Text>
      <View style={styles.contactsContainer}>
        {contacts.filter(c => c.type === 'emergency').map(contact => (
          <TouchableOpacity 
            key={contact.id} 
            style={styles.emergencyContact}
            onPress={() => handleCallEmergency(contact.number)}
          >
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactNumber}>{contact.number}</Text>
            </View>
            <View style={styles.callButton}>
              <Phone color="#FFFFFF" size={20} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Contatos Médicos</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            setNewContact({ name: '', number: '', relation: '', type: 'medical' });
            setShowAddForm(true);
            setEditingContact(null);
          }}
        >
          <Plus color="#FFFFFF" size={20} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.contactsContainer}>
        {personalContacts.filter(c => c.type === 'medical').length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum contato médico adicionado</Text>
            <Text style={styles.emptySubtext}>
              Adicione seu neurologista, hospital ou outros profissionais de saúde
            </Text>
          </View>
        ) : (
          personalContacts.filter(c => c.type === 'medical').map(contact => (
            <View key={contact.id} style={styles.personalContact}>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactNumber}>{contact.number}</Text>
                {contact.relation && <Text style={styles.contactRelation}>{contact.relation}</Text>}
              </View>
              <View style={styles.contactActions}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => handleEditContact(contact)}
                >
                  <Edit2 color="#3B82F6" size={16} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeleteContact(contact.id)}
                >
                  <Trash2 color="#EF4444" size={16} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.callButtonSmall]}
                  onPress={() => handleCallEmergency(contact.number)}
                >
                  <Phone color="#FFFFFF" size={16} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Contatos Pessoais</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            setNewContact({ name: '', number: '', relation: '', type: 'personal' });
            setShowAddForm(true);
            setEditingContact(null);
          }}
        >
          <Plus color="#FFFFFF" size={20} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.contactsContainer}>
        {personalContacts.filter(c => c.type === 'personal').length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum contato pessoal adicionado</Text>
            <Text style={styles.emptySubtext}>
              Adicione familiares ou amigos próximos para emergências
            </Text>
          </View>
        ) : (
          personalContacts.filter(c => c.type === 'personal').map(contact => (
            <View key={contact.id} style={styles.personalContact}>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactNumber}>{contact.number}</Text>
                {contact.relation && <Text style={styles.contactRelation}>{contact.relation}</Text>}
              </View>
              <View style={styles.contactActions}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => handleEditContact(contact)}
                >
                  <Edit2 color="#3B82F6" size={16} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeleteContact(contact.id)}
                >
                  <Trash2 color="#EF4444" size={16} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.callButtonSmall]}
                  onPress={() => handleCallEmergency(contact.number)}
                >
                  <Phone color="#FFFFFF" size={16} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
      
      
      <Modal
        visible={showAddForm}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingContact ? 'Editar Contato' : 'Novo Contato'}
              </Text>
              <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
                <X color="#64748B" size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome *</Text>
                <TextInput
                  style={styles.input}
                  value={newContact.name}
                  onChangeText={(text) => setNewContact({...newContact, name: text})}
                  placeholder="Ex: Maria Silva"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Número *</Text>
                <TextInput
                  style={styles.input}
                  value={newContact.number}
                  onChangeText={(text) => setNewContact({...newContact, number: text})}
                  placeholder="(00) 00000-0000"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Relação (opcional)</Text>
                <TextInput
                  style={styles.input}
                  value={newContact.relation}
                  onChangeText={(text) => setNewContact({...newContact, relation: text})}
                  placeholder="Ex: Irmã, Neurologista, Hospital"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.typeSelector}>
                <Text style={styles.inputLabel}>Tipo de Contato *</Text>
                <View style={styles.typeOptions}>
                  <TouchableOpacity
                    style={[
                      styles.typeOption,
                      newContact.type === 'medical' && styles.selectedTypeOption
                    ]}
                    onPress={() => setNewContact({...newContact, type: 'medical'})}
                  >
                    <Text
                      style={[
                        styles.typeOptionText,
                        newContact.type === 'medical' && styles.selectedTypeOptionText
                      ]}
                    >
                      👨‍⚕️ Médico
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeOption,
                      newContact.type === 'personal' && styles.selectedTypeOption
                    ]}
                    onPress={() => setNewContact({...newContact, type: 'personal'})}
                  >
                    <Text
                      style={[
                        styles.typeOptionText,
                        newContact.type === 'personal' && styles.selectedTypeOptionText
                      ]}
                    >
                      👤 Pessoal
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={handleCancel}
                disabled={saving}
              >
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSaveButton, saving && styles.modalSaveButtonDisabled]}
                onPress={handleAddContact}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalSaveButtonText}>
                    {editingContact ? 'Atualizar' : 'Adicionar'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <View style={styles.emergencyTips}>
        <Text style={styles.tipsTitle}>Dicas em Caso de Emergência</Text>
        <View style={styles.tipItem}>
          <Text style={styles.tipNumber}>1</Text>
          <Text style={styles.tipText}>
            Mantenha a calma. Sua tranquilidade é essencial para ajudar a vítima.
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipNumber}>2</Text>
          <Text style={styles.tipText}>
            Ligue imediatamente para o SAMU (192) e descreva os sintomas claramente.
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipNumber}>3</Text>
          <Text style={styles.tipText}>
            Anote a hora exata em que os sintomas começaram - essa informação é crucial para o tratamento.
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipNumber}>4</Text>
          <Text style={styles.tipText}>
            Não dê alimentos, bebidas ou medicamentos à pessoa com suspeita de AVC.
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipNumber}>5</Text>
          <Text style={styles.tipText}>
            Se a pessoa estiver consciente, mantenha-a em posição confortável e afrouxe roupas apertadas.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748B',
  },
  emergencyHeader: {
    backgroundColor: '#EF4444',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyHeaderText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    padding: 16,
    paddingBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
  },
  addButton: {
    backgroundColor: '#3B82F6',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    marginTop: 8,
    marginBottom: 24,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emergencyContact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    padding: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: 14,
    color: '#64748B',
  },
  contactRelation: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  callButton: {
    backgroundColor: '#EF4444',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  personalContact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    padding: 16,
  },
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#E0F2FE',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
  },
  callButtonSmall: {
    backgroundColor: '#3B82F6',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1E293B',
  },
  typeSelector: {
    marginBottom: 20,
  },
  typeOptions: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  selectedTypeOption: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  typeOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  selectedTypeOptionText: {
    color: '#3B82F6',
  },
  formButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  formButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#E2E8F0',
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  modalCancelButtonText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSaveButton: {
    backgroundColor: '#3B82F6',
  },
  modalSaveButtonDisabled: {
    backgroundColor: '#94A3B8',
    opacity: 0.6,
  },
  modalSaveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emergencyTips: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: 'bold',
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
});