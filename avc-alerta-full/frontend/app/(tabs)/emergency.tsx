import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform, TextInput } from 'react-native';
import { Phone, Plus, CreditCard as Edit2, Trash2, CircleAlert as AlertCircle } from 'lucide-react-native';

export default function EmergencyScreen() {
  const [contacts, setContacts] = useState([
    { id: 1, name: 'SAMU', number: '192', type: 'emergency', fixed: true },
    { id: 2, name: 'Bombeiros', number: '193', type: 'emergency', fixed: true },
    { id: 3, name: 'Polícia', number: '190', type: 'emergency', fixed: true },
  ]);
  
  const [personalContacts, setPersonalContacts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [newContact, setNewContact] = useState({ name: '', number: '', relation: '', type: 'personal' });
  
  const handleAddContact = () => {
    if (newContact.name.trim() === '' || newContact.number.trim() === '') {
      alert('Nome e número são obrigatórios');
      return;
    }
    
    if (editingContact) {
      const updatedContacts = personalContacts.map(contact => 
        contact.id === editingContact.id ? { ...newContact, id: contact.id } : contact
      );
      setPersonalContacts(updatedContacts);
      setEditingContact(null);
    } else {
      const newId = personalContacts.length > 0 
        ? Math.max(...personalContacts.map(c => c.id)) + 1 
        : contacts.length + 1;
      setPersonalContacts([...personalContacts, { ...newContact, id: newId }]);
    }
    
    setNewContact({ name: '', number: '', relation: '', type: 'personal' });
    setShowAddForm(false);
  };
  
  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setNewContact({
      name: contact.name,
      number: contact.number,
      relation: contact.relation || '',
      type: contact.type
    });
    setShowAddForm(true);
  };
  
  const handleDeleteContact = (id) => {
    setPersonalContacts(personalContacts.filter(contact => contact.id !== id));
  };
  
  const handleCallEmergency = (number) => {
    // In a real app, this would use Linking.openURL(`tel:${number}`);
    alert(`Simulando chamada para ${number}`);
  };
  
  const handleCancel = () => {
    setShowAddForm(false);
    setEditingContact(null);
    setNewContact({ name: '', number: '', relation: '', type: 'personal' });
  };
  
  useEffect(() => {
    // In a real app, this would load contacts from local storage
    const loadedContacts = [
      { id: 4, name: 'Dr. Silva', number: '(11) 98765-4321', relation: 'Neurologista', type: 'medical' },
    ];
    setPersonalContacts(loadedContacts);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.emergencyHeader}>
        <AlertCircle color="#FFFFFF" size={24} />
        <Text style={styles.emergencyHeaderText}>
          Em caso de suspeita de AVC, ligue imediatamente para o SAMU (192)
        </Text>
      </View>
      
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
      
      {showAddForm && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>
            {editingContact ? 'Editar Contato' : 'Adicionar Contato'}
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nome</Text>
            <TextInput
              style={styles.input}
              value={newContact.name}
              onChangeText={(text) => setNewContact({...newContact, name: text})}
              placeholder="Nome do contato"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Número</Text>
            <TextInput
              style={styles.input}
              value={newContact.number}
              onChangeText={(text) => setNewContact({...newContact, number: text})}
              placeholder="(00) 00000-0000"
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Relação/Observação (opcional)</Text>
            <TextInput
              style={styles.input}
              value={newContact.relation}
              onChangeText={(text) => setNewContact({...newContact, relation: text})}
              placeholder="Ex: Irmão, Cardiologista, etc."
            />
          </View>
          
          <View style={styles.typeSelector}>
            <Text style={styles.inputLabel}>Tipo de Contato</Text>
            <View style={styles.typeOptions}>
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
                  Pessoal
                </Text>
              </TouchableOpacity>
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
                  Médico
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.formButtons}>
            <TouchableOpacity
              style={[styles.formButton, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.formButton, styles.saveButton]}
              onPress={handleAddContact}
            >
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
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
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#334155',
  },
  typeSelector: {
    marginBottom: 16,
  },
  typeOptions: {
    flexDirection: 'row',
    marginTop: 8,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  selectedTypeOption: {
    backgroundColor: '#3B82F6',
  },
  typeOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  selectedTypeOptionText: {
    color: '#FFFFFF',
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